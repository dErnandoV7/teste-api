const { getFirestore, collection, query, where, getDocs, updateDoc, arrayUnion } = require('firebase/firestore');
const app = require('./configdb');

const db = getFirestore(app);

const updateUserProducts = async (email, newProductId) => {
    try {
        const usersRef = collection(db, 'Usuarios');
        const q = query(usersRef, where('email', '==', email));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return { success: false, message: 'Usuário não encontrado para atualização.' };
        }

        const userDoc = snapshot.docs[0];
        const userDocRef = userDoc.ref; 

        await updateDoc(userDocRef, {
            products: arrayUnion(newProductId)
        });

        return { success: true, message: `Produtos do usuário ${email} atualizados com sucesso!` };
    } catch (error) {
        return { success: false, message: 'Erro ao atualizar produtos do usuário: ' + error.message };
    }
};

module.exports = updateUserProducts;