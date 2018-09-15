'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso';

exports.createToken = function(user){
    var payload ={
        sub: user._id,
        name: user.name,
        lastname : user.lastname,
        email: user.email,
        type_user: user.type_user,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    };
    return jwt.encode(payload, secret);
};