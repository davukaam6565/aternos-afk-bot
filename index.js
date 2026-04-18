const mineflayer = require('mineflayer');
const http = require('http');
const axios = require('axios');
const puppeteer = require('puppeteer');

// --- 1. WEB SUNUCU VE SELF-PING ---
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
            console.log('[SİSTEM] Bot kendi sitesini uyandirdi.');
        }
    } catch (err) {
        console.log('[HATA] Self-ping hatasi.');
    }
}, 300000); // 5 Dakikada bir

// --- 2. MAGMANODE PANEL KORUYUCU (PUPPETEER) ---
let page;
async function paneliAcikTut() {
    try {
        if (!page) {
            const browser = await puppeteer.launch({
                headless: "new",
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            page = await browser.newPage();
            
            console.log("[SİSTEM] MagmaNode giris sayfasina gidiliyor...");
            await page.goto('https://panel.magmanode.com/auth/login', { waitUntil: 'networkidle2' });
            
            await page.type('input[name="username"]', 'davukadma9889');
            await page.type('input[name="password"]', 'btniwcje');
            await page.click('button[type="submit"]');
            await page.waitForNavigation({ waitUntil: 'networkidle2' });
            console.log("[BAŞARILI] MagmaNode Girişi Yapıldı!");
            
            await page.goto('https://panel.magmanode.com/server/945971', { waitUntil: 'networkidle2' });
            console.log("[SİSTEM] Sunucu kontrol moduna gecildi.");
        } else {
            await page.reload({ waitUntil: 'networkidle2' });
            console.log("[GÜNCELLEME] Panel tazelendi.");
        }

        // YENİ GARANTİ BAŞLATMA SİSTEMİ
        const herSey = await page.$$('button, a, div, span'); 
        let basildiMi = false;

        for (let parca of herSey) {
            try {
                const text = await page.evaluate(el => el.innerText, parca);
                if (text && text.toUpperCase().includes('START')) {
                    console.log("[MÜJDE] START yazısı bulundu, üzerine basılıyor...");
                    await parca.click();
                    basildiMi = true;
                    break; 
                }
            } catch (err) {
                continue;
            }
        }
        if (!basildiMi) console.log("[BİLGİ] START butonu henüz görünür değil.");

    } catch (e) {
        console.log("[HATA] Tarayici sisteminde hata: " + e);
        page = null; // Hata alirsa bastan baslasin
    }
}

setInterval(paneliAcikTut, 300000); // 5 Dakikada bir kontrol
paneliAcikTut();

// --- 3. MINECRAFT AFK BOT AYARLARI ---
const botArgs = {
    host: 'gold.magmanode.com',
    port: 34688,
    username: 'afk_bot',
    version: '1.21.1'
};

const sakaMesajlari = [
    "Ben buralarin bekcisiyim, MagmaNode gelse ayiramaz bizi! 😎",
    "Ziplaya ziplaya bacak kasi yaptim, yakinda boksor olcam. 🥊",
    "Admin duy sesimi, maasima zam isime son istiyorum! 😂",
    "Sikinti yok knk, sunucu bana emanet. Siz keyfinize bakin.",
    "Bot dediler, bagirlarina bastilar... Ben sadece bir gorev adamiyim. 🤖"
];

let bot;
function createBot() {
    bot = mineflayer.createBot(botArgs);

    bot.on('login', () => console.log("[MİNEFLAYER] Minecraft'a giris yapildi!"));
    bot.on('spawn', () => {
        console.log("[MİNEFLAYER] Bot oyunda, sistemler aktif.");
        setTimeout(() => {
            bot.chat('/register Sifre123 Sifre123');
            bot.chat('/login Sifre123');
        }, 2000);
    });

    // Rastgele Hareket ve Ziplama (15 sn)
    setInterval(() => {
        if (bot && bot.entity) {
            const yaw = Math.random() * Math.PI * 2;
            const pitch = (Math.random() - 0.5) * Math.PI;
            bot.look(yaw, pitch);
            bot.setControlState('jump', true);
            setTimeout(() => { if(bot.entity) bot.setControlState('jump', false); }, 500);
        }
    }, 15000);

    // 10 Dakikada Bir Saka
    setInterval(() => {
        if (bot && bot.entity) {
            const mesaj = sakaMesajlari[Math.floor(Math.random() * sakaMesajlari.length)];
            bot.chat(mesaj);
        }
    }, 600000);

    bot.on('end', () => {
        console.log('[BİLGİ] Baglanti koptu. 1 dakika sonra tekrar deniyorum...');
        setTimeout(createBot, 600000);
    });

    bot.on('error', (err) => console.log("[HATA] Bot hatasi:", err));
}

createBot();
