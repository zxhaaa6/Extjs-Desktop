var log4js = require('log4js');

log4js.configure({
    appenders: [
        {
            type: 'console',
            category: "console"
        },
        {
            type: 'dateFile',
            filename: 'logs/temp',
            pattern: "-yyyy-MM-dd.log",
            alwaysIncludePattern: true,
            category: 'MyTest'
        }
    ],
    replaceConsole: true,
    levels:{
        MyTest: 'INFO'
    }
});

var logger = log4js.getLogger('MyTest');

exports.logger = logger;

exports.use = function(app) {
    app.use(log4js.connectLogger(logger, {level:'debug', format:':method :url'}));
};