/**
 * Created by rishabhkhanna on 27/07/18.
 */
const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const adminSchema=new Schema({
    username:String,
    password:String,
    firstname:String,
    lastname:String

});



const admin=mongoose.model("admin",adminSchema);


module.exports = {
    admin
}