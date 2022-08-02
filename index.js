const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { json } = require('express');

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
            const result = await toDoCollection.insertOne(blog);
            res.send(result);
        });
        app.get('/blog', async(req, res) => {
            const query = {};
            const result = await toDoCollection.find(query).toArray();
            res.send(result);
        });
        app.get('/update/:id', async(req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = {_id: ObjectId(id)};
            const result = await toDoCollection.findOne(filter);
            res.send(result);
        })
        app.delete('/blog/:id', async(req, res)=>{
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const result = await toDoCollection.deleteOne(filter);
            res.send(result);
        });
        app.patch('/update/:id', async(req, res) => {
            const id = req.params.id;
            const blog = req.body;
            const filter = {_id: ObjectId(id)};
            const updateDoc = {
                $set: blog,
            };
            const result = await toDoCollection.updateOne(filter, updateDoc);
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