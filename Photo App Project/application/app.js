var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var handlebars = require('express-handlebars');
var sessions = require('express-session');
var mysqlSession = require('express-mysql-session')(sessions);
var flash = require('express-flash');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
var commentRouter = require('./routes/comments');


var errorPrint = require('./helpers/debug/debugprinters').errorPrint;
var requestPrint = require('./helpers/debug/debugprinters').requestPrint;
const { red } = require('colors');
const { nextTick } = require('process');

var app = express();

app.engine(
    'hbs',
    handlebars({
        layoutsDir: path.join(__dirname, "views/layouts"),
        partialDir: path.join(__dirname, "views/partial"),
        extname: ".hbs",
        defaultLayout: "home",
        helpers: {
            emptyObject: (obj) => {
                return !(obj.constructor === Object && Object.keys(obj).length == 0);
            }
        }
    })
);

var mysqlSessionStore = new mysqlSession(
    {
        /* using default options */
    },
    require('./config/database'));

app.use(sessions({
    key: "csid",
    secret: "Secret from csc317",
    store: mysqlSessionStore,
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

app.set("view engine", "hbs");
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    requestPrint(req.url);
    next();
});

app.use((req, res, next) => {
    if(req.session.username){
        res.locals.logged = true;
    }
    next();
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentRouter);

app.use((err, req, res, next) => {
    console.log(err);
    res.render('error', {err_message: err});
});


module.exports = app;
