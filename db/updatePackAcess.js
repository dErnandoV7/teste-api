const { getFirestore, collection, query, where, getDocs, updateDoc, increment } = require('firebase/firestore');
const app = require('./configdb');

const db = getFirestore(app);

const updatePackAcess = async (productIdFromWebhook) => {
    try {
        const packsCollectionRef = collection(db, 'packs');
        
        const q = query(packsCollectionRef, where('idpack', '==', productIdFromWebhook));
        
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.warn(`Nenhum pack encontrado com idpack: ${productIdFromWebhook}`);
            return { success: false, message: `Nenhum pack encontrado com idpack: ${productIdFromWebhook}` };
        }

        const packDoc = querySnapshot.docs[0];
        const packDocRef = packDoc.ref; 

        await updateDoc(packDocRef, {
            acess: increment(1)
        });

        return { success: true, message: `Acesso do pack (idpack: ${productIdFromWebhook}) incrementado!` };
    } catch (error) {
        console.error(`Erro ao incrementar acesso do pack (idpack: ${productIdFromWebhook}):`, error.message);
        return { success: false, message: `Erro ao incrementar acesso do pack: ${error.message}` };
    }
};

module.exports = updatePackAcess;