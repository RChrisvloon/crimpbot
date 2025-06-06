require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { Player } = require('discord-player');
const { YoutubeiExtractor } = require('discord-player-youtubei');
const ffmpeg = require('ffmpeg-static');
const { registerPlayerEvents } = require('./events/playerEvents');

// Initialize the Discord client with necessary intents
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMessages,
	],
});

// Initialize collections for commands and cooldowns
client.commands = new Collection();
client.cooldowns = new Collection();

// Initialize the player with necessary options
client.player = new Player(client, {
	ytdlOptions: {
		quality: 'highestaudio',
		highWaterMark: 1 << 25,
	},
	ffmpegPath: ffmpeg.path,
});

registerPlayerEvents(client.player);

// Load default extractors and register YoutubeiExtractor
(async () => {
	await client.player.extractors.loadDefault();
	client.player.extractors.register(YoutubeiExtractor, {});
})();

// Load commands from the commands directory
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);

		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
			);
		}
	}
}

// Load events from the events directory
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Log in to Discord
client.login(process.env.DISCORD_TOKEN);
