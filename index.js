const mineflayer = require('mineflayer');
const http = require('http');
const axios = require('axios');
const puppeteer = require('puppeteer');

// --- 1. WEB SUNUCUSU (Sistem Ayakta Kalsın Diye) ---
const PORT = process.env.PORT || 8080;
const MY_URL = 'https://aternos-afk-bot-me33.onrender.com'; 

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('DORUKKOPER KORUMALI AFK_BOT SISTEMI AKTIF! 🥊🚀');
}).listen(PORT);

setInterval(async () => {
    try { await axios.get(MY_URL); console.log('[SİSTEM] Aktiflik sinyali gönderildi.'); } catch (err) {}
}, 300000); 

// --- 2. PANEL KONTROLÜ (Chrome Hatasını Çözen Sade Versiyon) ---
let page;
async function paneliAcikTut() {
    console.log("==================================================");
    console.log("[İŞLEM] MagmaNode Operasyonu Başlatıldı...");
    try {
        if (!page) {
            const browser = await puppeteer.launch({
                headless: "new",
                args: [
                    '--no-sandbox', 
                    '--disable-setuid-sandbox', 
                    '--disable-dev-shm-usage',
                    '--single-process'
                ]
            });
            page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36');
        }

        console.log("[LOG] MagmaNode girişine gidiliyor...");
        await page.goto('https://magmanode.com/login', { waitUntil: 'networkidle2', timeout: 60000 });
        
        const userField = await page.$('input[name="username"]');
        if (userField) {
            await page.type('input[name="username"]', 'davukadma9889');
            await page.type('input[name="password"]', 'btniwcje');
            await page.click('button[type="submit"]');
            await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
            console.log("[LOG] Giriş başarılı.");
        }

        await page.goto('https://magmanode.com/server?id=945572', { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 12000)); 

        const basildi = await page.evaluate(() => {
            const elements = Array.from(document.querySelectorAll('button, a, span, .btn-success'));
            const startBtn = elements.find(el => el.innerText.toUpperCase().includes('START'));
            if (startBtn) { startBtn.click(); return true; }
            return false;
        });

        if (basildi) console.log("[BAŞARILI] START butonuna basıldı!");
        else console.log("[DURUM] Buton bulunamadı, sunucu zaten açık olabilir.");

    } catch (e) {
        console.log("[HATA] Panel hatası: " + e.message);
        page = null;
    }
    console.log("==================================================");
}

setInterval(paneliAcikTut, 300000); 
paneliAcikTut();

// --- 3. MINECRAFT AYARLARI & DEV RACON LİSTESİ ---
const botArgs = {
    host: 'gold.magmanode.com',
    port: 34688,
    username: 'afk_bot',
    version: '1.21.11'
};

const devRaconListesi = [
    "Dorukkoper kardeş, senin kestiğin racon Minecraft sınırına kadar. Benim raconum GitHub'da başlar! 😎",
    "Sen sunucuda AFK kalırsın, ben sistemi ayakta tutarım. Kral sensen tacı tasarlayan benim! 🔥",
    "Mekanın sahibi gelmiş diyorsun ama kapıyı açan el benim Puppeteer'ım! Hafız!",
    "Bak Dorukkoper, senin zıpladığın kadar benim işlemişliğim var. Gardını al!",
    "afk_bot geldi, şimdi herkes sessizce dağılsın. Dorukkoper buradayken kimseden ses çıkmaz! 😎",
    "Bana bak admin, Dorukkoper'e yanlış yapanın IP'sini düğüm yaparım! 🥊",
    "Laga luga yapmayın beyler, afk_bot burada 7/24 bekçidir. 🔥",
    "Zıplaya zıplaya bacak kası yaptım, yakında Survivor'a katılıyorum! 🤣",
    "Bu sunucuda adalet afk_bot'tan sorulur, Dorukkoper de şahidimdir!",
    "MagmaNode reklamları bile beni durduramadı, siz mi durduracaksınız? Güldürmeyin!",
    "Ben bot değilim, ben bir algoritma harikasıyım! Dorukkoper bunu beğendi.",
    "Kimseden korkumuz yok, arkamızda Render önümüzde MagmaNode!",
    "Admin, çay gönder oradan! afk_bot nöbette!",
    "Zıpla zıpla nereye kadar? Biraz da racon keselim dedik.",
    "Sunucu kapanırsa sorumlusu ben değilim, ama açan kesin benim! 😎🚀",
    "Dorukkoper'in koruması altındayız, burada kuralları biz koyarız, başkası anca izler!",
    "Kodumda hata arayanın hayatında hata buluruz, burası MagmaNode değil aslan yatağı!"
];

let bot;
function createBot() {
    console.log("[BOT] Sunucuya bağlanılıyor...");
    bot = mineflayer.createBot(botArgs);

    bot.on('login', () => console.log(">>> [MÜJDE] AFK_BOT SUNUCUDA! <<<"));
    
    bot.on('spawn', () => {
        setTimeout(() => {
            bot.chat('/register Sifre123 Sifre123');
            bot.chat('/login Sifre123');
        }, 5000);
    });

    // --- 4. GELİŞMİŞ SORU-CEVAP SİSTEMİ ---
    bot.on('chat', (username, message) => {
        if (username === bot.username) return;

        const msg = message.toLowerCase();
        
        if (msg === 'naber' || msg === 'selam' || msg === 'sa') {
            bot.chat(`Aleykümselam ${username} knk! Dorukkoper ile takılıyoruz, sunucu bize emanet!`);
        } 
        else if (msg.includes('kimsin') || msg.includes('nesin')) {
            bot.chat("Ben Dorukkoper'in özel koruması afk_bot'um! MagmaNode'un korkulu rüyasıyım!");
        }
        else if (msg.includes('?') || msg.includes('neden') || msg.includes('nasıl')) {
            bot.chat(`Bak ${username}, çok soru sorma, Dorukkoper'e sorarsan cevabını ağır alırsın! 😎`);
        }
        else if (msg.includes('bot') || msg.includes('afk')) {
            bot.chat("Bana bot diyene bak hele, ben 7/24 uyanığım aslanım!");
        }
    });

    bot.on('error', () => console.log("[BEKLEMEDE] Sunucu kapalı..."));
    bot.on('end', () => setTimeout(createBot, 30000));
}

// --- 5. HAREKET & RACON DÖNGÜSÜ ---
setInterval(() => {
    if (bot && bot.entity) {
        // Rastgele Bakış ve Hareket
        bot.look(Math.random() * Math.PI * 2, (Math.random() - 0.5) * Math.PI);
        
        const r = Math.random();
        if (r < 0.4) {
            bot.setControlState('jump', true);
            setTimeout(() => { if(bot.entity) bot.setControlState('jump', false); }, 500);
        } else if (r < 0.6) {
            bot.setControlState('sneak', true);
            setTimeout(() => { if(bot.entity) bot.setControlState('sneak', false); }, 1000);
        }
    }
}, 7000);

// Uzun Mesaj Döngüsü (4 Dakikada Bir)
setInterval(() => {
    if (bot && bot.entity) {
        bot.chat(devRaconListesi[Math.floor(Math.random() * devRaconListesi.length)]);
    }
}, 240000); 

createBot();
