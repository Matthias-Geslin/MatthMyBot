const { ApplicationCommandOptionType, Client, Interaction } = require('discord.js');
const UserProfile = require('../../models/UserProfile');

module.exports = {
    data: {
        name: 'balance',
        description: "See yours/someone else's balance",
        options: [
            {
                name: 'target-user',
                description: 'The user whose balance you want to get.',
                type: ApplicationCommandOptionType.User,
            }
        ],
    },
    
    run: async ({ interaction }) => {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: 'You can only run this command inside a server.',
                ephemeral: true,
            });
            return;
        }

        const targetUserId = interaction.options.getUser('target-user')?.id || interaction.user.id;

        await interaction.deferReply();

        try {
            let userProfile = await UserProfile.findOne({ userId: targetUserId });
            
            if (!userProfile) {
                userProfile = new UserProfile({ userId: targetUserId });
            }
            
            interaction.editReply(
                targetUserId === interaction.user.id ? `Your balance is ${userProfile.balance}` : `<@${targetUserId}>'s balance is ${userProfile.balance}`
            );
        } catch (error) {
            console.log(`Error handling /balance: ${error}`);
        }
    },
    options: {
        //devOnly: false,
        //userPermissions: [''],
        //botPermissions: [''],
        //deleted: true
        //cooldown: '1d',
    },
}