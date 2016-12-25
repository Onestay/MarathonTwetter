// here we go
const path = require('path');

// express middleware
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const port = 3000;

// create the express app
const app = express();


// use the express middleware
app.use(express.static(path.join(`${__dirname}/public`)));

app.use(morgan('dev'));

app.use(session({
	secret: 'hsngio39',
	resave: false,
	saveUninitialized: true
}));

require('./app/routes')(app);

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
