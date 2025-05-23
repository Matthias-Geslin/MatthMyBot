const Parser = require('rss-parser');
const NotificationConfig = require('../../models/NotificationConfig');

const parser = new Parser();

module.exports = (client) => {

    checkYoutube();

    setInterval(checkYoutube, 3,6e+6);
    async function checkYoutube() {
        try {
            const notificationConfigs = await NotificationConfig.find();

            for (const notificationConfig of notificationConfigs) {
                const YOUTUBE_RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${notificationConfig.ytChannelId}`;
                
                const feed = await parser.parseURL(YOUTUBE_RSS_URL).catch((e) => null);

                if (!feed?.items.length) continue; // if feed is null || 0 , continue

                const latestVideo = feed.items[0];
                const lastCheckedVid = NotificationConfig.lastCheckedVid;
                
                if (!lastCheckedVid || (latestVideo.id.split(':')[2] !== lastCheckedVid.id && new Date(lastestVideo.pubDate) > new Date(lastCheckedVid.pubDate))) {
                    const targetGuild = client.guilds.cache.get(notificationConfig.guildId) || (await client.guild.fetch(notificationConfig.guildId));

                    if (!targetGuild) {
                        await NotificationConfig.findOneAndDelete({ _id: notificationConfig._id });
                        continue;
                    }

                    const targetChannel = targetGuild.channels.cache.get(notificationConfig.notificationChannelId) || (await targetGuild.channels.fetch(notificationConfig.notificationChannelId));

                    if(!targetChannel) {
                        await NotificationConfig.findOneAndDelete({ _id: notificationConfig._id });
                        continue;
                    }

                    notificationConfig.lastCheckedVid = {
                        id: latestVideo.id.split(':')[2],
                        pubDate: latestVideo.pubDate,
                    };

                    notificationConfig.save()
                        .then(() => {
                            const targetMessage = notificationConfig.customMessage
                                ?.replace('{VIDEO_URL}', latestVideo.link)
                                ?.replace('{VIDEO_TITLE}', latestVideo.title)
                                ?.replace('{CHANNEL_URL}', feed.link)
                                ?.replace('{CHANNEL_NAME}', feed.title) ||
                                `New upload by ${feed.title}\n${latestVideo.link}`;

                                targetChannel.send(targetMessage);
                        })
                        .catch((e) => null);
                }
            }
        } catch (error) {
            console.log(`Error in ${__filename}:\n`, error);
        }
    }
};