require('dotenv').config()
const dialect = 'postgres';

module.exports = {
  docker: {
    username: 'postgres',
    database: 'chute_development',
    host: '127.0.0.1',
    port: 5433,
    dialect
  },
  development: {
    username: 'postgres',
    database: 'chute_development',
    host: '127.0.0.1',
    dialect
  },
  test: {
    username: 'postgres',
    database: 'chute_test',
    host: '127.0.0.1',
    dialect
  },
  staging: {
    url: process.env.DATABASE_URL,
    dialect,
    dialectOptions: {
      ssl: true
    }
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect,
    dialectOptions: {
      ssl: true
    }
  },
  psp: {
    url: process.env.DATABASE_URL,
    dialect,
    dialectOptions: {
      ssl: true
    }
  }
};