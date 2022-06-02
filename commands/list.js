const { SlashCommandBuilder } = require('@discordjs/builders');
const {db} = require('../models/database')
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const getTableEmbed = require('../functions/getTableEmbed')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('list')
		.setDescription('List all requests'),
	async execute(interaction) {
		
		const reply = getTableEmbed()

		const get = db.prepare('SELECT * FROM Requests');
		const rows = get.all()

		if (rows.length == 0) {
			await interaction.reply({content: "There are no requests!", ephemeral: true}) 
			return
		}

		const sql = db.prepare('SELECT * FROM UserVotes WHERE UserId=?');
		const records = sql.all(interaction.user.id);
		const uuids = records.map((row) => row.RequestId);
		const options = []
		console.log(uuids)
		rows.forEach((row, i) => {
			const emoji = uuids.includes(row.Uuid) ? '✅' : '⭕';
			options.push(
				{
					label: `${row.Name}`,
					description: `${row.Type} | Votes: ${row.Votes}`,
					value: `${row.Uuid}`,
					emoji: {
						name: emoji,
					  },
				}
			);
		})

		const row = new MessageActionRow()
		.addComponents(
			new MessageSelectMenu()
				.setCustomId('voteMenu')
				.setPlaceholder('Vote for what to Watch!')
				.setMinValues(1)
				.addOptions(options),
		);

		await interaction.reply({ content: reply, components: [row], ephemeral: true})
		//await interaction.reply(reply);
			
	},
};