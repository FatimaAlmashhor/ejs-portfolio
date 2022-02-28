const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('[filed]', file.fieldname);

        if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
            if (file.fieldname == 'avatar')
                cb(null, './uploads/avatars')
            else if (file.fieldname == 'project') {
                cb(null, './uploads/projects')
            }
        }
        else if (file.mimetype == "application/pdf") {
            cb(null, './uploads/files')
        }
    },
    filename: function (req, file, cb) {
        let extact = file.originalname.split('.')[1];

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + extact
        cb(null, file.fieldname + '-' + uniqueSuffix)

    }
})

const upload = multer({
    storage: storage,

    fileFilter: (req, file, callback) => {
        if (
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg" ||
            file.mimetype == "application/pdf"
        ) {
            callback(null, true);
        } else callback(null, false);
    },
    limits: 1024 * 1024 * 5,
})

module.exports = upload;