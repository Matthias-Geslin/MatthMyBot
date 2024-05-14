const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription("Shows server's advanced informations."),
    run: async ({ interaction, client, handler }) => {
        await interaction.reply(`
            Name: ${interaction.guild.name}\n
            Member count: ${interaction.guild.memberCount}\n
            Description : ${interaction.guild.description}\n
            Channels : ${interaction.guild.channels.cache.size}\n
            Creation : <t:${Math.floor(interaction.guild.createdTimestamp / 1000)}:R>\n
            Roles : ${interaction.guild.roles.cache.sort((a, b) => b.position - a.position).map(r => r).join(",")}
        `);
    },
    options: {
        //devOnly: false,
        //userPermissions: ['Administrator'],
        //botPermissions: [''],
        //deleted: true
        //cooldown: '1d',
    },
}