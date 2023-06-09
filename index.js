const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 4000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fpfcy.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toyCollection = client.db('pawToy').collection('toys');


    app.get('/addToy', async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { seller_email: req.query.email }
      }

      let sort = {};
      if (req.query?.sort === 'desc') {
        sort = { price: -1 };
      } else if (req.query?.sort === 'asc') {
        sort = { price: 1 };
      }

      const result = await toyCollection.find(query).sort(sort).toArray();
      res.send(result);
    })

    app.get('/toy/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toyCollection.findOne(query);
      res.send(result);
    })

    app.post('/addToy', async (req, res) => {
      const toy = req.body;
      const result = await toyCollection.insertOne(toy);
      res.send(result);
    });

    app.put('/toy/:id', async (req, res) => {
      const id = req.params.id;
      const updatedToy = req.body;
      console.log('updatedToy', updatedToy);
    
      filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updateUser = {
        $set: {
          price: updatedToy.price,
          quantity: updatedToy.quantity,
          description: updatedToy.description
        }
      }
      
        const result = await toyCollection.updateOne(filter, updateUser, options);
        if (result.modifiedCount > 0) {
          res.send(result);
        }
    });

    app.delete('/toy/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toyCollection.deleteOne(query);
      res.send(result);
    })






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});