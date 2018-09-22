var mongoose = require('mongoose');
var User = require('../models/userModel');
var bcrypt = require('bcryptjs');
var validator = require("email-validator");


/**
 * Find all the users
 * @method findAllUsers
 * @param {} req
 * @param {} res
 * @return list of users
 */
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
};


/**
 * Find by Id a specific user
 * @method findById
 * @param {} req
 * @param {} res
 * @return user(object)
 */
exports.findById = function (req, res) {
    // id validation
    if (!req.params.id) {
        return res.status(500).send({
            message: 'The id was not found'
        });
    }
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

};


/**
 * Add new User
 * @method addUser
 * @param {} req
 * @param {} res
 * @return status code
 */
exports.addUser = function (req, res) {
    //  user data validation
    if (validateUserData(req)) {
        return res.status(400).send({
            erros: req.validationErrors()
        });
    }
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    var user = new User();
    user.name = req.body.name;
    user.surnames = req.body.surnames;
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

/**
 * update a specific user
 * @method updateUser
 * @param {} req
 * @param {} res
 * @return specific user
 */
exports.updateUser = function (req, res) {
    var update = req.body;
    if (validateUserData(req)) {
        return res.status(400).send({
            erros: req.validationErrors()
        });
    }
    // id validation
    if (!req.params.id) {
        return res.status(500).send({
            message: 'The id was not found'
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


/**
 * Update a specific user 
 * @method deleteUser
 * @param {} req
 * @param {} res
 * @return status code
 */
exports.deleteUser = function (req, res) {
    // id validation
    if (!req.params.id) {
        return res.status(500).send({
            message: 'The id was not found'
        });
    }
    User.findByIdAndRemove(req.params.id, (err, data) => {
        if (err) {
            res.status(500).send({
                message: 'Error when removing the user'
            });
        } else {
            if (!data) {
                res.status(404).send({
                    message: 'The user could not be deleted'
                });
            } else {
                res.status(200).send({
                    message: 'User deleted'
                });
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