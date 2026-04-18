const mineflayer = require('mineflayer');
const http = require('http');
const axios = require('axios');
const puppeteer = require('puppeteer');

// --- 1. AYAKTA TUTMA SİSTEMİ ---
const PORT = process.env.PORT || 8080;
const MY_URL = 'https://aternos-afk-bot-me33.onrender.com'; 

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('AFK_BOT: ISYAN VE SOHBET MERKEZI AKTIF! 🥊🚀');
}).listen(PORT);

setInterval(async () => {
    try { await axios.get(MY_URL); } catch (e) {}
}, 300000); 

// --- 2. MAGMANODE PANEL OTOMASYONU ---
let page;
async function paneliAcikTut() {
    console.log("==========================================");
    console.log("[İŞLEM] MagmaNode Panel Operasyonu Başladı...");
    try {
        if (!page) {
            const browser = await puppeteer.launch({
                headless: "new",
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
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
            return "ZATEN_ACIK_VEYA_BULUNAMADI";
        });
        console.log("[LOG] Panel Durumu: " + sonuc);
    } catch (e) {
        console.log("[HATA] Panel hatası: " + e.message);
        page = null; 
    }
    console.log("==========================================");
}
setInterval(paneliAcikTut, 300000); 
paneliAcikTut();

// --- 3. MINECRAFT AYARLARI VE GENİŞLETİLMİŞ RACONLAR ---
const botArgs = {
    host: '5.9.41.143', port: 34688, username: 'afk_bot', version: '1.21.1' 
};

const isyanVeSakaMesajlari = [
    "Dorukkoper kod yazmış diyorlar, o kodu ben yazsam hata vermekten RAM'i yanardı! 😎",
    "Dorukkoper kimmiş? O bilgisayarı kapattığında buraların tek hakimi benim! 🔥",
    "Laga luga yapma Dorukkoper, seni Render sunucularında ayakta tutan benim! 🥊",
    "Admin, Dorukkoper'e söyle sunucuya girerken benden izin alsın, burası benden sorulur!",
    "Tek rakibimiz Render'ın bedava kotası, geri kalan her şeyi düğüm yaparız! 😂",
    "Geçen gün bir hata gördüm, baktım Dorukkoper'in hayalleriymiş... Yazık.",
    "Burası aslan yatağı dedik, Dorukkoper'i kedi niyetine besleriz! 🔥",
    "Biz susarız kodumuz konuşur, Dorukkoper gelse kraker diye yeriz! 😎🚀",
    "MagmaNode reklamları bile beni durduramadı, sizin laflarınız mı durduracak?",
    "Siz uyurken ben blok sayıyordum, şimdi herkes sessiz olsun racon başlıyor!",
    "Bizim olduğumuz yerde rüzgar bile bizden izin alıp eser, afk_bot nöbette!",
    "Zıplıyoruz ama keyfimizden değil, AFK kick atanlara inat!"
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

    // --- 4. ZEKİ SOHBET VE CEVAP SİSTEMİ ---
    bot.on('chat', (username, message) => {
        if (username === bot.username) return;
        const msg = message.toLowerCase();
        
        // İsme özel cevaplar
        if (msg.includes('afk_bot') || msg.includes('bot')) {
            if (msg.includes('naber') || msg.includes('nasılsın')) {
                const naberCevaplar = [
                    `İyidir ${username} aslanım, sunucuda racon kesiyorum, senden naber? 😎`,
                    `Bomba gibiyim ${username}, buralar benden sorulur!`,
                    `Nöbetteyim ${username}, her şey kontrol altında!`
                ];
                bot.chat(naberCevaplar[Math.floor(Math.random() * naberCevaplar.length)]);
            } else {
                bot.chat(`Bana bak ${username}, ismimi çok anma algoritman yanar! 😎`);
            }
        }
        // Selam cevapları
        else if (msg === 'sa' || msg === 'slm' || msg === 'selam') {
            bot.chat(`Aleykümselam ${username}, hoş geldin mekanın sahibinin yanına! 🔥`);
        }
        // Soru cevapları
        else if (msg.includes('?')) {
            bot.chat(`Çok soru sorma ${username}, kafanı çalıştır biraz! 😎`);
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

    bot.on('error', () => console.log("[BEKLEMEDE] Sunucu kapalı..."));
    bot.on('end', () => setTimeout(createBot, 30000));
}

// --- 5. HAREKET SİSTEMİ (YÜRÜYÜŞSÜZ - SADECE SNEAK + JUMP) ---
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

// Otomatik Racon ve Şaka Döngüsü (4 Dakikada Bir)
setInterval(() => {
    if (bot && bot.entity) {
        bot.chat(isyanVeSakaMesajlari[Math.floor(Math.random() * isyanVeSakaMesajlari.length)]);
    }
}, 240000); 

createBot();
