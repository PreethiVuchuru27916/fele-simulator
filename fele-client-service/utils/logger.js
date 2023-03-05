const winston = require('winston');
const path = require('path');

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: 'info' || 'warn'
        }),
        new winston.transports.File({
            level: 'error',
            filename: path.join(__dirname, '../..', '/logs/logs.log')
        })
    ],
    format: winston.format.combine(
        winston.format.label({
            label: 'Label'
        }),
        winston.format.timestamp({
           format: 'MMM-DD-YYYY HH:mm:ss'
        }),
        winston.format.printf(info => `${info.level}: ${info.label}: ${[info.timestamp]}: ${info.message}`),
    )
});

module.exports = logger;