const passport=require('passport')
const {user}=require('../models/userdb')
const LocalStrategy=require('passport-local').Strategy


//serialize user is used to save the data of user in the session and here we save only username in the session
passport.serializeUser(function(user,done){
    done(null,user.username)
})

passport.deserializeUser(function(username,done){
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

passport.use(new LocalStrategy((username,password,done)=>{
    user.findOne({
        username:username,
    }).then((users)=>{


        if(!users){

            return done(null,false,{message:'no such user'})
        }
        if(users.password!==password){

            return done(null,false,{message:'wrong password'})

        }

        return done(null,users)
    }).catch((err)=>{
        return done(err)
    })
}))

exports=module.exports=passport;
