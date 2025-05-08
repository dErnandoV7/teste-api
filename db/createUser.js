const { getFirestore, collection, addDoc } = require('firebase/firestore');
const app = require('./configdb');

const db = getFirestore(app);

const createUser = async (name, email, password, id_product) => {
    const data = {
        name,
        email,
        password,
        id_product,
    };

    try {
        await addDoc(collection(db, 'Usuarios'), data);
        return { success: true, message: 'Produto criado com sucesso!' };
    } catch (error) {
        return { success: false, message: 'Erro ao criar produto: ' + error.message };
    }
};

module.exports = createUser;
