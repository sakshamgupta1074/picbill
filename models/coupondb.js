
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
const saleSchema=new Schema({
   couponno:Number,
    couponprice:Number


});



const coupon=mongoose.model("coupon",couponSchema);

const sale=mongoose.model("sale",saleSchema);
module.exports = {
    coupon,
    sale
}