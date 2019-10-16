# Rallio Chute

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
