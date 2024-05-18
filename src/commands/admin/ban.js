const { ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');

module.exports = {
    data: {
        name: 'ban',
        description: 'Selectionne un membre pour le bannir.',
        default_member_permissions: '0x0000000000000004',
        contexts: "0",
        options: [
            {
                name: 'target',
                description: "Le membre à bannir.",
                type: ApplicationCommandOptionType.User,
                required: true,
            },
            {
                name: 'reason',
                description: "La raison du bannissement.",
                type: ApplicationCommandOptionType.String,
            },
        ]
    },
    run: async ({ interaction }) => {
        
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') ?? 'Pas de raison apportée.';

		const confirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Bannir')
			.setStyle(ButtonStyle.Danger)

		const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Annuler')
			.setStyle(ButtonStyle.Secondary);

		const row = new ActionRowBuilder()
		.addComponents(cancel, confirm);

		const response = await interaction.reply({
			content: `Êtes vous sur de vouloir bannir ${target.username} pour la raison suivante: ${reason}?`,
			components: [row],
		});
		
		const collectorFilter = i => i.user.id === interaction.user.id;
		
		try {
			const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

			if (confirmation.customId === 'confirm') {
				await interaction.guild.members.ban(target);
				await confirmation.update({ content: `${target.username} a été bannis pour la raison suivante: ${reason}`, components: [] });
			} else if (confirmation.customId === 'cancel') {
				await confirmation.update({ content: 'Action annulée.', components: [] });
			}
		} catch (e) {
			await interaction.editReply({ content: 'Confirmation non reçue dans la minute suivant la commande /ban, annulation.', components: [] });
		}

    },
    options: {
        //devOnly: false,
        userPermissions: ['BanMembers'],
        botPermissions: ['BanMembers'],
        //deleted: true
        //cooldown: '1d',
    },
}