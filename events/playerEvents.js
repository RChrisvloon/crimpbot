module.exports = (client) => {
	client.player.events.on('error', (queue, error) => {
		console.log(`Error emitted from the queue: ${error.message}`);
	});

	client.player.events.on('playerError', (queue, error) => {
		console.log(`Error emitted from the player: ${error.message}`);
	});

	client.player.events.on('trackStart', (queue, track) => {
		console.log(`Track started: ${track.title}`);
		queue.metadata.send(`🎶 | Now playing: **${track.title}**`);
	});

	client.player.events.on('trackAdd', (queue, track) => {
		console.log(`Track added: ${track.title}`);
		queue.metadata.send(`🎶 | Added to queue: **${track.title}**`);
	});

	client.player.events.on('botDisconnect', (queue) => {
		console.log('Bot was disconnected from the voice channel');
		queue.metadata.send('❌ | I was disconnected from the voice channel!');
	});

	client.player.events.on('channelEmpty', (queue) => {
		console.log('Voice channel is empty, leaving the channel');
		queue.metadata.send('❌ | Leaving the voice channel as it is empty!');
	});
};
