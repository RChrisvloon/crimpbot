const { SlashCommandBuilder } = require('discord.js');
const { QueryType, useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays a song from YouTube or Spotify')
		.addStringOption((option) =>
			option.setName('query').setDescription('The song you want to play').setRequired(true)
		),
	async execute(interaction) {
		const query = interaction.options.getString('query');
		const voiceChannel = interaction.member.voice.channel;

		if (!voiceChannel) {
			return interaction.reply('You need to be in a voice channel to play music!');
		}

		const permissions = voiceChannel.permissionsFor(interaction.client.user);
		if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
			return interaction.reply('I need the permissions to join and speak in your voice channel!');
		}

		await interaction.deferReply();

		const searchResult = await interaction.client.player
			.search(query, {
				requestedBy: interaction.user,
				searchEngine: QueryType.AUTO,
			})
			.catch(() => {});
		if (!searchResult || !searchResult.tracks.length) {
			console.log('No results found for query:', query);
			return void interaction.followUp({ content: 'No results were found!' });
		}

		console.log('Search results:', searchResult);

		let queue = useQueue(interaction.guild.id);
		if (!queue) {
			queue = interaction.client.player.nodes.create(interaction.guild, {
				metadata: interaction.channel,
			});
		}

		try {
			if (!queue.connection) {
				console.log('Connecting to voice channel...');
				await queue.connect(voiceChannel);
			}
		} catch (error) {
			console.error('Error connecting to voice channel:', error);
			queue.destroy();
			return void interaction.followUp({ content: 'Could not join your voice channel!' });
		}

		await interaction.followUp({
			content: `⏱ | Loading your ${searchResult.playlist ? 'playlist' : 'track'}...`,
		});

		if (searchResult.playlist) {
			queue.addTracks(searchResult.tracks);
			await interaction.editReply({
				content: `🎶 | Playlist **${searchResult.playlist.title}** has been added to the queue!`,
			});
		} else {
			queue.addTrack(searchResult.tracks[0]);
			await interaction.editReply({
				content: `🎶 | Track **${searchResult.tracks[0].title}** has been added to the queue!`,
			});
		}

		if (!queue.playing) {
			console.log('Starting playback...');
			await queue.node.play();
		}
	},
};
