const express=require('express');
const app=express();
const model=require('./models/userdb');
const session=require('express-session')
const passport=require('./config/passport')
const keys=require('./config/keys')
const  mongoose=require('mongoose')


app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

mongoose.connect(keys.mongodb.dbURI,()=>{
    console.log('connected to mongodb')

})

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret:keys.session.cookiesKey
}))
app.use(passport.initialize());
app.use(passport.session());
app.use('/public',require('./routes/public'));
app.use('/private',require('./routes/private'));
app.use('/',require('./routes/root'));
app.use('/adminprivate',require('./routes/adminprivate'))
app.use('/admin',require('./routes/adminroot'))


    app.listen(3000, ()=>{
        console.log("server started at 3000");
    })
