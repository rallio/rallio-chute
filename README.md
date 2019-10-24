# Rallio Chute
- [Rallio Chute](#rallio-chute)
  - [Travis Build Status](#travis-build-status)
    - [master](#master)
    - [production](#production)
  - [Setup](#setup)
  - [Dependencies](#dependencies)
  - [Set up DB](#set-up-db)
  - [Set up a local SQS Queue](#set-up-a-local-sqs-queue)
  - [Stopping a local SQS Queue](#stopping-a-local-sqs-queue)
  - [Send a message to the queue](#send-a-message-to-the-queue)
  - [Develop](#develop)

## Travis Build Status
[![Travis](https://cdn.travis-ci.com/images/ui/travis-ci-logo-hover-51a78629352a38fdd0046d35766797d2.svg)](https://travis-ci.com/rallio/rallio-chute)
### master
[![Build Status](https://travis-ci.com/rallio/rallio-chute.svg?branch=master)](https://travis-ci.com/rallio/rallio-chute)

### production
[![Build Status](https://travis-ci.com/rallio/rallio-chute.svg?branch=production)](https://travis-ci.com/rallio/rallio-chute)

## Setup

## Dependencies

```sh
yarn --global add npx
```

## Set up DB

```sh
yarn db:create
yarn db:migrate
yarn db:seed:all
```

## Set up a local SQS Queue

```sh
yarn sqs-local:dev:start
```

## Stopping a local SQS Queue

```sh
yarn sqs-local:dev:stop
```

## Send a message to the queue

```sh
yarn send-message MessageBody="Tacos are delicious."
```

## Develop

```sh
yarn dev
```
