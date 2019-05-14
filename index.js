const { Client } = require('discord.js');
const bot = new Client;
const cfg = require('./config.json');
const YTDL = require('ytdl-core');

let queue = []
let dispatcher;

function Play(connection, message) {
    dispatcher = connection.playStream(YTDL(queue[0]), {filter: "audioonly"})
    dispatcher.on("end", function() {
            queue.shift();
            console.log(queue)
            if(queue[0]) {
            Play(connection, message)
            } else {
            connection.disconnect();
            }
    })
}

bot.on('ready', () => {
    console.log(`${bot.user.username} is Online`);
});

bot.on('message', (message) => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let prefix = cfg.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray[1];
    let option = messageArray[2];

    if(cmd === `${prefix}hello`) {
        message.channel.send("Hello I'm Bot Test");
    }

    if(cmd === `${prefix}join`) {
        if(message.member.voiceChannel) {
            message.member.voiceChannel.join()
            .then(connection => {
                message.reply('I have join to server')
             })
             .catch(console.log)
        } else {
            message.reply("You need to join to Voice Channel")
        }
    }

    if(cmd === `${prefix}p`) {
        if(message.member.voiceChannel) {
            message.member.voiceChannel.join()
            .then(connection => {
                queue.push(args);
                if(queue.length === 1) {
                    Play(connection, message)
                }
            })
            .catch(console.log)
        }
        else {
            message.reply("You need to join to Voice Channel")
        }
    }

    if(cmd === `${prefix}clear`) {
        queue = []
    }
    if(cmd === `${prefix}pause`) {
        dispatcher.pause();
    }
    if(cmd === `${prefix}resume`) {
        dispatcher.resume();
    }
    if(cmd === `${prefix}skip`) {
        dispatcher.end();
    }

});
bot.login(cfg.token);