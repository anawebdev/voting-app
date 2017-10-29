
const passport      = require('passport')
const bcrypt        = require('bcrypt')
const mongo         = require('mongodb')
const MongoClient   = require('mongodb').MongoClient
const mongoose      = require('mongoose')
const UserInfo      = require('./models/users.js')
const PollInfo      = require('./models/polls.js')

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

      PollInfo.find({"creator_id": req.session.passport.user},(err, user)=>{

        let displayPolls=[];   
        user.map((user,index)=>{
          displayPolls.unshift({"title": user.title, "poll_id": user._id});
        })
        let display = (user===null) ? false : true;
        res.render(process.cwd()+'/views/pug/profile.pug', {"message":'Welcome back, ' + req.user.name + '!', 
                                                            "displayPolls": displayPolls, 
                                                            "display": display
                                                          })
      })
  })

  app.route('/home')
   .get(ensureAuthenticated,(req,res, next)=>{
      res.render(process.cwd()+'/views/pug/index.pug', {authenticated:true})
      // '/home' throws error if authenticated is false
  })

  //create poll
  app.route('/createpoll')
    .post((req,res,next)=>{
      let date = new Date();
      let timestamp = date.getTime();
      const createOptions = [];

      // create options array
      Object.keys(req.body).map((key,index)=>{
        if(index!==0) {
          createOptions.unshift({'option' : req.body[key], 'votes': 0})
        } 
      })

      // create new poll object     
      let newPoll = new PollInfo({
        "creator_id": req.session.passport.user,
        "title": req.body.title,
        "timestamp" : timestamp,
        "options": createOptions        
      })

      newPoll.save((err,user)=>{
        if(err) throw err;
      });

    })

  app.route('/poll/:pollId')
    .get((req,res)=>{
      console.log(req.params.pollId)
      PollInfo.findOne({"_id": req.params.pollId}, (err, user)=>{
        if (err) throw err;
        console.log(user);
        let pollOptions = [];
        let pollVotes = [];
        user.options.map((option, index)=>{
          return pollOptions.push(option.option);
        })
        user.options.map((option, index)=>{
          return pollVotes.push(option.votes);
        })

        let pollDetails = JSON.stringify({"pollOptions": pollOptions,
                                          "pollVotes": pollVotes})    
        res.render(process.cwd()+'/views/pug/poll.pug', {"pollTitle": user.title, "pollDetails": pollDetails});
      })
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