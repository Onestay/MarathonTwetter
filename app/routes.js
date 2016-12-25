const mysql = require('mysql');
const token = require('../tokens.json');
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
	// post routes
	app.post('/login', (req, res) => {
		const user = req.body.user;
		const password = req.body.pass;
		sql.query('SELECT * FROM `user` WHERE `username` = ?', [user], (errSql, results) => {
			if (errSql) return console.log(errSql);
			if (results.length === 0) return res.send({ status: 'error', message: 'This user/password combination doesn\' exist. Try again.' });
			bcrypt.compare(password, results[0].password, (err, resBcrypt) => {
				if (err) return console.log(err);
				if (resBcrypt === true) {
					let responseObject = {
						status: 'ok',
						message: 'ok'
					};
					req.session.user = {
						user: user,
						id: results[0].iduser
					};
					res.send(responseObject);
				} else {
					return res.send({ status: 'error', message: 'This user/password combination doesn\'t exist. Try again.' });
				}
			});
		});
	});

	app.post('/register', (req, res) => {
		const user = req.body.user;
		const password = req.body.pass;
		const email = req.body.email;
		bcrypt.genSalt(10, (err, salt) => {
			if (err) return console.log(err);
			bcrypt.hash(password, salt, (error, hash) => {
				if (error) return console.log(error);
				sql.query({
					sql: 'INSERT INTO `user` (`username`, `email`, `password`) VALUES (?, ?, ?);',
					timeout: 40000,
					values: [user.toLowerCase(), email, hash]
				}, (errmysql, results) => {
					if (errmysql) {
						let responseObject = {
							status: 'error',
							message: errmysql
						};
						res.send(responseObject);
					}
					let responseObject = {
						status: 'ok',
						message: 'ok'
					};
					console.log('Successfully created a new user!');
					req.session.user = {
						user: user,
						id: results.insertId
					};
					res.send(responseObject);
				});
			});
		});
	});

	app.get('/dashboard', (req, res) => {
		if (!req.session.user) {
			res.redirect('/');
		}
		res.send('A wonderful dashboard');
	});

	app.get('/clearuserdata', (req, res) => {
		req.session.regenerate((err) => {
			if (err) return console.log(err);
			res.redirect('/');
		});
	});

	app.get('/', (req, res) => {
		if (!req.session.user) {
			res.redirect('/welcome');
		} else {
			res.redirect('/dashboard');
		}
	});
};
