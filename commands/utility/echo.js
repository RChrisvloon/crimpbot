const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('echo')
		.setDescription('Replies with your input!')
		.addStringOption((option) =>
			option.setName('input').setDescription('The input to echo back').setRequired(true)
		),

	async execute(interaction) {
		// Get the input value from the interaction options
		// interaction.options is an object that contains the data passed by the user when they interact with a slash command
		const userInput = interaction.options.getString('input');

		// Reply with the input provided by the user
		await interaction.reply({
			content: `You said: ${userInput}`,
		});
	},
};
