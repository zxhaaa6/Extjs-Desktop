var config = require('../../config/config');
var GlobalVarManager = require('../GlobalVarManager');

exports.deskTop = function (req, res) {
    var userInfo = req.session.userInfo;
    var logo = config.logo;
    var resParams = {
        title: 'firstExt',
        userInfo: userInfo,
        logo: logo
    };
    res.render('desktop', {resParam: resParams});
};