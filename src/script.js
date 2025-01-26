// Inițializare Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

// Configurare Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBahkhy2GgUW2wM5dxghoVt2bv0-6ZyWqQ",
  authDomain: "restaurantapp-d0256.firebaseapp.com",
  projectId: "restaurantapp-d0256",
  storageBucket: "restaurantapp-d0256.appspot.com",
  messagingSenderId: "275208346650",
  appId: "1:275208346650:web:30f21698afaeb3919945a3",
  measurementId: "G-X0H5WP9NX1"
};

// Inițializare Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Elemente DOM
const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// Adăugare mesaj în chat
function addMessage(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    messageDiv.textContent = text;
    chatbox.appendChild(messageDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Verifică disponibilitatea
async function checkDisponibilitate(data, ora, cosmeticianaId) {
    const q = firebase.firestore.query(
        firebase.firestore.collection(db, "programari"),
        firebase.firestore.where("data", "==", data),
        firebase.firestore.where("ora", "==", ora),
        firebase.firestore.where("cosmeticianaId", "==", cosmeticianaId)
    );
    const snapshot = await firebase.firestore.getDocs(q);
    return snapshot.empty; // true dacă este disponibil
}

// Creează o programare
async function createProgramare(client, telefon, data, ora, tratamentId, cosmeticianaId) {
    const programare = {
        client,
        telefon,
        data,
        ora,
        tratamentId,
        cosmeticianaId,
        status: "confirmată"
    };
    await firebase.firestore.addDoc(firebase.firestore.collection(db, "programari"), programare);
}

// Detectează intenția utilizatorului
async function detectIntent(text) {
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Clasifică mesajul în 'programare' sau 'recomandare': "${text}"` })
    });
    const data = await response.json();
    return data.reply.toLowerCase().includes('programare') ? 'programare' : 'recomandare';
}

// Gestionează cererea de programare
async function handleAppointment(userMessage) {
    // Extrage detalii din mesaj (ex: "programare manichiură mâine la 14:00")
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            prompt: `Extrage JSON cu "data", "ora", "tratament" și "cosmeticianaId" din: "${userMessage}"`
        })
    });
    const details = await response.json();

    // Verifică disponibilitatea
    const disponibil = await checkDisponibilitate(details.data, details.ora, details.cosmeticianaId);
    if (disponibil) {
        // Creează programarea
        await createProgramare("Nume Client", "0722...", details.data, details.ora, details.tratament, details.cosmeticianaId);
        return `✅ Programare confirmată pentru ${details.data} la ${details.ora}.`;
    } else {
        return "⚠️ Ne pare rău, slotul este ocupat. Vă recomandăm altă oră.";
    }
}

// Gestionează cererea de recomandare
async function handleTreatmentQuery(userMessage) {
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage })
    });
    const data = await response.json();
    return data.reply;
}

// Trimite mesaj
async function sendMessage() {
    const userMessage = userInput.value.trim();
    addMessage(userMessage, true);
    userInput.value = '';

    try {
        // Detectează intenția
        const intent = await detectIntent(userMessage);

        // Procesează cererea
        let reply;
        if (intent === 'programare') {
            reply = await handleAppointment(userMessage);
        } else {
            reply = await handleTreatmentQuery(userMessage);
        }

        addMessage(reply, false);
    } catch (error) {
        addMessage("⚠️ Eroare. Vă rugăm încercați mai târziu.", false);
    }
}

// Evenimente
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
