const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription("Supprime un certain nombre de messages du canal de texte actuel.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(option => option.setName('nombre').setDescription('Le nombre de messages à supprimer. Entre 1 & 100.').setMinValue(1).setMaxValue(100).setRequired(true)),
    run: async ({ interaction }) => {
        const amount = interaction.options.getInteger('nombre');

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) return await interaction.reply({ content: "Vous n'avez pas les permissions requises à l'utilisation de cette commande.", ephemeral: true });
        if (!amount) return await interaction.reply({ content: "Spécifier le nombre de messages à supprimer.", ephemeral: true });
        if (amount < 1 || amount > 100) return await interaction.reply({ content: "Choisissez un nombre **entre** 1 et 100.", ephemeral: true })
            
        await interaction.channel.bulkDelete(amount).catch(err => {
            return;
        });
        interaction.reply({ content: "Messages supprimés.", ephemeral: true });
    },
    options: {
        devOnly: true,
        userPermissions: ['ManageMessages'],
        botPermissions: ['ManageMessages'],
        //deleted: false
        //cooldown: '1d',
    },
}