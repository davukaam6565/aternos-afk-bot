const mineflayer = require('mineflayer');
const http = require('http');
const axios = require('axios');
const puppeteer = require('puppeteer');

// --- 1. WEB SUNUCU VE KENDİ KENDİNE UYANDIRMA ---
const PORT = process.env.PORT || 8080;
const MY_URL = `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`;

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Sistem 7/24 Aktif: Bot ve Panel Koruyucu Calisiyor!');
});

server.listen(PORT, () => {
    console.log(`[BİLGİ] Sunucu ${PORT} portunda acildi.`);
});

setInterval(async () => {
    try {
        if (process.env.RENDER_EXTERNAL_HOSTNAME) {
            await axios.get(MY_URL);
            console.log('[SİSTEM] Bot kendi sitesini uyandirdi (Keep-Alive).');
        }
    } catch (err) {
        console.log('[HATA] Self-ping hatasi.');
    }
}, 300000);

// --- 2. MAGMANODE PANEL KORUYUCU (PUPPETEER GİRİŞLİ) ---
async function paneliAcikTut() {
    try {
        console.log("[SİSTEM] MagmaNode giriş sayfasına gidiliyor...");
        const browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        // Giriş Yapma İşlemi
        await page.goto('https://panel.magmanode.com/auth/login', { waitUntil: 'networkidle2' });
        await page.type('input[name="usermail"]', 'davukadma9889'); 
        await page.type('input[name="password"]', 'btniwcje'); 
        await page.click('button[type="submit"]');
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
        
        console.log("[BAŞARILI] MagmaNode Girişi Yapıldı!");

        // Gönderdiğin ID'li Panel Linkine Git
        await page.goto('https://magmanode.com/server?id=945571', { waitUntil: 'networkidle2' });
        console.log("[SİSTEM] Panel izleme moduna geçildi.");

        // 5 dakikada bir sayfayı tazeler ki oturum kapanmasın
        setInterval(async () => {
            try {
                await page.reload({ waitUntil: 'networkidle2' });
                console.log("[GÜNCELLEME] Panel tazelendi, aktiflik korunuyor.");
            } catch (err) {
                console.log("[HATA] Panel tazelenemedi.");
            }
        }, 300000);

    } catch (e) {
        console.log("[HATA] Tarayıcı sisteminde hata oluştu: " + e);
    }
}
paneliAcikTut();

// --- 3. MINECRAFT BOT AYARLARI ---
const botArgs = {
    host: 'gold.magmanode.com',
    port: 34688,
    username: 'afk_bot',
    version: '1.21.1'
};

const sakaMesajlari = [
    "Ben buralarin bekçisiyim, MagmaNode gelse ayiramaz bizi! 😎",
    "Ziplaya ziplaya bacak kasi yaptim, yakinda boksör olcam. 🥊",
    "Admin duy sesimi, maaşima zam işime son istiyorum! 😂",
    "Dorukkoper kankam nerede ya, o olmayinca buralar çok issiz... 🌵",
    "Sikinti yok knk, sunucu bana emanet. Siz keyfinize bakin.",
    "Lag mi var yoksa bana mi öyle geliyor? Neyse ziplamaya devam.",
    "Dorukkoper ile boks maçimiz ne zaman? Sabirsizlikla bekliyorum. 🥊",
    "Bot dediler, bağirlarına bastilar... Ben sadece bir görev adamiyim. 🫡"
];

let bot;

function createBot() {
    bot = mineflayer.createBot(botArgs);

    bot.on('login', () => console.log("[MİNEFRAYER] Minecraft'a giriş yapildi!"));
    
    bot.on('spawn', () => {
        console.log("[MİNEFRAYER] Bot oyunda, sistemler aktif.");
        
        // Kayıt ve Giriş
        setTimeout(() => {
            bot.chat('/register Sifre123 Sifre123');
            bot.chat('/login Sifre123');
        }, 2000);

        // Rastgele Hareket ve Zıplama (15 sn)
        setInterval(() => {
            if (bot && bot.entity) {
                const yaw = Math.random() * Math.PI * 2;
                const pitch = (Math.random() - 0.5) * Math.PI;
                bot.look(yaw, pitch);
                bot.setControlState('jump', true);
                setTimeout(() => { if(bot.entity) bot.setControlState('jump', false); }, 500);
            }
        }, 15000);
    });

    // 10 Dakikada Bir Rastgele Şaka
    setInterval(() => {
        if (bot && bot.entity) {
            const mesaj = sakaMesajlari[Math.floor(Math.random() * sakaMesajlari.length)];
            bot.chat(mesaj);
            console.log(`[MESAJ] 10 dk doldu, şaka yapildi: ${mesaj}`);
        }
    }, 600000);

    // --- SUNUCU KAPANIRSA 1 DAKİKA PUSUDA BEKLE ---
    bot.on('end', () => {
        console.log('[BİLGİ] Sunucu kapali veya koptu. 1 dakika pusuda bekleyip tekrar dalıyorum...');
        setTimeout(createBot, 60000); // 1 Dakika (60.000 ms)
    });

    bot.on('error', (err) => console.log("[HATA] Bot hatasi:", err));
}

createBot();
