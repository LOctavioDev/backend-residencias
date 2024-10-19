const config = {
  jwtSecret: process.env.JWT_SECRET || 'secret',
  port: process.env.PORT || 11111,
};

export default config;
