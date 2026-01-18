const emoji = {
  // Server
  start: '🚀',
  shutdown: '👋',

  // Status
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: '💡',

  // Database
  db: '🗄️',

  // Auth
  auth: '🔐',

  // Tasks
  task: '📋',
};

const colors = {
  reset: '\x1b[0m',
  criticalRed: '\x1b[91m',
  warningYellow: '\x1b[93m',
  successGreen: '\x1b[32m',
  startCyan: '\x1b[36m',
  infoGray: '\x1b[90m',
  shutdownMagenta: '\x1b[95m',
};

const log = {
  start: (msg) =>
    console.log(`${emoji.start} ${colors.startCyan}${msg}${colors.reset}`),
  success: (msg) =>
    console.log(`${emoji.success} ${colors.successGreen}${msg}${colors.reset}`),
  shutdown: (msg) =>
    console.log(
      `${emoji.shutdown} ${colors.shutdownMagenta}${msg}${colors.reset}`
    ),
  error: (msg) =>
    console.error(`${emoji.error} ${colors.criticalRed}${msg}${colors.reset}`),
  warning: (msg) =>
    console.warn(
      `${emoji.warning} ${colors.warningYellow}${msg}${colors.reset}`
    ),
  info: (msg) =>
    console.log(`${emoji.info} ${colors.infoGray}${msg}${colors.reset}`),
  db: (msg) => console.log(`${emoji.db} ${msg}`),
  auth: (msg) => console.log(`${emoji.auth} ${msg}`),
  task: (msg) => console.log(`${emoji.task} ${msg}`),
};

export default log;
