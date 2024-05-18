const { ApplicationCommandType, PermissionFlagsBits } = require("discord.js");
 
module.exports = {
    data: {
        name: 'translate',
        type: ApplicationCommandType.Message,
    },
 
    run: async ({ interaction, client, handler }) => {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return await interaction.reply({ content: "Vous n'avez pas les permissions pour éxécuter cette commande.", ephemeral: true });

        interaction.reply(`Message original: ${interaction.targetMessage}.\nMessage traduit: ...`);
    },
 
    options: {
        devOnly: true,
        userPermissions: ['Administrator'],
        botPermissions: ['Administrator'],
        deleted: true,
    },
};