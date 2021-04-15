#!/bin/bash

version=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

version="$(echo -e "${version}" | sed -e 's/^[[:space:]]*//')"
echo "Docker image: ampnet/aapx-supply-service:$version"
docker build -t ampnet/aapx-supply-service:$version -t ampnet/aapx-supply-service:latest .
docker push ampnet/aapx-supply-service:$version
docker push ampnet/aapx-supply-service:latest