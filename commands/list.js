const { SlashCommandBuilder } = require('@discordjs/builders');
const {db} = require('../models/database')
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('list')
		.setDescription('List all requests'),
	async execute(interaction) {
		
		const get = db.prepare('SELECT * FROM Requests');
        const rows = get.all()
		console.log(rows[0])
		var reply = "TYPE\t| Name\t| Date Requested\n"
		
		rows.forEach((row, i) => {
			var date = new Date(row.Date).toDateString()
			reply += `${row.Type}\t| ${row.Name}\t| ${date}\n`
		})

		// inside a command, event listener, etc.
		const exampleEmbed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Request List')
		.setAuthor({ name: 'WatchParty Bot' })
		.setDescription('```Test   test   test\n1       1        1\n```')
		.setTimestamp()
		.setFooter({ text: 'WatchParty Bot - TheNightwisp',  });


		await interaction.reply({ embeds: [exampleEmbed] });
			
	},
};