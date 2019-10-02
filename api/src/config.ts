const config = {
  database: {
    host: process.env.DATABASE_HOST || 'db',
    dbName: 'cards',
    port: process.env.DATABASE_PORT || 5432,
    user: process.env.DATABASE_USER || process.env.USER || '',
    password: process.env.DATABASE_PASSWORD || '',
  },
  port: process.env.PORT || 80
};

export default config;
