const route=require('express').Router();
const model = require("../models/admindb");
const passport=require('../config/passport');

route.get('/adminlogin',(req,res)=>{
    res.render('adminlogin');
})

route.get('/adminsignup',(req,res)=>{
    res.render('adminsignup');
});

route.post('/adminlogin',passport.authenticate('local',{
    failureRedirect:'/admin/adminlogin',
    successRedirect:'/adminprivate'
}));

route.post('/adminloggedin',(req,res)=>{
    req.logout();
    res.redirect('/admin/adminlogin')
});

route.post("/adminsignup", (req,res)=>{
    console.log(req.body);

// users.push({username: req.body.username, password: req.body.password})
    model.admin.create({
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname:req.body.lastname
    }).then((createuser)=>{
        res.redirect("/admin/adminlogin");
    })
});




exports=module.exports=route;