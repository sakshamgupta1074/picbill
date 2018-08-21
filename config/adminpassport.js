const passport=require('passport')
const {admin}=require('../models/admindb')
const LocalStrategy=require('passport-local').Strategy


//serialize user is used to save the data of user in the session and here we save only username in the session
passport.serializeUser(function(admin,done){
    done(null,admin.username)
})

passport.deserializeUser(function(username,done){
    admin.findOne({
        username:username
    }).then((admin)=>{
        if(!admin){
            console.log('no such user');
            return done(new Error("No such user"))
        }

        return done(null,admin)
    }).catch((err)=>{
        done(err)
    })
})

passport.use(new LocalStrategy((username,password,done)=>{
    admin.findOne({
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
