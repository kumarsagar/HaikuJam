const express = require('express');
const bodyParser= require('body-parser');
var mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const connectionPath = "mongodb://localhost:27017";
const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(3000, function() {
    console.log('listening on 3000');
});


MongoClient.connect(connectionPath, { useUnifiedTopology: true })
    .then(client => {
        console.log("connected to database HaikuDb.."); 
        const haikuDb = client.db("HaikuDb"); 

        app.get("/showDbConfig", (req,res) => {
            haikuDb.executeDbAdminCommand({ replSetGetStatus : 1 })
            .then(stats => {
                res.send(stats);
            })
            .catch(error => console.log(error));
        });

        const haikus = haikuDb.collection("haikus");
        app.get('/', (req, res) => {
            haikus.findOne({$or : [{"line2" : undefined},{"line3" : undefined}]})
            .then(result => {
                res.render('index.ejs',{"incompleteHaiku" : result});
            })
            .catch(error => console.error(error));
        }); 
    
        app.post('/addLine', (req, res) => {
            if(req.body.HaikuId == undefined){
                var firstLine ={};
                firstLine["line1"] = req.body.line;
                haikus.insertOne(firstLine)
                .then(result => {
                    console.log(result);
                    res.redirect("/");
                }).catch(error => console.log(error));
            }else{
                var lineNumber = (req.body.lineNumber == 2) ? "line2" : "line3" ;
                var lineObject ={};
                lineObject[lineNumber] = req.body.line;
                docId = new mongo.ObjectID(req.body.HaikuId);
                haikus.updateOne(
                    { "_id" : docId },
                    { $set : lineObject }
                    )
                .then(result => {
                    console.log(result);
                    res.redirect("/");
                }).catch(error => console.log(error));
            }
        });    
    })
    .catch(error => console.log(error));