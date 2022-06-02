const { SlashCommandBuilder } = require('@discordjs/builders');
const {db} = require('../models/database')
const client = require('../app.js')

function create_embed(name, username, date) {
    const embed = {
        color: 0x0099ff,
        title: `🗓️ Watch party for "${name}"`,
        description: `Created by ${username}`,
        fields: [
            {
                name: 'Event Time',
                value: `'${date.toUTCString()}'`,
            },
            {
                name: 'Attendees',
                value: "No one :(",
            }
        ],
        footer: {
            text: '✅ RSVP | 🕒 Notify Me',
        },
    };

    return embed;
}

function set_attendees(embed, attendees) {
    var attendeeValue = ""
    attendees.forEach((attendee, i) => {
        attendeeValue += `> ${attendee}`
        if(i+1 != attendees.length) attendeeValue += "\n"
    })
    embed.fields[1].value = attendeeValue
    return embed;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('watch')
        .setDescription('Start a Watch Party!')
        .addStringOption(option => {
            option.setName('watch')
                .setDescription('The film/series to watch')
                .setRequired(true)

            const get = db.prepare('SELECT * FROM Requests');
            const rows = get.all()
            rows.forEach((row, i) => {
                option.addChoices(
                    {name: row.Name, value: row.Uuid}
                )
            });

            return option;
        }),

	async execute(interaction) {
        const uuid = interaction.options.getString('watch');

        const get = db.prepare('SELECT Name FROM Requests WHERE Uuid=?');
        const rows = get.all(uuid)

        var embed = create_embed(rows[0].Name, interaction.user.username, new Date())
		const message = await interaction.channel.send({embeds: [embed] });

        message.react('✅').then(() => message.react('🕒')).catch(error => console.error('One of the emojis failed to react:', error));
        const filter = (reaction, user) => {
            return ['✅', '🕒'].includes(reaction.emoji.name) && !user.bot; // Get reactions that aren't the bot's
        };

        message.awaitReactions({ filter, max: 1, time: 60000, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first();
                //reaction.users.cache.has(userId)
                if (reaction.emoji.name === '✅') {
                    console.log("REACTED")

                    reaction.users.fetch().then(users => {
                        usernames = users.filter(user => !user.bot).map(user => user.username)
                        embed = set_attendees(embed, usernames)
                        message.edit({embeds: [embed] })
                    })
                }
            })
            .catch(collected => {
                
            });
	},
};