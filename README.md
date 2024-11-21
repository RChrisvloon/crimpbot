# CrimpBot

CrimpBot is a feature-rich Discord bot built with JavaScript and the [discord.js](https://discord.js.org/) library. It offers a range of utility and music commands designed to make managing your server easier and more fun. The bot uses the `discord-player` and `ytdl-core` libraries to provide robust music functionality, including seamless playback, queue management, and YouTube integration.

## Features

- **Utility Commands**: Provides server and user information.
- **Music Commands**: Seamless music playback with features like play, pause, skip, stop, and queue management.
- **Slash Commands**: Fully integrated with Discord's modern slash command system for intuitive and user-friendly interactions.
- **Music Framework**: Powered by `discord-player` for audio playback and `ytdl-core` for extracting audio streams from YouTube.

## Commands

### Utility Commands

- `/ping` - Replies with "Pong!".
- `/user` - Displays information about the user who initiated the command.
- `/server` - Provides details about the server, such as name, member count, and more.

### Music Commands

- `/play [query]` - Plays a song in your voice channel (supports YouTube and other platforms).
- `/pause` - Pauses the current song.
- `/skip` - Skips to the next song in the queue.
- `/stop` - Stops playback and clears the music queue.
- `/queue` - Displays the current song queue.

## How It Works

CrimpBot leverages the following key packages to provide music functionality:

1. **[discord-player](https://discord-player.js.org/)**: Handles all aspects of music playback, including searching for tracks, managing queues, and connecting to Discord voice channels. This package simplifies the process of streaming audio within Discord servers.

2. **[ytdl-core](https://github.com/fent/node-ytdl-core)**: Extracts high-quality audio streams from YouTube videos, which are then passed to `discord-player` for playback. This ensures that CrimpBot can play songs directly from YouTube links or search results.

These two libraries work together to provide a smooth and reliable music experience for users.

## Installation

Follow these steps to get CrimpBot up and running:

1. Clone the repository: `git clone https://github.com/yourusername/crimpbot.git && cd crimpbot`
2. Install dependencies: `npm install`
3. Set up environment variables: Create a `.env` file in the root directory and add your bot's credentials: `DISCORD_TOKEN=your-discord-bot-token CLIENT_ID=your-client-id GUILD_ID=your-guild-id # Optional, required for guild-specific commands`
4. Deploy commands: Run `node deploy-commands.js guild` for guild-specific commands or `node deploy-commands.js global` for global commands.
5. Start the bot: `node index.js`

## Usage

Invite CrimpBot to your server using the OAuth2 URL from the Discord Developer Portal. Once the bot is in your server, interact with it using the provided slash commands.

## Contributing

Contributions are welcome! If you encounter issues or have ideas for new features, feel free to open an issue or submit a pull request. Please ensure any code contributions follow the project's coding standards and include tests where applicable.

### Acknowledgements

Special thanks to:

- The developers of [discord.js](https://discord.js.org/) for their excellent library.
- The creators of [discord-player](https://discord-player.js.org/) for simplifying audio playback in Discord bots.
- The maintainers of [ytdl-core](https://github.com/fent/node-ytdl-core) for enabling high-quality YouTube audio extraction.
