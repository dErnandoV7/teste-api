const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'artistaoficial01@gmail.com',
        pass: 'sfyt kijz bnvy brms'
    }
});

async function sendEmail(email, senha) {
    const mailOptions = {
        from: 'artistaoficial01@gmail.com',
        to: email,
        subject: 'Sua senha de acesso',
        text: `Olá,

Sua senha de acesso foi gerada com sucesso. Você pode utilizá-la juntamente com o seu e-mail para acessar a plataforma no Link a seguir:

Link: link

E-mail: ${email}
Senha: ${senha}

Caso tenha alguma dúvida ou precise de assistência, não hesite em contatar.

Atenciosamente,
WILL`
    };

    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;