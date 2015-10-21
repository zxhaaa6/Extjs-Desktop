var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
var os=require('os');
var test=require('../model/test');

var resDoc = {
    success: true,
    users: [
        {id: 1, name: 'Peter', email: 'x@a.com',status:'yes'},
        {id: 2, name: 'Frank', email: 'x@b.com',status:'yes'},
        {id: 3, name: 'Cat', email: 'x@c.com',status:'yes'},
        {id: 4, name: 'John', email: 'x@d.com',status:'yes'},
        {id: 5, name: 'Marry', email: 'x@e.com',status:'no'},
        {id: 6, name: 'Kitty', email: 'x@f.com',status:'no'},
        {id: 7, name: 'Tom', email: 'a@x.com',status:'yes'}
    ]
};
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});
router.get('/getAllUsers', function (req, res, next) {
    /*var pageSize = req.param('limit');
     var currentPage = req.param('page');
     var count = resDoc.users.length;
     var index = (count / pageSize) * (currentPage - 1);
     var doc = {
     success: true,
     users: []
     };
     for (var i = index; i < index+pageSize; i++) {
     doc.users.push(resDoc.users[i]);
     }
     console.log(doc);*/
    console.log('*******************');
    res.send(resDoc);
});
router.post('/updateUsers', function (req, res, next) {
    var id = req.body.id;
    var name = req.body.name;
    var email = req.body.email;
    for (var i = 0; i < resDoc.users.length; i++) {
        if (id === resDoc.users[i].id) {
            resDoc.users[i].name = name;
            resDoc.users[i].email = email;
            break;
        }
    }
    res.send('success');
});
router.post('/addUser', function (req, res, next) {

    var name = req.body.name;
    var email = req.body.email;
    console.log(name + email);
    resDoc.users.push({id: resDoc.users[resDoc.users.length - 1].id + 1, name: name, email: email});
    res.send('success');
    console.log(resDoc);
});
router.post('/deleteUsers', function (req, res, next) {
    var data = req.body;
    console.log(resDoc);
    var removeDate = function (id) {
        for (var i = 0; i < resDoc.users.length; i++) {
            if (resDoc.users[i].id === id) {
                if (i === resDoc.users.length - 1) {
                    resDoc.users.pop();
                } else {
                    for (var j = i + 1; j < resDoc.users.length; j++) {
                        var temp = resDoc.users[j - 1];
                        resDoc.users[j - 1] = resDoc.users[j];
                        if (j === resDoc.users.length - 1) {
                            resDoc.users.pop();
                        }
                    }
                }

                break;
            }
        }
    };
    if (data instanceof Array) {
        for (var i = 0; i < data.length; i++) {
            removeDate(data[i].id);
        }
    } else {
        var id = data.id;
        removeDate(id);
    }

    console.log(resDoc);
    console.log(data);
    res.send('success');

});
router.post('/fileUpload', function (req, res) {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = 'D:/upload/';
    form.keepExtensions = true;
    form.maxFieldsSize = 30 * 1024; //最大内存30kb
    var resDoc = {};
    form.parse(req, function (err, fields, files) {
        if (err) {
            resDoc.msg = 'went wrong';
            res.send(resDoc);
            throw err;
        } else {
            console.log(fields);
            var newPath = form.uploadDir + files.fulAvatar.name;
            console.log(newPath);
            fs.renameSync(files.fulAvatar.path, newPath);  //重命名
            resDoc.msg = 'success';
            res.send(resDoc);
            /*fs.stat('D:/upload/', function (err,stats) {
                console.log(stats);
                console.log(stats.isDirectory());
            })*/
            console.log(os.freemem());

        }

    });


});
module.exports = router;
