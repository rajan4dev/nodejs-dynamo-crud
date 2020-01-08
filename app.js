const express = require("express");

const app = express();

const morgan = require('morgan');

const userRoutes = require('./api/routes/users');

app.use(morgan('dev'));//will log all requests with format 'dev' and internally call next function to pass request to next middleware which is to handle /users in this case

app.use('/users', userRoutes);//for path starting with /users , let userRoutes handle the request


//execution reached here meaning no above routes got matched
app.use((req, res, next) => {
   const error = new Error("Not Found!");
   error.status = 404;
   next(error);//forward request(error in this case) to the next middleware which is a generic error handler for handling all kinds of errors thrown while serving any route
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message : error.message
        }
    });
});

module.exports = app;
