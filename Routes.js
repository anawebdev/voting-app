
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
      let displayPolls=[];
      console.log('user: '+ req.user)
      if(req.user.polls.length===0) {
        res.render(process.cwd()+'/views/pug/profile.pug', {message:'Welcome, ' + req.user.name + '! Would you like to create a poll?'})
      } else {
        //display polls
        UserInfo.find({"_id": req.session.passport.user},(err,user)=>{
          console.log('USER');
          console.log(req.user.polls);
          
          req.user.polls.map((elem, index)=>{
            let title = "title" + index;
            let id = "id"+index;
            displayPolls.push({title: elem.title, id: elem._id})
            
          })
          console.log('POLLS');
          console.log(displayPolls);
          res.render(process.cwd()+'/views/pug/profile.pug', {message:'Welcome back, ' + req.user.name + '!', displayPolls:displayPolls})
        })
        
      }
  })

  app.route('/home')
   .get(ensureAuthenticated,(req,res, next)=>{
      res.render(process.cwd()+'/views/pug/index.pug', {authenticated:true})
  })

  //create poll
  app.route('/createpoll')
    .post((req,res,next)=>{
      const formObj = req.body;
      let date = new Date();
      let timestamp = date.getTime();
      UserInfo.findOne({"_id":req.session.passport.user},(err,user)=>{
        const createOptions = [];

        // create options array
        Object.keys(req.body).map((key,index)=>{
          createOptions.unshift({'option' : req.body[key], 'votes': 0})
        })

        // create poll object
        user.polls.unshift({
          "timestamp": timestamp,
          "creator": req.session.passport.user,
          "title": req.body.title,
          "options": createOptions
        })

        // save poll to db
        user.save((err,user)=>{
          if (err) throw err
          res.redirect('/profile');
        })

        
      })
      
    })
/*
  //display poll
  app.route('/poll/:pollId')
    .get((req,res)=>{
      console.log(req.params.pollId);
      var doc = users.polls.id(req.params.pollId);
      UserInfo.findOne(doc,(err,user)=>{
        if(err) throw err;
        console.log(user);
      })
    })
*/
   
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