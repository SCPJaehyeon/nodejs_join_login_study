var express = require('express');
var app = express()
var router = express.Router()
var path = require('path')
var mysql = require('mysql')
var crypto = require('crypto')

var connection = mysql.createConnection({
	host     : 'xxx.xxx.xxx.xxx',
	port     : 3306,
	user     : '',
	password : '',
	database : ''
});

connection.connect();

router.get('/', function(req,res){
	console.log('get login url')
	res.sendFile(path.join(__dirname, '../../public/login.html'))
})

router.post('/', function(req,res){
	var body = req.body;
	var email = body.email;
	var passwd = body.password;

	var query = 'select * from member_tb where member_email=?;';
	connection.query(query, [email], function(err, results){
		if(err)
			console.log(err);
		if(!results[0])
			return res.send('please check your email.');
		var user = results[0];
		crypto.pbkdf2(passwd, user.salt, 100000, 64, 'sha256', function(err, derivedKey){
			if(err)
				console.log(err);
			if(derivedKey.toString('hex') === user.member_pw){
				return res.send('login success');
			}else{
				return res.send('please check your password.');
			}
		});
	});
})

module.exports = router;
