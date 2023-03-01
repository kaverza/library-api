const express = require('express');

const userRouter = require('./routes/user');
const booksRouter = require('./routes/books');
const apiBooksRouter = require('./routes/api-books');

const app = express();
app.use(express.urlencoded());
app.set('view engine', 'ejs');

app.use('/api/user', userRouter);
app.use('/api/books', apiBooksRouter);
app.use('/', booksRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT);