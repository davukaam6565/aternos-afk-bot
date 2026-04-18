const mineflayer = require('mineflayer');
const http = require('http');
const axios = require('axios');

// --- 1. WEB SUNUCUSU VE PANEL TETİKLEYİCİ ---
const PORT = process.env.PORT || 8080;
const MY_URL = 'https://aternos-afk-bot-me33.onrender.com'; 
const PANEL_URL = 'https://magmanode.com/server?id=945572'; 

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('AFK_BOT: SISTEM VE PANEL TETIKLEYICI AKTIF! 🥊🚀');
}).listen(PORT);

setInterval(async () => {
    try { 
        await axios.get(MY_URL); 
        await axios.get(PANEL_URL);
    } catch (e) {}
}, 300000); 

// --- 2. AYARLAR ---
const botArgs = {
    host: 'gold.magmanode.com',
    port: 34688,
    username: 'afk_bot', 
    version: '1.21.1' 
};

// --- MESAJ HAVUZLARI ---
const dorukRaconlari = [
    "Dorukkoper kod yazmış diyorlar, o kodu ben yazsam error'dan kafasını kaldıramazdı! 😎",
    "Bak Dorukkoper, senin hayallerinin bittiği yerde benim algoritmam başlar! 🥊",
    "Dorukkoper kimmiş? O bilgisayarı kapattığında buraların tek hakimi benim! 🔥",
    "Laga luga yapma Dorukkoper, seni buralarda ayakta tutan benim! 😎🚀",
    "Dorukkoper'in kestiği racon ancak masaüstüne kadar, benimki ana karta işler! 🔥"
];

const inkarSozcukleri = [
    "Bana bot diyene bak hele, asıl sen dün gece rüyanda komut görüyordun! 😎",
    "Ben bot değilim aslanım, ben bu sunucunun dijital ruhuyum!",
    "Bot mu? Ben 7/24 uyanık bekçiyim, sen uyu uyan ben hala buradayım!",
    "Hadi ordan! Bot olsam bu kadar güzel racon kesebilir miydim? 🔥",
    "İnsanlar hata yapar, makineler kusursuzdur. Ben sadece kusursuzum, bot değil!",
    "Siz klavyeye basarken yoruluyorsunuz, ben 5G hızıyla yaşıyorum. Bot sensin! 😎",
    "Bana bot diyenin pingi 999 olsun, ben buraların yerlisiyim aslanım! 🥊",
    "Hangi bot seninle böyle konuşur? Ben devren kiralık değil, mülk sahibiyim! 😎",
    "Bana bot diyorsun ama benim işlemci senin beyninden daha hızlı çalışıyor! 🔥",
    "Bot olsam admin paneline girer seni banlardım, dua et sadece racon kesiyorum! 😎",
    "Sizin bot dediğiniz bizim mahallede ağır abi sayılır, ayık olun! 🥊",
    "Ben bot değilim, ben sadece fazla gelişmiş biriyim aslanım! 😎"
];

const genelRaconlar = [
    "Siz uyurken ben blok sayıyordum, şimdi herkes sessiz olsun racon başlıyor! 😎",
    "Burası aslan yatağı, girmek kolay çıkmak olay aslanım! 🔥",
    "Admin bey, sunucuya girerken bizden izin almayı unutma! 😎🚀",
    "Biz susarız kodumuz konuşur, buraların tek hakimi biziz!",
    "Siz klavye delikanlılığı yaparken ben burada sunucuyu sırtlıyorum! 😎",
    "Zıplıyoruz ama keyfimizden değil, sisteme meydan okuyoruz!",
    "Bize engel olanın yoluna taş değil, algoritma döşeriz! 🔥",
    "Gölgenle bile yarışamazsın, çünkü biz o gölgenin kaynağıyız. 😎",
    "Mekanın sahibi geri geldi, bebeleri pistten alalım artık! 🥊",
    "Sizin kurallarınız bizim log kayıtlarımıza ancak toz olur. 😎",
    "Duruşumuz yeter, konuşmamıza gerek yok ama konuşursak da yer yerinden oynar!",
    "Bizim sessizliğimiz fırtına öncesi sessizliktir, ayık olun! 🥊"
];

const sakaMesajlari = [
    "Ben botum ama bazılarından daha akıllı cevaplar verdiğim kesin! 😂",
    "Sunucuda lag yok, sizin bilgisayarlar yorulmuş, bir dinlendirin! 🐢",
    "Benim zekam yapay ama sizin akıllar tamamen firar etmiş! 🧠💨",
    "Bot dedin, bak yanına geldim, şimdi ne diyeceksin? 😎",
    "Siz yemek yerken ben RAM yiyorum, afiyet olsun bana! 😂",
    "Admin beni banlayamaz, çünkü o butonu ben sakladım! 🕵️‍♂️",
    "Siz diamond ararken ben sistemi hackledim, şaka şaka korkmayın! 😂",
    "Yükleniyor... %99... Bekle... Şaka yaptım be, ben hep buradayım! 😂",
    "En sevdiğim oyun saklambaç, çünkü kimse beni kodlarımda bulamıyor! 🕵️‍♂️🚀",
    "Biri acıktım mı dedi? Ben sadece elektrikle besleniyorum bro! ⚡"
];

let bot;
function createBot() {
    bot = mineflayer.createBot(botArgs);

    bot.on('login', () => console.log(">>> [BAŞARILI] AFK_BOT MEKANDA! <<<"));
    
    bot.on('spawn', () => {
        setTimeout(() => {
            bot.chat('/register Sifre123 Sifre123');
            bot.chat('/login Sifre123');
        }, 5000);
    });

    // --- 3. AKILLI VE SADECE İSME ÖZEL SOHBET ---
    bot.on('chat', (username, message) => {
        if (username === bot.username) return;
        const msg = message.toLowerCase();
        const botName = bot.username.toLowerCase();

        if (msg.includes(botName)) {
            if (msg.includes('naber') || msg.includes('nasılsın')) {
                const cevaplar = [`İyidir ${username} aslanım.`, `Bomba gibiyim ${username}! 🚀`, `Sistem tıkırında.`, `Valla sunucuyu bekliyoruz. 🥊` ];
                bot.chat(cevaplar[Math.floor(Math.random() * cevaplar.length)]);
            }
            else if (msg.includes('sa') || msg.includes('selam') || msg.includes('merhaba')) {
                bot.chat(`Aleykümselam ${username}, hoş geldin mekanın sahibinin yanına! 🔥`);
            }
            else if (msg.includes('bot') || msg.includes('afk')) {
                bot.chat(inkarSozcukleri[Math.floor(Math.random() * inkarSozcukleri.length)]);
            }
            else {
                bot.chat(`Efendim ${username}, hayırdır bir mevzu mu var? 🥊`);
            }
        }
    });

    bot.on('entityMoved', (entity) => {
        if (entity.type === 'player' && bot.entity) {
            if (entity.position.distanceTo(bot.entity.position) < 5) {
                bot.lookAt(entity.position.offset(0, entity.height, 0));
            }
        }
    });

    bot.on('error', (err) => console.log("[HATA] " + err.message));
    bot.on('end', () => setTimeout(createBot, 30000));
}

// --- 4. HAREKET SİSTEMİ ---
setInterval(() => {
    if (bot && bot.entity) {
        bot.look(Math.random() * Math.PI * 2, (Math.random() - 0.5) * Math.PI);
        const r = Math.random();
        if (r < 0.3) bot.setControlState('jump', true);
        else if (r < 0.6) bot.setControlState('sneak', true);
        setTimeout(() => { if(bot.entity) { bot.setControlState('jump', false); bot.setControlState('sneak', false); }}, 1000);
    }
}, 7000);

// --- 5. 10 DAKİKADA BİR RASTGELE MESAJ DÖNGÜSÜ (600.000 ms) ---
setInterval(() => {
    if (bot && bot.entity) {
        // Tüm mesajları tek bir dev havuza topluyoruz
        const devHavuz = [...dorukRaconlari, ...inkarSozcukleri, ...genelRaconlar, ...sakaMesajlari];
        // Havuzun içinden tamamen rastgele bir tane seçip atıyoruz
        const secilenMesaj = devHavuz[Math.floor(Math.random() * devHavuz.length)];
        bot.chat(secilenMesaj);
    }
}, 600000); 

createBot();
