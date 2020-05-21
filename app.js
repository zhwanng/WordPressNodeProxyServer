// const createError = require('http-errors');
const express = require('express');
const path = require('path');
// const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
var bodyParser = require('body-parser');
//wp
const wpRouter = require('./routes/wp');

const app = express();

// var cors = require('cors');
// app.use(cors({
//     origin: [
//         'http://localhost:9000', 'http://localhost:9001', 'http://localhost:9002'
//     ],
//     methods: ['GET', 'POST'],
//     alloweHeaders: ['Conten-Type', 'Authorization']
// }));

app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({
    extended: false
}));
//router
app.use('/wp/', wpRouter);

//第三方
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// catch 404 and forward to error handler
//app.use(function (req, res, next) {
//    next(createError(404));
//});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;