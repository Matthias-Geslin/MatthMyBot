const { ApplicationCommandType, PermissionFlagsBits } = require("discord.js");
 
module.exports = {
    data: {
        name: 'userinfo',
        type: ApplicationCommandType.User,
    },
 
    run: async ({ interaction }) => {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return await interaction.reply({ content: "Vous n'avez pas les permissions pour éxécuter cette commande.", ephemeral: true });

        interaction.reply(`Nom d'utilisateur: ${interaction.targetUser.username}\nID: ${interaction.targetUser.id}.\nTag utilisateur: ${interaction.targetUser.tag}.`);
    },
 
    options: {
        devOnly: true,
        userPermissions: ['Administrator'],
        botPermissions: ['Administrator'],
        deleted: false,
    },
};