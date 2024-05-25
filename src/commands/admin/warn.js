const { ApplicationCommandOptionType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Interaction, SlashCommandBuilder, PermissionFlagsBits} = require("discord.js");
const WarningSchema = require('../../models/WarningProfile');

/**
 * @param {Interaction} interaction 
 */
module.exports = {
    data: {
        name: 'warn',
        description: 'Selectionne un membre et averti le.',
        default_member_permissions: '0x0000000000000002',
        options: [
            {
                name: 'membre',
                description: "Le membre à avertir.",
                type: ApplicationCommandOptionType.User,
                required: true,
            },
            {
                name: 'raison',
                description: "La raison de l'avertissement.",
                type: ApplicationCommandOptionType.String,
            }
        ]
    },
   /* data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription("Add, check, delete warns")
        .addSubcommand(s =>
            s.setName("add")
            .setDescription('Add a warning to a user')
            .addUserOption(o=> 
                o
                .setName("user")
                .setDescription('The user to warn')
                .setRequired(true)
            )
            .addStringOption((o) =>
                o.setName("reason").setDescription('The reason for the warning')
            )
            .addIntegerOption((o) =>
                o.setName("duration").setDescription("Duration for the warning to last (in min)")
            )
        )
        .addSubcommand(s =>
            s
            .setName("check")
            .setDescription('Check a warning from a user')
            .addUserOption(o=> 
                o
                .setName("user")
                .setDescription('The user to warn')
            )
        )
        .addSubcommand(s =>
            s
            .setName("delete")
            .setDescription('Delete a warning from a user')
            .addUserOption(o=> 
                o
                .setName("user")
                .setDescription('The user to warn')
                .setRequired(true)
            )
            .addStringOption((o) =>
                o.setName("index").setDescription('The index of the warning to delete')
            )
        )
        .toJSON(),
        userPermissions: [],
        botPermissions: [PermissionFlagsBits.MuteMembers]
    ,*/
    run: async ({ interaction, client }) => {
         const member = interaction.options.getUser('membre');
                const reason = interaction.options.getString('raison') ?? 'Pas de raison apportée';
                let amount = 0;

                const dmSend = new EmbedBuilder()
                    .setColor('#00c7fe')
                    .setDescription(`Vous avez reçu un avertissement dans le serveur: ${interaction.guild.name}.\nPour la raison suivante: ${reason}`);

                const embed = new EmbedBuilder()
                    .setColor('#00c7fe')
                    .setDescription(`✅ Avertissement envoyé à ${member} | ${reason}`);
                
                const confirm = new ButtonBuilder()
                    .setCustomId('confirm')
                    .setLabel('Confirmer')
                    .setStyle(ButtonStyle.Danger)

                const cancel = new ButtonBuilder()
                    .setCustomId('cancel')
                    .setLabel('Annuler')
                    .setStyle(ButtonStyle.Secondary);

                const row = new ActionRowBuilder()
                .addComponents(cancel, confirm);

                const response = await interaction.reply({
                    content: `Êtes vous sur de vouloir avertir ${member.username} pour la raison suivante: ${reason}?`,
                    components: [row],
                });
                
                const collectorFilter = i => i.user.id === interaction.user.id;

                try {
                    //const warning = await WarningSchema.find({ userId: interaction.user.id, guildId: interaction.guild.id});           

                    const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
                    const logModerators = client.channels.cache.find(channel => channel.id === "1242508925425942579");

                    if (confirmation.customId === 'confirm') {
                        
                        //warning.counter+1;

                        await confirmation.update({ content: `${member.username} a été averti pour la raison suivante: ${reason}.`, components: [] });
                        logModerators.send({ embeds: [embed] });

                        await interaction.editReply({ embeds: [embed] });
                        await member.send({ embeds: [dmSend] }).catch(err => { return;});
                    
                    } else if (confirmation.customId === 'cancel') {
                        await confirmation.update({ content: 'Action annulée.', components: [] });
                    }
                    //WarningSchema.save();

                } catch (e) {
                    console.log(e);
                    await interaction.editReply({ content: 'Confirmation non reçue dans la minute suivant la commande /warn, annulation.', components: [] });}
        
                }
    ,
    options: {
        devOnly: true,
        userPermissions: ['KickMembers'],
        botPermissions: ['KickMembers'],
        //deleted: true
        //cooldown: '1d',
    },
}