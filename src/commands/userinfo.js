const { ApplicationCommandType, PermissionFlagsBits } = require("discord.js");
 
module.exports = {
    data: {
        name: 'userinfo',
        type: ApplicationCommandType.User,
    },
 
    run: async ({ interaction, client, handler }) => {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return await interaction.reply({ content: "You don't have the perms to execute this command.", ephemeral: true });

        interaction.reply(`Username: ${interaction.targetUser.username}\nID: ${interaction.targetUser.id}.\nUser tag: ${interaction.targetUser.tag}.`);
    },
 
    options: {
        devOnly: true,
        userPermissions: ['Administrator'],
        botPermissions: ['Administrator'],
        deleted: false,
    },
};