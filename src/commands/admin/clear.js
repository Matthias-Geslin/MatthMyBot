const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear the chat.')
        .addIntegerOption(option => option.setName('amount').setDescription('The amount of messages to delete').setMinValue(1).setMaxValue(100).setRequired(true)),
    run: async ({ interaction, client, handler }) => {
        const amount = interaction.options.getInteger('amount');

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) return await interaction.reply({ content: "You don't have the perms to execute this command.", ephemeral: true });
        if (!amount) return await interaction.reply({ content: "Please specify the amount of messages you want to delete.", ephemeral: true });
        if (amount < 1 || amount > 100) return await interaction.reply({ content: "Please select a number **between** 1 and 100.", ephemeral: true })
            
        await interaction.channel.bulkDelete(amount).catch(err => {
            return;
        });
        interaction.reply({ content: "Messages deleted.", ephemeral: true });
    },
    options: {
        devOnly: true,
        userPermissions: ['ManageMessages'],
        botPermissions: ['ManageMessages'],
        //deleted: false
        //cooldown: '1d',
    },
}