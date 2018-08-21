
const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const requestSchema=new Schema({
    username:String,
    amount:Number
});


const request=mongoose.model("request",requestSchema);


module.exports = {
    request
}