var GlobalVarManager = require('../GlobalVarManager');
var log = require('log4js').getLogger('user');
var collection = GlobalVarManager.getDatabase().collection('sys_user');

exports.getUserInfoByUsername = function (userName, callback) {
    collection.find({name: userName}).toArray(function (err, userInfo) {
        if (err) {
            log.error('getRoleByUser|根据用户名查询角色－－失败｜err:%s|param:%s', err.message, userName);
            callback(err);
            return;
        }
        if (userInfo.length > 0) {
            callback(err, userInfo[0]);
        } else {
            callback(err, null);
        }

    });
};

exports.login = function (loginParam, callback) {
    collection.find(loginParam).toArray(function (err, userInfo) {
        if (err) {
            log.error('login|用户登录－－失败｜err:%s|param:%j', err.message, loginParam);
            callback(err);
            return;
        }
        if (userInfo.length > 0) {
            callback(err, userInfo[0]);
        } else {
            callback(err, null);
        }
    });
};
