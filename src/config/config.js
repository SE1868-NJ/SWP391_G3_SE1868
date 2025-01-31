require('dotenv').config({ path: './.env' });

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.PASSWORD_DB || 'Shin2004', 
    database: process.env.DB_NAME || 'Test',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: process.env.DIALECT || 'mysql',
  },
  test: {
    username: process.env.DB_USER || 'root',
    password: process.env.PASSWORD_DB || null,
    database: process.env.DB_NAME || 'db_swp',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: process.env.DIALECT || 'mysql',
  },
  production: {
    username: process.env.DB_USER || 'root',
    password: process.env.PASSWORD_DB || null,
    database: process.env.DB_NAME || 'database_production',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: process.env.DIALECT || 'mysql',
  }
}
