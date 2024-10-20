#!/bin/bash

if [ -z "$1" ]; then
  echo "Please insert the api version."
  exit 1
fi

npm run typeorm migration:revert -- -d src/"$1"/persistence/data-source.ts
