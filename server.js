import connectDb from './src/config/db.js';
import dotenv from 'dotenv';
import app from './src/app.js';
import log from './src/utils/logger.js';
import gracefulShutdown from './src/utils/gracefulShutdown.js';

dotenv.config();

const PORT_DEFAULT = 4000;
const PORT = process.env.PORT || PORT_DEFAULT;

if (PORT === PORT_DEFAULT) {
  log.warning('PORT missing from .env');
  log.info(`PORT set to defaults: ${PORT_DEFAULT}`);
}

const startServer = async () => {
  try {
    log.start('Starting taskify server...');

    await connectDb();

    const server = app.listen(PORT, () => {
      log.success(`Server running on port: ${PORT}`);
      log.info(`Environment: ${process.env.NODE_ENV || 'dev'}`);
    });

    gracefulShutdown(server);
  } catch (error) {
    log.error(`startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
