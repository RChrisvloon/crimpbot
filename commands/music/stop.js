const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stops the music and clears the queue'),
	async execute(interaction) {
		await interaction.deferReply();

		const queue = useQueue(interaction.guild.id);

		if (!queue || !queue.currentTrack) {
			return void interaction.followUp({ content: '❌ | No music is being played!' });
		}

		queue.node.stop();
		return void interaction.followUp({ content: '✅ | Stopped the music and cleared the queue!' });
	},
};
