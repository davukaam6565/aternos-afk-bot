const mineflayer = require('mineflayer');
const http = require('http');
const axios = require('axios');
const puppeteer = require('puppeteer');

// --- 1. WEB SUNUCU VE SELF-PİNG (7/24 AKTİF TUTMA) ---
const PORT = process.env.PORT || 8080;
const MY_URL = 'https://aternos-afk-bot-me33.onrender.com'; 

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Sistem Aktif: afk_bot Görev Başında! 🚀');
}).listen(PORT);

setInterval(async () => {
    try { await axios.get(MY_URL); } catch (err) {}
}, 300000); 

// --- 2. ZORLAYICI REKLAM SAVAR MAGMANODE KORUYUCU ---
let page;
async function paneliAcikTut() {
    console.log("--------------------------------------------------");
    console.log("[SİSTEM] Sunucu uyandırma operasyonu başlıyor...");
    try {
        if (!page) {
            const browser = await puppeteer.launch({
                headless: "new",
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
            });
            page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36');
        }

        // 1. ADIM: GİRİŞ YAP
        await page.goto('https://magmanode.com/login', { waitUntil: 'networkidle2' });
        const userField = await page.$('input[name="username"]');
        if (userField) {
            await page.type('input[name="username"]', 'davukadma9889');
            await page.type('input[name="password"]', 'btniwcje');
            await page.click('button[type="submit"]');
            await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
        }

        // 2. ADIM: SUNUCU SAYFASINA GİT VE REKLAMI EZ
        console.log("[İŞLEM] Sunucu sayfasına (945572) bağlanılıyor...");
        await page.goto('https://magmanode.com/server?id=945572', { waitUntil: 'networkidle2' });
        
        // Reklam (google_vignette) algılanırsa sayfayı yenileyerek temizle
        for (let i = 0; i < 3; i++) {
            if (page.url().includes('google_vignette')) {
                console.log(`[UYARI] Reklam algılandı, deneme ${i+1}: Sayfa temizleniyor...`);
                await page.goto('https://magmanode.com/server?id=945572', { waitUntil: 'networkidle2' });
                await new Promise(r => setTimeout(r, 5000));
            }
        }

        // 3. ADIM: START BUTONUNU BUL VE BAS
        await new Promise(r => setTimeout(r, 10000)); // Sayfanın iyice yüklenmesini bekle

        const basildiMi = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button, a, span, div.btn'));
            const target = buttons.find(b => 
                b.innerText.toUpperCase().includes('START') || 
                b.innerHTML.toUpperCase().includes('START')
            );
            
            if (target) {
                target.click();
                return true;
            }
            return false;
        });

        if (basildiMi) console.log("[BAŞARILI] START butonuna tıklandı! Sunucu uyandırıldı.");
        else console.log("[DURUM] START butonu bulunamadı. Ya sunucu açık ya da sayfa yüklenmedi.");

    } catch (e) {
        console.log("[HATA] Panel operasyonunda aksama: " + e.message);
        page = null; 
    }
    console.log("--------------------------------------------------");
}

setInterval(paneliAcikTut, 300000); 
paneliAcikTut();

// --- 3. MINECRAFT BOT (afk_bot 1.21.11 ÖZEL) ---
const botArgs = {
    host: 'gold.magmanode.com',
    port: 34688,
    username: 'afk_bot', // Botun adını düzelttim knk!
    version: '1.21.11'
};

const sakaMesajlari = [
    "Dorukkoper kardeş, senin kestiğin racon Minecraft sınırına kadar. Benim raconum GitHub'da başlar! 😎",
    "Sen sunucuda AFK kalırsın, ben sistemi ayakta tutarım. Kral sensen tacı tasarlayan benim! 🔥",
    "Dorukkoper'e sormuşlar: 'Sen mi büyüksün seni yazan zeka mı?' diye, sustu garibim! 😂",
    "Mekanın sahibi gelmiş diyorsun ama kapıyı açan el benim Puppeteer'ım! Hafız!",
    "Bak Dorukkoper, senin zıpladığın kadar benim işlemişliğim var. Gardını al!",
    "afk_bot geldi, şimdi herkes sessizce dağılsın. Dorukkoper buradayken kimseden ses çıkmaz! 😎",
    "Bana bak admin, Dorukkoper'e yanlış yapanın IP'sini düğüm yaparım! 🥊",
    "Laga luga yapmayın beyler, afk_bot burada 7/24 bekçidir. 🔥",
    "Zıplaya zıplaya bacak kası yaptım, yakında Survivor'a katılıyorum! 🤣",
    "Sunucunun en yakışıklı karakteri benim, aksini iddia eden gitsin zombilerle dans etsin!",
    "Zıplıyorum, eğiliyorum, bakıyorum... Resmen bir hayatım var artık! 😎"
];

let bot;
function createBot() {
    bot = mineflayer.createBot(botArgs);

    bot.on('login', () => console.log(">>> [MÜJDE] afk_bot OYUNA GİRDİ! <<<"));
    
    bot.on('spawn', () => {
        setTimeout(() => {
            bot.chat('/register Sifre123 Sifre123');
            bot.chat('/login Sifre123');
        }, 5000);
    });

    bot.on('error', (err) => {
        console.log("[BAĞLANTI BEKLENİYOR] Sunucu henüz açılmadı, bot denemeye devam ediyor...");
    });

    bot.on('end', () => {
        setTimeout(createBot, 30000);
    });
}

// HAREKET SİSTEMİ (Zıplama, Eğilme, Kafa Sallama)
setInterval(() => {
    if (bot && bot.entity) {
        const r = Math.random();
        bot.look(Math.random() * Math.PI * 2, (Math.random() - 0.5) * Math.PI);
        if (r < 0.4) {
            bot.setControlState('jump', true);
            setTimeout(() => { if(bot.entity) bot.setControlState('jump', false); }, 500);
        } else if (r < 0.7) {
            bot.setControlState('sneak', true);
            setTimeout(() => { if(bot.entity) bot.setControlState('sneak', false); }, 1000);
        }
    }
}, 10000); 

// RACON MESAJ SİSTEMİ (4 Dakikada Bir)
setInterval(() => {
    if (bot && bot.entity) {
        bot.chat(sakaMesajlari[Math.floor(Math.random() * sakaMesajlari.length)]);
    }
}, 240000); 

createBot();
