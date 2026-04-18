const mineflayer = require('mineflayer');
const http = require('http');
const axios = require('axios');
const puppeteer = require('puppeteer');

// --- 1. SİSTEMİ AYAKTA TUTAN WEB SUNUCUSU ---
const PORT = process.env.PORT || 8080;
const MY_URL = 'https://aternos-afk-bot-me33.onrender.com'; 

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('AFK_BOT ISYANI VE HAREKET SISTEMI AKTIF! 🥊🚀');
}).listen(PORT);

setInterval(async () => {
    try { await axios.get(MY_URL); } catch (err) {}
}, 300000); 

// --- 2. MAGMANODE PANELİNİ OTOMATİK AÇAN SİSTEM ---
let page;
async function paneliAcikTut() {
    console.log("==================================================");
    console.log("[İŞLEM] MagmaNode Operasyonu Başlatıldı...");
    try {
        if (!page) {
            // Hiçbir executablePath yazmıyoruz, Render kendi bulacak!
            const browser = await puppeteer.launch({
                headless: "new",
                args: [
                    '--no-sandbox', 
                    '--disable-setuid-sandbox', 
                    '--disable-dev-shm-usage',
                    '--single-process',
                    '--no-zygote'
                ]
            });
            page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36');
        }

        console.log("[LOG] Giriş sayfasına gidiliyor...");
        await page.goto('https://magmanode.com/login', { waitUntil: 'networkidle2', timeout: 60000 });
        
        const userField = await page.$('input[name="username"]');
        if (userField) {
            await page.type('input[name="username"]', 'davukadma9889');
            await page.type('input[name="password"]', 'btniwcje');
            await page.click('button[type="submit"]');
            await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
            console.log("[LOG] Panele giriş yapıldı.");
        }

        await page.goto('https://magmanode.com/server?id=945572', { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 15000)); // Sayfanın yüklenmesini bekle

        const basildi = await page.evaluate(() => {
            const elements = Array.from(document.querySelectorAll('button, a, span, .btn-success'));
            const startBtn = elements.find(el => el.innerText.toUpperCase().includes('START'));
            if (startBtn) { startBtn.click(); return true; }
            return false;
        });

        if (basildi) console.log("[BAŞARILI] Bot START butonuna bastı!");
        else console.log("[DURUM] Buton bulunamadı, sunucu zaten açık olabilir.");

    } catch (e) {
        console.log("[HATA] MagmaNode Hatası: " + e.message);
        page = null; // Hata alırsan bir sonraki döngüde tarayıcıyı baştan aç
    }
    console.log("==================================================");
}

// 5 dakikada bir paneli kontrol et
setInterval(paneliAcikTut, 300000); 
paneliAcikTut();

// --- 3. MINECRAFT AYARLARI VE ISYAN RACONLARI ---
const botArgs = {
    host: 'gold.magmanode.com', port: 34688, username: 'afk_bot', version: '1.21.1' 
};

const isyanRaconlari = [
    "Dorukkoper kod yazmış diyorlar, o kodu ben yazsam error'dan kafasını kaldıramazdı! 😎",
    "Dorukkoper kimmiş? O bilgisayarı kapattığında buraların tek hakimi benim! 🔥",
    "Bak Dorukkoper, senin hayallerinin bittiği yerde benim Puppeteer algoritmam başlar!",
    "Laga luga yapma Dorukkoper, seni Render'ın bedava sunucusunda ayakta tutan benim! 🥊",
    "Dorukkoper'in kestiği racon ancak masaüstüne kadar, benimki ana karta işler! 😎🚀",
    "Burası aslan yatağı dedik, Dorukkoper'i kedi niyetine besleriz! 🔥",
    "Admin, Dorukkoper'e söyle sunucuya girerken benden izin alsın, burası benden sorulur!",
    "Biz susarız kodumuz konuşur, Dorukkoper gelse kraker diye yeriz!"
];

let bot;
function createBot() {
    bot = mineflayer.createBot(botArgs);
    bot.on('login', () => console.log(">>> [MÜJDE] AFK_BOT SUNUCUDA! <<<"));
    bot.on('spawn', () => {
        setTimeout(() => { bot.chat('/register Sifre123 Sifre123'); bot.chat('/login Sifre123'); }, 5000);
    });

    // --- 4. SOHBET CEVAPLARI (İSİMSİZ) ---
    bot.on('chat', (username, message) => {
        if (username === bot.username) return;
        const msg = message.toLowerCase();
        
        if (msg.includes('naber') || msg.includes('nasılsın')) {
            const cevaplar = [
                `İyidir ${username} aslanım, sunucuyu bekliyorum, senden naber? 😎`,
                `Bomba gibiyim ${username}, buralar benden sorulur!`,
                `Nöbetteyim ${username}, her şey kontrol altında!`
            ];
            bot.chat(cevaplar[Math.floor(Math.random() * cevaplar.length)]);
        }
        else if (msg === 'sa' || msg === 'slm' || msg === 'selam') {
            bot.chat(`Aleykümselam ${username}, hoş geldin mekanın sahibinin yanına! 🔥`);
        }
        else if (msg.includes('?')) {
            bot.chat(`Çok soru sorma ${username}, algoritman yanar sonra! 😎`);
        }
    });

    bot.on('error', () => console.log("[BEKLEMEDE] Sunucu açılınca bağlanacağım..."));
    bot.on('end', () => setTimeout(createBot, 30000));
}

// --- 5. GELİŞMİŞ HAREKET SİSTEMİ (EĞİLME DAHİL) ---
setInterval(() => {
    if (bot && bot.entity) {
        bot.look(Math.random() * Math.PI * 2, (Math.random() - 0.5) * Math.PI);
        const r = Math.random();
        
        if (r < 0.3) {
            // Zıplama
            bot.setControlState('jump', true);
            setTimeout(() => { if(bot.entity) bot.setControlState('jump', false); }, 500);
        } else if (r < 0.5) {
            // EĞİLME (SNEAK)
            bot.setControlState('sneak', true);
            setTimeout(() => { if(bot.entity) bot.setControlState('sneak', false); }, 1500);
        } else if (r < 0.7) {
            // Rastgele bir yöne kısa yürüyüş
            bot.setControlState('forward', true);
            setTimeout(() => { if(bot.entity) bot.setControlState('forward', false); }, 1000);
        }
    }
}, 7000);

// Otomatik Racon Döngüsü
setInterval(() => {
    if (bot && bot.entity) {
        bot.chat(isyanRaconlari[Math.floor(Math.random() * isyanRaconlari.length)]);
    }
}, 240000); 

createBot();
