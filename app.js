const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
//checking env
if (process.env.ENV === 'Test') {
	console.log('running on testing env...');
	const database = mongoose.connect('mongodb://localhost/bookAPI_test');
} else {
	console.log('running on production env...');
	const database = mongoose.connect('mongodb://localhost/bookAPI');
}

const port = process.env.PORT || 3000;
const Book = require('./models/bookModel');
const bookRouter = require('./routes/bookRouter')(Book);

//body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', bookRouter);

app.get('/', (req, res) => {
	res.send('Welcome o my Nodemon API');
});

app.server = app.listen(port, () => {
	console.log(`Running on port ${port}`);
});

module.exports = app;