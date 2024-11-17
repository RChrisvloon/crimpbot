const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder().setName('skip').setDescription('Skips the currently playing song'),
	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);

		if (!queue || !queue.playing) {
			return interaction.reply('There is no song currently playing!');
		}

		queue.node.skip();
		await interaction.reply('Skipped the current song!');
	},
};
