const { Client, Interaction } = require('discord.js');
const UserProfile = require('../../models/UserProfile');

const dailyAmount = 100;

module.exports = {
    data: {
        name: "daily",
        description: "Récuperer des crédits quotidien."
    },
    run: async ({ interaction }) => {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: "Cette commande peut seulement être lancée dans un serveur.",
                ephemeral: true,
            });
        }

        try {
            await interaction.deferReply();

            let userProfile = await UserProfile.findOne({
                userId: interaction.member.id,
            });

            if (userProfile) {
                const lastDailyDate = userProfile.lastDailyCollected?.toDateString();
                const currentDate = new Date().toDateString();
                
                if (lastDailyDate === currentDate) {
                    interaction.editReply("Vous avez déjà collectés vos crédits aujourd'hui. Revenez demain !");
                    return;
                }
            } else {
                userProfile = new UserProfile({
                    userId: interaction.member.id
                });
            }

            userProfile.balance += dailyAmount;
            userProfile.lastDailyCollected = new Date();
            await userProfile.save();
            
            interaction.editReply(
                `${dailyAmount} crédits ont été ajouté à votre compte.\nCrédits: ${userProfile.balance}`
            );

        } catch (error) {
            console.log(`Error handling /daily ${error}.`);
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