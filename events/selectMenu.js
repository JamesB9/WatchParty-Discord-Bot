const {db} = require('../models/database')
const getTableEmbed = require('../functions/getTableEmbed')
const { MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
        if (!interaction.isSelectMenu()) return;

        if (interaction.customId === 'voteMenu') {
            //const insert = db.prepare('INSERT INTO Requests VALUES (?, ?, ?, ?, ?)');
            //insert.run(uuid, type, name, new Date().toISOString(), 0)
    
            interaction.values.forEach((requestUuid) => {
                const sql = db.prepare('SELECT * FROM UserVotes WHERE RequestId=? AND UserId=?');
                const records = sql.all(requestUuid, interaction.user.id);
                if(records.length == 0) { // VOTE
                    sql2 = db.prepare('UPDATE Requests SET Votes=Votes+1 WHERE Uuid=?')
                    sql3 = db.prepare('INSERT INTO UserVotes VALUES(?, ?)')
                    sql2.run(requestUuid)
                    sql3.run(requestUuid, interaction.user.id)
                }else { // REMOVE VOTE
                    sql2 = db.prepare('UPDATE Requests SET Votes=Votes-1 WHERE Uuid=?')
                    sql3 = db.prepare('DELETE FROM UserVotes WHERE RequestId=? AND UserId=?')
                    sql2.run(requestUuid)
                    sql3.run(requestUuid, interaction.user.id)
                }
            })

            const reply = getTableEmbed()

            const sql = db.prepare('SELECT * FROM UserVotes WHERE UserId=?');
            const records = sql.all(interaction.user.id);
            const uuids = records.map((row) => row.RequestId);
            const options = []
            console.log(uuids)
            const get = db.prepare('SELECT * FROM Requests');
            const rows = get.all()
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

            await interaction.update({ content: reply, components: [row], ephemeral: true });
        }
	},
};