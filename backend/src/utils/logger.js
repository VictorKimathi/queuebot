function logInfo(message, meta) {
  // eslint-disable-next-line no-console
  console.log(`[INFO] ${message}`, meta || '');
}

function logWarn(message, meta) {
  // eslint-disable-next-line no-console
  console.warn(`[WARN] ${message}`, meta || '');
}

function logError(message, meta) {
  // eslint-disable-next-line no-console
  console.error(`[ERROR] ${message}`, meta || '');
}

module.exports = { logInfo, logWarn, logError };

