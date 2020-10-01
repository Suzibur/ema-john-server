const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const port = 4000;
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wanio.mongodb.net/Ema-John?retryWrites=true&w=majority`;
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const client = new MongoClient(uri, { useNewUrlParser: true,  useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("Ema-John").collection("Products");

    app.post('/addProducts', (req,res) => {
        const products = req.body
        collection.insertMany(products)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    })    
    app.get('/allProducts', (req,res) => {
        collection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })
    app.get('/product', (req,res) => {
        const productKey = req.query.key;
        collection.find({key:productKey})
        .toArray((err, documents) => {
            res.send(documents[0])
        })
    })
    app.post('/orderProducts', (req,res) => {
        const productKeys = req.body;
        collection.find({key: { $in : productKeys } })
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

});

app.listen(process.env.PORT || port);