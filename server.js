// here we go
const path = require('path');
const redis = require('redis');
const redisClient = redis.createClient();

// express middleware
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const port = 3055;

// redis to store session data
const RedisStore = require('connect-redis')(session);

// create the express app
const app = express();

// initiate the db connection

// use the express middleware
app.use(express.static(path.join(`${__dirname}/public`)));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(session({
	store: new RedisStore({ client: redisClient }),
	secret: 'gnhjoie',
	resave: false,
	saveUninitialized: true
}));
app.set('view engine', 'ejs');

// check for the existence of req.session
app.use((req, res, next) => {
	if (!req.session) {
		throw new Error('Couldn\'t find the express session. This is likely caused by redis.');
	}
	next();
});


require('./app/routes')(app);

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});


redisClient.on('error', (err) => {
	console.log(`Redis error ${err}`);
});
