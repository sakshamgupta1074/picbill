const route=require('express').Router();

route.get('/',(req,res)=>{
   if(req.user)
   {
       res.render('loggedin',{cashback:req.user.cashback})
   }
   else
   {
       res.redirect('/login')
   }

});



exports=module.exports=route;