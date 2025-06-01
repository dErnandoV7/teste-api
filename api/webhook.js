if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const { createUser, userExists } = require('../db/createUser'); // Importe userExists
const createUserAccount = require('../db/createUserAccount');
const sendEmail = require('./sendEmail');
const updateUserProducts = require('../db/updateUserProducts'); // Importe a nova função
const crypto = require('crypto');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { email, name } = req.body.data.customer;
    const id_product = req.body.data.product.id;
    const phone = req.body.data.customer.phone; // Supondo que o telefone venha aqui

    // 1. Verificar se o usuário já existe no Firestore pelo e-mail
    const userAlreadyExists = await userExists(email);

    if (userAlreadyExists) {
      console.log(`Usuário com e-mail ${email} já existe. Atualizando produtos.`);
      // 2. Se o usuário existe, apenas atualiza seus produtos
      const updateRes = await updateUserProducts(email, id_product);

      if (updateRes.success) {
        console.log("Produtos do usuário atualizados com sucesso!");
        // Opcional: Aqui você pode adicionar lógica para enviar uma mensagem de WhatsApp
        // informando que o novo produto foi adicionado à conta existente,
        // mas APENAS se você tiver a API Oficial do WhatsApp Business configurada.
        // O Twilio seria chamado aqui, por exemplo.
        // Se você não tiver a API oficial, a mensagem não será enviada automaticamente.
      } else {
        console.error("Falha ao atualizar produtos do usuário:", updateRes.message);
      }
      return res.status(200).json({ message: 'Usuário existente, produtos atualizados.' });

    } else {
      console.log(`Novo usuário detectado: ${email}. Criando conta.`);
      // 3. Se o usuário não existe, cria a conta e envia e-mail/senha
      const senha = crypto.randomBytes(4).toString('hex'); // Gera senha

      // Envia e-mail
      await sendEmail(email, senha); // Esta é a função que envia e-mail, não WhatsApp

      // Cria usuário no Firestore (coleção 'Usuarios')
      const createRes = await createUser(name, email, senha, id_product);
      
      // Cria usuário no Firebase Authentication
      const createResAcc = await createUserAccount(email, senha);

      if (createRes.success && createResAcc.success) {
        console.log("Novo usuário criado com sucesso no Firestore e Authentication!");
        // Aqui, se você quiser enviar a senha/e-mail para o WhatsApp
        // para *novos* usuários, você chamaria a API do BSP aqui,
        // usando o 'phone' que veio no webhook.
        // Exemplo (requer integração com BSP como Twilio):
        // await sendWhatsAppMessage(phone, `Olá, ${name}! Sua senha temporária é ${senha} e seu e-mail de login é ${email}.`);
      } else {
        console.error("Falha ao criar novo usuário:", createRes.message || createResAcc.error);
        return res.status(500).json({ message: 'Falha ao criar novo usuário.' });
      }
      await updatePackAcess(id_product)
      console.log(`Senha enviada por e-mail e salva para ${email}`);
      return res.status(200).json({ message: 'Novo usuário criado e dados enviados.' });
    }
  } catch (err) {
    console.error('Erro geral ao processar webhook:', err);
    return res.status(500).json({ message: 'Erro interno no webhook.' });
  }
};