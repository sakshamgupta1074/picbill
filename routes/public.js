const route=require('express').Router();
const {coupon}=require('../models/coupondb')
const {user}=require('../models/userdb')
const {sale}=require('../models/coupondb')

route.get('/',(req,res)=>{
    res.render('index');
});


route.post('/vendor',(req,res)=>{

    coupon.findOne({
        vendorname:req.body.vendorname
    }).then((vendor)=>{
        res.render('vendor',{vendor:vendor})
    })
})

route.get('/home',(req,res)=>{
    if(!req.user)       //middleware to check if user is not logged in
    {
        //if user is not logged in
        res.render('index');
    }
    else{
        res.render('loggedin');
    }

});


exports=module.exports=route;