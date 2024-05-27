const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dl1tykd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productsCollections = client.db("products").collection("items");

    // app.get('/items', async (req, res) => {
    //     const query = {};
    //     const result = ( await productsCollections.find(query).toArray()).splice(0,10);
    //     res.send(result);
    // });

    // get products
    app.get("/items", async (req, res) => {
      const query = {};
      const result = await productsCollections.find(query).toArray();
      res.send(result);
    });

    //product delete
    app.delete("/items/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const result = await productsCollections.deleteOne(filter);
      console.log(result);
      res.send(result);
    });

    //add product
    app.post("/items", async (req, res) => {
      const product = req.body;
      console.log(product);
      const result = await productsCollections.insertOne(product);
      console.log(result);
      res.send(result);
    });

    // get by id
    app.get("/items/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await productsCollections.find(query).toArray();
      res.send(result);
    });

    // product update
    app.put("/items/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const data = req.body;
      const option = { upsert: true };
      const updateProduct = {
        $set: {
          price: data.price,
          title: data.title,
          description: data.description,
          brand: data.brand,
          image_url: data.image_url,

        },
      };
      console.log(updateProduct);
      const result = await productsCollections.updateOne(
        filter,
        updateProduct,
        option
      );
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("server running");
});

app.listen(port, () => console.log(`server running on ${port}`));
