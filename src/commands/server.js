const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription("Affiche d'avantages d'informations liées au serveurd discord."),
    run: async ({ interaction }) => {
        await interaction.reply(`
            Nom du serveur: ${interaction.guild.name}\n
            Nombre de membres: ${interaction.guild.memberCount}\n
            Description : ${interaction.guild.description}\n
            Nombre de canaux au total: ${interaction.guild.channels.cache.size}\n
            Date de création : <t:${Math.floor(interaction.guild.createdTimestamp / 1000)}:R>\n
            Liste des rôles : ${interaction.guild.roles.cache.sort((a, b) => b.position - a.position).map(r => r).join(",")}
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