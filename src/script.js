// Inițializare Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  projectId: process.env.FIREBASE_PROJECT_ID,
  // ... alte configurări
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Funcție trimitere mesaj
async function sendMessage() {
    const userMessage = document.getElementById('userInput').value.trim();
    addMessage(userMessage, true);

    try {
        // Detectare intenție
        const intent = await detectIntent(userMessage);
        
        // Procesare
        let response;
        if(intent === 'programare') {
            response = await handleAppointment(userMessage);
        } else {
            response = await handleTreatmentQuery(userMessage);
        }

        addMessage(response, false);
    } catch (error) {
        addMessage("⚠️ Ne pare rău, am întâmpinat o eroare. Vă rugăm încercați mai târziu.", false);
    }
}

// Detectare intenție cu DeepSeek
async function detectIntent(text) {
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            prompt: `Clasifică mesajul în 'programare' sau 'recomandare': "${text}"`
        })
    });
    const data = await response.json();
    return data.reply.toLowerCase().includes('programare') ? 'programare' : 'recomandare';
}
