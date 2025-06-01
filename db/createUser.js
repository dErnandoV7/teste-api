const { getFirestore, collection, addDoc, query, where, getDocs } = require('firebase/firestore');
const app = require('./configdb');

const db = getFirestore(app);

const userExists = async (email) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const snapshot = await getDocs(q);
    return !snapshot.empty; 
};

const createUser = async (name, email, password, id_product) => {
    const data = {
        name,
        email,
        password, 
        products: [id_product],
    };

    try {
        const docRef = await addDoc(collection(db, 'users'), data);
        return { success: true, message: 'Usuário criado no Firestore!', docId: docRef.id };
    } catch (error) {
        return { success: false, message: 'Erro ao criar usuário no Firestore: ' + error.message };
    }
};

module.exports = { createUser, userExists }; 
