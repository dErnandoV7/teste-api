const { getFirestore, collection, addDoc, query, where, getDocs } = require('firebase/firestore');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const app = require('./configdb');

const db = getFirestore(app);
const auth = getAuth(app);

const userExists = async (email) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const snapshot = await getDocs(q);
    return !snapshot.empty; 
};

const createUser = async (name, email, id_product, senha) => {

    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;
    const uid = user.uid;

    const data = {
        name,
        email,
        packs: [id_product],
        id: uid,
        downloads: 0,
    };

    
    try {
        const docRef = await addDoc(collection(db, 'users'), data);
        return { success: true, message: 'Usuário criado no Firestore!', docId: docRef.id };
    } catch (error) {
        return { success: false, message: 'Erro ao criar usuário no Firestore: ' + error.message };
    }
};

module.exports = { createUser, userExists }; 
