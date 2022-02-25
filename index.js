const express = require('express');
const app = express();
const mongoose = require('mongoose')

app.set('view engine', 'ejs');
// app.set('views', ['views', 'components'])
app.use('/style', express.static('dist/css'))
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
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
