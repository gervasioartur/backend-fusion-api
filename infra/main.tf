# Create S3 bucket
resource "aws_s3_bucket" "bucket" {
  bucket = var.bucket_name
}

# Resource to disable public policy blocking on the S3 bucket
resource "aws_s3_bucket_public_access_block" "block_public_access" {
  bucket = aws_s3_bucket.bucket.id

  block_public_acls       = false    # Allows public ACLs
  block_public_policy     = false    # Disables block on public bucket policies
  ignore_public_acls      = false    # Does not ignore public ACLs
  restrict_public_buckets = false    # Disables restriction on public buckets
}

# Resource to apply a public access policy to the S3 bucket
resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket = aws_s3_bucket.bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = "*"            # Allows access to any user
        Action = "s3:GetObject"     # Grants permission to read objects
        Resource = "${aws_s3_bucket.bucket.arn}/*"   # Applies the policy to all objects in the bucket
      }
    ]
  })

  # Ensures that public access block is removed before applying the bucket policy
  depends_on = [aws_s3_bucket_public_access_block.block_public_access]
}

# Security group to allow access to RDS
resource "aws_security_group" "rds_sg" {
  name = "rds_sg"

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "rds_sg"
  }
}

# Create database instance
resource "aws_db_instance" "postgres" {
  identifier = var.database_instance_name
  allocated_storage = var.database_allocated_storage
  max_allocated_storage = var.database_max_allocated_storage
  engine = "postgres"
  engine_version = var.database_engine_version
  instance_class = var.database_instance_class
  db_name = var.database_name
  username = var.database_username
  password = var.database_password
  parameter_group_name = var.database_parameter_group_name
  publicly_accessible = true
  skip_final_snapshot = true
  vpc_security_group_ids   = [aws_security_group.rds_sg.id]

  tags = {
    Name = var.database_instance_name
  }
}

# Create SSH key in order to access the EC2 instance
resource "tls_private_key" "ssh_key" {
  algorithm = "RSA"
  rsa_bits = 4096
}

# Save SSH private key on S3 bucket
resource "aws_s3_object" "ssh_private_key" {
  bucket = aws_s3_bucket.bucket.bucket
  key    = "ssh-keys/${var.deployer_key_name}.pem"
  content = tls_private_key.ssh_key.private_key_pem
}

# Save SSH public key on S3 bucket
resource "aws_s3_object" "ssh_public_key" {
  bucket = aws_s3_bucket.bucket.bucket
  key    = "ssh-keys/${var.deployer_key_name}.pub"
  content = tls_private_key.ssh_key.public_key_openssh
}

# Associate to EC2
resource "aws_key_pair" "deployer" {
  key_name = var.deployer_key_name
  public_key = tls_private_key.ssh_key.public_key_openssh
}

# Security group to allow SSH and HTTP access on EC2 instance
resource "aws_security_group" "allow_ssh_http" {
  name_prefix = "allow_ssh_http"
  ingress {
    from_port = 22
    to_port   = 22
    protocol  = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

 ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Create EC2 instance
resource "aws_instance" "docker_instance" {
  ami = var.ami_instance
  instance_type = var.ami_instance_type
  key_name = aws_key_pair.deployer.key_name
  # Installing docker and run container
  user_data = <<-EOF
              #!/bin/bash
              sudo su
              yum update -y
              yum install -y docker
              service docker start
              usermod -a -G docker ec2-user

              curl -fsSL https://nodejs.org/dist/v20.17.0/node-v20.17.0-linux-x64.tar.xz -o node-v20.17.0-linux-x64.tar.xz
              tar -xJf node-v20.17.0-linux-x64.tar.xz
              mv node-v20.17.0-linux-x64 /usr/local/node

              echo 'export PATH=/usr/local/node/bin:$PATH' >> /etc/profile
              source /etc/profile
              EOF

  # Associate a security group
  vpc_security_group_ids = [aws_security_group.allow_ssh_http.id]

  tags = {
    Name = var.server_instance_name
  }
}


# Removes old files
resource "null_resource" "remove_outputs_json" {
  provisioner "local-exec" {
    command = "rm -f ${path.module}/infra/${var.environment}_terraform_outputs.json"
  }
}

resource "null_resource" "remove_env_file" {
  provisioner "local-exec" {
    command = "rm -f ${path.module}/infra/.env"
  }
}


# Generate JSON file for outputs
resource "local_file" "outputs_json" {
  depends_on = [null_resource.remove_outputs_json]

  content = jsonencode({
    db_host              = aws_db_instance.postgres.address
    instance_public_ip   = aws_instance.docker_instance.public_ip
    ssh_private_key_url  = "https://${aws_s3_bucket.bucket.bucket}.s3.amazonaws.com/${aws_s3_object.ssh_private_key.key}"
    ssh_public_key       = "https://${aws_s3_bucket.bucket.bucket}.s3.amazonaws.com/${aws_s3_object.ssh_public_key.key}"
    ec2_hostname         = aws_instance.docker_instance.public_dns
  })
  filename = "${path.module}/infra/${var.environment}_terraform_outputs.json"
}

# Upload outputs to S3
resource "aws_s3_object" "terraform_outputs" {
  bucket = aws_s3_bucket.bucket.bucket
  key    = "terraform-outputs/${var.environment}_terraform_outputs.json"
  source = local_file.outputs_json.filename
}

# Generate .env file locally
resource "local_file" "env_file" {
  depends_on = [null_resource.remove_env_file]

  content = <<-EOT
    PORT=8080
    HOST=${aws_db_instance.postgres.address}
    DB_HOST=${aws_db_instance.postgres.address}
    DB_PORT=5432
    DB_USERNAME=${var.database_username}
    DB_PASSWORD=${var.database_password}
    DB_NAME=${var.database_name}
    SYNCHRONIZE=false
    REDIS_HOST=localhost
    REDIS_PORT=6379
  EOT

  filename = "${path.module}/infra/.env"
}

# Upload the .env file to S3
resource "aws_s3_object" "env_file_upload" {
  bucket = aws_s3_bucket.bucket.bucket   # Reference to the S3 bucket created above
  key    = "configs/.env"                # Path where the file will be stored in S3
  source = local_file.env_file.filename  # Path to the local .env file
}