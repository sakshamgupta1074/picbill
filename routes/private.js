const route=require('express').Router();

const authCheck=(req,res,next)=>{
    if(!req.user)       //middleware to check if user is not logged in
    {
        //if user is not logged in
        res.redirect('/')
    }
    else{
        next();
    }
}

route.use(authCheck);

route.get('/',(req,res)=>{

       res.render('loggedin',{cashback:req.user.cashback})

});

route.use('/uploads',require('./uploads'))



exports=module.exports=route;