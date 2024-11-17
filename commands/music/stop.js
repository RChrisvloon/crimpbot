const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stops the music and clears the queue'),
	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);

		if (!queue || !queue.playing) {
			return interaction.reply('There is no song currently playing!');
		}

		queue.destroy();
		await interaction.reply('Stopped the music and cleared the queue!');
	},
};
