const { ApplicationCommandOptionType, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const choices = [
    { name: 'Pierre', emoji: '🪨', beats: 'Ciseaux'},
    { name: 'Feuille', emoji: '📄', beats: 'Pierre'},
    { name: 'Ciseaux', emoji: '✂️', beats: 'Feuille'},
];

module.exports = {
    data: {
        name: 'pfc',
        description: 'Pierre Feuille Ciseaux avec un autre joueur.',
        dm_persmission: false,
        options: [
            {
                name: 'user',
                description: "Le membre avec qui vous voulez jouer.",
                type: ApplicationCommandOptionType.User,
                required: true,
            }
        ]
    },
 
    run: async ({ interaction }) => {
        try {
            const targetUser = interaction.options.getUser('user');

            if (interaction.user.id === targetUser.id) {
                interaction.reply({
                    content: 'Vous ne pouvez pas jouer avec vous même.',
                    ephemeral: true,
                });

                return;
            }

            if (targetUser.bot) {
                interaction.reply({
                    content: 'Vous ne pouvez pas jouer avec un bot.',
                    ephemeral: true,
                });

                return;
            }

            const embed = new EmbedBuilder()
                .setTitle('Pierre Feuille Ciseaux')
                .setDescription(`C'est le tour de: ${targetUser}.`)
                .setColor('Yellow')
                .setTimestamp(new Date())

            const buttons = choices.map((choice) => {
                return new ButtonBuilder()
                    .setCustomId(choice.name)
                    .setLabel(choice.name)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(choice.emoji)
            });

            const row = new ActionRowBuilder().addComponents(buttons);

            const reply = await interaction.reply({
                content: `${targetUser}, vous avez été défié à une partie de Pierre Feuille Ciseaux, par ${interaction.user}.\nPour commencer à jouer, cliquez sur un bouton en dessous.`,
                embeds: [embed],
                components: [row],
            });

            const targetUserInteraction = await reply.awaitMessageComponent({
                filter: (i) => i.user.id === targetUser.id,
                time: 30000,
            }).catch( async (error) => {
                embed.setDescription(`Perdu ..! ${targetUser} n'a pas répondu à temps.`);
                await reply.edit({ embeds: [embed], components: [] });
            });

            if (!targetUserInteraction) return;

            const targetUserChoice = choices.find(
                (choice) => choice.name === targetUserInteraction.customId,
            );

            await targetUserInteraction.reply({
                content: `Vous avez choisis ${targetUserChoice.name + targetUserChoice.emoji}`,
                ephemeral: true,
            });
            
            // edit embed w/ updated user turn
            embed.setDescription(`C'est au tour de: ${interaction.user}.`);
            await reply.edit({
                content: `${interaction.user} C'est votre tour maintenant.`,
                embeds: [embed],
            });

            const initialUserInteraction = await reply.awaitMessageComponent({
                filter: (i) => i.user.id === interaction.user.id,
                time: 30000,
            }).catch( async (error) => {
                embed.setDescription(`Perdu ..! ${interaction.user} n'a pas répondu à temps.`);
                await reply.edit({ embeds: [embed], components: [] });
            });

            if (!initialUserInteraction) return;

            const initialUserChoice = choices.find(
                (choice) => choice.name === initialUserInteraction.customId
            );

            let result;

            if (targetUserChoice.beats === initialUserChoice.name) {
                result = `${targetUser} Gagné!`;
            }

            if (initialUserChoice.beats === targetUserChoice.name) {
                result = `${interaction.user} Gagné!`;
            }

            if (targetUserChoice.beats === initialUserChoice.name) {
                result = "C'est une égalité!";
            }

            embed.setDescription(
                `${targetUser} à choisi ${targetUserChoice.name + targetUserChoice.emoji}\n${interaction.user} à choisi ${initialUserChoice.name + initialUserChoice.emoji}\n\n ${result}.`
            );

            reply.edit({ embeds: [embed], components: [] });
        } catch (error) {
            console.log(`Error with /pfc.`);
            console.error(error);
        }

    },
 
    options: {},
}