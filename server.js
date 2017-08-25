'use strict'

const express     = require('express')
const bodyParser  = require('body-parser')
const passport    = require('passport')
const session     = require('express-session')
const mongo       = require('mongodb')
const MongoClient = require('mongodb').MongoClient
const mongoose    = require('mongoose')
const app         = express()

require('dotenv').config()

app.use('/public', express.static(process.cwd() + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.route('/')
  .get((req, res) => {
    res.render(process.cwd() + '/views/pug/index.pug', {title: 'Hello', message:'Please login'})
  })

app.set('view engine', 'pug')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}))

// Set up passport
app.use(passport.initialize())

// Connect to DB
mongoose.connect(process.env.MONGODB_URI)
const db = mongoose.connection

// Check connection
db.once('open',()=>{
  console.log('Connected to MongoDB...');
});

// Check for DB errors
db.on('error',(err)=>{
  console.log(process.env.MONGODB_URI)
  console.log("Did not connect to MongoDb. " + err)
})

// Bring in the Models
const UserInfo = require('./models/users.js')
const PollInfo = require('./models/polls.js')

// Serialization
passport.serializeUser((user,done)=>{
  done(null, user._id)
})
passport.deserializeUser((id,done)=>{
  UserInfo.findOne({_id: new ObjectID(id)}, (err,doc)=>{
    done(null,doc)
  })
  //return full user object
  //const ObjectID - to search for mongo _id
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log("Listening on port " + port)
});
