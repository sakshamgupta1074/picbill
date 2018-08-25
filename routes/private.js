const route=require('express').Router();
const {coupon}=require('../models/coupondb')

const authCheck=(req,res,next)=>{
    if(!req.user)       //middleware to check if user is not logged in
    {
        //if user is not logged in
        res.redirect('/')
    }
    else{
        next();
    }
}

route.use(authCheck);

route.get('/',(req,res)=>{

       res.render('loggedin',{cashback:req.user.cashback,username:req.user.username})

});

route.use('/uploads',require('./uploads'));

route.post('/vendor',(req,res)=>{

    coupon.findOne({
        vendorname:req.body.vendorname
    }).then((vendor)=>{
        res.render('vendor',{vendor:vendor})
    })
})

route.post('/buycoupon',(req,res)=>{
    coupon.findOne({
        vendorname:req.body.vendorname
    }).then((vendor)=>{
        console.log(vendor);

        if(req.user.cashback-parseInt(req.body.buycoupon)<0){
       res.send(`Current amount:${req.user.cashback}<br/>sorry you dont have enough amount in your wallet`)
   }
   else {
       req.user.cashback = req.user.cashback - parseInt(req.body.buycoupon);
       req.user.save();
            res.render('buycoupon',{vendor:vendor})
       res.send('wallet amount left:' + req.user.cashback)
   }

    })


})

route.get('/uploadbill',(req,res)=>{
    res.render('uploadbil',{user:req.user})
})



exports=module.exports=route;