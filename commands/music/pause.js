const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pauses the currently playing song'),
	async execute(interaction) {
		const queue = interaction.client.player.getQueue(interaction.guild.id);

		if (!queue || !queue.playing) {
			return interaction.reply('There is no song currently playing!');
		}

		queue.setPaused(true);
		await interaction.reply('Paused the current song!');
	},
};
