const express = require('express');
const app = express();
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

app.set('view engine', 'ejs');
app.use(cookieParser())
// app.set('views', ['views', 'components'])
app.use('/style', express.static('dist/css'))
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('[filed]', file.fieldname);
        if (file.fieldname == 'avatar') {
            cb(null, './uploads/avatars')
        }
        else if (file.fieldname == 'projects') {
            cb(null, './uploads/projects')
        }
        else{
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


app.get(['/', '/home'], (req, res) => {
    res.render('index', {
        service: [
            { title: 'Web design', desciption: 'I am building a good user exprirence' },
            { title: 'Web Developer', desciption: 'I am building a good user exprirence' },
            { title: 'SEO', desciption: 'I am building a good user exprirence' },
            { title: 'UI/UX', desciption: 'I am building a good user exprirence' },
        ]
    })
})

app.use('/dashboard', require('./routes/dashboard'))
app.use('/auth', require('./routes/auth'))
app.get('/500page', (req, res) => {
    res.render('500page')
})

app.get('*', (req, res) => {
    res.render('noFound')
})
main().catch(err => console.log(err));


async function main() {
    await mongoose.connect('mongodb://localhost:27017/protfolioApp',
        {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            // useCreateIndex: true, //make this true
            autoIndex: true, //make this also true
        });
}
app.listen(process.env.PORT || 3000);
