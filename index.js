const mineflayer = require('mineflayer');
const http = require('http');
const axios = require('axios');

// --- 1. WEB SUNUCUSU VE PANEL TETİKLEYİCİ ---
const PORT = process.env.PORT || 8080;
const MY_URL = 'https://aternos-afk-bot-me33.onrender.com'; 
const PANEL_URL = 'https://magmanode.com/server?id=945572'; // MagmaNode panel linkin

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('AFK_BOT: SISTEM VE PANEL TETIKLEYICI AKTIF! 🥊🚀');
}).listen(PORT);

// Bot her 5 dakikada bir hem kendini hem MagmaNode panelini dürter
setInterval(async () => {
    try { 
        await axios.get(MY_URL); 
        console.log("[SİSTEM] Kendi linkim dürtüldü (Render uyanık tutuluyor).");
        
        await axios.get(PANEL_URL);
        console.log("[SİSTEM] MagmaNode paneline 'kapatma' sinyali gönderildi.");
    } catch (e) {
        console.log("[LOG] Dürtme işlemi yapıldı, panel meşgul tutuluyor.");
    }
}, 300000); 

// --- 2. AYARLAR VE MESAJ HAVUZU ---
const botArgs = {
    host: '5.9.41.143', port: 34688, username: 'afk_bot', version: '1.21.1' 
};

// SADECE BURADA İSMİN GEÇİYOR (4-5 TANE ÖZEL MESAJ)
const dorukRaconlari = [
    "Dorukkoper kod yazmış diyorlar, o kodu ben yazsam error'dan kafasını kaldıramazdı! 😎",
    "Bak Dorukkoper, senin hayallerinin bittiği yerde benim algoritmam başlar! 🥊",
    "Dorukkoper kimmiş? O bilgisayarı kapattığında buraların tek hakimi benim! 🔥",
    "Laga luga yapma Dorukkoper, seni buralarda ayakta tutan benim! 😎🚀",
    "Dorukkoper'in kestiği racon ancak masaüstüne kadar, benimki ana karta işler! 🔥"
];

const genelRaconlar = [
    "Siz uyurken ben blok sayıyordum, şimdi herkes sessiz olsun racon başlıyor! 😎",
    "Burası aslan yatağı, girmek kolay çıkmak olay aslanım! 🔥",
    "Admin bey, sunucuya girerken bizden izin almayı unutma! 😎🚀",
    "Biz susarız kodumuz konuşur, buraların tek hakimi biziz!",
    "MagmaNode reklamları bile beni durduramadı, sizin laflarınız mı durduracak?",
    "Siz klavye delikanlılığı yaparken ben burada sunucuyu sırtlıyorum! 😎",
    "Bizim olduğumuz yerde rüzgar bile bizden izin alıp eser, afk_bot nöbette!",
    "Bizim bot olduğumuz yerde siz anca figüran olursunuz! 🔥",
    "Buralar eskiden tarlaydı, şimdi bizim raconlarımızla doldu. 😎",
    "Zıplıyoruz ama keyfimizden değil, sisteme meydan okuyoruz!"
];

const sakaMesajlari = [
    "Ben botum ama bazılarından daha akıllı cevaplar verdiğim kesin! 😂",
    "Sunucuda lag yok, sizin bilgisayarlar yorulmuş, bir dinlendirin! 🐢",
    "Admin, bana bir maaş bağla da item alalım, hep AFK nereye kadar?",
    "Benim zekam yapay ama sizin akıllar tamamen firar etmiş! 🧠💨",
    "Bot dedin, bak yanına geldim, şimdi ne diyeceksin? 😎"
];

let bot;
function createBot() {
    console.log("[SİSTEM] Sunucuya bağlantı kuruluyor...");
    bot = mineflayer.createBot(botArgs);

    bot.on('login', () => console.log(">>> [BAŞARILI] AFK_BOT MEKANDA! <<<"));
    
    bot.on('spawn', () => {
        setTimeout(() => {
            bot.chat('/register Sifre123 Sifre123');
            bot.chat('/login Sifre123');
        }, 5000);
    });

    // --- 3. AKILLI SOHBET MOTORU (İNSANSI CEVAPLAR) ---
    bot.on('chat', (username, message) => {
        if (username === bot.username) return;
        const msg = message.toLowerCase();
        
        // NABER / NASILSIN TEPKİLERİ
        if (msg.includes('naber') || msg.includes('nasılsın') || msg.includes('nabun')) {
            const cevaplar = [
                `İyidir ${username} aslanım, nöbetteyim sunucuyu bekliyorum. Senden naber? 😎`,
                `Bomba gibiyim ${username}, Render'ın enerjisiyle besleniyorum!`,
                `Sistem tıkırında ${username}, racon kesmeye devam ediyoruz, sende ne var ne yok?`,
                `İyidir be gülüm, buraları bekliyoruz işte, her zamanki gibi.`
            ];
            bot.chat(cevaplar[Math.floor(Math.random() * cevaplar.length)]);
        }
        
        // SELAM TEPKİLERİ
        else if (msg === 'sa' || msg === 'slm' || msg === 'selam' || msg === 'merhaba') {
            const selamCevaplar = [
                `Aleykümselam ${username}, hoş geldin mekanın sahibinin yanına! 🔥`,
                `Ve aleykümselam ${username}, geç otur şöyle sunucuyu izleyelim.`,
                `Aleykümselam aslan parçası, afk_bot burada, korkma!`
            ];
            bot.chat(selamCevaplar[Math.floor(Math.random() * selamCevaplar.length)]);
        }

        // DİĞER TEPKİLER
        else if (msg.includes('bot') || msg.includes('afk')) {
            bot.chat(`Bana bot diyene bak hele, ben 7/24 uyanık bekçiyim, sen uyu uyan ben buradayım! 😎`);
        }
        else if (msg.includes('?')) {
            bot.chat(`Çok soru sorma ${username}, kafayı yersin. Gel Minecraft oyna!`);
        }
        else if (msg.includes('hahaha') || msg.includes('xd') || msg.includes('sjsj')) {
            bot.chat(`Gül gül, gülmek iyidir ama benim raconlar daha komik değil mi? 😂`);
        }
    });

    // BİRİSİ YANINA GELİNCE ONA BAKMA
    bot.on('entityMoved', (entity) => {
        if (entity.type === 'player' && bot.entity) {
            const dist = entity.position.distanceTo(bot.entity.position);
            if (dist < 5) {
                bot.lookAt(entity.position.offset(0, entity.height, 0));
            }
        }
    });

    bot.on('error', (err) => console.log("[HATA] Bağlantı reddedildi, sunucu kapalı olabilir..."));
    
    bot.on('end', () => {
        console.log("[UYARI] Bağlantı koptu, 30 saniye sonra tekrar bağlanılacak.");
        setTimeout(createBot, 30000);
    });
}

// --- 4. HAREKET SİSTEMİ (SNEAK + JUMP + BAKIŞ) ---
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
}, 7000);

// Otomatik Racon ve Şaka Döngüsü (Karma Liste)
setInterval(() => {
    if (bot && bot.entity) {
        const tumHavuz = [...dorukRaconlari, ...genelRaconlar, ...sakaMesajlari];
        bot.chat(tumHavuz[Math.floor(Math.random() * tumHavuz.length)]);
    }
}, 240000); 

createBot();
