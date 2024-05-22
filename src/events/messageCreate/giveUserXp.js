const { Client, Message } = require('discord.js');
const calculateLevelXp = require('../../utils/calculateLevelXp');
const Level = require('../../models/Level');
const cooldowns = new Set();

function getRandomXp(min, max) {
    min = Math.ceil(min);
    max = Math.ceil(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 */
module.exports = async (message, client) => {
    if (!message.inGuild || message.author.bot || cooldowns.has(message.author.id)) return;

    const xpToGive = getRandomXp(1,10);
    
    const query = {
        userId: message.author.id,
        guildId: message.guild.id,
    };

    try {
        const level = await Level.findOne(query);

        if (level) {
            level.xp += xpToGive;

            if (level.xp > calculateLevelXp(level.level)) {
                level.xp = 0;
                level.level += 1;

                message.channel.send(`${message.member} Tu as monté au niveau **Niveau ${level.level}**`);
            }

            await level.save().catch((e) => {
                console.log(`Erreur à la sauvegarde de la montée de niveau ${e}`);
                return;
            });

            cooldowns.add(message.author.id);
            setTimeout(() => {
                cooldowns.delete(message.author.id);
            }, 60000);
        }

        // if (!level)
        else {
            // create new level
            const newLevel = new Level({
                userId: message.author.id,
                guildId: message.guild.id,
                xp: xpToGive,
            });
            cooldowns.add(message.author.id);
            setTimeout(() => {
                cooldowns.delete(message.author.id);
            }, 60000);
            await newLevel.save();
        }
        
    } catch (error) {
        console.log(`Error giving xp: ${error}`)
    }
}