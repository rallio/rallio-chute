# Rallio Chute
- [Rallio Chute](#rallio-chute)
  - [Status](#status)
    - [master](#master)
    - [production](#production)
  - [Setup](#setup)
  - [Install Deps](#install-deps)
  - [Set up DB](#set-up-db)
  - [Send a message to the queue](#send-a-message-to-the-queue)

## Status
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

## Send a message to the queue

```sh
yarn send-message MessageBody="Tacos are delicious."
```
