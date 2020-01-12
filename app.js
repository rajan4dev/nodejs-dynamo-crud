require('dotenv').config({path: './config/.env'});//sets environment variables using .env file

const express = require("express");

const app = express();

const morgan = require('morgan');//logger

const bodyParser = require('body-parser');//parse body from http request

const userRoutes = require('./api/routes/users');

app.use(morgan('dev'));//will log all requests with 'dev' format and internally call next function to pass request to next middleware

app.use(bodyParser.urlencoded({extended : false})); //type of request bodies to parse
app.use(bodyParser.json());//type of request bodies to parse

app.use((req, res, next)=>{
   res.header("Access-Control-Allow-Origin","*");
   res.header(
       "Access-Control-Allow-Headers",
       "Origin, X-Requested-With, Content-Type, Accept, Authorization"
   );
   if(req.method === 'OPTIONS'){//browser will always send an OPTION req first, when you send a post/put request to check if it can make that request
        req.header("Access-Control-Allow-Methods", 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
   }
   next();
});

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
