require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rclqpat.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    const slider_image = client.db("brand").collection("slider_image");
    const GariDekhunDbNew = client
      .db("GariDekhunDbNew")
      .collection("garidekhunCollectionNew");
    const allproducts = client
      .db("GariDekhunDbNew")
      .collection("garikinunProducts");
    const cartProducts = client
      .db("GariDekhunDbNew")
      .collection("garikinunCarts");
    const banner = client.db("brand").collection("banner");
    const userRegistrationDb = client.db("brand").collection("registration");

    app.get("/banner", async (req, res) => {
      try {
        const cursor = banner.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    });
    app.get("/home/slider", async (req, res) => {
      try {
        const cursor = slider_image.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.get("/home", async (req, res) => {
      try {
        const cursor = GariDekhunDbNew.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.get("/home/:id", async (req, res) => {
      const id = req.params.id;
      try {
        if (!ObjectId.isValid(id)) {
          return res.status(400).send("Invalid ID format");
        }
        const query = { _id: new ObjectId(id) };
        const result = await GariDekhunDbNew.findOne(query);
        if (!result) {
          return res.status(404).send("Product not found");
        }
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.get("/allproducts", async (req, res) => {
      try {
        const cursor = allproducts.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.get("/allproducts/details/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await allproducts.findOne(query);
      res.send(result);
    });

    app.get("/allproducts/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allproducts.findOne(query);
      res.send(result);
    });
    app.put("/allproducts/update/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const UpdateContent = req.body;
        console.log(UpdateContent);
        const filter = { _id: new ObjectId(id) };
        const option = { upsert: true };
        const updatedProduct = {
          $set: {
            brand: UpdateContent.brand,
            name: UpdateContent.name,
            image_link: UpdateContent.image_link,
            car_type: UpdateContent.car_type,
            price: UpdateContent.price,
            ratings: UpdateContent.ratings,
            description: UpdateContent.description,
          },
        };
        const result = await allproducts.updateOne(
          filter,
          updatedProduct,
          option
        );
        if (result.modifiedCount > 0) {
          res.send(result);
        } else {
          res.status(404).json({ message: "Product not found" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.get("/allproducts/:brand", async (req, res) => {
      const brand = req.params.brand;
      try {
        const cursor = allproducts.find({ brand: brand });
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.post("/allproducts", async (req, res) => {
      try {
        const productData = req.body;
        const result = await allproducts.insertOne(productData);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    });
    app.post("/cart", async (req, res) => {
      try {
        const addCart = req.body;
        const result = await cartProducts.insertOne(addCart);
        res.status(201).json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });
    app.get("/cart", async (req, res) => {
      try {
        const cursor = cartProducts.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    });
    app.get("/cart/:uuid", async (req, res) => {
      const uuid = req.params.uuid;
      try {
        const cursor = cartProducts.find({ uuid: uuid });
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    });
    app.delete("/cart/:id", async (req, res) => {
      try {
        const id = req.params.id;
        console.log(id);
        const query = { _id: new ObjectId(id) };
        const result = await cartProducts.deleteOne(query);

        if (result.deletedCount === 1) {
          res.send({ success: true });
        } else {
          res.status(404).send({ error: "Document not found" });
        }
      } catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).send({ error: "Internal server error" });
      }
    });

    app.post("/users", async (req, res) => {
      try {
        const userData = req.body;
        const result = await userRegistrationDb.insertOne(userData);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Leave the client open in a server application.
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Gari Dekhun Server is running");
});

app.listen(port, () => {
  console.log(`Gari Dekhun Server is running on port: ${port}`);
});
