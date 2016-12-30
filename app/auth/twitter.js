const Twitter = require('node-twitter-api');
const tokens = require('../../tokens.json');

module.exports = (app) => {
	const twitter = new Twitter({
		consumerKey: tokens.twitter.id,
		consumerSecret: tokens.twitter.secret,
		callback: 'http://localhost:3055/twitter/callback',
		x_auth_access_type: 'write' //eslint-disable-line
	});

	let _requestSecret;

	app.get('/twitter', (req, res) => {
		if (!req.session.user) {
			res.redirect('/welcome');
		} else {
			twitter.getRequestToken((err, requestToken, requestSecret) => {
				if (err) return res.status(500).send(err);
				_requestSecret = requestSecret;
				res.redirect(`https://api.twitter.com/oauth/authenticate?oauth_token=${requestToken}`);
			});
		}
	});

	let _accessToken, _accessSecret;
	app.get('/twitter/callback', (req, res) => {
		const requestToken = req.query.oauth_token,
			verifier = req.query.oauth_verifier;

		twitter.getAccessToken(requestToken, _requestSecret, verifier, (err, accessToken, accessSecret) => {
			if (err) return res.status(500).send(err);
			twitter.verifyCredentials(accessToken, accessSecret, (error, user) => {
				if (error) return res.status(500).send(error);
				console.log(user);
				console.log(accessToken + accessSecret);
				_accessToken = accessToken;
				_accessSecret = accessSecret;
				req.session.user = {
					user: req.session.user.user,
					id: req.session.user.id,
					twitterHandle: user.screen_name
				};
				res.redirect('/importSchedule');
			});
		});
	});

	app.post('/importSchedule', (req, res) => {
		console.log(`accessToken: ${_accessToken}, accessSecret: ${_accessSecret}`);
		res.send({ accessToken: _accessToken, accessSecret: _accessSecret });
	});
};
