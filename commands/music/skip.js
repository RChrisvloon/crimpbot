const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder().setName('skip').setDescription('Skips the currently playing song'),
	async execute(interaction) {
		await interaction.deferReply();

		const queue = useQueue(interaction.guild.id);

		if (!queue || !queue.currentTrack)
			return void interaction.followUp({ content: '❌ | No music is being played!' });

		const currentTrack = queue.currentTrack;

		const success = queue.node.skip();

		return void interaction.followUp({
			content: success ? `✅ | Skipped **${currentTrack}**!` : '❌ | Something went wrong!',
		});
	},
};
