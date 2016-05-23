var express = require('express');
var router = express.Router();

var sys = require('../controllers/system/sys');
var sysUser = require('../controllers/system/sys_user');

router.get('/', sys.deskTop);
router.get('/sys/roleByUser/:username', sysUser.getRoleByUser);
router.post('/sys/login', sysUser.login);


module.exports = router;