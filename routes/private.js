const route=require('express').Router();

route.get('/',(req,res)=>{
   if(req.user)
   {
       res.render('loggedin')
   }
   else
   {
       res.redirect('/login')
   }

});



exports=module.exports=route;