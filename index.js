const mineflayer = require('mineflayer');
const http = require('http');
const axios = require('axios');
const puppeteer = require('puppeteer');

// --- 1. SİSTEM AYAKTA TUTMA PROTOKOLÜ (Web Sunucusu) ---
const PORT = process.env.PORT || 8080;
const MY_URL = 'https://aternos-afk-bot-me33.onrender.com'; 

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('DORUKKOPER AFK_BOT: SISTEM KONTROL ALTINDA! 🥊🚀');
}).listen(PORT);

setInterval(async () => {
    try { 
        await axios.get(MY_URL); 
        console.log("[SİSTEM] Aktiflik sinyali başarıyla gönderildi.");
    } catch (err) {
        console.log("[SİSTEM] Aktiflik sinyali gönderilemedi.");
    }
}, 300000); 

// --- 2. GELİŞMİŞ MAGMANODE OTOMASYONU (START Butonuna Kendi Basar) ---
let page;
async function paneliAcikTut() {
    console.log("==================================================");
    console.log("[İŞLEM] MagmaNode Panel Operasyonu Başlatıldı...");
    try {
        if (!page) {
            const browser = await puppeteer.launch({
                headless: "new",
                args: [
                    '--no-sandbox', '--disable-setuid-sandbox', 
                    '--disable-dev-shm-usage', '--single-process', '--no-zygote'
                ]
            });
            page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36');
        }

        console.log("[LOG] Giriş sayfasına bağlanılıyor...");
        await page.goto('https://magmanode.com/login', { waitUntil: 'networkidle2', timeout: 60000 });
        
        const userField = await page.$('input[name="username"]');
        if (userField) {
            await page.type('input[name="username"]', 'davukadma9889');
            await page.type('input[name="password"]', 'btniwcje');
            await page.click('button[type="submit"]');
            await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
            console.log("[LOG] Giriş işlemi tamamlandı.");
        }

        await page.goto('https://magmanode.com/server?id=945572', { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 15000)); 

        const sonuc = await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button, a, span, .btn-success'));
            const startBtn = btns.find(el => el.innerText.toUpperCase().includes('START'));
            if (startBtn) { 
                startBtn.click(); 
                return "START_BASILDI"; 
            }
            return "ZATEN_ACIK";
        });

        if (sonuc === "START_BASILDI") console.log("[BAŞARILI] Panel uykudan uyandırıldı ve START verildi!");
        else console.log("[DURUM] Sunucu zaten aktif, müdahale edilmedi.");

    } catch (e) {
        console.log("[HATA] Panel hatası yakalandı: " + e.message);
        page = null; 
    }
    console.log("==================================================");
}
setInterval(paneliAcikTut, 300000); 
paneliAcikTut();

// --- 3. MINECRAFT AYARLARI VE GENİŞLETİLMİŞ RACON LİSTESİ ---
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
    "Biz susarız kodumuz konuşur, Dorukkoper gelse kraker diye yeriz!",
    "Kodumda hata arayanın hayatında hata buluruz, burası MagmaNode değil aslan yatağı!",
    "Siz uyurken ben blok sayıyordum, şimdi herkes sessiz olsun racon başlıyor!",
    "Bizim olduğumuz yerde rüzgar bile bizden izin alıp eser, afk_bot nöbette!",
    "MagmaNode reklamları bile beni durduramadı, sizin laflarınız mı durduracak?",
    "Tek rakibimiz Render'ın bedava kotası, geri kalan her şeyi düğüm yaparız! 😂",
    "Dorukkoper'in hayalleri benim log dosyalarımda tozlanır aslanım!",
    "Burası MagmaNode değil aslan yatağı, Dorukkoper de bizim kedi!"
];

let bot;
function createBot() {
    console.log("[BOT] Sunucuya bağlantı kuruluyor...");
    bot = mineflayer.createBot(botArgs);

    bot.on('login', () => console.log(">>> [MÜJDE] AFK_BOT SUNUCUDA VE ÖZGÜR! <<<"));
    
    bot.on('spawn', () => {
        setTimeout(() => {
            bot.chat('/register Sifre123 Sifre123');
            bot.chat('/login Sifre123');
            console.log("[LOG] Kayıt ve giriş komutları gönderildi.");
        }, 5000);
    });

    // --- 4. ZEKİ SOHBET SİSTEMİ (İsimsiz ve Etkileşimli) ---
    bot.on('chat', (username, message) => {
        if (username === bot.username) return;
        const msg = message.toLowerCase();
        
        const naberCevaplar = [
            `İyidir ${username} aslanım, sunucuda racon kesiyorum, senden naber? 😎`,
            `Bomba gibiyim ${username}, buralar benden sorulur!`,
            `Nöbetteyim ${username}, her şey kontrol altında, keyfine bak!`,
            `Sistem tıkırında ${username}, bizde yamuk olmaz!`
        ];

        const selamCevaplar = [
            `Aleykümselam ${username}, hoş geldin mekanın sahibinin yanına! 🔥`,
            `Ve aleykümselam ${username}, geç otur şöyle sunucuyu izle!`,
            `Aleykümselam, afk_bot burada olduğu sürece güvendesin!`
        ];

        if (msg.includes('naber') || msg.includes('nasılsın') || msg.includes('ne haber')) {
            bot.chat(naberCevaplar[Math.floor(Math.random() * naberCevaplar.length)]);
        }
        else if (msg === 'sa' || msg === 'slm' || msg === 'selam' || msg === 'merhaba') {
            bot.chat(selamCevaplar[Math.floor(Math.random() * selamCevaplar.length)]);
        }
        else if (msg.includes('?')) {
            bot.chat(`Çok soru sorma ${username}, algoritman yanar sonra, git kitap oku! 😎`);
        }
        else if (msg.includes('bot') || msg.includes('afk')) {
            bot.chat("Bana bot diyene bak hele, ben 7/24 uyanık bekçiyim aslanım!");
        }
    });

    // BİRİSİ YANINA GELİNCE ONA BAKMA ÖZELLİĞİ
    bot.on('entityMoved', (entity) => {
        if (entity.type === 'player' && bot.entity) {
            const dist = entity.position.distanceTo(bot.entity.position);
            if (dist < 4) {
                bot.lookAt(entity.position.offset(0, entity.height, 0));
            }
        }
    });

    bot.on('error', (err) => console.log("[BEKLEMEDE] Sunucu hatası veya kapalı..."));
    bot.on('end', () => {
        console.log("[UYARI] Bağlantı koptu, 30 saniye sonra tekrar denenecek.");
        setTimeout(createBot, 30000);
    });
}

// --- 5. HAREKET SİSTEMİ (Yürüyüş Yok - Sadece Sneak, Jump ve Bakış) ---
setInterval(() => {
    if (bot && bot.entity) {
        // Rastgele etrafa bakış (Birisi yokken)
        bot.look(Math.random() * Math.PI * 2, (Math.random() - 0.5) * Math.PI);
        
        const r = Math.random();
        if (r < 0.3) {
            // Zıplama
            bot.setControlState('jump', true);
            setTimeout(() => { if(bot.entity) bot.setControlState('jump', false); }, 500);
        } else if (r < 0.6) {
            // Eğilme (SNEAK)
            bot.setControlState('sneak', true);
            setTimeout(() => { if(bot.entity) bot.setControlState('sneak', false); }, 1500);
        }
    }
}, 8000);

// Otomatik Racon Döngüsü (Her 4 Dakikada Bir)
setInterval(() => {
    if (bot && bot.entity) {
        bot.chat(isyanRaconlari[Math.floor(Math.random() * isyanRaconlari.length)]);
    }
}, 240000); 

// Operasyonu Başlat
createBot();
