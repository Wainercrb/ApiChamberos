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
            res.json({ error: err });
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
    User.findById(req.params.id, function (err, user) {
        if (err) {
            res.status(422);
            res.json({ error: err });
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


    if (validator.validate(req.body.email)) {

        
            var hashedPassword = bcrypt.hashSync(req.body.password, 8);

            var user = new User();

            user.name = req.body.name;


            user.lastName = req.body.lastName;
            user.professionId = req.body.professionId;
            user.country = req.body.country;
            user.password = hashedPassword;
            user.birthDate = req.body.birthDate;
            user.email = req.body.email;
            user.admin = req.body.admin;
            user.approvalstatus = true;



            user.save(function (err) {
                if (err) {
                    res.status(422);
                    res.json({ error: err });
                }
              
            });
}


};


/**
 * update a specific user
 * @method updateUser
 * @param {} req
 * @param {} res
 * @return specific user
 */
exports.updateUser = function (req, res) {
    var update = req.body;
    User.findByIdAndUpdate(req.params.id, update, (err, userUpdated) => {

        if (err) {
            res.status(500).send({ message: 'Error al actualizar el usuario' });

        } else {
            if (!userUpdated) {
                res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
            } else {
                res.status(200).send({ user: userUpdated });
            }
        }


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
    req.body.approvalstatus = false;
    var update = req.body;

    User.findByIdAndUpdate(req.params.id, update, (err, userUpdated) => {

        if (err) {
            res.status(500).send({ message: 'Error al elimiar usuario' });

        } else {
            if (!userUpdated) {
                res.status(404).send({ message: 'No se ha podido eliminar el usuario' });
            } else {
                res.status(200).send({ message: 'Usuario eliminado con exito' });
            }
        }


    });
}





