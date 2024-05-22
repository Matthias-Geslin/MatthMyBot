const { ApplicationCommandOptionType, AttachmentBuilder, Colors } = require("discord.js");
const { Font, RankCardBuilder } = require('canvacord');
const calculateLevelXp = require('../../utils/calculateLevelXp');
const Level = require('../../models/Level');

module.exports = {
    data: {
        name: 'level',
        description: "Voir votre niveau ou celui d'un autre",
        options: [
            {
                name: 'membre',
                description: "Le membre dont vous souhaitez voir le niveau.",
                type: ApplicationCommandOptionType.User,
            }
        ]
    },
 
    run: async ({ interaction, client }) => {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: 'Vous ne pouvez lancer cette commande que dans un serveur.',
                ephemeral: true,
            });
            return;
        }

        await interaction.deferReply();

        const mentionedUserId = interaction.options.get('membre')?.value;
        const targetUserId = mentionedUserId || interaction.member.id;
        const targetUserObj = await interaction.guild.members.fetch(targetUserId);

        const fetchedLevel = await Level.findOne({
            userId: targetUserId,
            guildId: interaction.guild.id,
        });

        if (!fetchedLevel) {
            interaction.editReply(
                mentionedUserId ? `${targetUserObj.user.tag} n'a pas de niveau encore. Réessayez quand il parlera un peu plus.` : `Vous n'avez pas de niveau encore. Parlez un peu plus & réessayez.`
            );
            return;
        }

        let allLevels = await Level.find({ guildId: interaction.guild.id }).select('-_id userId xp level');
        
        allLevels.sort((a, b) => {
            if (a.level === b.level) {
                return b.xp - a.xp;
            } else {
                return b.level - a.level;
            }
        });

        let currentRank = allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;

        Font.loadDefault();

        const rank = new RankCardBuilder()
            .setDisplayName(targetUserObj.user.globalName)
            .setUsername(targetUserObj.user.username)
            .setAvatar(targetUserObj.user.displayAvatarURL({ size: 256 }))
            .setRank(currentRank)
            .setLevel(fetchedLevel.level)
            .setCurrentXP(fetchedLevel.xp)
            .setRequiredXP(calculateLevelXp(fetchedLevel.level))
            .setOverlay(10)
            //.setBackground("#23272a")
            .setStatus(targetUserObj.presence.status)
            .setTextStyles({
                level: "NIVEAU :",
                xp: "EXP :",
                rank: "CLASSEMENT :",
            })
            .setStyles({
                username: {
                    handle: {
                        style: {
                            color: "#FFFFFF"
                        }
                    }
                },
                // block toutes infos à droite
                container: {
                    style: {
                        backgroundColor: '#777e91'
                    }
                },
                // style de la bordure ext
                background: {
                  style: {
                    backgroundColor: '#334680'
                  }  
                },
                // style fond int
                overlay: {
                    style: {
                        backgroundColor: '#777e91'
                    }
                },
                progressbar: {
                    // barre xp remplie
                    thumb: {
                      style: {
                        backgroundColor: '#163287'
                      },
                    },
                    // barre xp non remplie
                    track: {
                      style: {
                        backgroundColor: "#faa61a"
                      },
                    },
                },
                statistics: {
                    container: {
                        style: {
                            backgroundColor: '#777e91'
                        },
                    },
                    level: {
                        container: {},
                        text: {
                            style: {
                                color: "#163287"
                            },
                        },
                        value: {},
                    },
                    rank: {
                        container: {},
                        text: {
                            style: {
                                color: "#163287"
                            },
                        },
                        value: {},
                    },
                    xp: {
                        container: {},
                        text: {
                            style: {
                                color: "#163287"
                            },
                        },
                        value: {},
                    },
                }
            })
            /*
            
            .setBackground("#23272a") // set background color or,
            .setBackground("./path/to/image.png") // set background image
            */

            const data = await rank.build({ format: "png"});
            const attachment = new AttachmentBuilder(data);
            interaction.editReply({ files: [attachment] });
    },
 
    options: {
        //devOnly: true,
        //userPermissions: ['Administrator'],
        //botPermissions: ['Administrator'],
        deleted: false,
    },
};