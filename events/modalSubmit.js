module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
        if (!interaction.isModalSubmit()) return;
        // Get the data entered by the user
        
        //const hobbies = interaction.fields.getTextInputValue('hobbiesInput');
        //console.log({ favoriteColor, hobbies });
	},
};