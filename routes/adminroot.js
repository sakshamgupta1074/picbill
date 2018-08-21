const route=require('express').Router();
const model = require("../models/admindb");
const passport=require('../config/passport');
const {user}=require("../models/userdb")
const {request}=require('../models/requestsdb')

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

route.post('/adminuserdata',(req,res)=>{

    user.findOne({
        username:req.body.username
    }).then((user)=>{
        console.log(user)
        res.send(user);
    })
})

route.post('/modifydata',(req,res)=>{
    user.findOne({
        username:req.body.username
    }).then((user)=>{
        const c=user.cashback;
        user.cashback=user.cashback+parseInt(req.body.cashback);
        user.save();
        res.send(`old amount of user:${c} new amount of user:${user.cashback}`)   //refresh wala bug hata diyo
    })
})

route.post('/requests',(req,res)=>{

    request.create({
        username:req.user.username,
        amount:req.body.amount
    });
    console.log(request)

    res.send('your cashback will be updated in next 24 hrs')
})


route.post('/requestdb',(req,res)=>{

    request.find({}, function (err, users) {
        var data = {};
        users.forEach(function(user) {
            data[user._id] = user;
        });
        console.log(data);
        res.send(data);

    });

})




exports=module.exports=route;