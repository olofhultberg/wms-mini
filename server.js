const express = require('express')
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.get('/', function(req,res){
    res.send("Warehouse management system - Grafokett AB v1.0");
});

app.listen(PORT, function(){
    console.log(`App running on localhost:${PORT}`);
});