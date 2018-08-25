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

       res.render('loggedin',{cashback:req.user.cashback})

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

    req.user.cashback=req.user.cashback-parseInt(req.body.buycoupon);
    req.user.save();
    res.send('new cashback'+req.user.cashback)

})



exports=module.exports=route;