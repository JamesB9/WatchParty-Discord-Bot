const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('frazzlee')
		.setDescription('Says Hi!'),
	async execute(interaction) {
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('primary')
                .setLabel('FRAZZLE BUTTON')
                .setStyle('PRIMARY'),
        );

    await interaction.reply({ content: '```This is a new frazzle message!```', components: [row] });
	},
};