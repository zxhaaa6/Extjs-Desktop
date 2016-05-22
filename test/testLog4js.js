var log = require('log4js');

log.configure({
    appenders: [
        {type: 'console'},
        {
            type: 'dateFile',
            filename: 'logs/temp',
            pattern: "-yyyy-MM-dd.log",
            alwaysIncludePattern: true,
            category: 'temp'
        }
    ]
});

var logger = log.getLogger('temp');

var test = function () {
    logger.trace('Entering cheese testing');
    logger.debug('Got cheese.');
    logger.info('Cheese is Gouda.');
    logger.warn('Cheese is quite smelly.');
    logger.error('Cheese is too ripe!');
    logger.fatal('Cheese was breeding ground for listeria.');
};

//test();

exports.log = logger;