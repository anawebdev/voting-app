const express       = require('express')
const bodyParser    = require('body-parser')
const passport      = require('passport')
const session       = require('express-session')
const mongo         = require('mongodb')
const MongoClient   = require('mongodb').MongoClient
const mongoose      = require('mongoose')
const app           = express()
const LocalStrategy = require('passport-local')
const bcrypt        = require('bcrypt')
const routes        = require('./routes.js')
const auth          = require('./auth.js')

require('dotenv').config()

app.use('/public', express.static(process.cwd() + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.route('/')
  .get((req, res) => {
    res.render(process.cwd() + '/views/pug/index.pug', {title: 'Hello', message:'Please login', showLogin: true, showRegistration: true})
  })

app.set('view engine', 'pug')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}))

// Set up passport
app.use(passport.initialize())
app.use(passport.session())

// Bring in the Models
const UserInfo = require('./models/users.js')
const PollInfo = require('./models/polls.js')

// Connect to DB
mongoose.connect(process.env.MONGODB_URI,(err, db)=>{
  if(err) throw err
  console.log('Connected to MongoDB...')

  auth(app,db)
  routes(app, db)

const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log("Listening on port " + port)
  });
})






