const route=require('express').Router();
const passport1=require('passport');
const {request}=require('../models/requestsdb')
const {user}=require('../models/userdb')
const grid=require('gridfs-stream');
const mongoose=require('mongoose');

route.get('/adminlogin',(req,res)=>{
    res.render('adminlogin');
})

let gfs;

mongoose.connection.on('connected', () => {
    // Init stream
    gfs = grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('uploads');
})



route.post('/adminlogin',passport1.authenticate('local',{
    failureRedirect:'/admin/adminlogin',
    successRedirect:'/adminprivate'
}));

route.post('/adminloggedin',(req,res)=>{
    req.logout();
    res.redirect('/admin/adminlogin')
});



route.post('/adminuserdata',(req,res)=>{

    user.findOne({
        username:req.body.username
    }).then((user)=>{
        console.log(user)
        res.send(user);
    })
})

route.post('/modifydata',(req,res)=>{
    user.findOne({
        username:req.body.username
    }).then((user)=>{
        const c=user.cashback;
        user.cashback=user.cashback+parseInt(req.body.cashback);
        user.save();
        res.send(`old amount of user:${c} new amount of user:${user.cashback}`)   //refresh wala bug hata diyo
    })
})

route.post('/requests',(req,res)=>{

    request.create({
        username:req.user.username,
        amount:req.body.amount
    });


    res.send('your cashback will be updated in next 24 hrs')
})


route.post('/requestdb',(req,res)=>{

    request.find({}, function (err, users) {
        var data = {};
        users.forEach(function(user) {
            data[user._id] = user;
        });
        console.log(data);
        res.send(data);

    });

    route.get('/requestdb/:filename', (req, res) => {
        gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
            // Check if file
            if (!file || file.length === 0) {
                return res.status(404).json({
                    err: 'No file exists'
                });
            }

            // Check if image
            if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
                // Read output to browser
                const readstream = gfs.createReadStream(file.filename);
                readstream.pipe(res);
            } else {
                res.status(404).json({
                    err: 'Not an image'
                });
            }
        });
    });
    route.get('/requestdb/:filename/s',(req,res)=>{
        console.log(req.params.filename)
        res.render('particularup.ejs',{filename:req.params.filename})
    })

    route.post('/deleterequest/:filename',(req,res)=>{
        let a=req.params.filename;
        request.findOne({
          imgname:req.params.filename
        }).then((user)=>{
            user.remove();
            res.redirect(`/admin/requestdb/`)


        })
    })


})








exports=module.exports=route;