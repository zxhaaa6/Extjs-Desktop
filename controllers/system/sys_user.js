var async = require('async');
var dao = require('../../model/system/user');
var log = require('log4js').getLogger('sys_user');

exports.getRoleByUser = function (req, res) {
    var userName = req.params.username;
    dao.getUserInfoByUsername(userName, function (err, userInfo) {
        if (err) {
            log.error('getUserInfoByUser|查询用户信息失败|err:%s', err.message);
            res.sendResult(err);
            return;
        }
        var resInfo = {
            id: '',
            name: '',
            role: ''
        };
        if (userInfo) {
            resInfo._id = userInfo._id.toString();
            resInfo.name = userInfo.name;
            resInfo.role = userInfo.role;
        }
        res.sendResult(err, resInfo);
    });
};

exports.login = function (req, res) {
    var name = req.body.NAME;
    var password = req.body.PASSWORD;
    var loginParam = {
        name: name,
        password: password
    };
    dao.login(loginParam, function (err, userInfo) {
        if (err) {
            log.error('login|登录失败|err:%s', err.message);
            res.sendResult(err);
            return;
        }
        var resData = {
            loginSuccess: false,
            userInfo: null,
            msg:''
        };
        if (userInfo) {
            req.session.userInfo = userInfo;
            resData.loginSuccess = true;
            resData.userInfo = userInfo;
            res.sendResult(err, resData);
        } else {
            resData.msg = '用户名或密码错误！';
            res.sendResult(err, resData);
        }
    });
};

exports.logout = function (req, res) {
    req.session.destroy();
    res.redirect('/');
};
