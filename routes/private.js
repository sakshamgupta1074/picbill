const route=require('express').Router();
const {coupon}=require('../models/coupondb')
const {user}=require('../models/userdb')

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
        user.findOne({
            username:req.user.username
        }).then((user)=>{
            console.log(user);
            if(user.noofcoupons<2){
                user.noofcoupons=user.noofcoupons+1;
                if(user.couponname1==='nocoupon')
                {
                    user.couponname1=vendor.vendorname
                }
                else{
                    user.couponname2=vendor.vendorname
                }
                    user.save();
                if(req.user.cashback-parseInt(vendor.coupon1price)<0){
                    res.send(`Current amount:${req.user.cashback}<br/>sorry you dont have enough amount in your wallet`)
                }
                else {

                    req.user.cashback = req.user.cashback - parseInt(vendor.coupon1price);

                    req.user.save();
                    res.render('userprofile',{user:user})


                }

            }
            else{
                res.send('sorry you cannot buy more than 2 coupons ')
            }




        })

    })


})

route.get('/uploadbill',(req,res)=>{
    res.render('uploadbil',{user:req.user,username:req.user.username})
})


route.post('/verification',(req,res)=>{
    coupon.findOne({
        vendorname:req.body.password
    }).then((vendor)=>{
        res.render('verifycoupon',{password:vendor.vendorpassword})
    })

})

route.post('/code',(req,res)=>{
    let c=req.body.password;
    let d=req.body.code;

    if(c===d){
        coupon.findOne({
           vendorpassword:req.body.password
        }).then((coupon)=>{
            if(coupon.vendorname===req.user.couponname1){
                couponname1='nocoupon'
            }
            else{
                couponname2='nocoupon'
            }
            req.user.noofcoupons=req.user.noofcoupons-1;
            user.save();
        })

        res.send('code verified')
    }
    else{
        res.send('code not verified')
    }
})

route.get('/userprofile',(req,res)=>{
    res.render('userprofile',{user:req.user})
})

exports=module.exports=route;