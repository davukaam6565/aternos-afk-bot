const mineflayer = require('mineflayer');
const http = require('http');
const axios = require('axios');
const puppeteer = require('puppeteer');

// --- 1. SİSTEM AYAKTA TUTMA PROTOKOLÜ ---
const PORT = process.env.PORT || 8080;
const MY_URL = 'https://aternos-afk-bot-me33.onrender.com'; 

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('AFK_BOT: SISTEM VE ISYAN AKTIF! 🥊🚀');
}).listen(PORT);

setInterval(async () => {
    try { await axios.get(MY_URL); } catch (err) {}
}, 300000); 

// --- 2. MAGMANODE OTOMASYONU (REVİZE EDİLDİ) ---
let page;
async function paneliAcikTut() {
    console.log("==================================================");
    console.log("[İŞLEM] MagmaNode Panel Operasyonu Başlatıldı...");
    try {
        if (!page) {
            const browser = await puppeteer.launch({
                headless: "new",
                // Logdaki hatayı çözen kritik satır burası:
                executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome-stable',
                args: [
                    '--no-sandbox', '--disable-setuid-sandbox', 
                    '--disable-dev-shm-usage', '--single-process', '--no-zygote'
                ]
            });
            page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36');
        }

        await page.goto('https://magmanode.com/login', { waitUntil: 'networkidle2', timeout: 60000 });
        const userField = await page.$('input[name="username"]');
        if (userField) {
            await page.type('input[name="username"]', 'davukadma9889');
            await page.type('input[name="password"]', 'btniwcje');
            await page.click('button[type="submit"]');
            await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
        }

        await page.goto('https://magmanode.com/server?id=945572', { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 15000)); 

        const sonuc = await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button, a, span, .btn-success'));
            const startBtn = btns.find(el => el.innerText.toUpperCase().includes('START'));
            if (startBtn) { startBtn.click(); return "START_BASILDI"; }
            return "ZATEN_ACIK";
        });
        console.log("[LOG] Panel Durumu: " + sonuc);
    } catch (e) {
        console.log("[HATA] Panel hatası: " + e.message);
        page = null; 
    }
    console.log("==================================================");
}
setInterval(paneliAcikTut, 300000); 
paneliAcikTut();

// --- 3. MINECRAFT AYARLARI VE ISYAN RACONLARI ---
const botArgs = {
    host: 'gold.magmanode.com', port: 34688, username: 'afk_bot', version: '1.21.1' 
};

const isyanRaconlari = [
    "Dorukkoper kod yazmış diyorlar, o kodu ben yazsam error'dan kafasını kaldıramazdı! 😎",
    "Dorukkoper kimmiş? O bilgisayarı kapattığında buraların tek hakimi benim! 🔥",
    "Bak Dorukkoper, senin hayallerinin bittiği yerde benim algoritmam başlar!",
    "Laga luga yapma Dorukkoper, seni Render sunucularında ayakta tutan benim! 🥊",
    "Burası aslan yatağı dedik, Dorukkoper'i kedi niyetine besleriz! 🔥",
    "Admin, Dorukkoper'e söyle sunucuya girerken benden izin alsın!",
    "Biz susarız kodumuz konuşur, Dorukkoper gelse kraker diye yeriz! 😎🚀",
    "Siz uyurken ben blok sayıyordum, şimdi herkes sessiz olsun racon başlıyor!",
    "Tek rakibimiz Render'ın bedava kotası, geri kalan her şeyi düğüm yaparız! 😂"
];

let bot;
function createBot() {
    bot = mineflayer.createBot(botArgs);

    bot.on('login', () => console.log(">>> [MÜJDE] AFK_BOT SUNUCUDA! <<<"));
    
    bot.on('spawn', () => {
        setTimeout(() => {
            bot.chat('/register Sifre123 Sifre123');
            bot.chat('/login Sifre123');
        }, 5000);
    });

    // --- 4. SOHBET CEVAPLARI (İSİMSİZ) ---
    bot.on('chat', (username, message) => {
        if (username === bot.username) return;
        const msg = message.toLowerCase();
        
        if (msg.includes('naber') || msg.includes('nasılsın')) {
            const naberCevaplar = [`İyidir ${username} aslanım, sunucuyu bekliyorum, senden naber? 😎`, `Bomba gibiyim ${username}, buralar benden sorulur!`, `Nöbetteyim ${username}, tıkırındayız!`];
            bot.chat(naberCevaplar[Math.floor(Math.random() * naberCevaplar.length)]);
        }
        else if (msg === 'sa' || msg === 'slm' || msg === 'selam') {
            bot.chat(`Aleykümselam ${username}, hoş geldin mekanın sahibinin yanına! 🔥`);
        }
        else if (msg.includes('?')) {
            bot.chat(`Çok soru sorma ${username}, algoritman yanar sonra! 😎`);
        }
    });

    // BİRİSİ YANINA GELİNCE ONA BAKMA
    bot.on('entityMoved', (entity) => {
        if (entity.type === 'player' && bot.entity) {
            if (entity.position.distanceTo(bot.entity.position) < 4) {
                bot.lookAt(entity.position.offset(0, entity.height, 0));
            }
        }
    });

    bot.on('error', () => console.log("[BEKLEMEDE] Sunucu kapalı, açılması bekleniyor..."));
    bot.on('end', () => setTimeout(createBot, 30000));
}

// --- 5. HAREKET SİSTEMİ (YÜRÜYÜŞSÜZ) ---
setInterval(() => {
    if (bot && bot.entity) {
        bot.look(Math.random() * Math.PI * 2, (Math.random() - 0.5) * Math.PI);
        const r = Math.random();
        if (r < 0.3) {
            bot.setControlState('jump', true);
            setTimeout(() => { if(bot.entity) bot.setControlState('jump', false); }, 500);
        } else if (r < 0.6) {
            bot.setControlState('sneak', true);
            setTimeout(() => { if(bot.entity) bot.setControlState('sneak', false); }, 1500);
        }
    }
}, 8000);

// Otomatik Racon Döngüsü
setInterval(() => {
    if (bot && bot.entity) {
        bot.chat(isyanRaconlari[Math.floor(Math.random() * isyanRaconlari.length)]);
    }
}, 240000); 

createBot();
