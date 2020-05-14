const express = require('express');
const fs = require('fs');
const handler = require('./handler');
const router = express.Router();

router.get('/', (req, res) => {
    fs.readFile('./server/db/cart.json','utf-8', (err, data) => {
        if (err) {
            res.sendStatus(404, JSON.stringify({result: 0, text: err}));
        } else {
            res.send(data);
        }
    });

});

router.post('/', (req, res) => {
    handler(req, res, 'add','./server/db/cart.json');
});

router.put('/:id', (req, res) => {
    handler(req, res, 'change','./server/db/cart.json');
});
router.delete('/:id', (req, res) => {
    handler(req, res, 'delete','./server/db/cart.json');
});

module.exports = router;