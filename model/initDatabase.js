var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var log = require('log4js').getLogger('initDatabase');

var userCollectionFun = function (db, callback) {
    var users = [];
    var adminUser = {
        name: 'admin',
        password: '123',
        phone: '10000000000',
        deptId: '',
        id_card: '',
        employee_number: '001',
        position: 'admin',
        valid: 1
    };
    users.push(adminUser);
    for (var i = 1; i < 20; i++) {
        var user = {name: 'user' + i, password: '123'};
        users.push(user);
    }
    db.collection('sys_user').insertMany(users, function (err, result) {
        if (err) {
            log.error('userCollectionFun|插入用户失败|err:%s', err.message);
            callback(err);
            return;
        }
        callback(err);
    });
};

var initProcess = function (db, callback) {
    async.parallel([
        function (next) {
            userCollectionFun(db, function (err) {
                next(err);
            });
        }
    ], function (err) {
        callback(err);
    });
};

var url = 'mongodb://localhost:27017/firstExt';
MongoClient.connect(url, function (err, db) {
    if (err) {
        log.error('DB connection [' + url + '] failed.');
        return;
    }
    log.info('DB connection [' + url + '] established.');
    initProcess(db, function (err) {
        if (err) {
            log.error('初始化数据失败');
            return;
        }
        log.info('初始化数据成功');
        db.close();
        process.exit(0);
    });
});
