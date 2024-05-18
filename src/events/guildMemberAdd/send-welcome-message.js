const welcomeChannelSchema = require('../../models/WelcomeChannel');

module.exports = async (guildMember) => {
    try {
        if(guildMember.user.bot) return; // if bot joins, do nthing

        const welcomeConfigs =  await welcomeChannelSchema.find({
            guildId: guildMember.guild.id,
        });

        if (!welcomeConfigs.length) return;

        for (const welcomeConfig of welcomeConfigs) {
            const targetChannel = guildMember.guild.channels.cache.get(
                welcomeConfig.channelId
            ) || (await guildMember.guild.channels.fetch(
                welcomeConfig.channelId
            ));

            if (!targetChannel) {
                welcomeChannelSchema.findOneAndDelete({
                    guildId: guildMember.guild.id,
                    channelId: welcomeConfig.channelId,
                }).catch(() => {});
                return;
            }

            const customMessage = welcomeConfig.customMessage || "🎉 Bienvenue {mention-member} sur {server-name}. Dites bonjour à {username}! 😊";

            const welcomeMessage = customMessage
                .replace('{mention-member}', `<@${guildMember.id}>`)
                .replace('{username}', guildMember.user.username)
                .replace('{server-name}', guildMember.guild.name);

            targetChannel.send(welcomeMessage);
        }
    } catch (error) {
        console.log(`Error in ${__filename}:\n`, error);
    }
}