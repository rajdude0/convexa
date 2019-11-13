var express = require('express');
var bodyParser = require('body-parser');
var app     = express();

//Note that in version 4 of express, express.bodyParser() was
//deprecated in favor of a separate 'body-parser' module.
app.use(express.urlencoded());
app.use(express.json());
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/node-demo");
var inputSchema = new mongoose.Schema({
    iname:String,
    ivalue:String
});
var studioSchema = new mongoose.Schema({
    api: String,
    userinputs: [{}],
    method: String,
    intents:Array,
    resType:String

});
var Studio = mongoose.model("Studio", studioSchema);


//app.use(bodyParser());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get('/', function(req, res) {
    res.send("hello world");
});

app.post('/', function(req, res) {
    console.log(req);
    var myData = new Studio(req.body);
    myData.save().then(function(item){
        res.header('Access-Control-Allow-Origin','*');
        res.send("Name saved to database");
    })
    .catch(function(err){
        res.status(400).send("Unable to save to database");
   });

});

app.listen(3200, function() {
    console.log('Server running at http://127.0.0.1:3200/');
});