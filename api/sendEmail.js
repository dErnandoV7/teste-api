const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'vinicius11112006@gmail.com',
        pass: 'edrw bhey bfll nycg'
    }
});

async function sendEmail(email, senha) {
    const mailOptions = {
        from: 'vinicius11112006@gmail.com',
        to: email,
        subject: 'Sua senha de acesso',
        text: `Olá,

Sua senha de acesso foi gerada com sucesso. Você pode utilizá-la juntamente com o seu e-mail para acessar a plataforma.

E-mail: ${email}
Senha: ${senha}

Caso tenha alguma dúvida ou precise de assistência, não hesite em contatar.

Atenciosamente,
WILL`
    };

    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;