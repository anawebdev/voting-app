'use strict'

const express       = require('express')
const bodyParser    = require('body-parser')
const passport      = require('passport')
const session       = require('express-session')
const mongo         = require('mongodb')
const MongoClient   = require('mongodb').MongoClient
const mongoose      = require('mongoose')
const app           = express()
const LocalStrategy = require('passport-local')
const port          = process.env.PORT || 3000

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

  // Serialization
  passport.serializeUser((user,done)=>{
    done(null, user._id)
  })
  passport.deserializeUser((id,done)=>{
    UserInfo.findById(id, (err,doc)=>{
      done(null,doc)
    })
  })

  passport.use(new LocalStrategy(
    (username, password, done)=>{
      UserInfo.findOne({username:username}, (err,user)=>{
        console.log('User '+ username +' attempted to log in.');
        if (err) { return done(err); }
        if (!user) { return done(null, false);}
        if (password !== user.password) { return done(null, false); }
        console.log(user)
        return done(null, user);
      })
    }
  ))

  // Register new User
  app.route('/register')
    .post((req,res,next)=>{
      UserInfo.findOne({'username': req.body.username},(err,user)=>{
        if(err) {next(err)
        } else if (user) {
          res.redirect('/')
        } else {
          mongoose.connection.collection('users').insert({ username: req.body.username, 
                              password: req.body.password,
                              email: req.body.email, 
                              name: req.body.name, 
                              polls: []
                            }, (err,doc)=>{
                              if(err) {
                                res.redirect('/')
                              } else {
                                next(null,user)
                              }
                            })
          
        }
      })
    }),
    passport.authenticate('local', {failureRedirect: '/'},(req,res,next)=>{
      res.redirect('/profile')
    })

  app.post('/login', passport.authenticate('local', { successRedirect: '/profile', 
                                                      failureRedirect: '/login' }));

  function ensureAuthenticated(req,res,next){
    if(req.session.passport.user !== undefined) {
      return next();
    }
    res.redirect('/login');
  }

  app.route('/profile')
    .get(ensureAuthenticated,(req,res)=>{
      console.log('user: '+ req.user)
      res.render(process.cwd()+'/views/pug/profile.pug', {username:req.user.username})
  })

  app.route('/logout')
    .get((req,res)=>{
      req.logout()
      res.redirect('/')
    })

  app.use((req,res,next)=>{
    res.status(404)
      .type('text')
      .send('Not Found')
  })

  app.listen(port, () => {
    console.log("Listening on port " + port)
  });
})






