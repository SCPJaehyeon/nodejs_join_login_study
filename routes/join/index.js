var express = require('express');
var app = express()
var router = express.Router()
var path = require('path')
var mysql = require('mysql')
var crypto = require('crypto');

var connection = mysql.createConnection({
	host     : 'xx.xxx.xxx.xxx',
	port     : 3306,
	user     : 'xxx',
	password : 'xxx',
	database : 'xxx'
});

connection.connect();

router.get('/', function(req,res){
	console.log('get join url')
	res.sendFile(path.join(__dirname, '../../public/join.html'))
})

router.post('/', function(req,res){
	var body = req.body;
	var email = body.email;
	var name = body.name;
	var passwd = body.password;
	var msalt = '';
	var mpassword = '';
	crypto.randomBytes(64, (err, buf) =>{
		if(err) throw err;
		msalt = buf.toString('hex');
		console.log('salt : ', msalt);
	
		crypto.pbkdf2(passwd, msalt, 100000, 64, 'sha512',(err,derivedKey) => {
			if(err) throw err;
			mpassword = derivedKey.toString('hex');
			console.log('mpasswd : ', mpassword, mpassword.length);
	
				var query = connection.query('insert into member_tb (member_email, member_name, member_pw, salt) values ("' + email + '","' + name + '","' + mpassword + '","' + msalt + '")', function(err, rows) {
				if(err) { throw err;}
				console.log("Data inserted!");
				res.redirect('/');
			});
		});
	});
})

module.exports = router;
