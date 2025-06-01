const { SlashCommandBuilder, ApplicationCommandOptionType } = require('discord.js');
const { QueryType, useMainPlayer } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a song in your channel!')
		.addStringOption((option) =>
			option.setName('query').setDescription('The song you want to play').setRequired(true)
		),
	async execute(interaction) {
		try {
			// Get the voice channel of the user who invoked the command
			const voiceChannel = interaction.member.voice.channel;

			if (!voiceChannel) {
				return interaction.reply('You need to be in a voice channel to play music!');
			}

			// Check if the bot has the necessary permissions to join and speak in the voice channel
			const permissions = voiceChannel.permissionsFor(interaction.client.user);

			if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
				return interaction.reply('I need the permissions to join and speak in your voice channel!');
			}

			await interaction.deferReply();

			// Get the main player instance and user input
			const player = useMainPlayer();
			const query = interaction.options.getString('query');

			// Search for the query using the player
			const searchResult = await player.search(query, {
				requestedBy: interaction.user,
				searchEngine: QueryType.AUTO,
			});

			// If no tracks were found, send a follow-up message and return
			if (!searchResult.hasTracks()) {
				return void interaction.followUp({ content: 'No results were found!' });
			}

			// Play the found track(s) in the user's voice channel
			try {
				await player.play(voiceChannel.id, searchResult, {
					nodeOptions: {
						metadata: {
							channel: interaction.channel,
							client: interaction.guild?.members.me,
							requestedBy: interaction.user.username,
						},
						leaveOnEmptyCooldown: 300000,
						leaveOnEmpty: true,
						leaveOnEnd: true,
						bufferingTimeout: 0,
					},
				});

				await interaction.deleteReply();
			} catch (error) {
				await interaction.editReply({
					content: 'An error has occurred!',
				});
				console.log(error);
			}
		} catch (error) {
			await interaction.reply({
				content: 'There was an error trying to execute that command: ' + error.message,
			});
		}
	},
};
