var express = require('express');
var router = express.Router();
var crypto=require('crypto');
var users=require('../models/user.js');
var blogs=require('../models/blog.js')

// 该路由使用的中间件
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});


/* GET home page. */
router.get('/', function(req, res, next) {
    blogs.find().sort('-date').exec(function(err,blogs){
        if(err){
            blogs=[];
        }
        console.log("index");
        console.log(typeof(req.session.user));
        res.render('index', { path: 'home', title:'首页',user:req.session.user,blogs:blogs});
    })
});


router.get('/u/:user',function(req,res){
    users.find({name:req.params.user},function(err,user){
        //console.log(user);
        if(user.length==0){
            res.cookie('message','用户不存在');
            return res.redirect('/');
        }
        blogs.find({username:req.params.user},function(err,blogs){
            console.log(blogs);
            if(err){
                console.log(err);
                return res.redirect('/');
            }
            res.render('index',{
                user:req.session.user,
                path:'user',
                title:user[0].name,
                blogs:blogs
            });

        });
    });

});
router.post('/post',checkNotLogin);
router.post('/post',function(req,res){
    console.log(req.body.blog);
    var  content=req.body.blog;
    var currentUser=req.session.user;
    var blog=new blogs({
        username:currentUser,
        content:content});
    blog.save(function(err){
        if(err){
            console.log(err);
        }
        res.cookie('message','发表成功');
        return res.redirect('/u/'+currentUser);
    })
});
router.get('/reg',checkLogin);
router.get('/reg',function(req,res){
    //console.log("reg cookie:");
    //console.log(req.cookies);
    //console.log('session:'+req.session);
    //console.log(req.session);
    if(req.cookies.message){
        res.clearCookie('message');
        res.render('index',{title:'Express',
            path:'reg',
            message:req.cookies.message});
    }else{
        res.render('index',{title:'Express',
            path:'reg'})
    }
});

router.post('/reg',function(req,res){
    if(req.body["password"]!=req.body["password-repeat"]){
        res.cookie('message','两次输入密码不一致。');
        return res.redirect('/reg');
    }
    users.find({name:req.body.username},function(err,user){
        console.log(user);
        if(user.length!=0){
            err='username already exists.'
        }
        if(err){
            res.cookie('message',err);
            return res.redirect('/reg');
        }
        new users({
                name: req.body.username,
                password: req.body.password
            }
        ).save(function(err){
                if(err){
                }
                res.cookie('message','success');
                return res.redirect('/reg');
            });
    });

});
router.get('/login',checkLogin);

router.get('/login',function(req,res){
    res.clearCookie('message');
    res.render('index',{title:'Express',
        path:'login',
        message:req.cookies.message});
});
router.post('/login',function(req,res){
    console.log('login');
    users.find({name:req.body.username,password:req.body.password},function(err,user){
            if(user.length!=0){
                //res.session('user',user[0].name);
                req.session.user=user[0].name;
                return res.redirect('/');

            }else{
                res.cookie('message','用户名或密码错误')
                return res.redirect('/login');
            }
        }
    );
});
router.get('/logout',function(req,res){
    req.session.user=null;
    res.cookie('message','登出成功');
    return res.redirect("/");
});
module.exports = router;


function checkLogin(req,res,next){
    if(req.session.user){
        return res.redirect('/');
    }
        next();
}

function checkNotLogin(req,res,next){
    if(!req.session.user){
        return res.redirect('/login');
    }
    next();
}
