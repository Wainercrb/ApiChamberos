const express = require('express');
const mongoose = require('mongoose');
const validator = require('express-validator');
const db = mongoose.connect('mongodb://localhost:27017/db_chamberos');
const app = express();
const cors = require('cors');
var md_auth = require('../APIChamberos/middleware/authenticate');
const bodyParser = require('body-parser');



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(validator());
app.use(cors());



var UserCTRL = require('./controllers/userController');
var LoginController = require('./controllers/loginController');

app.set('view engine', 'pug');
// this is where we can put the public contents like css and js files
app.use(express.static(__dirname + '/public'));



app.get('/', (request, response) => {
    //connect to db and get data
    response.render('index', {
        title: 'Main Title',
        content: 'The content of the page'
    })
});

//API ROUTES LOGIN

var login = express.Router();

login.route('/login')
    .post(LoginController.findUserUsername);


app.use('/api', login);


//API ROUTES USER

var user = express.Router();

user.route('/users')
    .get(md_auth.ensureAuth, UserCTRL.findAllUsers)
    .post(UserCTRL.addUser);

user.route('/users/:id')
    .get(md_auth.ensureAuth, UserCTRL.findById)
    .put(md_auth.ensureAuth, UserCTRL.updateUser)
    .delete(md_auth.ensureAuth, UserCTRL.deleteUser);


app.use('/api', user);




// handle 404
app.use(function (req, res, next) {
    res.status(404);
    res.send({ error: 'Not found' });
    return;
});


app.listen(3000, () => console.log('API is listening on port 3000!'));