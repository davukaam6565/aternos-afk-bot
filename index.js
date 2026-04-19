const mineflayer = require('mineflayer');
const http = require('http');
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- 1. YAPAY ZEKA AYARI ---
const genAI = new GoogleGenerativeAI("AizAsyA8UVrm1xZmIZBiesQEsKLX9xiZDepsFz0"); // API Anahtarın burada
const aiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// --- 2. WEB SUNUCUSU VE PANEL TETİKLEYİCİ ---
const PORT = process.env.PORT || 8080;
const MY_URL = 'https://aternos-afk-bot-me33.onrender.com';
const PANEL_URL = 'https://magmanode.com/server?id=945572';

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('AFK_BOT: AKILLI ZEKA VE MAGMANODE KORUMASI AKTIF! 🔥🤖');
}).listen(PORT);

// MagmaNode Paneli tetikleme döngüsü (5 dakikada bir)
setInterval(async () => {
    try {
        await axios.get(MY_URL);
        await axios.get(PANEL_URL, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        console.log("Panel tetiklendi ve Render uyanık tutuldu.");
    } catch (e) {
        console.log("Panel tetikleme hatası (önemsiz)");
    }
}, 300000);

// --- 3. BOT AYARLARI ---
const botArgs = {
    host: 'gold.magmanode.com',
    port: 34688,
    username: 'afk_bot',
    version: '1.21.11',
    checkTimeoutInterval: 90000 // KEEPALIVE HATASINI ÖNLEYEN KRİTİK AYAR (90 Saniye)
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

        // Botun adı geçerse veya bot kelimesi geçerse devreye girer
        if (msg.includes(botName) || msg.includes('bot')) {
            try {
                const prompt = `Sen Minecraft'ta bir AFK botusun. Adın ${bot.username}. Samimi, hafif atarlı ama kafa dengi bir mahalle abisi gibi konuş. Argo kullanma ama "aslanım", "kardeşim", "ayık ol" gibi kelimeler kullanabilirsin. Cevapların kısa olsun. Kullanıcı "${username}" sana şunu dedi: "${message}"`;

                const result = await aiModel.generateContent(prompt);
                const response = await result.response;
                const text = response.text();

                // Minecraft mesaj sınırı 256'dır
                bot.chat(text.substring(0, 250));
            } catch (error) {
                console.log("AI Hatası:", error);
                bot.chat(`Valla kafam yandı ${username}, birazdan konuşalım mı?`);
            }
        }
    });

    // --- 5. HAREKET VE SUNUCUYU UYANIK TUTMA SİSTEMİ ---
    setInterval(() => {
        if (bot && bot.entity) {
            // Rastgele bakış
            bot.look(Math.random() * Math.PI * 2, (Math.random() - 0.5) * Math.PI);
            
            // Kol sallama (Aktiflik sinyali)
            bot.swingArm('right');

            // Envanter slot değiştirme (Paket trafiği sağlar)
            const randomSlot = Math.floor(Math.random() * 9);
            bot.setQuickBarSlot(randomSlot);

            // Zıplama veya Eğilme (Aktivite)
            const r = Math.random();
            if (r < 0.2) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
            } else if (r < 0.4) {
                bot.setControlState('sneak', true);
                setTimeout(() => bot.setControlState('sneak', false), 500);
            }
        }
    }, 12000); // 12 saniyede bir işlem yapar

    // --- 6. HATA VE BAĞLANTI YÖNETİMİ ---
    bot.on('error', (err) => console.log("[SİSTEM HATASI] " + err.message));

    bot.on('end', () => {
        console.log("Bağlantı koptu, 10 saniye sonra tekrar giriyorum...");
        setTimeout(createBot, 10000); // 10 saniye bekleyip tekrar bağlanır
    });

    bot.on('kicked', (reason) => {
        console.log("SUNUCUDAN ATILDIK! SEBEP: " + reason);
    });
}

// Botu başlat
createBot();
