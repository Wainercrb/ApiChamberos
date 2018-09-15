var nodemailer = require('nodemailer');

// email sender function
/**
 * Metodo para enviar correos.
 * @method sendEmail
* @param {} req request proveniente del cliente
 * @param {} res response saliente al cliente
 * @return un codigo si se envia el correo exitosamente o de igual manera sino.
 */
exports.sendEmail = function (body, res) {
    // Definimos el transporter
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'roke12chacon@gmail.com',
            pass: 'Saprissa'
        }
    });
    // Definimos el email
    var mailOptions = {
        from: 'Remitente',
        to: body.email,
        subject: 'Confirmacion de registro TUBEKIDS',
        text: 'TUBEKIDS  link de confirmacion : ' + body.link
    };
    // Enviamos el email
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.send(500, err.message);
        } else {
            console.log("Email sent");
            res.status(200).jsonp(body);
        }
    });
};