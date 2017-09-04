const passport      = require('passport')
const express       = require('express')
const session       = require('express-session')
const LocalStrategy = require('passport-local')
const bcrypt        = require('bcrypt')
const mongo         = require('mongodb')
const MongoClient   = require('mongodb').MongoClient
const mongoose      = require('mongoose')
const UserInfo      = require('./models/users.js')

module.exports = function (app, db) {

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
        if (!bcrypt.compareSync(password, user.password)) { return done(null, false); }
        console.log(user)
        return done(null, user);
      })
    }
  ))
}