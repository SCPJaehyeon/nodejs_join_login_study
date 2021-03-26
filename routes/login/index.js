var express = require('express');
var app = express()
var router = express.Router()
var path = require('path')
var mysql = require('mysql')
var crypto = require('crypto')

const jwt = require('jsonwebtoken');
require('dotenv').config();
const { verifyToken } = require('../middleware');

var connection = mysql.createConnection({
	host     : 'xx.xxx.xxx.xxx',
	port     : 3306,
	user     : 'xxx',
	password : 'xxx',
	database : 'xxx'
});

connection.connect();

router.get('/', function(req,res){
	console.log('get login url')
	res.sendFile(path.join(__dirname, '../../public/login.html'))
})
router.get('/test', verifyToken, (req,res)=>{
	res.json(req.decoded);
});

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
		var user_email = user.member_email;
		crypto.pbkdf2(passwd, user.salt, 100000, 64, 'sha512', function(err, derivedKey){
			if(err)
				console.log(err);
			if(derivedKey.toString('hex') === user.member_pw){
				const token = jwt.sign({
					user_email
				}, process.env.JWT_SECRET, {
					expiresIn: '1d',
					issuer: '토큰발급자',
				});
				res.cookie('user', token);
				return res.json({
					code: 200,
					message: '토큰이 발급되었습니다.',
					token,
				});
			}
				//return res.send('login success');
			else{
				return res.send('please check your password.');
			}
		});
	});
})
module.exports = router;
