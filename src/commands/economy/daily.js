const { Client, Interaction } = require('discord.js');
const UserProfile = require('../../models/UserProfile');

const dailyAmount = 100;

module.exports = {
    data: {
        name: "daily",
        description: "Collect dailies!"
    },
    run: async ({ interaction }) => {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: "This command can only be executed inside a server.",
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
                    interaction.editReply("You have already collected your dailies today. Come back tomorrow.");
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
                `${dailyAmount} was added to your balance.\nNew balance: ${userProfile.balance}`
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