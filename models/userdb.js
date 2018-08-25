
const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const userSchema=new Schema({
    username:{type:String,unique:true},
    password:String,
    firstname:String,
    lastname:String,
    cashback:{type:Number, default:0},
    confirmed:{
        type:Boolean,
        default:false
    },
    secrettoken:String,
    email:{type:String,unique:true}

});



const user=mongoose.model("user",userSchema);


module.exports = {
    user
}