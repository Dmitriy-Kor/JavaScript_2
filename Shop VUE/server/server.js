
const express = require('express');
const fs = require('fs');
const cartRouter = require('./cartRouter');
const app = express();
const stats = require('./db/stats');
const moment = require('moment');

app.use(express.json());
app.use('/', express.static('./public'));
app.use('/api/cart', cartRouter);


app.get('/api/products', (req, res) => {
    fs.readFile('./server/db/catalog.json', 'utf-8', (err, data) => {
        if (err) {
            res.send(JSON.stringify({result: 0, text: err}));
            //res.sendStatus(404, JSON.stringify({result: 0, text: err}));
        } else {
            res.send(data);
        }
    });
});

app.post('/api/stats', (req, res) => {
    // добавляю время
    let stat = Object.assign({time: moment().format('MMMM Do YYYY, h:mm:ss a')}, req.body);
    stat = JSON.stringify(stat, null, 4)
    console.log(stat);
    stats.push(stat); // не записывается в массив
    console.log(stats);
    fs.writeFile('./server/db/stats.json',stats, (err) => {
        if (err) {
            if (err) {
                res.send('{"result": 0}');
            } else {
                res.send('{"result": 1}');
            }
        }
    })
})



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening ${port} port`);
});