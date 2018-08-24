
const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const requestSchema=new Schema({
    username:String,
    amount:Number,
    imgname:{type:String,Default:'photonotuploaded'}
});


const request=mongoose.model("request",requestSchema);


module.exports = {
    request
}