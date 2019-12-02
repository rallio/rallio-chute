# Rallio Chute Service

- [Travis Build Status](#travis-build-status)
- [Description](#description)
- [Development Setup](#development-setup)
  - [Dependencies](#dependencies)
  - [Set up Database](#set-up-database)
  - [Start local SQS Queue](#start-local-sqs-queue)
  - [Stop local SQS Queue](#stop-local-sqs-queue)
  - [Send a message to the queue](#send-a-message-to-the-queue)
  - [Start local server](#start-local-server)

## Travis Build Status
[![Travis](https://cdn.travis-ci.com/images/ui/travis-ci-logo-hover-51a78629352a38fdd0046d35766797d2.svg)](https://travis-ci.com/rallio/rallio-chute-service)

development | master | production
--- | --- | ---
[![Build Status](https://travis-ci.com/rallio/rallio-chute-service.svg?branch=development)](https://travis-ci.com/rallio/rallio-chute-service) | [![Build Status](https://travis-ci.com/rallio/rallio-chute-service.svg?branch=master)](https://travis-ci.com/rallio/rallio-chute-service) | [![Build Status](https://travis-ci.com/rallio/rallio-chute-service.svg?branch=production)](https://travis-ci.com/rallio/rallio-chute-service)

## Description

This service provides local images to [Chute](http://www.ignitetech.com/chute/) for `Pet Supplies Plus`.

The workflow is

1. Rallio Local strategist likes/approve an image in the Rallio image gallery
2. Rallio sends an AWS SQS message to a queue
3. This service fetches message from queue
4. The message is processed to see if the location and tags maps to albums in Chute
   - Location mapping data is stored in `LocationMaps` database table
   - Tag mapping data is stored in `TagMaps` database table
   - A record is stored in `Requests` database table for each matching location and tag
5. Image is uploaded to all mapped albums
   - The `Requests` record is marked as completed (table column `request_success` set to `true`) if upload is successful
   - Incomplete `Requests` records will be retried
   - The SQS message is deleted from the queue when all `Requests` records are completed

## Development Setup

### Dependencies

```sh
yarn --global add npx
brew install awscli
brew cask install docker
```

### Set up Database

```sh
yarn db:create
yarn db:migrate
yarn db:seed:all
```

### Start local SQS Queue

```sh
yarn sqs-local:dev:start
```

### Stop local SQS Queue

```sh
yarn sqs-local:dev:stop
```

### Send a message to the queue

```sh
yarn send-message MessageBody="Tacos are delicious."
```

### Start local server

```sh
yarn dev
```
