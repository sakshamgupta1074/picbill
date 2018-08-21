const route=require('express').Router();
const model = require("../models/userdb");
const passport=require('../config/passport');

route.get('/login',(req,res)=>{
    res.render('login');
})

route.get('/signup',(req,res)=>{
    res.render('signup');
});

route.post('/login',passport.authenticate('local',{
    failureRedirect:'/login',
    successRedirect:'/private'
}));

route.post('/loggedin',(req,res)=>{
    req.logout();
    res.redirect('/login')
});

route.post("/signup", (req,res)=>{
    console.log(req.body);

// users.push({username: req.body.username, password: req.body.password})
    model.user.create({
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname:req.body.lastname
    }).then((createuser)=>{
        res.redirect("/login");
    })

});




exports=module.exports=route;