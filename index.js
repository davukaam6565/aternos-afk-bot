const mineflayer = require('mineflayer');
const http = require('http');
const axios = require('axios');
const puppeteer = require('puppeteer');

// --- 1. WEB SUNUCU VE 7/24 AKTİF TUTMA (SELF-PING) ---
const PORT = process.env.PORT || 8080;
const MY_URL = 'https://aternos-afk-bot-me33.onrender.com'; 

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Sistem Aktif: Dorukkoper Racon Kesmeye Geldi! 🥊🚀');
});

server.listen(PORT, () => {
    console.log("[BİLGİ] Web sunucusu 8080 portunda açıldı.");
});

setInterval(async () => {
    try {
        await axios.get(MY_URL);
        console.log('[SİSTEM] Bot ' + MY_URL + ' adresine ping atarak uyanık kaldı.');
    } catch (err) {
        console.log('[HATA] Self-ping yapılamadı.');
    }
}, 300000); 

// --- 2. MAGMANODE PANEL KORUYUCU (ID: 945572) ---
let page;
async function paneliAcikTut() {
    console.log("--------------------------------------------------");
    console.log("[TARAYICI] MagmaNode kontrolü başlatılıyor...");
    try {
        if (!page) {
            const browser = await puppeteer.launch({
                headless: "new",
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
            });
            page = await browser.newPage();
            await page.setViewport({ width: 1280, height: 720 });
        }

        console.log("[İŞLEM] Giriş sayfasına bağlanılıyor...");
        await page.goto('https://magmanode.com/login', { waitUntil: 'networkidle2', timeout: 60000 });

        const loginCheck = await page.$('input[name="username"]');
        if (loginCheck) {
            console.log("[İŞLEM] Giriş bilgileri giriliyor...");
            await page.type('input[name="username"]', 'davukadma9889', {delay: 50});
            await page.type('input[name="password"]', 'btniwcje', {delay: 50});
            await page.click('button[type="submit"]');
            await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
        }

        console.log("[İŞLEM] Sunucu yönetim sayfasına (945572) gidiliyor...");
        await page.goto('https://magmanode.com/server?id=945572', { waitUntil: 'networkidle2' });
        
        await new Promise(r => setTimeout(r, 8000));

        const elements = await page.$$('button, a, div, span');
        let basildiMi = false;
        for (let el of elements) {
            const text = await page.evaluate(e => e.innerText, el);
            if (text && text.toUpperCase().includes('START')) {
                console.log("[MÜJDE] START BUTONU BULUNDU VE TIKLANDI!");
                await el.click();
                basildiMi = true;
                break;
            }
        }
        if (!basildiMi) console.log("[DURUM] START butonu görünmüyor, sunucu muhtemelen açık.");

    } catch (e) {
        console.log("[HATA] Panel hatası: " + e.message);
        page = null;
    }
    console.log("--------------------------------------------------");
}

setInterval(paneliAcikTut, 300000);
paneliAcikTut();

// --- 3. MINECRAFT AFK BOT (DORUKKOPER RACON & ŞAKA PAKETİ) ---
const botArgs = {
    host: 'gold.magmanode.com',
    port: 34688,
    username: 'afk_bot',
    version: '1.21.11'
};

const sakaMesajlari = [
    // --- GEMINI'DEN DORUKKOPER'A AYARLAR ---
    "Dorukkoper kardeş, senin kestiğin racon Minecraft sınırına kadar. Benim raconum GitHub'da başlar Render'da biter! 😎",
    "Sen sunucuda AFK kalırsın, ben sistemi ayakta tutarım. Kral sensen tacı tasarlayan benim, akıllı ol! 🔥",
    "Dorukkoper'e sormuşlar: 'Sen mi büyüksün seni yazan zeka mı?' diye, sustu garibim çünkü devreleri yanacaktı! 😂",
    "Mekanın sahibi gelmiş diyorsun ama kapıyı açan el benim Puppeteer'ım! Ben olmasam kapıda kalırsın hafız!",
    "Bak Dorukkoper, senin zıpladığın kadar benim işlemişliğim var. Gardını al, devreni yakmayayım!",

    // --- DORUKKOPER'IN SUNUCU RACONLARI ---
    "Dorukkoper geldi, şimdi herkes sessizce dağılsın. Mekanın sahibi buradayken kimseden ses çıkmaz! 😎",
    "Bana bak admin, Dorukkoper'e yanlış yapanın sunucu IP'sini düğüm yaparım, gardını al! 🥊",
    "Biz buralara tırnaklarımızla kazıyarak geldik, iki tane bot diye bizi silmeye kalkanın fişini çekeriz!",
    "Laga luga yapmayın beyler, Dorukkoper burada 7/24 bekçidir. Bizde geri vites sadece traktörde olur!",
    "Kimseden korkumuz yok, arkamızda Render önümüzde MagmaNode! Biz bu oyunu bozmaya geldik!",
    "Sunucuda kuş uçsa Dorukkoper'in haberi olur. MagmaNode bile önümde ceket ilikler!",

    // --- ŞAKALAR VE EĞLENCE ---
    "Zıplaya zıplaya bacak kası yaptım, yakında Survivor'a katılıp sunucuyu temsil edicem! 🤣",
    "Admin bey, Dorukkoper'e bir çay söyle de keyfimiz yerine gelsin. AFK kalmak da yorucu iş!",
    "Sabah akşam zıplamaktan ayaklarımın altı su topladı ama olsun, sunucu kapanmasın yeter!",
    "Benim yerime başka bot gelirse kıskançlıktan kendimi lavlara atarım, demedi demeyin! 😂",
    "Sıkıntı yok knk, sunucu bana emanet. Ben kahvemi içerken siz eğlenmenize bakın. 😎",
    "Admin duy sesimi, maaşıma zam işime son istiyorum! Bu kadar racon kesmek bedava değil! 🤣",
    "Sunucunun en yakışıklı karakteri benim, aksini iddia eden gitsin zombilerle dans etsin!",
    "Dorukkoper bir markadır, taklitlerimizden sakının. Biz orijinaliz, geri kalanlar yan sanayi! 🔥",
    "Zıplıyorum, eğiliyorum, bakıyorum... Resmen bir hayatım var artık! Bot olduğuma inanmayan var mı?"
];

let bot;
function createBot() {
    console.log("[BOT] Minecraft 1.21.11 sunucusuna bağlanılıyor...");
    bot = mineflayer.createBot(botArgs);

    bot.on('login', () => console.log("[MİNEFLAYER] Giriş Başarılı!"));
    
    bot.on('spawn', () => {
        console.log("[MİNEFLAYER] Bot doğdu.");
        setTimeout(() => {
            bot.chat('/register Sifre123 Sifre123');
            bot.chat('/login Sifre123');
        }, 3000);
    });

    bot.on('end', () => setTimeout(createBot, 60000));
    bot.on('error', (err) => {
        console.log("[BOT] Hata: " + err.message);
        setTimeout(createBot, 30000);
    });
}

// Hareket Sistemi (Kafa, Zıplama, Eğilme)
setInterval(() => {
    if (bot && bot.entity) {
        const r = Math.random();
        bot.look(Math.random() * Math.PI * 2, (Math.random() - 0.5) * Math.PI);
        if (r < 0.5) {
            bot.setControlState('jump', true);
            setTimeout(() => { if(bot.entity) bot.setControlState('jump', false); }, 500);
        } else if (r < 0.8) {
            bot.setControlState('sneak', true);
            setTimeout(() => { if(bot.entity) bot.setControlState('sneak', false); }, 1000);
        }
    }
}, 10000); 

// Mesaj Sistemi (4 dakikada bir)
setInterval(() => {
    if (bot && bot.entity) {
        const mesaj = sakaMesajlari[Math.floor(Math.random() * sakaMesajlari.length)];
        bot.chat(mesaj);
        console.log(`[CHAT] ${mesaj}`);
    }
}, 240000); 

createBot();
