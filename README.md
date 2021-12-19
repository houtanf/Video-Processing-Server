# Video-Processing-Server [![Coverage Status](https://coveralls.io/repos/github/houtanf/Video-Processing-Server/badge.svg?branch=master)](https://coveralls.io/github/houtanf/Video-Processing-Server?branch=master)

Rest API, and server backend for retrieving and processing videos through specified computer vision algorithms. 

First API I had written.

## Install
To install needed dependendencies run `npm install`.

## Test
To run unit tests and make sure everything is working as intended run `npm test`.

## Execution
1. To start API run `npm run api`.

2. To start Video Processing Manager run `npm run manager`.

## Configuration
* API settings can be configured by editing the `api_config.json` file.
* Video Processing Manager settings can be configured by editing the `manager_config.json` file.
* AWS settings can be configured by editing the `aws_config.json` file.
* Docker image and be configured by editing the Docker file.
