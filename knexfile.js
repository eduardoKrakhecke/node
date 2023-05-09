// Update with your config settings.

module.exports = {

  client: 'pg',
  connection: {
    host: 'localhost',
    database: 'knowledge',
    user:     'postgres',
    password: '123'
  },
  pool: {
    min: 2,
    max: 10,
    propagateCreateError: false
  },
  migrations: {
    tableName: 'knex_migrations'
  }


 /* development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },*/

/*  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }*/

};
