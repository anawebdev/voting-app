
const passport      = require('passport')
const bcrypt        = require('bcrypt')
const mongo         = require('mongodb')
const MongoClient   = require('mongodb').MongoClient
const mongoose      = require('mongoose')
const GitHubStrategy= require('passport-github').Strategy

const UserInfo = require('./models/users.js')

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
/*
  app.post('/login', passport.authenticate('local', { successRedirect: '/profile', 
                                                    failureRedirect: '/login' }));
*/
  app.route('/login')
    .post(passport.authenticate('local',{ successRedirect: '/profile', 
                                          failureRedirect: '/login' 
                                        })
    );

  app.route('/auth/github')
    .get(passport.authenticate('github',{successRedirect:'/profile',
                                          failureRedirect:'/login'})
    );

  app.route('/auth/github/callback')
    .get(passport.authenticate('github', {successRedirect:'/profile',
                                           failureRedirect:'/login'})
    );

  function ensureAuthenticated(req,res,next){
    if(req.session.passport.user !== undefined) {
      return next();
    }
    res.redirect('/login');
  }

  app.route('/profile')
    .get(ensureAuthenticated,(req,res)=>{
      console.log('user: '+ req.user)
      res.render(process.cwd()+'/views/pug/profile.pug', {username:req.user.name})
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

}