const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../../storage/logs');

// Criar diretório de logs se não existir
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const getTimestamp = () => new Date().toISOString();

class Logger {
  static log(message, data = null) {
    const timestamp = getTimestamp();
    const log = `[${timestamp}] INFO: ${message}`;
    console.log(log, data || '');
    Logger._writeToFile(log, data);
  }

  static error(message, error = null) {
    const timestamp = getTimestamp();
    const log = `[${timestamp}] ERROR: ${message}`;
    console.error(log, error || '');
    Logger._writeToFile(log, error);
  }

  static warn(message, data = null) {
    const timestamp = getTimestamp();
    const log = `[${timestamp}] WARN: ${message}`;
    console.warn(log, data || '');
    Logger._writeToFile(log, data);
  }

  static debug(message, data = null) {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = getTimestamp();
      const log = `[${timestamp}] DEBUG: ${message}`;
      console.debug(log, data || '');
    }
  }

  static _writeToFile(message, data) {
    try {
      const logFile = path.join(logsDir, `app-${new Date().toISOString().split('T')[0]}.log`);
      const logEntry = data ? `${message} ${JSON.stringify(data)}\n` : `${message}\n`;
      fs.appendFileSync(logFile, logEntry, 'utf8');
    } catch (err) {
      console.error('Failed to write to log file:', err);
    }
  }
}

module.exports = Logger;
