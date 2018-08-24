const route=require('express').Router();
const path=require('path');
const crypto=require('crypto')
const bodyParser=require('body-parser');
const methodoverride=require('method-override');
const multer=require('multer');
const GridFsStorage=require('multer-gridfs-storage');
const grid=require('gridfs-stream');
const server=require('../server')
const mongoose=require('mongoose');
const keys=require('../config/keys')
const {request}=require('../models/requestsdb')

let gfs;

mongoose.connection.on('connected', () => {
    // Init stream
    gfs = grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('uploads');
})


route.get('/', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
            res.render('uploadfile.ejs',{files:false})
        } else {
            files.map(file => {
                if (
                    file.contentType === 'image/jpeg' ||
                    file.contentType === 'image/png'
                ) {
                    file.isImage = true;
                } else {
                    file.isImage = false;
                }
            });
            res.render('adminupload.ejs', { files: files });
        }
    });
});


exports=module.exports=route;