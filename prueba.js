const express = require('express');
const mongoose = require('mongoose');
const db = mongoose.connect('mongodb://localhost:27017/db_chamberos');
const User = require('./models/userModel');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const randomstring = require("randomstring");

//init API
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.use(cors())

//Get the users of the db
app.get('/api/users', verifyToken, (req, res) => {
    jwt.verify(req.token, 'tubekids', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            User.find().then(users => {
                res.send(users);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || 'Some error occurred while retrieving users'
                });
            });
        }
    });
});


//saves the user in the db
app.post('/api/users', (req, res) => {
    //validatios
    if (!req.body.id) {
        res.status(400).send({
            message: 'cédula requerida'
        });
    }
    if (!req.body.name) {
        res.status(400).send({
            message: 'nombre requerido'
        });
    }
    if (!req.body.surnames) {
        res.status(400).send({
            message: 'apellidos requerido'
        });
    }
    if (!req.body.age) {
        res.status(400).send({
            message: 'edad requerida'
        });
    }
    if (!req.body.gender) {
        res.status(400).send({
            message: "genero requerido"
        });
    }
    if (!req.body.email) {
        res.status(400).send({
            message: 'email requerido'
        });
    }
    if (!req.body.pass) {
        res.status(400).send({
            message: 'contraseña requerida'
        });
    }
    if (!req.body.latitud) {
        res.status(400).send({
            message: 'latitud requerida'
        });
    }
    if (!req.body.longitud) {
        res.status(400).send({
            message: 'longitud requerida'
        });
    }
    User.findOne({
        email: req.body.email
    }, function (user) {
        if (user !== null) {
            res.status(400).send({
                message: 'email resgistrado'
            });
        } else {
            let user = new User();
            user = buildUser(req.body);
            user.save()
            .then(data => {
                res.send(data);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || 'some error occurred while creating the User'
                });
            });
        }
    });
});
//get user by id
app.get('/api/users/:id', verifyToken, (req, res) => {
    //token validation
    jwt.verify(req.token, 'chamberos', (err) => {
        if (err) {
            res.sendStatus(403);
        } else {
            User.findById(req.id, function (err, guests) {
                if (err) {res.send(err);} 
                else {res.json(guests);}
            });
        }
    });
});

//delete user by id of the db
app.delete('/api/users/:id', verifyToken, (req, res) => {
    //token validation
    let obj;
    jwt.verify(req.token, 'secret_key_goes_here', function (err, data) {
        if (err) {
            res.sendStatus(403);
        } else {
            obj = data;
        }
    });
    if (obj.role !== 'admin') {
        res.status(403);
    }
    User.findByIdAndRemove(req.params.id)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: `Note not found with id ${req.params.id}`
                });
            }
            res.send({
                message: 'Note deleted successfully!'
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: `User not found with id ${req.params.id}`
                });
            }
            return res.status(500).send({
                message: `Could not delete user with id ${req.params.id}`
            });
        });
})
//Update user by id
app.put('/api/users', verifyToken, (req, res) => {
    //token validation
    jwt.verify(req.token, 'tubekids', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            if (authData.role !== 'admin') {
                res.sendStatus(403);
            }
            // Validate Request
            if (!req.body.name) {
                res.status(400).send({
                    message: 'User name can not be empty'
                });
            }
            if (!req.body.surnames) {
                res.status(400).send({
                    message: 'User surnames can not be empty'
                });
            }
            if (!req.body.country) {
                res.status(400).send({
                    message: 'User country can not be empty'
                });
            }
            if (!req.body.birthDate) {
                res.status(400).send({
                    message: 'User birthDate can not be empty'
                });
            }
            if (!req.body.email) {
                res.status(400).send({
                    message: 'User email can not be empty'
                });
            }
            if (!req.body.password) {
                res.status(400).send({
                    message: 'User password can not be empty'
                });
            }
            // Find note and update it with the request body
            User.findByIdAndUpdate(authData.id, {
                    name: req.body.name,
                    surnames: req.body.surnames,
                    email: req.body.email,
                    country: req.body.country,
                    birthDate: req.body.birthDate
                }, {
                    new: true
                })
                .then(user => {
                    if (!user) {
                        return res.status(404).send({
                            message: `User not found with id ${req.params.id}`
                        });
                    }
                    res.send(user);
                }).catch(err => {
                    if (err.kind === 'ObjectId') {
                        res.status(404).send({
                            message: `User not found with id ${req.params.id}`
                        });
                    }
                    res.status(500).send({
                        message: `Error updating user with id ${req.params.id}`
                    });
                });
        }
    });
})
//Update user by id, but without the password
app.put('/api/users/password', verifyToken, (req, res) => {
    //token validation
    jwt.verify(req.token, 'tubekids', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            if (authData.role !== 'admin') {
                res.sendStatus(403);
            }
            // Validate Request
            if (!req.body.name) {
                res.status(400).send({
                    message: 'User name can not be empty'
                });
            }
            if (!req.body.surnames) {
                res.status(400).send({
                    message: 'User surnames can not be empty'
                });
            }
            if (!req.body.country) {
                res.status(400).send({
                    message: 'User country can not be empty'
                });
            }
            if (!req.body.birthDate) {
                res.status(400).send({
                    message: 'User birthDate can not be empty'
                });
            }
            if (!req.body.email) {
                res.status(400).send({
                    message: 'User email can not be empty'
                });
            }
            if (!req.body.password) {
                res.status(400).send({
                    message: 'User password can not be empty'
                });
            }
            // Find note and update it with the request body
            User.findByIdAndUpdate(authData.id, {
                    name: req.body.name,
                    surnames: req.body.surnames,
                    email: req.body.email,
                    country: req.body.country,
                    birthDate: req.body.birthDate,
                    password: md5(req.body.password)
                }, {
                    new: true
                })
                .then(user => {
                    if (!user) {
                        return res.status(404).send({
                            message: `User not found with id ${req.params.id}`
                        });
                    }
                    res.send(user);
                }).catch(err => {
                    if (err.kind === 'ObjectId') {
                        res.status(404).send({
                            message: `User not found with id ${req.params.id}`
                        });
                    }
                    res.status(500).send({
                        message: `Error updating user with id ${req.params.id}`
                    });
                });
        }
    });
});


//check if API work
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

// Verify Token
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        // Forbidden
        res.sendStatus(403);
    }
}

function buildUser(body){

    let user = new User();
    user.cedula = body.id;
    user.nombre = body.name;
    user.apellidos = body.surnames;
    user.edad = body.email;
    user.genero = body.gender;
    user.email = body.email;
    user.pass = md5(body.pass);
    user.latitud = body.latitud;
    user.longitud = body.longitud;
    return user;
}


//root route
app.use(function (req, res, next) {
    res.status(404);
    res.send({
        error: 'Not found'
    });
    return;
});