const mineflayer = require('mineflayer');
const http = require('http');
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- 1. YAPAY ZEKA AYARI ---
const genAI = new GoogleGenerativeAI("AiZaSyAxaOBkWsDhVKvWQbJDmGqKR153Kv1_bdM");
const aiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// --- 2. WEB SUNUCUSU VE KEEP-ALIVE ---
const PORT = process.env.PORT || 10000;
const MY_URL = 'https://aternos-afk-bot-me33.onrender.com/';

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('AFK_BOT: EĞİLME VE ZIPLAMA MODU AKTİF! 🔥');
}).listen(PORT);

setInterval(async () => {
    try {
        await axios.get(MY_URL);
    } catch (e) {
        console.log("Keep-alive hatası: " + e.message);
    }
}, 300000); 

// --- 3. BOT AYARLARI (HOST DÜZELTİLDİ) ---
const botArgs = {
    host: 'gold.magmanode.com', // Sayısal IP olarak sabitlendi
    port: 34688,
    username: 'afk_bot',
    version: '1.21.11',
    checkTimeoutInterval: 60000
};

let bot;

function createBot() {
    bot = mineflayer.createBot(botArgs);

    bot.on('login', () => {
        console.log(">>> BOT SUNUCUYA GİRİŞ YAPTI <<<");
    });

    bot.on('spawn', () => {
        setTimeout(() => {
            bot.chat('/register Sifre123 Sifre123');
            bot.chat('/login Sifre123');
        }, 10000);
    });

    // --- 4. HAREKET SİSTEMİ (EĞİLME VE ZIPLAMA EKLENDİ) ---
    // Paket aşımı yapmaması için 30 saniyede bir rastgele hareket yapar
    setInterval(() => {
        if (bot && bot.entity) {
            const r = Math.random();
            
            if (r < 0.33) {
                // ZIPLAMA
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
                console.log("Bot zıpladı.");
            } else if (r < 0.66) {
                // EĞİLME (SNEAK)
                bot.setControlState('sneak', true);
                setTimeout(() => bot.setControlState('sneak', false), 2000); // 2 saniye eğik kalır
                console.log("Bot eğildi.");
            } else {
                // ETRAFA BAKMA
                const yaw = (Math.random() - 0.5) * 2 * Math.PI;
                bot.look(yaw, 0, false);
                console.log("Bot etrafa baktı.");
            }
        }
    }, 30000); // 30 saniye aralık paket hatasını önler

    // --- 5. SOHBET VE HATA YÖNETİMİ ---
    bot.on('chat', async (username, message) => {
        if (username === bot.username) return;
        if (message.toLowerCase().includes('bot')) {
            try {
                const prompt = `Minecraft oyuncusu gibi kısa cevap ver: ${message}`;
                const result = await aiModel.generateContent(prompt);
                bot.chat(result.response.text().substring(0, 100));
            } catch (err) { console.log("AI Hatası"); }
        }
    });

    bot.on('error', (err) => console.log("Hata: " + err.message));
    bot.on('end', () => setTimeout(createBot, 15000));
    bot.on('kicked', (reason) => console.log("Atıldık: " + reason));
}

createBot();
