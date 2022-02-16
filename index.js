const express = require('express');
const app = express();


app.set('view engine', 'ejs');
app.use('/style', express.static('dist/css'))
app.use(express.static('public'));

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

app.listen(process.env.PORT || 3000);