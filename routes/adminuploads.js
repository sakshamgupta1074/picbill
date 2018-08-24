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
route.get('/image/:filename', (req, res) => {
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

exports=module.exports=route;