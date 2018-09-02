const route=require('express').Router();
const {coupon}=require('../models/coupondb')
const {sale}=require('../models/coupondb')
route.get('/',(req,res)=>{
    if(req.user)
    {
        res.render('adminloggedin')
    }
    else
    {
        res.redirect('/login')
    }

});

route.use('/adminuploads',require('./adminuploads'));

route.post('/addvendor',(req,res)=>{
    res.render('addvendor')
})

route.post('/add',(req,res)=>{
    coupon.create({
        vendorname:req.body.vendorname,
        coupon1price:parseInt(req.body.coupon1price),
        coupon1no:parseInt(req.body.coupon1no),
        coupon2price:parseInt(req.body.coupon2price),
        coupon2no:parseInt(req.body.coupon2no),
        vendorpassword:req.body.password
    }).then((coupon)=>{
        res.send(`coupon created of ${coupon.vendorname}`)
    })
})

route.post('/modifyvendor',(req,res)=>{
    res.render('modifyvendor')
})

route.post('/modify',(req,res)=>{
    coupon.findOne({
        vendorname:req.body.vendorname,
        vendorpassword:req.body.password
    }).then((vendor)=>{
        if(!vendor){
            res.send('wrong details')
        }
        else {
            vendor.coupon1price = req.body.coupon1price;
            vendor.coupon1no=req.body.coupon1no;
            vendor.coupon2price=req.body.coupon2price;
            vendor.coupon2no=req.body.coupon2no
            vendor.save();
            res.send('modified user details')

        }
    }).catch((err)=>{
        console.log(err);
    })
})
route.post('/sale',(req,res)=>{
    res.render('adminsale')
})

route.post('/salecreate',(req,res)=>{
    sale.create({
        couponno:req.body.noofcoupun,
        couponprice:req.body.price
    }).then((sale)=>{
        console.log(sale);
        res.send('created');
    }).catch((err)=>{
        console.log(err);
    })
})
exports=module.exports=route