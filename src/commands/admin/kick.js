const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    data: {
        name: 'kick',
        description: 'Selectionne un membre et kick le.',
        default_member_permissions: '0x0000000000000002',
        contexts: "0",
        options: [
            {
                name: 'target',
                description: "Le membre à kick.",
                type: ApplicationCommandOptionType.User,
                required: true,
            },
            {
                name: 'reason',
                description: "La raison du kick.",
                type: ApplicationCommandOptionType.String,
            },
        ]
    },
    run: async ({ interaction }) => {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') ?? 'Pas de raison apportée.';

        await interaction.reply(`Kick ${target.username} pour la raison suivante: ${reason}`);
        await interaction.guild.members.kick(target);
    },
    options: {
        devOnly: true,
        userPermissions: ['KickMembers'],
        botPermissions: ['KickMembers'],
        //deleted: true
        //cooldown: '1d',
    },
}