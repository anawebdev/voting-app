
const passport      = require('passport')
const bcrypt        = require('bcrypt')
const mongo         = require('mongodb')
const MongoClient   = require('mongodb').MongoClient
const mongoose      = require('mongoose')
const UserInfo      = require('./models/users.js')

module.exports = function (app, db) {

  // Register new User
  app.route('/register')
    .post((req,res,next)=>{
      UserInfo.findOne({'username': req.body.username},(err,user)=>{
        if(err) {next(err)
        } else if (user) {
          res.redirect('/')
        } else {
          const hash = bcrypt.hashSync(req.body.password, 8)
          mongoose.connection.collection('users').insert({username: req.body.username, 
                                                          password: hash,
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
  },
  passport.authenticate('local', { successRedirect: '/profile', failureRedirect: '/' })
  )

  app.route('/login')
    .post(passport.authenticate('local',{ successRedirect: '/profile', 
                                          failureRedirect: '/register' 
                                        })
    );

  function ensureAuthenticated(req,res,next){
    if(req.session.passport.user !== undefined) {
      return next();
      //authenticated
    }
    res.redirect('/register');
    //unauthenticated
  }

  app.route('/profile')
    .get(ensureAuthenticated,(req,res, next)=>{
      console.log('user: '+ req.user)
      if(req.user.polls.length===0) {
        res.render(process.cwd()+'/views/pug/profile.pug', {message:'Welcome, ' + req.user.name + '! Would you like to create a poll?'})
      } else {
        res.render(process.cwd()+'/views/pug/profile.pug', {message:'Welcome back, ' + req.user.name + '!'})}
  })

  app.route('/home')
   .get(ensureAuthenticated,(req,res, next)=>{
      res.render(process.cwd()+'/views/pug/index.pug', {authenticated:true})
  })

  // if auth do stuff, if not auth redirect to register

   
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

}