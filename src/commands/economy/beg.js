const Cooldown = require('../../models/Cooldown');
const UserProfile = require('../../models/UserProfile');

function getRandomNumber(x,y) {
    const range = y - x + 1;
    const randomNumber = Math.floor(Math.random() * range);
    return randomNumber + x;
}

module.exports = {
    data: {
        name: "beg",
        description: "Supplier quelques crédits."
    },
    run: async ({ interaction }) => {
        if(!interaction.inGuild()) {
            await interaction.reply({
                content: "Cette commande peut seulement être lancée dans un serveur.",
                ephemeral: true,
            });
            return;
        }

        try {
            await interaction.deferReply();

            const commandName = 'beg';
            const userId = interaction.user.id;
            const chance = getRandomNumber(0,100);
            const amount = getRandomNumber(1,20);

            let cooldown = await Cooldown.findOne({ userId, commandName });

            if(cooldown && Date.now() < cooldown.endsAt) {
                const { default: prettyMs } = await import('pretty-ms');

                await interaction.editReply(
                    `Vous avez un cooldown, revenez après ${prettyMs(cooldown.endsAt - Date.now())}`
                );
                return;
            }

            if (!cooldown) {
                cooldown = new Cooldown({ userId, commandName });
            }

            if (chance < 40) {
                await interaction.editReply("Vous n'avez rien eu cette fois. Réessayez plus tard.");

                cooldown.endsAt = Date.now() + 300000; // 5 min in milisec
                await cooldown.save();
                return;
            }

            let userProfile = await UserProfile.findOne({ userId }).select('userId balance');

            if (!userProfile) {
                userProfile = new UserProfile({ userId });
            }
            
            userProfile.balance += amount;
            cooldown.endsAt = Date.now() + 300000;

            await Promise.all([cooldown.save(), userProfile.save()]);

            await interaction.editReply(`Vous avez reçu ${amount}!\nVous avez ${userProfile.balance} crédits.`);
        } catch (error) {
            console.log(`Error handling /beg: ${error}`);
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