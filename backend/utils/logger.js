// Centralized logging utility for document operations
export const getTimestamp = () => {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
};

export const logWithContext = (level, message, context = {}) => {
  const timestamp = getTimestamp();
  const contextStr = Object.entries(context)
    .map(([key, value]) => `${key}:${value}`)
    .join('][');
  const fullContext = contextStr ? `[${contextStr}]` : '';
  console.log(`[${timestamp}][${level}][DocumentUpload]${fullContext} ${message}`);
};

export const logError = (message, error, context = {}) => {
  logWithContext('ERROR', message, { ...context, error: error.message });
  if (process.env.NODE_ENV === 'development') {
    console.error('Stack trace:', error.stack);
  }
};

export const logInfo = (message, context = {}) => {
  logWithContext('INFO', message, context);
};

export const logDebug = (message, context = {}) => {
  logWithContext('DEBUG', message, context);
};

export const logWarn = (message, context = {}) => {
  logWithContext('WARN', message, context);
};
