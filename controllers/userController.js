var mongoose = require('mongoose');
var User = require('../models/userModel');
var bcrypt = require('bcryptjs');
var validator = require("email-validator");

// get all users
exports.findAllUsers = function (req, res) {
    User.find(function (err, users) {
        if (err) {
            res.status(422);
            res.json({
                error: err
            });
        }
        res.status(200);
        res.json(users);
    });
}
// find user by id
exports.findById = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) {
            res.status(422);
            res.json({
                error: err
            });
        }
        res.status(200);
        res.json(user);
    });
}
// add user to db
exports.addUser = function (req, res) {
    //  user data validation
    if (validateUserData(req)) {
        return res.status(400).send({
            erros: req.validationErrors()
        });
    }
    if (validator.validate(req.body.email)) {
        var hashedPassword = bcrypt.hashSync(req.body.password, 8);
        var user = new User();
        user.name = req.body.name;
        user.lastName = req.body.lastName;
        user.password = hashedPassword;
        user.age = req.body.age;
        user.email = req.body.email;
        user.gender = req.body.gender;
        user.latitud = req.body.latitud;
        user.longitud = req.body.longitud;
        user.approvalstatus = true;
        user.save(function (err, user) {
            if (err) {
                res.status(422);
                res.json({
                    error: err
                });
            }
            res.status(200);
            res.json(user);
        });
    }
}
// delete user by id
exports.updateUser = function (req, res) {
    var update = req.body;
    if (validateUserData(req)) {
        return res.status(400).send({
            erros: req.validationErrors()
        });
    }
    User.findByIdAndUpdate(req.params.id, update, () => {})
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: `User not found with id ${req.params.id}`
                });
            }
            res.send(user);
        }).catch(err => {
            res.status(404);
            es.json({
                error: err
            });
        });
}

// delete user by id
exports.deleteUser = function (req, res) {
    // id validation
    if (!req.params.id) {
        return res.status(500).send({
            message: 'Error when removing the user'
        });
    }
    User.findByIdAndRemove(req.params.id, (err, data) => {
        if (err) {
            res.status(500).send({message: 'Error when removing the user'});
        } else {
            if (!data) {
                res.status(404).send({message: 'The user could not be deleted'});
            } else {
                res.status(200).send({message: 'User deleted'});
            }
        }
    });
}
// request validation
function validateUserData(req) {
    req.checkBody('name', 'Invalid name').notEmpty().isLength({min: 4});
    req.checkBody('surnames', 'Invalid surnames').notEmpty().isLength({min: 4});
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min: 4});
    req.checkBody('age', 'Invalid age').notEmpty().isInt({gt: 1,lt: 150});
    req.checkBody('gender', 'Invalid gender').notEmpty();
    req.checkBody('latitud', 'Invalid latitud').notEmpty();
    req.checkBody('longitud', 'Invalid longitud').notEmpty();
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('approvalstatus', 'Invalid approvalstatus').notEmpty().isBoolean();
    return req.validationErrors();
}