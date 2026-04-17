const mineflayer = require('mineflayer');
const http = require('http');
const axios = require('axios');

// --- 1. KENDİ KENDİNE UYANDIRMA SİSTEMİ (SELF-PING) ---
const PORT = process.env.PORT || 8080;
const MY_URL = `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`;

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot 7/24 Aktif ve Uyanik!');
});

server.listen(PORT, () => {
    console.log(`Web sunucusu ${PORT} portunda açıldı.`);
    
    // Render'ın uyumasını engellemek için her 5 dakikada bir kendine ping atar
    setInterval(async () => {
        try {
            if (process.env.RENDER_EXTERNAL_HOSTNAME) {
                await axios.get(MY_URL);
                console.log('Bot kendi sitesini uyandirdi (Self-ping başarılı).');
            }
        } catch (err) {
            console.log('Self-ping hatası: Henüz site tamamen açılmamış olabilir.');
        }
    }, 300000); // 300,000 ms = 5 dakika
});

// --- 2. MINECRAFT BOT AYARLARI ---
const botArgs = {
    host: 'sodasmp.funserver.top', // Örn: sunucu.magmanode.com
    port: 34688,                     // Eğer farklı bir portun varsa değiştir
    username: 'afk_bot',      // Botun oyundaki adı
    version: "1.21.11",                  // Otomatik versiyon tespiti
};

let bot;

function createBot() {
    bot = mineflayer.createBot(botArgs);

    bot.on('login', () => {
        console.log("Minecraft sunucusuna giriş yapıldı!");
    });

    bot.on('spawn', () => {
        console.log("Bot oyunda, hareket döngüsü aktif.");
        // Anti-AFK: 20 saniyede bir rastgele zıplama ve bakış
        setInterval(() => {
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 500);
            bot.look(Math.random() * Math.PI * 2, 0);
        }, 20000);
    });

    // Bağlantı koparsa (sunucu restart atarsa vb.) 5 sn sonra tekrar dener
    bot.on('end', () => {
        console.log("Bağlantı koptu, 5 saniye içinde tekrar bağlanılıyor...");
        setTimeout(createBot, 5000);
    });

    bot.on('error', (err) => console.log("Hata:", err));
}

createBot();
