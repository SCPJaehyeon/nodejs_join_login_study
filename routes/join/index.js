var express = require('express');
var app = express()
var router = express.Router()
var path = require('path')
var mysql = require('mysql')

var connection = mysql.createConnection({
	host     : '',
	port     : 3306,
	user     : '',
	password : '',
	database : ''
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

	var query = connection.query('insert into member_tb (member_email, member_name, member_pw) values ("' + email + '","' + name + '","' + passwd + '")', function(err, rows) {
		if(err) { throw err;}
		console.log("Data inserted!");
		res.redirect('/');
	})
})

module.exports = router;
