const config = {
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    dbName: 'cards',
    port: process.env.DATABASE_PORT || 5432,
    user: process.env.DATABASE_USER || process.env.USER || '',
    password: process.env.DATABASE_PASSWORD || '',
  },
  logLevel: process.env.LOGLEVEL || 'debug',
  port: process.env.PORT || 8082
};

export default config;
