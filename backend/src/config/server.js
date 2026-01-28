function getServerConfig() {
  return {
    env: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT || 4000),
    jwtSecret: process.env.JWT_SECRET || 'change-me',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  };
}

module.exports = { getServerConfig };

