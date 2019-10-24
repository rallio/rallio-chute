# Rallio Chute
- [Rallio Chute](#rallio-chute)
  - [Travis Build Status](#travis-build-status)
    - [master](#master)
    - [production](#production)
  - [Setup](#setup)
  - [Install Deps](#install-deps)
  - [Set up DB](#set-up-db)
  - [Set up a local Queue](#set-up-a-local-queue)
  - [Send a message to the queue](#send-a-message-to-the-queue)

## Travis Build Status
[![Travis](https://cdn.travis-ci.com/images/ui/travis-ci-logo-hover-51a78629352a38fdd0046d35766797d2.svg)](https://travis-ci.com/rallio/rallio-chute)
### master
[![Build Status](https://travis-ci.com/rallio/rallio-chute.svg?branch=master)](https://travis-ci.com/rallio/rallio-chute)

### production
[![Build Status](https://travis-ci.com/rallio/rallio-chute.svg?branch=production)](https://travis-ci.com/rallio/rallio-chute)

## Setup

## Install Deps

```sh
yarn --global add npx
yarn
```

## Set up DB

```sh
npx sequelize db:create
npx sequelize db:migrate
npx sequelize db:seed:all
```

## Set up a local Queue

```sh
yarn sqs-local:start
yarn sqs-local:create-queue
```

## Send a message to the queue

```sh
yarn send-message MessageBody="Tacos are delicious."
```