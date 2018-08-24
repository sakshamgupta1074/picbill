const route=require('express').Router();
const model = require("../models/userdb");
const passport=require('../config/pass');
var bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
const randomstring=require('randomstring');
const mailer=require('../misc/mailer')

route.get('/login',(req,res)=>{
    res.render('login');
})

route.get('/signup',(req,res)=>{
    res.render('signup');
});

route.post('/login',passport.authenticate('local',{
    failureRedirect:'/login',
    successRedirect:'/private'
}));

route.post('/loggedin',(req,res)=>{
    req.logout();
    res.redirect('/login')
});

route.post("/signup", (req,res)=>{
    console.log(req.body);
    bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        var hashpassword=hash;
        console.log(hash);
    });
  const secretToken= randomstring.generate();

// users.push({username: req.body.username, password: req.body.password})
    model.user.create({
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname:req.body.lastname,
        secrettoken:secretToken,
        email:req.body.email,
        confirmed:false
    }).then((createuser)=>{
        const html=`hi there ,<br/> Thank you for registering!<br/>
                    <br/>>please verify your email by adding the following token:<br/>
                    Token:<b>${secretToken}</b>
                      <br/>On the following page:<a href="http://localhost:3000/verify">http://localhost:3000/verify</a><br/>Have a pleasant day`

        //send email
        res.send('verification email has been sent to your email adress')
        mailer.sendEmail('mycoupon@company.com',createuser.email,'please verify your email',html)



    })

});

route.get('/verify',(req,res)=>{
    res.render('verification')
})

route.post('/verify',(req,res)=>{
    model.user.findOne({
        secrettoken:req.body.secrettoken
    }).then((user)=>{
        if(!user){
            res.send('you sent a wrong token')

            return
        }

            user.confirmed=true
            user.save()                                    //use promise here agar error aa ra h to
            res.send('your email is verified')

    })
})




exports=module.exports=route;