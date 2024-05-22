require('dotenv/config');
const { Client, GatewayIntentBits } = require('discord.js');
const { CommandKit } = require('commandkit');
const mongoose = require('mongoose');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
    ],
});

new CommandKit({
    client,
    devGuildIds: ['1230866705572565052'],
    devUserIds: ['188576429850624000'],
    eventsPath: `${__dirname}/events`, //src/events
    commandsPath: `${__dirname}/commands`,
    validationsPath: `${__dirname}/validations`,
    //devRoleIds: [''],
    bulkRegister: true,
    skipBuiltInValidations: true,
});

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to database.');

    client.login(process.env.TOKEN);
});
