const { ApplicationCommandOptionType, Client, Interaction } = require("discord.js");
const User = require('../../models/UserProfile');

module.exports = {
    data: {
        name: 'level',
        description: "See yours/someone else's level",
        options: [
            {
                name: 'target-user',
                description: "The user whose level you want to see.",
                type: ApplicationCommandOptionType.Mentionable,
            }
        ]
    },
 
    run: async ({ interaction, client, handler }) => {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: 'You can only run this command inside a server.',
                ephemeral: true,
            });
            return;
        }

        const targetUserId = interaction.options.get('user')?.value || interaction.member.id;

        await interaction.deferReply();

        const user = await User.findOne({ userId: targetUserId, guildId: interaction.guild.id });

        if (!user) {
            interaction.editReply(`<@${targetUserId}> doesn't have a profile yet.`);
            return;
        }

        //user prof exists
        interaction.reply(
            targetUserId === interaction.member.id
                ? `Your balance is **${user.balance}**.`
                : `<@${targetUserId}>'s balance is **${user.balance}**.`
        );
    },
 
    options: {
        //devOnly: true,
        //userPermissions: ['Administrator'],
        //botPermissions: ['Administrator'],
        deleted: false,
    },
};