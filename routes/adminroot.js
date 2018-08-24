const route=require('express').Router();
const passport1=require('passport');
const {request}=require('../models/requestsdb')
const {user}=require('../models/userdb')


route.get('/adminlogin',(req,res)=>{
    res.render('adminlogin');
})



route.post('/adminlogin',passport1.authenticate('local',{
    failureRedirect:'/admin/adminlogin',
    successRedirect:'/adminprivate'
}));

route.post('/adminloggedin',(req,res)=>{
    req.logout();
    res.redirect('/admin/adminlogin')
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