const mineflayer = require('mineflayer');
const http = require('http');
const axios = require('axios');
const puppeteer = require('puppeteer');

// --- 1. WEB SUNUCU VE 7/24 AKTİF TUTMA (SELF-PING) ---
const PORT = process.env.PORT || 8080;
const MY_URL = `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`;

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Sistem Aktif: MagmaNode Koruyucu ve Dorukkoper AFK Bot Görev Başında! 🚀');
});

server.listen(PORT, () => {
    console.log("[BİLGİ] Web sunucusu 8080 portunda açıldı.");
});

setInterval(async () => {
    try {
        if (process.env.RENDER_EXTERNAL_HOSTNAME) {
            await axios.get(MY_URL);
            console.log('[SİSTEM] Bot uyku moduna girmemek için kendine ping attı.');
        }
    } catch (err) {
        console.log('[HATA] Self-ping hatası.');
    }
}, 300000); // 5 Dakikada bir

// --- 2. MAGMANODE PANEL KORUYUCU (FOTOĞRAFA GÖRE TAM UYUMLU) ---
let page;
async function paneliAcikTut() {
    console.log("--------------------------------------------------");
    console.log("[TARAYICI] MagmaNode kontrol döngüsü başladı...");
    try {
        if (!page) {
            const browser = await puppeteer.launch({
                headless: "new",
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
            });
            page = await browser.newPage();
            await page.setViewport({ width: 1280, height: 720 });
        }

        // Giriş sayfasına bağlan
        console.log("[GİRİŞ] MagmaNode giriş sayfasına bağlanılıyor...");
        await page.goto('https://magmanode.com/login', { waitUntil: 'networkidle2', timeout: 60000 });

        const loginCheck = await page.$('input[name="username"]');
        if (loginCheck) {
            console.log("[İŞLEM] Kullanıcı bilgileri giriliyor...");
            await page.type('input[name="username"]', 'davukadma9889', {delay: 50});
            await page.type('input[name="password"]', 'btniwcje', {delay: 50});
            await page.click('button[type="submit"]');
            await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
            console.log("[BAŞARILI] Giriş yapıldı.");
        }

        // FOTOĞRAFTA GÖRDÜĞÜMÜZ DOĞRU LİNK (945572)
        console.log("[İŞLEM] Sunucu yönetim sayfasına (945572) gidiliyor...");
        await page.goto('https://magmanode.com/server?id=945572', { waitUntil: 'networkidle2' });
        
        // Sayfanın ve butonların tam yüklenmesi için 7 saniye bekle
        await new Promise(r => setTimeout(r, 7000));

        // START butonunu tara ve tıkla
        const buttons = await page.$$('button, a, div, span');
        let basildiMi = false;
        for (let btn of buttons) {
            const text = await page.evaluate(el => el.innerText, btn);
            if (text && text.toUpperCase().includes('START')) {
                console.log(">>> [MÜJDE] START BUTONU BULUNDU! Tıklanıyor... <<<");
                await btn.click();
                basildiMi = true;
                break;
            }
        }
        if (!basildiMi) console.log("[DURUM] START butonu bulunamadı, muhtemelen sunucu zaten AÇIK.");

    } catch (e) {
        console.log("[KRİTİK HATA] Panel kontrolünde sorun: " + e.message);
        page = null;
    }
    console.log("--------------------------------------------------");
}

// Paneli 5 dakikada bir kontrol et
setInterval(paneliAcikTut, 300000);
paneliAcikTut();

// --- 3. MINECRAFT AFK BOT (HAREKETLİ & 1.21.11) ---
const botArgs = {
    host: 'gold.magmanode.com',
    port: 34688,
    username: 'afk_bot',
    version: '1.21.11'
};

const sakaMesajlari = [
    "Dorukkoper mekanın sahibi geldi, artık herkes ayağını denk alsın, burası bizden sorulur! 😎",
    "Dorukkoper'in olduğu yerde lag olmaz, ping olmaz, sadece kalite olur! Adamı hasta etmeyin beyler.",
    "Bana bak admin, Dorukkoper'e yanlış yaparsan bu sunucunun fişini çekerim, şaka yapmıyorum! 🔥",
    "Ben buraların bekçisiyim, MagmaNode gelse ayıramaz bizi, 7/24 buradayım kimseden korkum yok!",
    "Zıplaya zıplaya bacak kası yaptım, yakında boksör olup hepinizi ringe davet edicem, gardınızı alın! 🥊",
    "Admin duy sesimi, maaşıma zam işime son istiyorum, Dorukkoper bile benim kadar çalışmıyor! 😂",
    "Zıplıyorum, eğiliyorum, etrafa bakıyorum... Resmen bir hayatım var artık! 🤖",
    "Sunucu bana emanet, arkama yaslandım kahvemi içiyorum siz keyfinize bakın.",
    "Oyunun kralı da biziz, lagın düşmanı da biziz, 30 TL'lik mapart satsak da olur satmasak da!",
    "Sabah akşam zıplamaktan ayaklarımın altı su topladı ama olsun, sunucu açık kalsın yeter!"
];

let bot;
function createBot() {
    console.log("[BOT] Minecraft 1.21.11 sunucusuna bağlanmaya çalışılıyor...");
    bot = mineflayer.createBot(botArgs);

    bot.on('login', () => {
        console.log("[MİNEFLAYER] Giriş Başarılı! Sunucuya bağlanıldı.");
    });
    
    bot.on('spawn', () => {
        console.log("[MİNEFLAYER] Bot oyunda doğdu. Komutlar gönderiliyor...");
        setTimeout(() => {
            bot.chat('/register Sifre123 Sifre123');
            bot.chat('/login Sifre123');
        }, 3000);
    });

    bot.on('end', () => {
        console.log("[BOT] Bağlantı koptu, 60 saniye içinde tekrar denenecek...");
        setTimeout(createBot, 60000);
    });

    bot.on('error', (err) => {
        console.log("[BOT] Bağlantı Hatası: " + err.message);
        setTimeout(createBot, 30000);
    });
}

// GELİŞMİŞ HAREKET SİSTEMİ (Bakış, Zıplama, Eğilme)
setInterval(() => {
    if (bot && bot.entity) {
        const r = Math.random();
        
        // 1. Kafa Hareket Ettirme (Rastgele Bakış)
        const yaw = Math.random() * Math.PI * 2;
        const pitch = (Math.random() - 0.5) * Math.PI;
        bot.look(yaw, pitch);

        // 2. Zıplama veya Eğilme Seçimi
        if (r < 0.4) {
            bot.setControlState('jump', true);
            setTimeout(() => { if(bot.entity) bot.setControlState('jump', false); }, 500);
            console.log("[HAREKET] Zıpladı.");
        } else if (r < 0.7) {
            bot.setControlState('sneak', true);
            setTimeout(() => { if(bot.entity) bot.setControlState('sneak', false); }, 1000);
            console.log("[HAREKET] Eğildi (Sneak).");
        }
    }
}, 12000); // 12 saniyede bir rastgele hareket

// Şaka ve Racon Paylaşımı (6 dakikada bir)
setInterval(() => {
    if (bot && bot.entity) {
        const mesaj = sakaMesajlari[Math.floor(Math.random() * sakaMesajlari.length)];
        bot.chat(mesaj);
        console.log(`[BOT KONUŞTU] ${mesaj}`);
    }
}, 360000);

createBot();
