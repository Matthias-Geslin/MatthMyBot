const { ModalBuilder, TextInputBuilder, ActionRowBuilder, EmbedBuilder, TextInputStyle, ButtonBuilder, ButtonStyle } = require('discord.js');
const GuildConfiguration = require('../models/GuildConfiguration');
const Suggestion = require('../models/Suggestion');
const formatResults = require('../utils/formatResults');

module.exports = {
    data: {
        name: 'suggest',
        description:'Créer une suggestion. À utiliser dans le canal de suggestion',
        dm_permission: false,
    },
    run: async ({ interaction, client }) => {
       try {
        const guildConfiguration = await GuildConfiguration.findOne({ guildId: interaction.guildId });

        if (!guildConfiguration?.suggestionChannelIds.length) {
            await interaction.reply(
                "Ce serveur n'a pas encore été configuré aux suggestions.\nDemandez à un administrateur de lancer `/config-suggestions add` pour commencer la mise en place.");
            return;
        }

        if (!guildConfiguration.suggestionChannelIds.includes(interaction.channelId)) {
            await interaction.reply(
                `Ce canal n'est pas configuré pour les suggestions. Essayez un de ceux là à la place: ${guildConfiguration.suggestionChannelIds.map((id) => `<#${id}>`).join(',')}`
            );
        }

        const modal = new ModalBuilder()
            .setTitle('Créer une suggestion')
            .setCustomId(`suggestion-${interaction.user.id}`);

        const textInput = new TextInputBuilder()
            .setCustomId('suggestion-input')
            .setLabel('Que souhaitez-vous suggérer ?')
            .setPlaceholder('Contenu du message à suggérer')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setMaxLength(1000);

        const actionRow = new ActionRowBuilder().addComponents(textInput);

        modal.addComponents(actionRow);

        await interaction.showModal(modal);

        const filter = (i) => i.customId === `suggestion-${interaction.user.id}`;

        const modalInteraction = await interaction.awaitModalSubmit({
            filter,
            time: 1000 * 60 * 5
        }).catch((error) => console.log(error));

        await modalInteraction.deferReply({ ephemeral: true });
        let suggestionMessage;

        try {
            suggestionMessage = await interaction.channel.send("Création de la suggestion, s'il vous plait patientez ...");
        } catch (error) {
            modalInteraction.editReply(
                "Échec à la création de la suggestion dans ce canal. Je n'ai peut-être pas les permissions pour."
            );
            return;
        }
        // interaction.options.getMember("nickname")
        const suggestionText = modalInteraction.fields.getTextInputValue('suggestion-input');
        const newSuggestion = new Suggestion({
            authorId: interaction.member.nickname,
            guildId: interaction.guildId,
            messageId: suggestionMessage.id,
            content: suggestionText,
        });

        await newSuggestion.save();

        modalInteraction.editReply('Suggestion créée!');


        // suggestion embed
        const suggestionEmbed = new EmbedBuilder()
            .setAuthor({
                name: interaction.user.displayName,
                iconURL: interaction.user.displayAvatarURL({ size: 256 }),
            })
            .addFields([
                { name: 'Suggestion', value: suggestionText },
                { name: "État actuel", value:'⌛ En attente' },
                { name: 'Votes', value: formatResults() }
            ])
            .setColor('Yellow')

        //buttons 
        const upvoteButton = new ButtonBuilder()
            .setEmoji('👍')
            .setLabel('Pour')
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`suggestion.${newSuggestion.suggestionId}.upvote`);

            const downvoteButton = new ButtonBuilder()
            .setEmoji('👎')
            .setLabel('Contre')
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`suggestion.${newSuggestion.suggestionId}.downvote`);

            const approveButton = new ButtonBuilder()
            .setEmoji('✅')
            .setLabel('Approuver')
            .setStyle(ButtonStyle.Success)
            .setCustomId(`suggestion.${newSuggestion.suggestionId}.approve`);

            const rejectButton = new ButtonBuilder()
            .setEmoji('🗑️')
            .setLabel('Rejeter')
            .setStyle(ButtonStyle.Danger)
            .setCustomId(`suggestion.${newSuggestion.suggestionId}.reject`);

            // rows
            const firstRow = new ActionRowBuilder().addComponents(upvoteButton, downvoteButton); 
            const secondRow = new ActionRowBuilder().addComponents(approveButton, rejectButton);

            suggestionMessage.edit({
                content: `${interaction.user} Suggestion créée. Place aux votes ci dessous, Pour ou Contre.\nSelon l'avancée des votes, la suggestion sera validée ou non par @Matt.`,
                embeds: [suggestionEmbed],
                components: [firstRow, secondRow],
            });
       } catch (error) {
        console.log(`Errors in /suggest: ${error}.`);
       }
    },
    options: {
        //devOnly: false,
        //userPermissions: [''],
        //botPermissions: [''],
        //deleted: true
        //cooldown: '1d',
    },
}