var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	email : {type: String, required: true},
	title : {type: String, required: true},
	postContent : {type: String, required: true},
	likes : {type: Number, required: true},
	shares : {type: Number, required: true},
	isLiked : {type: Boolean, required: true},
	isShared : {type: Boolean, required: true} 
});

module.exports = mongoose.model('Post', schema);	