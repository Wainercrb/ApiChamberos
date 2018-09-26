var mongoose = require('mongoose');
var User = require('../models/userModel');
var bcrypt = require('bcryptjs');
var moment = require('moment');
//var {AgeFromDateString, AgeFromDate} = require('age-calculator');


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


exports.findByProfession = function (req, res) {
    // id validation
    if (!req.params.professionId) {
        return res.status(500).send({
            message: 'The professionId was not found'
        });
    }
    if (!req.params.latitud || !req.params.longitud || req.params.radius <= 0) {
        return res.status(500).send({
            message: 'The locations was not found'
        });
    }
    User.find({
        "professionId": {
            "_id": [
                req.params.professionId
            ]
        }
     
    }, function (err, user) {
        if (err) {
            res.status(422);
            res.json({
                error: err
            });
        }
        res.status(200);
        res.json(filterUser(user, req.params.latitud, req.params.longitud, req.params.radius));
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
    //format:{YYYY-MM-DD} 
    // validate age --> new AgeFromDate(new Date(req.body.birthdate)).age <= 17
    if (!moment(req.body.birthdate, "DD-MM-YYYY")){
        return res.status(400).send({
            erros: 'Invalid birthdate'
        });
    }
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    var user = new User();
    user.name = req.body.name;
    user.professionId = req.body.professionId;
    user.surnames = req.body.surnames;
    user.password = hashedPassword;
    user.birthdate = req.body.birthdate;
    user.email = req.body.email;
    user.phone = req.body.phone;
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
    req.checkBody('birthdate', 'Invalid birthdate').notEmpty();
    req.checkBody('gender', 'Invalid gender').notEmpty();
    req.checkBody('latitud', 'Invalid latitud').notEmpty();
    req.checkBody('longitud', 'Invalid longitud').notEmpty();
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('phone', 'Invalid phone').notEmpty();
    req.checkBody('approvalstatus', 'Invalid approvalstatus').notEmpty().isBoolean();
    return req.validationErrors();
}


function getDistance(lat1, lon1, lat2, lon2) {
    const radio = 6371,
      dLat = deg2rad(lat2 - lat1),
      dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return radio * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }


  function filterUser(users, nowLatitd, nowLongitud, radius) {
    let response = [];
    for (let user of users) {
      let dtc = getDistance(
        nowLatitd,
        nowLongitud,
        user.latitud,
        user.longitud
      );
      if (dtc <= radius) {
        response.push({ user: user, km: Number(dtc.toFixed(2)) });
      }
    }
    //order items by km
    response.sort(function(obj1, obj2) {
      return obj1.km - obj2.km;
    });

    return response;
  }