var config = require('../../config/config');

exports.deskTop = function (req, res) {
    var baseUrl = req.protocol + '://' + req.get('Host');
    var userInfo = '';
    var logo = config.logo;
    var resParams = {
        title: 'firstExt',
        webRoot: baseUrl,
        userInfo: userInfo,
        logo: logo
    };
    res.render('desktop', resParams);
};