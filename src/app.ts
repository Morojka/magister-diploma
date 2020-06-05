var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));

app.set('view engine', 'pug');
app.listen(process.env.PORT, function () {
    console.log('Example app listening on port 5000!');
});

// ______ROUTES________
app.get('/', function(req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!'});
});
app.post('/confirmVK', function(req, res) {
    if(req.query === { "type": "confirmation", "group_id": 166439257 }) {
        res.send('cacf322a');
    }
});
app.post('/login', function(req, res) {

});
// ______ROUTES________

export default {app}