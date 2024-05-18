module.exports = {
    data: {
        name: 'ping',
        description: 'Send a Ping!'
    },
    run: ({ interaction, client, handler }) => {
        interaction.reply('Pong!');
    },
    options: {
        //devOnly: false,
        //userPermissions: [''],
        //botPermissions: [''],
        //deleted: true
        //cooldown: '1d',
    },
}