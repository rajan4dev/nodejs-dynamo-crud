const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({message: 'Handling GET request for /users'});
});

router.post('/', (req, res, next) => {
    res.status(200).json({message: 'Handling POST request for /users'});
});

router.get('/:userId', (req, res, next) => {
    const id = req.params.userId;

    if(id === 'special'){
        res.status(200).json({message: 'You discovered a special ID', id: id});

    }else{
        res.status(200).json({message: 'You passed an ID', id: id});

    }
});

router.patch('/:userId', (req, res, next) => {
    const id  = req.params.userId;
    res.status(200).json({
        message: 'Updated user!',
        id: id
    });
});
router.delete('/:userId', (req, res, next) => {
    const id  = req.params.userId;
    res.status(200).json({
        message: 'Deleted user!',
        id: id
    });
});

module.exports = router;//exporting router configured with routes