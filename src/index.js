import { ChannelType, Client, REST, Routes, SlashCommandBuilder } from 'discord.js';
import { config } from 'dotenv'; config(); const { BOT_TOKEN, CLIENT_ID, GUILD_ID } = process.env;
import schedule from 'node-schedule';


const client = new Client({
    intents: [

    ]
});
const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);


const commands = [
    new SlashCommandBuilder()
        .setName('schedule_message')
        .setDescription('Schedule a Message')
        .addStringOption((option) => 
            option
                .setName('message')
                .setDescription('Message to be schedule')
                .setMinLength(10)
                .setMaxLength(2000)
                .setRequired(true)
        )
        .addIntegerOption((option) => 
            option
                .setName('time')
                .setDescription('When to schedule the message')
                .setChoices(
                    { name: '10 seconds', value: 10000},
                    { name: '30 seconds', value: 30000},
                    { name: '1 Minute', value: 60000}
                )
                .setRequired(true)
        )
        .addChannelOption((option) => 
            option
                .setName('channel')
                .setDescription('The channel the message should be sent to')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
        )
        .toJSON(),
];


client.on('ready', () => {
    console.log(`${client.user.tag} has logged in.`);
});

client.on('interactionCreate', (interaction) => {
    if(interaction.isChatInputCommand()) {
        if(interaction.commandName === 'schedule_message') {
            const message = interaction.options.getString('message');
            const time    = interaction.options.getInteger('time');
            const channel = interaction.options.getChannel('channel');

            //$ npm i node-schedule
            const date = new Date(new Date().getTime() + time);

            interaction.reply({
                content: `Your message has been scheduled for ${date.toTimeString()}`
            })
            
            schedule.scheduleJob(date, () => {
                channel.send({ content: message });
            });
        };
    };
});





function scheduleMessage() {
    const date = new Date(new Date().getTime() + 2000);
    schedule.scheduleJob(date, () => console.log('Schedule Message'));
};

async function main() {
    try{
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
            body: commands,
        });
        
        client.login(BOT_TOKEN);
    } catch(error) {
        console.log(error);
    };
};

main();