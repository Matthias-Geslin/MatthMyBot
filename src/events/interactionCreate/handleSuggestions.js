const Suggestion = require('../../models/Suggestion');
const formatResults = require('../../utils/formatResults');

module.exports = async (interaction) => {
    if (!interaction.isButton() || !interaction.customId) return;

    try {
        const [type, suggestionId, action] = interaction.customId.split('.');
        
        if(!type || !suggestionId || !action) return;
        if (type !== 'suggestion') return;

        await interaction.deferReply({ ephemeral: true });

        const targetSuggestion = await Suggestion.findOne({ suggestionId });
        const targetMessage = await interaction.channel.messages.fetch(targetSuggestion.messageId);
        const targetMessageEmbed = targetMessage.embeds[0];

        if (action === 'approve') {
            if (!interaction.memberPermissions.has('Administrator')) {
                await interaction.editReply("Vous n'avez pas la permission de valider la suggestion.");
                return;
            }
            
            targetSuggestion.status = 'approved';

            targetMessageEmbed.data.color = 0x84e660;
            targetMessageEmbed.fields[1].value = '✅ Validée';
            
            await targetSuggestion.save();

            interaction.editReply('Suggestion validée!');

            targetMessage.edit({
                embeds: [targetMessageEmbed],
                components: [],
            });

            return;
        }

        if (action === 'reject') {
            if (!interaction.memberPermissions.has('Administrator')) {
                await interaction.editReply("Vous n'avez pas la permission pour rejeter la suggestion.");
                return;
            }

            targetSuggestion.status = 'rejected';

            targetMessageEmbed.data.color = 0xff6161;
            targetMessageEmbed.fields[1].value = '🗑️ Rejetée';
            
            await targetSuggestion.save();

            interaction.editReply('Suggestion rejetée!');

            targetMessage.edit({
                embeds: [targetMessageEmbed],
                components: [],
            });

            return;
        }

        if (action === 'upvote') {
            const hasVoted = targetSuggestion.upvotes.includes(interaction.user.id) || targetSuggestion.downvotes.includes(interaction.user.id);

            if (hasVoted) {
                await interaction.editReply('Vous avez déjà voté pour cette suggestion.');
                return;
            }

            targetSuggestion.upvotes.push(interaction.user.id);

            await targetSuggestion.save();

            interaction.editReply('Voté pour la suggestion!');

            targetMessageEmbed.fields[2].value = formatResults(
                targetSuggestion.upvotes,
                targetSuggestion.downvotes,
            );

            targetMessage.edit({
                embeds: [targetMessageEmbed],
            });

            return;
        }


        if (action === 'downvote') {
            const hasVoted = targetSuggestion.upvotes.includes(interaction.user.id) || targetSuggestion.downvotes.includes(interaction.user.id);

            if (hasVoted) {
                await interaction.editReply('Vous avez déjà voté pour cette suggestion.');
                return;
            }

            targetSuggestion.downvotes.push(interaction.user.id);

            await targetSuggestion.save();

            interaction.editReply('Voté contre la suggestion!');

            targetMessageEmbed.fields[2].value = formatResults(
                targetSuggestion.upvotes,
                targetSuggestion.downvotes,
            );

            targetMessage.edit({
                embeds: [targetMessageEmbed],
            });
            
            return;
        }
    } catch (error) {
        console.log(`Error in handleSuggestions ${error}.`)
    }
}