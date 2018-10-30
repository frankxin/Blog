#!/bin/bash
npm run deploy
local_root=$(pwd)
public_folder="${local_root}/public"
server_blog_folder='~/Blog'
server_address='ubuntu@118.24.147.13'
ssh $server_address "rm -rf ${server_blog_folder} && mkdir ${server_blog_folder}"
scp -r $public_folder $server_address:$server_blog_folder
