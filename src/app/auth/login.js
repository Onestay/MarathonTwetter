const mysql = require('mysql');
const token = require('../../tokens.json');
const bcrypt = require('bcrypt');

// could've created that mysql object in a diffrent file but ¯\_(ツ)_/¯
const sql = mysql.createConnection({
	host: token.mysql.host,
	user: token.mysql.user,
	password: token.mysql.password,
	database: token.mysql.database
});

sql.connect((err) => {
	if (err) return console.log(`Error connecting: ${err}`);
	console.log('Success connecting to database');
});

module.exports = (app) => {
	app.post('/login', (req, res) => {
		const user = req.body.user;
		const password = req.body.pass;
		sql.query('SELECT * FROM `user` WHERE `username` = ?', [user], (errSql, results) => {
			if (errSql) return console.log(errSql);
			if (results.length === 0) return res.send({ status: 'error', message: 'Wrong login credentials' });
			bcrypt.compare(password, results[0].password, (err, resBcrypt) => {
				if (err) return console.log(err);
				if (resBcrypt === true) {
					let responseObject = {
						status: 'ok',
						message: 'ok'
					};
					req.session.user = {
						user: user,
						id: results[0].iduser,
						setup: results[0].setup === 1
					};
					res.send(responseObject);
				} else {
					return res.send({ status: 'error', message: 'Wrong login credentials' });
				}
			});
		});
	});

	app.post('/register', (req, res) => {
		const user = req.body.user;
		const password = req.body.pass;
		const email = req.body.email;
		if (user.length === 0 || password.length === 0 || email.length === 0) return res.send({ status: 'error', message: '' });
		bcrypt.genSalt(10, (err, salt) => {
			if (err) return console.log(err);
			bcrypt.hash(password, salt, (error, hash) => {
				if (error) return console.log(error);
				sql.query({
					sql: 'INSERT INTO `user` (`username`, `email`, `password`, `setup`) VALUES (?, ?, ?, 0);',
					timeout: 40000,
					values: [user.toLowerCase(), email, hash]
				}, (errmysql, results) => {
					if (errmysql && errmysql.code === 'ER_DUP_ENTRY') {
						let responseObject = {
							status: 'error',
							message: 'This username or email already exist.'
						};
						return res.send(responseObject);
					}
					if (!results) {
						return res.send({ status: 'error', message: 'Error. This is most likely caused by the username or email already existing.' });
					}
					let responseObject = {
						status: 'ok',
						message: 'ok'
					};
					console.log('Successfully created a new user!');
					req.session.user = {
						user: user,
						id: results.insertId,
						setup: false
					};
					res.send(responseObject);
				});
			});
		});
	});
};
