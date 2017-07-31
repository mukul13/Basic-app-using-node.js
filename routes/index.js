var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var UserPost = require('../models/post');
var csrf = require('csurf');
var csrfProtection = csrf();
var UserCreds = require('../models/user');
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');

router.use(csrfProtection);
var sess;

/* GET home page. */
router.get('/', function(req, res, next) {
sess =  req.session;

if(!sess.email)
{
  console.log(sess.email);
  res.redirect('userInfo/signin');
}  
else{

  res.redirect('userInfo/profile');
  
}

});

router.get('/userInfo/signup', function(req, res){
  var messages = req.flash('error');
	res.render('userInfo/signup',{csrfToken : req.csrfToken(), messages: messages, hasErrors: messages.length > 0
});
});


router.get('/userInfo/signin', function(req, res){
  var messages = req.flash('error');
  res.render('userInfo/signin',{csrfToken : req.csrfToken(), messages: messages, hasErrors: messages.length > 0
})
});

router.post('/userInfo/signup',passport.authenticate('local.signup', {
//  successRedirect: 'profile',
  failureRedirect: 'signup',
  failureFlash: true
}), function(req, res){
  sess = req.session;
  sess.email = req.body.email;

  res.redirect('profile'); 
});

router.post('/userInfo/signin',passport.authenticate('local.signin', {
//  successRedirect: 'profile',
  failureRedirect: 'signin',
  failureFlash: true
}), function(req, res){
  sess = req.session;

  sess.email = req.body.email;
  res.redirect('profile');
  
  //res.render('userInfo/profile',{email : req.body.email});
});


router.get('/userInfo/profile', function(req, res, next){
sess = req.session;
console.log(sess.email);
if(sess.email)
{
     UserPost.find(function (err, users) {
      if (err) return console.error(err);
      console.log(users);
      sendPosts(users);
      //res.render('userInfo/profile',{email: sess.email, posts : posts});
    });

      function sendPosts(posts){
         res.render('userInfo/profile',{email: sess.email, posts : posts, csrfToken : req.csrfToken()});
      } 
}
else
{
      res.redirect('signin');
}

});

router.get('/userInfo/createPost', function(req, res){
var sess = req.session;
if(sess.email)
{ 
      res.render('userInfo/createPost', {csrfToken : req.csrfToken()});
}
else
{
      res.redirect('/');
}

});


router.post('/userInfo/createPost', function(req, res){
        var sess = req.session;
        var newPost = new UserPost();
        console.log(sess.email);
        newPost.email = sess.email;
        newPost.title = req.body.title;
        newPost.postContent = req.body.postContent;
        newPost.likes = 0;
        newPost.shares = 0;
        newPost.isLiked = false;
        newPost.isShared = false;

        newPost.save(function(err){
          if (err) return handleError(err);
      });

        res.redirect('profile');    

});


router.post('/userInfo/updateLikes', function(req, res){
    //  console.log("here");
  //    console.log(req.body.postId);
      //console.log(req.body.noOfLikes);
      //var ObjectId = mongoose.Types.ObjectId;
      var query = { _id: mongoose.Types.ObjectId(req.body.postId) };
      UserPost.findOne(query, function (err, post) {
          if (err) return console.error(err);
          console.log(post.isLiked);
          if(post.isLiked)
          {
              var noOfLikes = post.likes -1;
              UserPost.findOneAndUpdate(query, { likes : noOfLikes, isLiked: false }, {upsert:true}, function(err, doc){
                if (err) return res.send(500, { error: err });
                return res.send("succesfully saved");
              });
          }
          else
          {
              var noOfLikes = post.likes +1;
              UserPost.findOneAndUpdate(query, { likes : noOfLikes, isLiked: true }, {upsert:true}, function(err, doc){
                if (err) return res.send(500, { error: err });
                return res.send("succesfully saved");
              });   
          }
          
          //res.render('userInfo/profile',{email: sess.email, posts : posts});
      });

     

});


router.get('/logout',function(req,res){
req.session.destroy(function(err) {
  if(err) {
    console.log(err);
  } else {
    res.redirect('/');
  }
});

});



module.exports = router;