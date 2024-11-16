require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

// Get the deployment type from the command-line arguments
const deployType = process.argv[2];

if (!deployType || (deployType !== 'guild' && deployType !== 'global')) {
	console.error("Please specify 'guild' or 'global' as a command-line argument.");
	process.exit(1);
}

// Collect commands
const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
			);
		}
	}
}

// Setup REST client
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// Register commands based on the deploy type (guild or global)
(async () => {
	try {
		if (deployType === 'guild') {
			console.log(`Started refreshing ${commands.length} guild application (/) commands.`);
			const data = await rest.put(
				Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
				{
					body: commands,
				}
			);
			console.log(`Successfully reloaded ${data.length} guild application (/) commands.`);
		} else if (deployType === 'global') {
			console.log(`Started refreshing ${commands.length} global application (/) commands.`);
			const data = await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
				body: commands,
			});
			console.log(`Successfully reloaded ${data.length} global application (/) commands.`);
		}
	} catch (error) {
		console.error(error);
	}
})();
