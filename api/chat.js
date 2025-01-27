<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Stelmina - Salon de Înfrumusețare</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script src="https://cdn.tailwindcss.com"></script>
    <script type="module">
        // Import Firebase
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
        import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

        // Configurație Firebase
        const firebaseConfig = {
            apiKey: "AIzaSyBwCFGYsXp5zjWIHAcQbOmdd31e7bDN8mk",
            authDomain: "stelmina-19617.firebaseapp.com",
            projectId: "stelmina-19617",
            storageBucket: "stelmina-19617.firebasestorage.app",
            messagingSenderId: "828872692313",
            appId: "1:828872692313:web:adc44bf28b54b26279d748",
            measurementId: "G-FQ44LY0Y32"
        };

        // Inițializare Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        // Funcții pentru gestionarea programărilor
        async function addAppointment(clientName, date) {
            try {
                await addDoc(collection(db, "appointments"), {
                    clientName: clientName,
                    date: date,
                    status: 'pending'
                });
                console.log('Programare adăugată cu succes!');
                loadAppointments(); // Reîncarcă programările
            } catch (error) {
                console.error('Eroare la adăugarea programării:', error);
            }
        }

        async function loadAppointments() {
            try {
                const querySnapshot = await getDocs(collection(db, "appointments"));
                const appointmentsList = document.getElementById('appointmentsList');
                appointmentsList.innerHTML = ''; // Golește lista
                querySnapshot.forEach((doc) => {
                    const app = doc.data();
                    const appointmentDiv = document.createElement('div');
                    appointmentDiv.className = 'appointment p-2 bg-[rgba(32,32,64,0.3)] border border-[rgba(100,255,255,0.15)] rounded-lg mb-2';
                    appointmentDiv.innerHTML = `
                        <strong>${app.clientName}</strong> - ${new Date(app.date).toLocaleString()}
                    `;
                    appointmentsList.appendChild(appointmentDiv);
                });
            } catch (error) {
                console.error('Eroare la încărcarea programărilor:', error);
            }
        }

        // Funcții pentru chat și admin
        const chatbox = document.getElementById('chatbox');
        const userInput = document.getElementById('userInput');
        const sendButton = document.getElementById('sendButton');
        const toggleViewBtn = document.getElementById('toggleViewBtn');
        const adminView = document.getElementById('adminView');
        const addAppointmentBtn = document.getElementById('addAppointmentBtn');
        const instructionsInput = document.getElementById('instructionsInput');
        const sendInstructionsBtn = document.getElementById('sendInstructionsBtn');

        let isAdminView = false;

        // Schimbă între client și admin
        toggleViewBtn.addEventListener('click', () => {
            isAdminView = !isAdminView;
            if (isAdminView) {
                chatbox.style.display = 'none';
                adminView.style.display = 'block';
                toggleViewBtn.innerHTML = '<i class="fas fa-comments mr-2"></i> Client';
                loadAppointments(); // Încarcă programările
            } else {
                chatbox.style.display = 'block';
                adminView.style.display = 'none';
                toggleViewBtn.innerHTML = '<i class="fas fa-user-cog mr-2"></i> Admin';
            }
        });

        // Adăugare mesaj în chat
        function addMessage(text, isUser) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
            messageDiv.textContent = text;
            chatbox.appendChild(messageDiv);
            chatbox.scrollTop = chatbox.scrollHeight;
        }

        // Trimite mesaj către API-ul DeepSeek
        async function sendMessage() {
            const prompt = userInput.value.trim();
            if (!prompt) return;

            addMessage(prompt, true);
            userInput.value = '';

            try {
                // Trimite mesajul către API-ul DeepSeek
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt })
                });

                const data = await response.json();
                addMessage(data.reply, false); // Afișează răspunsul chatbotului
            } catch (error) {
                addMessage('⚠️ Eroare de conexiune. Încearcă din nou.', false);
            }
        }

        // Adaugă programare manuală (pentru cosmetician)
        addAppointmentBtn.addEventListener('click', async () => {
            const clientName = prompt("Nume client:");
            if (!clientName) return;

            const date = prompt("Data și ora (ex: 2023-10-15 14:00):");
            if (!date) return;

            await addAppointment(clientName, date);
        });

        // Trimite instrucțiuni către chatbot
        sendInstructionsBtn.addEventListener('click', () => {
            const instructions = instructionsInput.value.trim();
            if (!instructions) return;

            addMessage(`Instrucțiuni primite: ${instructions}`, false);
            instructionsInput.value = '';
        });

        // Evenimente
        sendButton.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        let isTouchingChat = false;
        chatbox.addEventListener('touchstart', () => isTouchingChat = true);
        chatbox.addEventListener('touchend', () => isTouchingChat = false);
        document.addEventListener('touchmove', (e) => {
            if (!isTouchingChat) e.preventDefault();
        }, { passive: false });
    </script>
    <style>
        /* Stilurile tale existente rămân aceleași */
        :root {
            --neon-blue: #64ffff;
            --space-black: #0a0a1a;
            --cyber-purple: #1a1a3a;
        }

        body {
            margin: 0;
            min-height: 100vh;
            background: linear-gradient(45deg, var(--space-black), var(--cyber-purple));
            font-family: 'Segoe UI', sans-serif;
            overflow: hidden;
            touch-action: none;
        }

        #background-canvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
        }

        .chat-container {
            position: fixed;
            top: 20px;
            bottom: 20px;
            left: 20px;
            right: 20px;
            background: rgba(16, 16, 32, 0.9);
            backdrop-filter: blur(15px);
            border-radius: 20px;
            border: 1px solid rgba(100, 255, 255, 0.2);
            box-shadow: 0 0 40px rgba(100, 255, 255, 0.1);
            display: flex;
            flex-direction: column;
            z-index: 1;
        }

        .chat-header {
            padding: 1.5rem;
            border-bottom: 1px solid rgba(100, 255, 255, 0.1);
            background: linear-gradient(90deg, 
                rgba(16, 16, 32, 0.9) 0%,
                rgba(32, 32, 64, 0.9) 100%);
            display: flex;
            align-items: center;
        }

        #chatbox {
            flex: 1;
            padding: 1.5rem;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
        }

        .message {
            max-width: 85%;
            margin: 12px 0;
            padding: 1rem;
            border-radius: 15px;
            animation: messagePop 0.3s ease-out;
            position: relative;
            backdrop-filter: blur(5px);
        }

        .message.bot {
            background: linear-gradient(45deg,
                rgba(32, 32, 64, 0.3),
                rgba(16, 16, 32, 0.2));
            border: 1px solid rgba(100, 255, 255, 0.15);
            color: #e0e0ff;
        }

        .message.user {
            background: linear-gradient(45deg,
                rgba(100, 150, 255, 0.15),
                rgba(100, 200, 255, 0.1));
            border: 1px solid rgba(100, 255, 255, 0.2);
            margin-left: auto;
            color: #c8ffff;
        }

        @keyframes messagePop {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
        }

        .input-area {
            padding: 1.5rem;
            border-top: 1px solid rgba(100, 255, 255, 0.1);
            display: flex;
            gap: 12px;
        }

        #userInput {
            flex: 1;
            background: rgba(8, 8, 16, 0.6);
            border: 1px solid rgba(100, 255, 255, 0.2);
            color: var(--neon-blue);
            padding: 1rem;
            border-radius: 12px;
            font-size: 16px;
        }

        #sendButton {
            background: linear-gradient(135deg, 
                var(--neon-blue) 0%, 
                #3264ff 100%);
            border: none;
            padding: 12px 24px;
            border-radius: 12px;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        #sendButton:hover {
            transform: scale(1.05);
            box-shadow: 0 0 20px rgba(100, 255, 255, 0.3);
        }

        #chatbox::-webkit-scrollbar {
            width: 6px;
        }

        #chatbox::-webkit-scrollbar-thumb {
            background: rgba(100, 255, 255, 0.3);
            border-radius: 3px;
        }

        #adminView {
            display: none;
            padding: 1.5rem;
        }

        #adminView h2 {
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--neon-blue);
            margin-bottom: 1rem;
        }

        #appointmentsList {
            margin-top: 1rem;
        }

        .appointment {
            background: rgba(32, 32, 64, 0.3);
            border: 1px solid rgba(100, 255, 255, 0.15);
            border-radius: 12px;
            padding: 1rem;
            margin-bottom: 0.5rem;
            color: #e0e0ff;
        }

        textarea {
            width: 100%;
            background: rgba(8, 8, 16, 0.6);
            border: 1px solid rgba(100, 255, 255, 0.2);
            color: var(--neon-blue);
            padding: 1rem;
            border-radius: 12px;
            margin-top: 1rem;
        }
    </style>
</head>
<body>
    <canvas id="background-canvas"></canvas>

    <div class="chat-container">
        <!-- Header -->
        <div class="chat-header">
            <h1 class="text-2xl font-bold text-[#64ffff]">
                <i class="fas fa-robot mr-2"></i>
                Stelmina
            </h1>
            <button id="toggleViewBtn" class="ml-auto bg-[#3264ff] text-white px-4 py-2 rounded-lg">
                <i class="fas fa-user-cog mr-2"></i> Admin
            </button>
        </div>

        <!-- Zona de chat pentru client -->
        <div id="chatbox">
            <div class="message bot">Bună! Sunt asistentul virtual al salonului Stelmina. Te ajut cu o programare? 🌟</div>
        </div>

        <!-- Zona de admin -->
        <div id="adminView">
            <h2>Gestionare Programări</h2>
            <button id="addAppointmentBtn" class="bg-[#3264ff] text-white px-4 py-2 rounded-lg">
                <i class="fas fa-plus mr-2"></i> Adaugă Programare
            </button>
            <div id="appointmentsList"></div>
            <textarea id="instructionsInput" placeholder="Scrie instrucțiuni pentru chatbot..."></textarea>
            <button id="sendInstructionsBtn" class="bg-[#3264ff] text-white px-4 py-2 rounded-lg mt-2">
                <i class="fas fa-paper-plane mr-2"></i> Trimite Instrucțiuni
            </button>
        </div>

        <!-- Input pentru mesaje -->
        <div class="input-area">
            <input type="text" id="userInput" placeholder="Scrie mesajul tău...">
            <button id="sendButton">
                <i class="fas fa-paper-plane"></i>
            </button>
        </div>
    </div>
</body>
</html>
