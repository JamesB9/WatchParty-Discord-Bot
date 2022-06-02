const { SlashCommandBuilder } = require('@discordjs/builders');
const {db} = require('../models/database')
const { v4: uuidv4 } = require('uuid');

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
        const uuid = uuidv4();
        const userID = interaction.user.id;

        /*const transaction = db.transaction(() => {
            const insert = db.prepare('INSERT INTO Requests VALUES (?, ?, ?, ?, ?)');
            insert.run(uuid, type, name, new Date().toISOString(), 0)

            const insert2 = db.prepare('INSERT INTO UserVotes VALUES (?, ?)');
            insert2.run(uuid, userID)
        })
        transaction()*/
        const insert = db.prepare('INSERT INTO Requests VALUES (?, ?, ?, ?, ?)');
        insert.run(uuid, type, name, new Date().toISOString(), 1)

        const insert2 = db.prepare('INSERT INTO UserVotes VALUES (?, ?)');
        insert2.run(uuid, userID)

        await interaction.reply({ content: `Request received for the ${type}: ${name}`, ephemeral: true });
    },
};