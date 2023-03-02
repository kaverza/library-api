const multer = require('multer');
const { UPLOADED_FILE_PATH } = require('../constants');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADED_FILE_PATH);
    },
    filename: (req, file, cb) => {
        const [exp] = /[^.]+$/.exec(file.originalname);
        cb(null, Date.now() + '.' + exp);
    }
});

module.exports = (req, res, next) => {
    return multer({ storage }).single('fileBook')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                res.status(400);
                res.json(err);
                next(err.message);
            }
        }
        next();
    } );
}