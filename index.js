const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.beeqz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async() => {
    try{
        await client.connect();
        const toDoCollection = client.db("toDoData").collection('toDo');

        app.post('/blog', async(req, res) => {
            const blog = req.body;
            console.log(blog)
            const result = await toDoCollection.insertOne(blog);
            res.send(result);
        });
        app.get('/blog', async(req, res) => {
            const query = {};
            const result = await toDoCollection.find(query).toArray();
            res.send(result);
        })

    }
    finally{

    }
};

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello from to do server');
});

app.listen(port, () => {
    console.log("Listening to port", port);
});