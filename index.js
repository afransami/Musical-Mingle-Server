require('dotenv').config()
const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express();
const cors = require('cors');


const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
  }

app.use(cors(corsOptions))
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tcuzcs8.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
   
    const usersCollection = client.db("musical-mingle").collection("users");
    const formsCollection = client.db("musical-mingle").collection("addClass");
    const classCollection = client.db("musical-mingle").collection("selectedClasses");

 // update/modified/register/signUp users
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


       // register/signUp users
      app.post('/users', async (req, res) => {
        const saveUser = req.body
        const result = await usersCollection.insertOne(saveUser)
        res.send(result)
        console.log(result)
      })


    // upload class 
      app.post('/class', async (req, res) => {
        const form = req.body
        const result = await formsCollection.insertOne(form)
        res.send(result)
        console.log(result)
      })
      
       // upload instructors 
       app.post('/instructor', async (req, res) => {
        const form = req.body
        console.log(form)
        const result = await usersCollection.insertOne(form)
        res.send(result)
      })


       // popular class api 

    app.get ('/class', async(req, res)=>{
        const result = await formsCollection.find().toArray()
        res.send(result)
    })
      
      // users related apis

    app.get('/users',async(req,res) => {
        const results = await usersCollection.find().toArray()      
        res.send(results)
        console.log(results);
    })

    app.patch('/users/admin/:id', async (req, res) => {
        const id= req.params.id
        const filter = {_id: new ObjectId(id)}
        const updateDoc = {
          $set: {
            role: "admin"
        },
      };
        const result = await usersCollection.updateOne(filter, updateDoc);
        res.send(result);
      })

      app.patch('/users/instructor/:id', async (req, res) => {
        const id= req.params.id
        const filter = {_id: new ObjectId(id)}
        const updateDoc = {
          $set: {
            role: "instructor"
        },
      };
        const result = await usersCollection.updateOne(filter, updateDoc);
        res.send(result);
      })


    app.post ('/selectedClasses', async (req, res) => {
        const item = req.body;
        const result = await classCollection.insertOne(item);
        res.send(result);
        console.log(result);
      })

    app.get('/admin', async(req, res)=> {
        const email = req.query.email;
        const query = {$and: [{email: email}, {role: 'admin'}]};
        const result = await usersCollection.findOne(query);
        res.send(result);
    });

    app.get('/instructor', async(req, res)=> {
        const email = req.query.email;
        const query = {$and: [{email: email}, {role: 'instructor'}]};
        const result = await usersCollection.findOne(query);
        res.send(result);
    });


    app.get('/student', async(req, res)=> {
        const email = req.query.email;
        const query = {$and: [{email: email}, {role: 'student'}]};
        const result = await usersCollection.findOne(query);
        res.send(result);
        // console.log(result);
    });

   
    
 // class collection apis
 app.get('/class', async (req, res) => {
    const email = req.query.email;

    if (!email) {
      res.send([]);
    }
    const query = { email: email };
    const result = await formsCollection.find(query).toArray();
    res.send(result);
  });



    // Delete class

    app.delete('/class/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await formsCollection.deleteOne(query)
        res.send(result)
      })
  
  
      app.delete('/users/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await usersCollection.deleteOne(query)
        res.send(result)
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



app.get ('/', (req, res)=>{
    res.send ('Musical Mingle Assignment-12 is on')
})

app.listen(port, ()=>{
    console.log(`musical mingle Assignment-12 is on port ${port}`);
})
