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





route.use(bodyParser.json());
route.use(methodoverride('_method'));

let gfs;

mongoose.connection.on('connected', () => {
    // Init stream
    gfs = grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('uploads');
})



const storage = new GridFsStorage({
    url:keys.mongodb.dbURI ,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });

route.post('/upload',upload.single('file'),(req,res)=>{
    res.redirect('/uploads');
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
            res.render('uploadfile.ejs', { files: files });
        }
    });
});

// @route POST /upload
// @desc  Uploads file to DB
route.post('/upload', upload.single('file'), (req, res) => {
    // res.json({ file: req.file });
    res.redirect('/');
});
route.get('/files', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: 'No files exist'
            });
        }

        // Files exist
        return res.json(files);
    });
});

// @route GET /files/:filename
// @desc  Display single file object
route.get('/files/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }
        // File exists
        return res.json(file);
    });
});

// @route GET /image/:filename
// @desc Display Image
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
route.delete('/files/:id', (req, res) => {
    gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
        if (err) {
            return res.status(404).json({ err: err });
        }

        res.redirect('/uploads');
    });
});

exports=module.exports=route;