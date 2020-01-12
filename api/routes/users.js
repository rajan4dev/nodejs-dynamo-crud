const express = require('express');
const router = express.Router();
const AWS = require("aws-sdk");
const uuid = require('uuid/v4');


AWS.config.update({
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretAccessKey,
    region: process.env.AWSRegion
});

const docClient = new AWS.DynamoDB.DocumentClient();
const table = "test-crud";

router.get('/', (req, res, next) => {
    const params = {
        TableName: table
    };
    docClient.scan(params, onScan);
    function onScan(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
            res.status(err.statusCode).json({message: 'Unable to get all users.', error : JSON.stringify(err, null, 2)});
        } else {
            res.status(200).json(data.Items);
            data.Items.forEach(function(user) {
                console.log(
                    JSON.stringify(user));
            });
        }
    }
});

router.post('/', (req, res, next) => {
    const newId = uuid();
    const params = {
        TableName:table,
        Item:{
            "userId": newId,
            "name" : req.body.name,
            "email" : req.body.email,
            "role" : req.body.role,
            "mobileNumber":req.body.mobileNumber
        }
    };
    docClient.put(params, function(err, data) {
        if (err) {
            res.status(err.statusCode).json({
                message : 'Unable to create user.',
                error : JSON.stringify(err, null, 2)
            });
        } else {
            res.status(200).json({
                message: 'User was created.!',
                id: newId
            });
        }
    });
});

router.get('/:userId', (req, res, next) => {
    const id = req.params.userId;

    const params = {
        TableName: table,
        Key:{
            "userId": id
        }
    };

    docClient.get(params, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            res.status(err.statusCode).json({message: 'Unable to read item.', error: JSON.stringify(err, null, 2)});
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            if(data.Item){
                res.status(200).json(data.Item);
            }else{
                res.status(404).json({message : "User ID not found"});
            }
        }
    });

});

router.patch('/:userId', (req, res, next) => {
    const id  = req.params.userId;
    const params = {
        TableName:table,
        Item:{
            "userId": id,
            "name" : req.body.name,
            "email" : req.body.email,
            "role" : req.body.role,
            "mobileNumber":req.body.mobileNumber
        }
    };
    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to update user. Error JSON:", JSON.stringify(err, null, 2));
            res.status(err.statusCode).json({
                message : 'Unable to update user.',
                error : JSON.stringify(err, null, 2)
            });
        } else {
            console.log("Update user succeeded:", JSON.stringify(data, null, 2));
            res.status(200).json({
                message: 'Update user succeeded.!',
                id: id
            });
        }
    });
});

router.delete('/:userId', (req, res, next) => {
    const id  = req.params.userId;
    const params = {
        TableName:table,
        Key:{
            "userId": id
        },
        ConditionExpression: 'attribute_exists(userId)',
    };

    docClient.delete(params, function(err, data) {
        if (err) {
            console.error("Unable to delete user. Error JSON:", JSON.stringify(err, null, 2));
            res.status(err.statusCode).json({message: 'Unable to delete item.', error: JSON.stringify(err, null, 2)});
        } else {
            console.log("Delete user succeeded:", JSON.stringify(data, null, 2));
            res.status(200).json({
                message: 'Deleted user!',
                id : id
            });
        }
    });
});

module.exports = router;//router configured with routes