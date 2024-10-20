#!/bin/bash

if [ -z "$1" ]; then
  echo "Please insert the api version."
  exit 1
fi

if [ -z "$2" ]; then
  echo "Please insert migration name."
  exit 1
fi

npm run typeorm migration:generate src/"$1"/persistence/migrations/"$2" -- -d src/"$1"/persistence/data-source.ts