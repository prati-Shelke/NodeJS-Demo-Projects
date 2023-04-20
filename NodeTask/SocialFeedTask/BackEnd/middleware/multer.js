const multer = require('multer')


//----------------------FOR STORING IMAGE OR FILE INTO DB---------------------------
const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './Images');
    },
    filename: (req, file, cb) => {
        // console.log(file)
        const fileName = Date.now() + file.originalname
        cb(null, fileName)
    }
});

//--------------------------------TO UPLOAD FILE USING MULTER--------------------
const upload = multer({
    storage:Storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
})

module.exports = upload