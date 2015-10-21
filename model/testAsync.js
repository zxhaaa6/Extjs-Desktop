var async = require('async');
var log = require('./testLog4js').log;
var testAsync = {
    testSeries: function () {
        async.series({
            first: function (next) {
                next(null, '1');
            },
            second: function (next) {
                next(null, '2');
            },
            third: function (next) {
                next(null, '3');
            }
        }, function (err, result) {
            console.log(result);    //{ first: '1', second: '2', third: '3' }
        });
    },
    testWaterfall: function () {
        async.waterfall([
            function (next) {
                next(null, '1');
            },
            function (arg, next) {
                next(null, arg, '2');
            },
            function (arg1, arg2, next) {
                next(null, arg1, arg2, '3');
            }
        ], function (err, arg1, arg2, arg3) {
            console.log(arg1 + ' ' + arg2 + ' ' + arg3);    //1 2 3
        });
    },
    testParallel: function () {
        async.parallel([
            function (next) {
                next(null, '1');
            },
            function (next) {
                next(null, '2');
            },
            function (next) {
                next(null, '3');
            }
        ], function (err, results) {
            console.log(results);   //[ '1', '2', '3' ]
        })
    },
    testMap: function () {
        var arr = ['1', '2', '3'];
        async.map(arr, function (item, next) {
            next(null, item);
        }, function (err, result) {
            console.log(result);    //[ '1', '2', '3' ]
        });
    },
    testMapSeries: function () {
        var arr = [0, 1, 2, 3, 4, 5, 6];
        async.mapSeries(arr, function (item, callback) {
            /*(function () {
             callback(null, item);
             }());*/
            callback(null, item);
        }, function (err, result) {
            console.log(result);    //[ 0, 1, 2, 3, 4, 5, 6 ]
        });
    },
    testAuto: function () {
        async.auto({
            first:function(next){
                next(null,'1');
            },
            second: function (next) {
                next(null,'2');
            },
            third:['first','second', function (next) {
                next(null,'3');
            }],
            fourth: ['third', function (next) {
                next(null,'4');
            }]
        }, function (err, result) {
            log.info(result);   //{ first: '1', second: '2', third: '3', fourth: '4' }
        })
    }
};
testAsync.testAuto();