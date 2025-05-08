const app = require('./configdb');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const auth = getAuth(app);
const db = getFirestore(app);

const createUserAccount = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

module.exports = createUserAccount;

