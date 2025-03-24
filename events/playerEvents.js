const { EmbedBuilder } = require('discord.js');

module.exports.registerPlayerEvents = (player) => {
	player.events.on('audioTrackAdd', (queue, song) => {
		const embed = new EmbedBuilder()
			.setTitle('Song Added to Queue')
			.setDescription(`🎶 | Song **${song.title}** added to the queue!`)
			.setColor('#0000FF')
			.setTimestamp();

		queue.metadata.channel.send({ embeds: [embed] });
	});

	player.events.on('playerStart', (queue, track) => {
		const embed = new EmbedBuilder()
			.setTitle('Now Playing')
			.setDescription(`▶ | Started playing: **${track.title}**`)
			.setColor('#00FF00')
			.setTimestamp();

		queue.metadata.channel.send({ embeds: [embed] });
	});

	player.events.on('audioTracksAdd', (queue) => {
		let queueStr = `🎶 |  **Upcoming Songs:**\n`;

		queue.tracks.data.forEach((track, index) => {
			queueStr += `${index + 1}. ${track.title} - ${track.author}\n`;
		});

		const embed = new EmbedBuilder()
			.setTitle('Tracks Queued')
			.setDescription(queueStr)
			.setColor('#0000FF')
			.setTimestamp();

		queue.metadata.channel.send({ embeds: [embed] });
	});

	player.events.on('disconnect', (queue) => {
		const embed = new EmbedBuilder()
			.setTitle('Disconnected')
			.setDescription('❌ | I was manually disconnected from the voice channel!')
			.setColor('#FF0000')
			.setTimestamp();

		queue.metadata.channel.send({ embeds: [embed] });
	});

	player.events.on('emptyChannel', (queue) => {
		const embed = new EmbedBuilder()
			.setTitle('Empty Channel')
			.setDescription('❌ | Nobody is in the voice channel, leaving...')
			.setColor('#FF0000')
			.setTimestamp();

		queue.metadata.channel.send({ embeds: [embed] });
	});

	player.events.on('emptyQueue', (queue) => {
		const embed = new EmbedBuilder()
			.setTitle('Queue Finished')
			.setDescription('✅ | Queue finished!')
			.setColor('#00FF00')
			.setTimestamp();

		queue.metadata.channel.send({ embeds: [embed] });
		queue.delete();
	});

	player.events.on('error', (queue, error) => {
		console.error(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
		queue.metadata.channel.send({
			content: `❌ | An error occurred: ${error.message}`,
		});
	});

	player.events.on('playerError', (queue, error) => {
		console.error(`[${queue.guild.name}] Player error: ${error.message}`);
		queue.metadata.channel.send({
			content: `❌ | A player error occurred: ${error.message}. Skipping this track...`,
		});
		queue.node.skip();
	});
};
