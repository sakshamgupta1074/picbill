const pass=require('passport')
const {user}=require('../models/userdb')
const LocalStrategy=require('passport-local').Strategy


//serialize user is used to save the data of user in the session and here we save only username in the session
pass.serializeUser(function(user, done){
    done(null,user.username)
})

pass.deserializeUser(function(username, done){
    user.findOne({
        username:username
    }).then((user)=>{
        if(!user){
            console.log('no such user');
            return done(new Error("No such user"))
        }

        return done(null,user)
    }).catch((err)=>{
        done(err)
    })
})

pass.use(new LocalStrategy((username, password, done)=>{
    user.findOne({
        username:username,
    }).then((users)=>{

        c=users.confirmed       //agr error aye login me to isme await ka dekhio
        console.log(c);
            if(!users){

            return done(null,false,{message:'no such user'})
        }
        if(!c){

            return done(null,false,{message:'email id not confirmed'})
        }
        if(users.password!==password){

            return done(null,false,{message:'wrong password'})

        }

        return done(null,users)
    }).catch((err)=>{
        return done(err)
    })
}))

exports=module.exports=pass;
