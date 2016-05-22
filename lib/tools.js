var http = require('http');
var util = require('util');
var url = require('url');
var querystring = require('querystring');
var log = require('log4js').getLogger('lib-tools');

var _LicenseInc = null;
//系统启动时间
var appStartTime = null;

exports.setAppStartTime = function(date) {
    appStartTime = date;
};

exports.getAppStartTime = function() {
    return appStartTime;
};

exports.getLicense = function() {
    return _LicenseInc;
};

exports.trim = function(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
};

exports.getDateString = function(isTime) {
    var date = new Date();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentDate = date.getFullYear() + '-' + month + '-' + strDate;
    if (isTime != undefined && isTime == true) {
        currentDate += " " + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    }
    return currentDate;
};

exports.getTimeString = function(requireSeconds) {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    if (hours >= 1 && hours <= 9) {
        hours = "0" + hours;
    }
    if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
    }
    if (seconds >= 0 && seconds <= 9) {
        seconds = "0" + seconds;
    }
    var currentTime = hours + ':' + minutes;
    if (requireSeconds != undefined && requireSeconds == true) {
        currentTime += ':' + seconds;
    }
    return currentTime;
};

exports.sendHTTPData = function(option, data, cb) {

    var req = http.request(option, function(res) {
        res.setEncoding('utf-8');
        var body = "";
        res.on('data', function(chunk) {
            body += chunk;
        });
        res.on('end', function() {
            var err = null;
            if (res.statusCode !== 200) {
                err = new Error(res.statusCode + '：' + body);
            }
            cb(err, body);
        });
    });
    req.setTimeout(5000);
    req.on('error', function(e) {
        cb(e);
    });
    if (data) {
        req.write(data);
    }
    req.end();
};

/**
 * 发送http post请求
 * @param  {String}   sendUrl  请求地址
 * @param  {Object}   data  请求的内容，对象格式
 * @param  {Function} cb   执行完毕后返回的结果  (err, result)
 */
exports.post = function(sendUrl, data, cb) {

    var urlObj = url.parse(sendUrl);
    var option = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    data = querystring.stringify(data);

    this.sendHTTPData(option, data, cb);
};

exports.http = function(sendUrl, httpMethod, cb) {
    var urlObj = url.parse(sendUrl);

    var option = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.path,
        method: httpMethod,
        headers: {
            'Content-Type': 'text/html'
        }
    };
    this.sendHTTPData(option, null, cb);
};

exports.formatDate = function(date) {
    function f(n) {
        return n < 10 ? '0' + n : n;
    }

    return date.getFullYear() + '-' +
        f(date.getMonth() + 1) + '-' +
        f(date.getDate()) + ' ' +
        f(date.getHours()) + ':' +
        f(date.getMinutes()) + ':' +
        f(date.getSeconds());
};

/**
 * 将日期类型的数据转换为Y-m-d类型的字符串
 * @author 毕磊 2016-01-13T15:28:11+0800
 * @param   {Date}  date
 * @return  {String}
 */
exports.formatDateToYmd = function(date) {
    function f(n) {
        return n < 10 ? '0' + n : n;
    }

    return date.getFullYear() + '-' +
        f(date.getMonth() + 1) + '-' +
        f(date.getDate());
};

//把日期字符串转化为日期对象，格式：2013120302351600
exports.ymdhmss2Date = function(date) {

    return new Date(date.substring(0, 4) + '-' +
        date.substring(4, 6) + '-' +
        date.substring(6, 8) + ' ' +
        date.substring(8, 10) + ':' +
        date.substring(10, 12) + ':' +
        date.substring(12, 14) + ':' + date.substring(14, 16));
};

//把日期字符串转化为日期对象，格式：20131121210756
exports.ymdhms2Date = function(date) {

    return new Date(date.substring(0, 4) + '-' +
        date.substring(4, 6) + '-' +
        date.substring(6, 8) + ' ' +
        date.substring(8, 10) + ':' +
        date.substring(10, 12) + ':' +
        date.substring(12, 14));
};

function parseISODate(value) {

    var a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
    if (a) {
        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
    }
    return value;
}

exports.ipStr2Int = function(str) {

    return new Buffer(str.split('.')).readUInt32BE(0);
};

exports.isEmpty = function(value, allowEmptyString) {

    return (value === null) || (value === undefined) || (!allowEmptyString ? value === '' : false) || (util.isArray(value) && value.length === 0);
};

exports.getDelay05 = function(date) {
    var oldDate = date.getTime();
    date.setSeconds(0);
    date.setMilliseconds(0);
    var min = date.getMinutes();
    var minSingleDigit = min % 10;
    var delay = 0;
    if (minSingleDigit === 0 || minSingleDigit === 5) {
        return delay;
    } else if (minSingleDigit < 5) {
        min = min - minSingleDigit + 5;
    } else {
        min = min - minSingleDigit + 10;
    }
    date.setMinutes(min);
    return date.getTime() - oldDate;
};

exports.getVersion = function(bloodtype) {
    var version = null;
    try {
        version = require('../version');
    } catch (e) {
        log.warn('版本文件不存在或文件格式不是json');
    }

    return version;
};

exports.getVersionStr = function(bloodtype) {
    var version = exports.getVersion();
    if (!version) {
        return '';
    }
    return version.major + '.' + version.minor + '.' + version.build;
};

/**
 * 判断传入的数据是否为对象
 * @param  {Object}  value  数据
 * @param  {Boolean} type   ture: 判断是否为空对象
 *                         false: 是判断是否为对象
 * @return {Boolean}        ture: 是对象，但不判断是否为{}
 *                         false: 不是对象
 */
exports.isObject = function(value, type) {
    if (type) {
        if (toString.call(value) === '[object Object]') {
            for (var obj in value) {
                return true;
            }
            return false;
        } else {
            return false;
        }
    } else {
        return toString.call(value) === '[object Object]';
    }
};

/**
 * 验证字符串的日期格式，只能验证的格式为 '2008-08-08 20:20:03'
 * @param  {String}  str  字符串
 * @return {Boolean}      false: 不是日期格式   true： 是日期格式
 */
function verifyDate(str) {
    var reg = /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))(\s(([01]\d{1})|(2[0123])):([0-5]\d):([0-5]\d))?$/;
    if (!reg.test(date)) {
        //alert("请输入正确的时间（格式: 2008-08-08 20:20:03）");
        return false;
    } else {
        return true;
    }
}

/**
 * 时间格式化
 * @param date 日期类型
 * @param format 日期格式字符串 如：yyyy-MM-dd hh:mm:ss
 * @returns {*}
 */
Date.prototype.format = function(format){
    var o = {
        "M+" : this.getMonth()+1,
        "d+" : this.getDate(),
        "h+" : this.getHours(),
        "m+" : this.getMinutes(),
        "s+" : this.getSeconds(),
        "q+" : Math.floor((this.getMonth()+3)/3),
        "S" : this.getMilliseconds()
    };

    if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }

    for(var k in o) {
        if(new RegExp("("+ k +")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        }
    }
    return format;
};

/**
 * 对象克隆
 * @param obj
 * @returns {*}
 */
exports.clone = function(obj) {
    var me = this;
    var o, obj; //obj可以删除
    if (obj.constructor == Object) {
        o = new obj.constructor();
    } else {
        o = new obj.constructor(obj.valueOf());
    }
    for (var key in obj) {
        if (o[key] != obj[key]) {
            if (typeof(obj[key]) == 'object') {
                o[key] = me.clone(obj[key]);
            } else {
                o[key] = obj[key];
            }
        } else if (typeof(o[key]) === 'undefined' && obj[key] === null) {
            o[key] = obj[key];
        }
    }
    o.toString = obj.toString;
    o.valueOf = obj.valueOf;
    return o;
};
