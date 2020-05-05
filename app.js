const PORT = 3000;

// library
var express = require('express');
var mysql = require('mysql');
var conn = require('express-myconnection');
var bodyParser = require('body-parser');

var config = require('./db');
var dbConfig = {
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    port: config.database.port,
    database: config.database.db
}

var routers = require('./routers/index');
var pubDir = (__dirname + '/public/'); // set static dir for display image

var app = express();
app.use(express.static(pubDir));
app.use(conn(mysql, dbConfig, 'pool'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/', routers);
app.listen(PORT, () => {
    console.log('Backend running at PORT: ' + PORT);
})