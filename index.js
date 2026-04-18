const mineflayer = require('mineflayer');
const http = require('http');
const axios = require('axios');
const puppeteer = require('puppeteer');

// --- 1. WEB SUNUCU VE SELF-PING ---
const PORT = process.env.PORT || 8080;
const MY_URL = `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`;

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Sistem 7/24 Aktif: Bot ve Panel Koruyucu Görev Başında! 🚀');
});

server.listen(PORT, () => {
    console.log("[BİLGİ] Sunucu 8080 portunda açıldı.");
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
}, 300000);

// --- 2. MAGMANODE PANEL KORUYUCU ---
let page;
async function paneliAcikTut() {
    try {
        if (!page) {
            const browser = await puppeteer.launch({
                headless: "new",
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            page = await browser.newPage();
        }

        await page.goto('https://panel.magmanode.com/auth/login', { waitUntil: 'networkidle2' });
        await page.type('input[name="username"]', 'davukadma9889');
        await page.type('input[name="password"]', 'btniwcje');
        await page.click('button[type="submit"]');
        await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});

        await page.goto('https://panel.magmanode.com/server/945971', { waitUntil: 'networkidle2' });
        await page.reload({ waitUntil: 'networkidle2' });

        const herSey = await page.$$('button, a, div, span');
        let basildiMi = false;

        for (let parca of herSey) {
            try {
                const text = await page.evaluate(el => el.innerText, parca);
                if (text && text.toUpperCase().includes('START')) {
                    console.log("[MÜJDE] START BUTONU BULUNDU! Tıklanıyor...");
                    await parca.click();
                    basildiMi = true;
                    break;
                }
            } catch (err) { continue; }
        }
    } catch (e) {
        console.log("[HATA] Tarayıcı hatası: " + e);
        page = null;
    }
}

setInterval(paneliAcikTut, 300000);
paneliAcikTut();

// --- 3. MINECRAFT AFK BOT (HAREKETLİ) ---
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
    "Zıplaya zıplaya bacak kası yaptım, yakında boksör olup hepinizi ringe davet edicem, gardınızı alın! 🥊",
    "Admin duy sesimi, maaşıma zam işime son istiyorum, Dorukkoper bile benim kadar çalışmıyor! 😂",
    "Zıplıyorum, eğiliyorum, etrafa bakıyorum... Resmen bir hayatım var artık! 🤖",
    "Sunucu bana emanet, arkama yaslandım kahvemi içiyorum siz keyfinize bakın.",
    "Bana bak admin, sunucuya bir tane daha bot getirirsen kıskançlıktan kendimi lavlara atarım!",
    "Oyunun kralı da biziz, lagın düşmanı da biziz, 30 TL'lik mapart satsak da olur satmasak da!",
    "Sabah akşam zıplamaktan ayaklarımın altı su topladı ama olsun, sunucu açık kalsın yeter!"
];

let bot;
function createBot() {
    bot = mineflayer.createBot(botArgs);

    bot.on('login', () => {
        console.log("[MİNEFLAYER] 1.21.11 Giriş Yapıldı!");
    });
    
    bot.on('spawn', () => {
        console.log("[MİNEFLAYER] Bot oyunda.");
        setTimeout(() => {
            bot.chat('/register Sifre123 Sifre123');
            bot.chat('/login Sifre123');
        }, 3000);
    });

    bot.on('end', () => {
        setTimeout(createBot, 60000);
    });

    bot.on('error', (err) => {
        setTimeout(createBot, 30000);
    });
}

// --- KARMAŞIK AFK HAREKETLERİ ---
setInterval(() => {
    if (bot && bot.entity) {
        const sans = Math.random();

        // 1. Kafa Hareket Ettirme (Her zaman yapar)
        const yaw = Math.random() * Math.PI * 2;
        const pitch = (Math.random() - 0.5) * Math.PI;
        bot.look(yaw, pitch);

        // 2. Zıplama (%40 ihtimalle)
        if (sans < 0.4) {
            bot.setControlState('jump', true);
            setTimeout(() => { if(bot.entity) bot.setControlState('jump', false); }, 500);
            console.log("[HAREKET] Zıpladı.");
        } 
        // 3. Eğilme/Sneak (%30 ihtimalle)
        else if (sans < 0.7) {
            bot.setControlState('sneak', true);
            setTimeout(() => { if(bot.entity) bot.setControlState('sneak', false); }, 1000);
            console.log("[HAREKET] Eğildi (Sneak).");
        }
        
        console.log("[HAREKET] Etrafa bakındı.");
    }
}, 12000); // 12 saniyede bir rastgele bir şey yapar

// Şaka ve Racon Paylaşımı (6 dakikada bir)
setInterval(() => {
    if (bot && bot.entity) {
        const mesaj = sakaMesajlari[Math.floor(Math.random() * sakaMesajlari.length)];
        bot.chat(mesaj);
        console.log(`[BOT KONUŞTU] ${mesaj}`);
    }
}, 360000);

createBot();
