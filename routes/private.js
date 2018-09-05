const route=require('express').Router();
const {coupon}=require('../models/coupondb')
const {user}=require('../models/userdb')
const {sale}=require('../models/coupondb')
const authCheck=(req,res,next)=>{
    if(!req.user)       //middleware to check if user is not logged in
    {
        //if user is not logged in
        res.redirect('/login')
    }
    else{
        next();
    }
}
route.use(function(req, res, next) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});
route.use(authCheck);

route.get('/',(req,res)=>{

       res.render('loggedin',{cashback:req.user.cashback,username:req.user.username})

});

route.use('/uploads',require('./uploads'));



route.post('/buycoupon',(req,res)=> {


    coupon.findOne({
        vendorname: req.body.vendorname
    }).then((vendor) => {

        if(parseInt(req.body.coupono)>=1) {
            if (req.user.cashback - parseInt(vendor.coupon1price) < 0) {
                res.send(`Current amount:${req.user.cashback}<br/>sorry you dont have enough amount in your wallet`)
            }
            else {
                user.findOne({
                    username: req.user.username
                }).then((user) => {
                    console.log(user);

                    if (user.noofcoupons < 2) {
                        user.noofcoupons = user.noofcoupons + 1;
                        user.cashback = user.cashback - req.body.couponprice;
                        console.log(vendor);


                        if (vendor.coupon1price === parseInt(req.body.couponprice)) {
                            vendor.coupon1no = vendor.coupon1no - 1;
                        }
                        else {
                            console.log("nooooo")
                            vendor.coupon2no = vendor.coupon2no - 1;
                        }


                        if (user.couponname1 === 'nocoupon') {
                            user.couponname1 = vendor.vendorname
                        }
                        else {
                            user.couponname2 = vendor.vendorname
                        }
                        user.save();
                        vendor.save();
                        res.render('userprofile', {user: user})
                    }
                    else {
                        res.send('sorry you cannot buy more than 2 coupons ')
                    }


                })


            }
        }
        else{
            res.send('sorry no coupons left');
        }
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
            console.log(coupon);
            if(coupon.vendorname===req.user.couponname1){
                req.user.couponname1='nocoupon'
            }
            else{
                req.user.couponname2='nocoupon'
            }
            req.user.noofcoupons=req.user.noofcoupons-1;
            req.user.save();
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

route.get('/sale',(req,res)=>{

   sale.findOne({
       couponprice:100
   }).then((sale)=>{
       console.log(sale)
       res.render('sale',{sale:sale})
   })


})

route.post('/salecoupon',(req,res)=>{
    sale.findOne({
        couponprice:100
    }).then((sale)=>{
        if(sale.couponno>=1){
            sale.couponno=sale.couponno-1;
            user.findOne({
                username:req.body.username
            }).then((user)=>{
                user.couponno3='salecoupon';
                user.save();
            })
            sale.save();
            res.render('userprofile',{user:req.user});
        }
        else{
            res.send('you missed the sale')
        }
    })
})
exports=module.exports=route;