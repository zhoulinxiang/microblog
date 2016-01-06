/**
 * Created by zlx on 16/1/4.
 */
var mongoose=require('./db.js');
//console.log(mongoose);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("connected.");
});

var userScheme = mongoose.Schema({
    name:String,
    password:String
});
var User =mongoose.model('User',userScheme);
module.exports=User;

//new User({
//    name:'aa',
//    password:'haha'
//}).save();

console.log('find user:')
User.find(function(err,users){
    console.log(users);

});

//console.log(mongoose);