var config = require('../../config/config');

exports.deskTop = function (req, res) {
    var userInfo = {
        name: 'admin',
        password: '123'
    };
    var logo = config.logo;
    var resParams = {
        title: 'firstExt',
        userInfo: userInfo,
        logo: logo
    };
    res.render('desktop', resParams);
};