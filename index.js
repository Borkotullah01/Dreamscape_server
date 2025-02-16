const express = require('express')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const app = express()
const port = 3000
const db_username = process.env.DB_USERNAME
const db_password = process.env.USER_PASSWORD

//middleware 
app.use(cors())
app.use(express.json())

//server to mondodb database
const uri = `mongodb+srv://${db_username}:${db_password}@cluster0.elpbg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
    // mongoDB Databse and collection creating
    const craftDB = client.db("craftDB");
    const ArtCategoryDB = client.db("ArtCategoryDB");
    const caftColl = craftDB.collection("caftColl");
    const CategoryColl = ArtCategoryDB.collection("CategoryColl");
    
    // server side routing
    app.get('/', async(req, res) => res.send('Hello World!'))

    app.get('/craft', async(req, res) => {
        const cursor = caftColl.find({});
        const allValues = await cursor.toArray();
        res.send(allValues)
    })
    
    app.get('/category', async(req, res) => {
        const cursor = CategoryColl.find({});
        const allValues = await cursor.toArray();
        res.send(allValues)
    })
    app.get('/category/:category', async(req, res) => {
      const category = req.params.category;
      const query = { category: category };
      const result = await caftColl.find(query).toArray();
      res.send(result)
    })
    
    app.post('/craft', async(req, res) => {
        const newCraft = req.body;
        console.log(newCraft);
        const result = await caftColl.insertOne(newCraft);
        res.send(result)
    })

    app.put('/craft', async(req, res) => {
        const data = req.body;
        const id = data._id;
        const filter = {_id: new ObjectId(id)}
        console.log(filter)
        const updateDock = {
          $set: {
          category: data.category, 
          customization: data.customization, 
          description: data.description, 
          email: data.email, 
          name: data.name, 
          photo: data.photo, 
          posted_at: data.posted_at, 
          posted_by: data.posted_by, 
          price: data.price, 
          processing: data.processing, 
          rating: data.rating, 
          stock: data.stock,
          } 
        }
        const result = await caftColl.updateOne(filter, updateDock);
        res.send(result)
    })
    app.delete('/delete/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await caftColl.deleteOne(query);
        res.send(result)
    })

    app.get('/details/:id', async(req, res) => {
        const id = req.params.id
        const query = { _id: new ObjectId(id) };
        const result = await caftColl.findOne(query);
        res.send(result)
    })

    app.get('/myCraft/:email', async(req, res) => {
        const email = req.params.email;
        const query = {email: email};
        const result = await caftColl.find(query).toArray();
        res.send(result)
    })

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => console.log(`Your Dreamescape server is running on http://localhost:${port}`))