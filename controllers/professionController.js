var mongoose = require('mongoose');
var Profession = mongoose.model('professions');



<<<<<<< HEAD
/**
 * FInd all Professions
 * @method findAllProfessions
 * @param {} req
 * @param {} res
 * @return  the profession
 */
exports.findAllProfessions= function (req, res) {
=======
exports.findAllProfessions = function (req, res) {
>>>>>>> User

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


/**
 * FInd by Id a profession
 * @method findById
 * @param {} req
 * @param {} res
 * @return profession(object)
 */
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

/**
 * add new profession
 * @method addProfession
 * @param {} req
 * @param {} res
 * @return profession (object)
 */
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

/**
 * Update a specific profession
 * @method updateProfession
 * @param {} req
 * @param {} res
 * @return Profession updated
 */
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
<<<<<<< HEAD
                res.status(200).send({ profession :updateProfessions });
=======
                res.status(200).send({
                    message: 'Profesion  Actualizado'
                });
>>>>>>> User
            }
        }


    });
}


/**
 * Delete a profession, in this case
 * the method update the atribute status
 * @method deleteProfession
 * @param {} req
 * @param {} res
 * @return message and code status
 */
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
<<<<<<< HEAD
                res.status(200).send({ message: 'Profesion  Eliminada' });
=======
                res.status(200).send({
                    message: 'Profesion  Actualizado'
                });
>>>>>>> User
            }
        }
    });
}