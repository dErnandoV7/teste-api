// webhook.js
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { createUser, userExists } = require("../db/createUser");
const createUserAccount = require("../db/createUserAccount");
const sendEmail = require("./sendEmail");
const updateUserProducts = require("../db/updateUserProducts");
const updatePackAcess = require("../db/updatePackAcess"); // NOVO: Importar a função de atualização de acesso
const crypto = require("crypto");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { email, name } = req.body.data.customer;
    const id_product = req.body.data.product.id; // Este é o ID do produto que você quer usar como packId
    const phone = req.body.data.customer.phone;

    const userAlreadyExists = await userExists(email);

    if (userAlreadyExists) {
      console.log(
        `Usuário com e-mail ${email} já existe. Atualizando produtos.`
      );
      const updateRes = await updateUserProducts(email, id_product);

      if (updateRes.success) {
        console.log("Produtos do usuário atualizados com sucesso!");
      } else {
        console.error(
          "Falha ao atualizar produtos do usuário:",
          updateRes.message
        );
      }
    } else {
      console.log(`Novo usuário detectado: ${email}. Criando conta.`);
      const senha = crypto.randomBytes(4).toString("hex");
      
      const gerarIdCurto = (tamanho = 12) => {
        const caracteres =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let id = "";
        for (let i = 0; i < tamanho; i++) {
          const randomIndex = Math.floor(Math.random() * caracteres.length);
          id += caracteres[randomIndex];
        }
        return id;
      }

      await sendEmail(email, senha);
      const idUser = gerarIdCurto()
      const createRes = await createUser(name, email, id_product, idUser);
      const createResAcc = await createUserAccount(email, senha);

      if (createRes.success && createResAcc.success) {
        console.log(
          "Novo usuário criado com sucesso no Firestore e Authentication!"
        );
      } else {
        console.error(
          "Falha ao criar novo usuário:",
          createRes.message || createResAcc.error
        );
        return res
          .status(500)
          .json({ message: "Falha ao criar novo usuário." });
      }
    }

    // NOVO: Incrementar o contador de acessos do pack
    const packAcessUpdateResult = await updatePackAcess(id_product);
    if (packAcessUpdateResult.success) {
      console.log(packAcessUpdateResult.message);
    } else {
      console.error(packAcessUpdateResult.message);
    }

    console.log(`Processamento do webhook para ${email} concluído.`);
    return res.status(200).json({ message: "OK" });
  } catch (err) {
    console.error("Erro geral ao processar webhook:", err);
    return res.status(500).json({ message: "Erro interno no webhook." });
  }
};
