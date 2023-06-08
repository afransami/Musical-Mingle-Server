const express = require('express')
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
  }

app.use(cors(corsOptions))
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tcuzcs8.mongodb.net/?retryWrites=true&w=majority`;

// DB_PASS=0SYOcSzDYraeaLUt
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

    const usersCollection = client.db("musicalMingle").collection("users");
    const formsCollection = client.db("musicalMingle").collection("forms");
    // const menuCollection = client.db("bistro-boss").collection("menu");
    // const reviewCollection = client.db("bistro-boss").collection("reviews");
    // const cartCollection = client.db("bistro-boss").collection("carts");


    app.put('/users/:email', async (req, res) => {
        const email = req.params.email
        const user = req.body
        const query = { email: email }
        const options = { upsert: true }
        const updateDoc = {
          $set: user,
        }
        const result = await usersCollection.updateOne(query, updateDoc, options)
        console.log(result)
        res.send(result)
      })

    // upload form 
      app.post('/uploadForm', async (req, res) => {
        const form = req.body
        console.log(form)
        const result = await formsCollection.insertOne(form)
        res.send(result)
      })



    // jwt api related functions
  
    //   app.post('/jwt', (req, res) => {
    //     const user = req.body;
    //     const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'1h'})
    //     res.send({token});
    //   });



    // users related apis

    app.get('/users',async(req,res) => {
        const results = await usersCollection.find().toArray()
      res.send(results)
    })


    // app.post('/users', async (req, res) => {
    //   const user = req.body;
    //   const query = {email: user.email}
    //   const existingUser = await usersCollection.findOne(query);
      
    //   if (existingUser){
    //     return res.send({message: 'User already exists'})
    //   }
      
    //   const result = await usersCollection.insertOne(user);
    //   res.send(result)  
    // })

    
    // admin related apis
    // app.patch('/users/admin/:id', async (req, res) => {
    //   const id= req.params.id
    //   const filter = {_id: new ObjectId(id)}
    //   const updateDoc = {
    //     $set: {
    //       role: "admin"
    //   },
    // };
    //   const result = await usersCollection.updateOne(filter, updateDoc);
    //   res.send(result);
    // })
    
// security layer: verifyJWT
// email same
// check admin
//     app.get('/users/admin/:email', verifyJWT, async (req, res) => {
//       const email = req.params.email;

//       if(req.decoded.email !== email){
//         res.send({admin: false})
//       }

//       const query = {email: email}
//       const user = await usersCollection.findOne(query);
//       const result = {admin: user?.role === "admin"}
//       res.send(result)
//     }) 

//     // menu related apis
//     app.get ('/menu', async(req, res)=>{
//         const result = await menuCollection.find().toArray()
//         res.send(result)
//     })


//     // review related apis
//     app.get ('/reviews', async(req, res)=>{
//         const result = await reviewCollection.find().toArray()
//         res.send(result)
//     })


//     // cart collections apis
//     app.get ('/carts', verifyJWT, async (req, res)=>{
//       const email = req.query.email;
//       if (!email){
//         res.send ([]);                
//       }
//       const decodedEmail = req.decoded.email;
//       if (email!== decodedEmail){
//               res.status(403).send({error: 'Invalid email', message:'forbidden access'})
//             }
//         const query = {email: email};
//         const result = await cartCollection.find (query).toArray();
//         res.send (result)
      
//     })

// // carts related apis
//     app.post ('/carts', async(req, res)=>{
//       const item = req.body;
//       console.log(item);
//         const result = await cartCollection.insertOne(item);
//         res.send(result)
//     })


//     // Delete myCart items

//     app.delete('/carts/:id', async(req, res)=>{
//       const id = req.params.id;
//       const query = {_id: new ObjectId(id)};
//       const result = await cartCollection.deleteOne(query)
//       res.send(result)
//     })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);













app.get ('/', (req, res)=>{
    res.send ('Musical Mingle is on')
})

app.listen(port, ()=>{
    console.log(`musical mingle is on port ${port}`);
})