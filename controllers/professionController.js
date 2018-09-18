var mongoose = require('mongoose');
var Profession = mongoose.model('professions');



exports.findAllProfessions = function (req, res) {

    Profession.find(function (err, professions) {
        if (err) {
            res.status(422);
            res.json({
                error: err
            });
        }
        res.status(200);
        res.json(professions);
    });
};


exports.findById = function (req, res) {
    Profession.findById(req.params.id, function (err, profession) {
        if (err) {
            res.status(422);
            res.json({
                error: err
            });
        }
        res.status(200);
        res.json(profession);
    });

};

exports.addProfession = function (req, res) {

    var profession = new Profession();
    profession.description = req.body.description;
    profession.status = true;

    profession.save(function (err) {
        if (err) {
            res.status(422);
            res.json({
                error: err
            });
        }
        res.status(201);
        res.json(profession);
    });
};

exports.updateProfession = function (req, res) {
    var update = req.body;
    Profession.findByIdAndUpdate(req.params.id, update, (err, updateProfession) => {

        if (err) {
            res.status(500).send({
                message: 'Error al actualizar el profesion'
            });

        } else {
            if (!updateProfession) {
                res.status(404).send({
                    message: 'No se ha podido actualizar el profesion'
                });
            } else {
                res.status(200).send({
                    message: 'Profesion  Actualizado'
                });
            }
        }


    });
}


exports.deleteProfession = function (req, res) {

    req.body.status = false;
    var update = req.body;
    Profession.findByIdAndUpdate(req.params.id, update, (err, updateProfession) => {

        if (err) {
            res.status(500).send({
                message: 'Error al actualizar el profesion'
            });

        } else {
            if (!updateProfession) {
                res.status(404).send({
                    message: 'No se ha podido actualizar el profesion'
                });
            } else {
                res.status(200).send({
                    message: 'Profesion  Actualizado'
                });
            }
        }
    });
}