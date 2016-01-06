/**
 * Created by zlx on 16/1/5.
 */
var mongoose=require('./db.js');


var blogScheme = mongoose.Schema({
    username:String,
    content:String,
    date:{ type: Date, default: Date.now }
});
var Blog =mongoose.model('Blog',blogScheme);
module.exports=Blog;
//function Blog(username,blog){
//    console.log('blog.js');
//    this.username=username;
//    this.content=blog;
//    return this;
//}

//new Blog({
//    username:"aa",
//    content:"hahlalal"
//}).save();