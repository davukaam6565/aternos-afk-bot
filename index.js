const http = require('http');
http.createServer((req, res) => {
    res.write('Bot Calisiyor!');
    res.end();
}).listen(process.env.PORT || 3000);
const mineflayer = require('mineflayer');

const botOptions = {
    host: 'jewelfish.aternos.host:62351', // BURAYA KENDİ IP ADRESİNİ YAZ
    port: 62351,
    username: 'afk_bot',
    version: false 
};

function createBot() {
    const bot = mineflayer.createBot(botOptions);

    bot.on('spawn', () => {
        console.log('Bot sunucuya giriş yaptı!');
        startRandomMovement(bot);
    });

    function startRandomMovement(bot) {
        setInterval(() => {
            if (!bot.entity) return;
            const actions = ['forward', 'back', 'left', 'right', 'jump'];
            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            bot.setControlState(randomAction, true);
            setTimeout(() => {
                bot.setControlState(randomAction, false);
            }, 1000);
        }, 5000);
    }

    bot.on('end', () => {
        console.log('Bağlantı kesildi! 30 saniye sonra tekrar denenecek...');
        setTimeout(createBot, 30000);
    });

    bot.on('error', (err) => {
        console.log('Hata: ' + err.message);
    });
}

createBot();
