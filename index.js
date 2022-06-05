import DiscordJS, { Intents } from 'discord.js'
import dotenv from 'dotenv'
import getCurrencyHistory from "./functions.js"

dotenv.config()

const client = new DiscordJS.Client({
    intents:[
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})

const prefix = '!';

client.on('ready',()=>{
    console.log('Bot is ready')
})

client.on('messageCreate', async (message, ) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    if(command == 'chart'){        
        if(args.length == 1){
            let result = await getCurrencyHistory(args[0],'TRY');
            message.channel.send({ embeds: [result]});            
        }else if (args.length == 2){
            let result = await getCurrencyHistory(args[0],args[1]);
            message.channel.send({ embeds: [result]});
        }else{
            message.reply("wtf")
        }
    }

})

client.login(process.env.TOKEN)
