var userPost = require('../models/post');
var mongoose = require('mongoose');
//To start mongo server sudo service mongod restart
//To stop mongo server sudo service mongod stop

mongoose.connect('localhost:27017/userPosts');


var posts = [ 
new userPost({
	email:'mukul@gmail.com',
	title : 'GOT',
	postContent : 'hello world',
	likes : 15,
	shares : 20,
	isLiked : false,
	isShared : false
}),
new userPost({
	email:'mukul@gmail.com',
	title : 'Sherlock',
	postContent : 'hello world!',
	likes : 152,
	shares : 202,
	isLiked : false,
	isShared : false
}),
new userPost({
	email:'mukul@gmail.com',
	title : 'Sherlock holmes',
	postContent : 'hello world!',
	likes : 152,
	shares : 202,
	isLiked : false,
	isShared : false

})
];

var done = 0;
for(var i = 0; i<posts.length; i++)
{
	posts[i].save(function(err, result){
		done++;

		if(done == posts.length){
			exit();
		}
	});
}


function exit()
{
	mongoose.disconnect();
}