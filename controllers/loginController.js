var mongoose = require('mongoose');
var jwt = require('../services/jwt');
var bcrypt = require('bcryptjs');
var User = mongoose.model('users');


var user = new User;

exports.findUserUsername = function (req, res) {

  User.findOne({ email: req.body.email }, {}, function (err, user) {

    if (err) {
      res.status(500).send({ message: 'Error en la peticion' });

    } else {

      if (!user) {
        res.status(401).send({ message: 'El usuario no existe' });
      } else {
        //Comprobacion de contrasenna
        bcrypt.compare(req.body.password, user.password, function (err, check) {
          if (check) {
            //si esta verificada la cuenta
            if (!user.isVerificated) {
              res.status(401).send({ message: 'Cuenta NO verificada' });
            }
            //devolver los datos del usuario logueado
            if (req.body.gethash) {
              //devolver un token jwt
              res.status(200).send({
                token: jwt.createToken(user)
              });
            } else {
              res.status(200).send({ user });
            }
          } else {
            res.status(401).send({ message: 'La contraseña es incorrecta' });
          }
        });
      }

    }
  });
}