import log from './logger.js';

const gracefulShutdown = (server) => {
  const shutDown = (signal) => {
    log.info(`\nReceived signal ${signal}, starting graceful shutdown...`);
    log.shutdown('Shutting down server...');

    server.close(() => process.exit(0));

    setTimeout(() => process.exit(1), 5000);
  };

  process.on('SIGINT', shutDown);
  process.on('SIGTERM', shutDown);
};

export default gracefulShutdown;
