// reference : https://zellwk.com/blog/crud-express-mongodb/

const express = require('express');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express();

const username = "tuhin";
const password = "PpRIHkB27zHVmRcP";
const cluster = "cluster0.kiwerfr";
const dbname = "star-wars";

MongoClient.connect(`mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
},
).then(client => {
  console.log('Connected to Database')

  const db = client.db('star-wars')
  const quotesCollection = db.collection('quotes')

  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(express.static('public'))

  app.set('view engine', 'ejs')

  //delete data
  app.delete('/quotes', (req, res) => {
    quotesCollection.deleteOne(
      { name: req.body.name }
    )
      .then(result => {
        if (result.deletedCount === 0) {
          return res.json('No quote to delete')
        }
        res.json(`Deleted Darth Vader's quote`)
      })
      .catch(error => console.error(error))
  })

  //update data
  app.put('/quotes', (req, res) => {
    console.log(req.body)
    quotesCollection.findOneAndUpdate(
      { name: 'yoda' },
      {
        $set: {
          name: req.body.name,
          quote: req.body.quote
        }
      },
      {
        upsert: true
      }
    )
      .then(result => {
        console.log("success")
      })
      .catch(error => console.error(error))
  })

  //read data
  app.get('/', (req, res) => {
    db.collection('quotes').find().toArray()
      .then(results => {
        console.log(results)
        res.render('index.ejs', { quotes: results })
      })
      .catch(error => console.error(error))
  })

  //add data
  app.post('/quotes', (req, res) => {
    quotesCollection.insertOne(req.body)
      .then(result => {
        console.log(result)
        res.redirect('/')
      })
      .catch(error => console.error(error))
  })

  app.listen(3000, function () {
    console.log('listening on 3000')
  })
}).catch(error => console.error(error))


