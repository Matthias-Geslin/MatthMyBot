const { ApplicationCommandOptionType, Client, Interaction } = require('discord.js');
const UserProfile = require('../../models/UserProfile');

module.exports = {
    data: {
        name: 'balance',
        description: "Voir vos crédits ou ceux de quelqu'un d'autre.",
        options: [
            {
                name: 'membre',
                description: 'Le membre dont vous souhaitez voir les crédits.',
                type: ApplicationCommandOptionType.User,
            }
        ],
    },
    
    run: async ({ interaction }) => {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: 'Cette commande peut seulement être lancée dans un serveur.',
                ephemeral: true,
            });
            return;
        }

        const targetUserId = interaction.options.getUser('membre')?.id || interaction.user.id;

        await interaction.deferReply();

        try {
            let userProfile = await UserProfile.findOne({ userId: targetUserId });
            
            if (!userProfile) {
                userProfile = new UserProfile({ userId: targetUserId });
            }
            
            interaction.editReply(
                targetUserId === interaction.user.id ? `Vous avez ${userProfile.balance} crédits` : `<@${targetUserId}> à ${userProfile.balance} crédits.`
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