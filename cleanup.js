require('dotenv').config();
const { REST, Routes } = require('discord.js');

// Get the cleanup type from the command-line arguments
const cleanupType = process.argv[2];

if (!cleanupType || (cleanupType !== 'guild' && cleanupType !== 'global')) {
	console.error("Please specify 'guild' or 'global' as a command-line argument.");
	process.exit(1);
}

// Construct REST client
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// Cleanup commands based on the cleanup type (guild or global)
(async () => {
	try {
		if (cleanupType === 'guild') {
			console.log('Started clearing all guild (local) commands...');
			// Send an empty list to remove all guild commands
			await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
				body: [],
			});
			console.log('Successfully cleared all guild (local) commands.');
		} else if (cleanupType === 'global') {
			console.log('Started clearing all global commands...');
			// Send an empty list to remove all global commands
			await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
				body: [],
			});
			console.log('Successfully cleared all global commands.');
		}
	} catch (error) {
		console.error(error);
	}
})();
