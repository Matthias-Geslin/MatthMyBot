const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const NotificationConfig = require('../../models/NotificationConfig');

async function run({ interaction }) {
    try {
        await interaction.deferReply({ ephemeral: true });

        const targetYtChannelId = interaction.options.getString('youtube-id');
        const targetNotificationChannel = interaction.options.getChannel('target-channel');

        const targetChannel = await NotificationConfig.findOne({
            ytChannelId: targetYtChannelId,
            notificationChannelId: targetNotificationChannel.id,
        });

        if (!targetChannel) {
            interaction.followUp('That YouTube channel has not been configured for notifications.');
            return;
        }

        NotificationConfig.fineOneAndDelete({ _id: targetChannel._id }) // unique _id from mongoDB 
            .then(() =>{
                interaction.followUp('Turned off notifications for that channel.');
            })
            .catch((e) => {
                interaction.followUp('There was a database error. Please try again later.');
            });
    } catch (error) {
        console.log(`Error in ${__filename}:\n`, error);
    }
}

const data = new SlashCommandBuilder()
    .setName('notification-remove')
    .setDescription('Turn off notifications for a channel')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) => 
        option
            .setName('youtube-id')
            .setDescription('The ID of the target YouTube channel.')
            .setRequired(true)
    )
    .addChannelOption((option) => 
        option
            .setName('target-channel')
            .setDescription('The channel to turn off notifications for.')
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
            .setRequired(true)
    )

module.exports = { data, run }