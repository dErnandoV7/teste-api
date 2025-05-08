if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const createUser = require('../db/createUser');
const createUserAccount = require('../db/createUserAccount');
const sendEmail = require('./sendEmail');
const crypto = require('crypto');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { email, name } = req.body.data.customer;
    const id_product = req.body.data.product.id;

    const senha = crypto.randomBytes(4).toString('hex');

    await sendEmail(email, senha);

    const createRes = await createUser(name, email, senha, id_product);
    const createResAcc = await createUserAccount(email, senha);

    if (createRes.success && createResAcc.success) console.log("Usuário criado com sucesso!");

    console.log(`Senha enviada e salva para ${email}`);

    return res.status(200).json({ message: 'OK' });
  } catch (err) {
    console.error('Erro ao processar webhook:', err);
    return res.status(500).json({ message: 'Erro interno' });
  }
};