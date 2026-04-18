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
});

setInterval(async () => {
    try {
        if (process.env.RENDER_EXTERNAL_HOSTNAME) {
            await axios.get(MY_URL);
            console.log('Bot kendi sitesini uyandirdi.');
        }
    } catch (err) {
        console.log('Self-ping hatasi.');
    }
}, 300000);

// --- 2. MINECRAFT BOT AYARLARI ---
const botArgs = {
    host: 'gold.magmanode.com', // Yeni IP Adresin
    port: 34688,                // Portun (Eğer port değiştiyse buradan güncelle)
    username: 'afk_bot',
    version: '1.21.11',
};

let bot;

function createBot() {
    bot = mineflayer.createBot(botArgs);

    bot.on('login', () => {
        console.log("Minecraft sunucusuna giriş yapıldı!");
    });

    bot.on('spawn', () => {
        console.log("Bot oyunda, hareket döngüsü ve giriş sistemi aktif.");
        
        // Giriş ve Kayıt Komutu
        setTimeout(() => {
            bot.chat('/register Sifre123 Sifre123');
            bot.chat('/login Sifre123');
        }, 2000); 

        // Gelişmiş Hareket Döngüsü (Zıplama, Eğilme, Bakma)
        setInterval(() => {
            // 1. Rastgele Bakış
            const yaw = Math.random() * Math.PI * 2;
            const pitch = (Math.random() - 0.5) * Math.PI;
            bot.look(yaw, pitch);

            // 2. Rastgele Zıplama
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 500);

            // 3. Rastgele Eğilme (Sneak/Shift)
            setTimeout(() => {
                bot.setControlState('sneak', true);
                setTimeout(() => bot.setControlState('sneak', false), 1000);
            }, 2000);

        }, 15000); // Her 15 saniyede bir hareket eder
    });

    bot.on('end', () => {
        console.log("Bağlantı koptu, tekrar bağlanılıyor...");
        setTimeout(createBot, 5000);
    });
    const sakaMesajlari = [
        "Ben buraların bekçisiyim, MagmaNode gelse ayıramaz bizi! 😎",
        "Zıplaya zıplaya bacak kası yaptım, yakında boksör olcam. 🥊",
        "Admin duy sesimi, maaşıma zam işime son istiyorum! 😂",
        "Dorukkoper kankam nerede ya, o olmayınca buralar çok ıssız... 🌵",
        "Beni burada unutup gitmeyin ha, gece korkuyorum... 👻",
        "Sıkıntı yok knk, sunucu bana emanet. Siz keyfinize bakın.",
        "Dorukkoper gelirse söyleyin, ona bir çift lafım var! 😂",
        "Lag mı var yoksa bana mı öyle geliyor? Neyse zıplamaya devam.",
        "Birisi bana elmas versin de şu halimden kurtulayım artık! 💎",
        "Dorukkoper ile boks maçımız ne zaman? Sabırsızlıkla bekliyorum. 🥊",
        "Bot dediler, bağırlarına bastılar... Ben sadece bir görev adamıyım. 🫡"
    ];

    setInterval(() => {
        if (bot && bot.entity) {
            const sakaciMesaj = sakaMesajlari[Math.floor(Math.random() * sakaMesajlari.length)];
            const yaw = Math.random() * Math.PI * 2;
            const pitch = (Math.random() - 0.5) * Math.PI;
            bot.look(yaw, pitch);
            bot.chat(sakaciMesaj);
            console.log(`[MESAJ] 10 dk doldu: ${sakaciMesaj}`);
        }
    }, 600000);

    bot.on('error', (err) => console.log("Hata oluştu:", err));
}

createBot();
