const { ApplicationCommandType, PermissionFlagsBits } = require("discord.js");
 
module.exports = {
    data: {
        name: 'translate',
        type: ApplicationCommandType.Message,
    },
 
    run: async ({ interaction, client, handler }) => {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return await interaction.reply({ content: "You don't have the perms to execute this command.", ephemeral: true });

        interaction.reply(`Original message: ${interaction.targetMessage}.\nTranslated message: ...`);
    },
 
    options: {
        devOnly: true,
        userPermissions: ['Administrator'],
        botPermissions: ['Administrator'],
        deleted: false,
    },
};