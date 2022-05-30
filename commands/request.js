const { SlashCommandBuilder } = require('@discordjs/builders');
const {db} = require('../models/database')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('request')
        .setDescription('Displays form to allow requesting of films and TV/Series')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Film or Series')
                .setRequired(true)
                .addChoices(
                    { name: 'Film', value: 'film' },
                    { name: 'Series', value: 'series' },
                ))
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Name of film/series')
                .setRequired(true)),

    async execute(interaction) {
        const type = interaction.options.getString('type');
        const name = interaction.options.getString('name');

        const insert = db.prepare('INSERT INTO Requests VALUES (?, ?, ?)');
        insert.run(type, name, new Date().toISOString())

        await interaction.reply({ content: `Request received for the ${type}: ${name}`, ephemeral: true });
    },
};