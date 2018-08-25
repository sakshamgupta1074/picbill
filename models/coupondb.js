
const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const couponSchema=new Schema({
    vendorname:{type:String,unique:true},
    coupon1price:Number,
    coupon1no:Number,
    coupon2price:Number,
    coupon2no:Number,
    vendorpassword:String,


});



const coupon=mongoose.model("coupon",couponSchema);


module.exports = {
    coupon
}