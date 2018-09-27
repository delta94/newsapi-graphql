#!/bin/sh

echo $env

if [ $env = "production" ]
then
  nginx
  pm2-runtime process.yml
elif [ $env = "development" ]
then
  npm run start
fi