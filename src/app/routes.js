module.exports = (app) => {
	require('./auth/twitter.js')(app);
	require('./auth/login.js')(app);
	require('./schedule.js')(app);

	// all the general routes that don't have any specific purpose other than redirecting or rendering
	app.get('/dashboard', (req, res) => {
		if (!req.session.user) {
			res.redirect('/welcome');
		} else if (!req.session.user.setup) {
			res.redirect('/startSetup');
		} else {
			res.send('xXDashboardMasterXx');
		}
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

	app.get('/welcome', (req, res) => {
		if (req.session.user) {
			res.redirect('/dashboard');
		} else {
			res.render('welcome.ejs');
		}
	});

	app.get('/startSetup', (req, res) => {
		if (req.session.user.setup) return res.redirect('/dashboard');
		res.render('startSetup', { username: req.session.user.user });
	});

	app.get('/importSchedule', (req, res) => {
		res.render('importSchedule', { twitterHandle: req.session.user.twitterHandle });
	});
};
