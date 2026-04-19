const mineflayer = require('mineflayer');
const http = require('http');
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- 1. YAPAY ZEKA AYARI (SENİN KEYİN EKLENDİ) ---
const genAI = new GoogleGenerativeAI("AIzaSyA8UVrm1xZmIZBiesQESkLX9xiZDepsFz0");
const aiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// --- 2. WEB SUNUCUSU VE PANEL TETİKLEYİCİ ---
const PORT = process.env.PORT || 8080;
const MY_URL = 'https://aternos-afk-bot-me33.onrender.com';
const PANEL_URL = 'https://magmanode.com/server?id=945572';

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('AFK_BOT: AKILLI ZEKA VE MAGMANODE KORUMASI AKTİF! 🧠🔥');
}).listen(PORT);

// MagmaNode Panelini tetikleme döngüsü
setInterval(async () => {
    try {
        await axios.get(MY_URL);
        await axios.get(PANEL_URL, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
    } catch (e) {
        console.log("Panel tetikleme hatası (önemsiz)");
    }
}, 300000);

// --- 3. BOT AYARLARI ---
const botArgs = {
    host: 'gold.magmanode.com',
    port: 34688,
    username: 'afk_bot',
    version: '1.21.1'
};

let bot;

function createBot() {
    bot = mineflayer.createBot(botArgs);

    bot.on('login', () => {
        console.log(">>> BAŞARILI: AFK_BOT MEKANDA VE AKILLI! <<<");
    });

    bot.on('spawn', () => {
        // Giriş yapma komutları
        setTimeout(() => {
            bot.chat('/register Sifre123 Sifre123');
            bot.chat('/login Sifre123');
        }, 5000);
    });

    // --- 4. AKILLI YAPAY ZEKA SOHBET SİSTEMİ ---
    bot.on('chat', async (username, message) => {
        if (username === bot.username) return;

        const msg = message.toLowerCase();
        const botName = bot.username.toLowerCase();

        // Birisi botun adını söylerse veya bota seslenirse devreye girer
        if (msg.includes(botName) || msg.includes('bot')) {
            try {
                // Yapay zekaya kimlik tanımlıyoruz
                const prompt = `Sen Minecraft'ta bir AFK botusun. Adın ${bot.username}. 
                                Samimi, hafif atarlı ama çok kafa dengi bir mahalle abisi gibi konuş. 
                                Argo kullanma ama "aslanım", "kardeşim", "ayık ol" gibi samimi kelimeler kullanabilirsin. 
                                Cevapların kısa, net ve mantıklı olsun. 
                                Kullanıcı "${username}" sana şunu dedi: "${message}"`;

                const result = await aiModel.generateContent(prompt);
                const response = await result.response;
                const text = response.text();

                // Minecraft'ta mesaj sınırı 256'dır, o yüzden kesiyoruz
                bot.chat(text.substring(0, 250));
            } catch (error) {
                console.log("AI Hatası:", error);
                bot.chat(`Valla kafam yandı ${username}, sonra konuşalım mı?`);
            }
        }
    });

    // --- 5. HAREKET VE SUNUCUYU UYANIK TUTMA SİSTEMİ ---
    // Bu kısım yürümeden veri trafiği oluşturur, hile korumasına takılmaz.
    setInterval(() => {
        if (bot && bot.entity) {
            // Rastgele hafif bakış
            bot.look(Math.random() * Math.PI * 2, (Math.random() - 0.5) * Math.PI);
            
            // Kol sallama (Swing Arm) - Sunucuya aktiflik sinyali gönderir
            bot.swingArm('right');

            // Envanterde slot değiştirme (Packet trafiği sağlar)
            const randomSlot = Math.floor(Math.random() * 9);
            bot.setQuickBarSlot(randomSlot);

            // Ara sıra zıplama veya eğilme
            const r = Math.random();
            if (r < 0.2) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
            } else if (r < 0.4) {
                bot.setControlState('sneak', true);
                setTimeout(() => bot.setControlState('sneak', false), 500);
            }
        }
    }, 12000); // 12 saniyede bir yapar (MagmaNode için ideal)

    // --- HATA YÖNETİMİ ---
    bot.on('error', (err) => console.log("[SİSTEM HATASI] " + err.message));
    
    bot.on('end', () => {
        console.log("Bağlantı koptu, 15 saniye sonra tekrar giriyorum...");
        setTimeout(createBot, 15000);
    });

    bot.on('kicked', (reason) => {
        console.log("SUNUCUDAN ATILDIK! SEBEP: " + reason);
    });
}

// Botu başlat
createBot();
