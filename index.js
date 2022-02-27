const express = require('express');
const app = express();
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const Skills = require('./schemas/skills');
const Services = require('./schemas/services');
const Projects = require('./schemas/projects');
const Info = require('./schemas/info');

app.set('view engine', 'ejs');
app.use(cookieParser())
// app.set('views', ['views', 'components'])
app.use('/style', express.static('dist/css'))
app.use('/uploads', express.static('uploads/'))
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.get(['/', '/home'], async (req, res) => {
    var skills = await Skills.find({ is_active: true, deleted: false }).clone().catch(function (err) { console.log(err) });
    var service = await Services.find({ is_active: true, deleted: false }).clone().catch(function (err) { console.log(err) });
    var projects = await Projects.find({ is_active: true, deleted: false }).clone().catch(function (err) { console.log(err) });
    var info = await Info.find().clone().catch(function (err) { console.log(err) });
    res.render('index', {
        services: service,
        skills: skills,
        projects: projects,
        info: info
    })
})


app.use('/dashboard', require('./routes/dashboard'))
app.use('/load', require('./routes/load'))
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
