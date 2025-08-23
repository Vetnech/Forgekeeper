// registerCommands.js
// Auto-registers slash commands in all guilds

const { REST, Routes } = require('discord.js');
const Globals = require('./Globals');

async function registerCommands(client) {
  const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

  // Define slash commands
  const commands = [
    {
      name: 'pingofftopic', // hardcoded since Globals only has channel IDs
      description: 'Ping Off-topic notice',
    },
  ];

  // Register in all guilds
  for (const guildId of Object.values(Globals.Guilds)) {
    try {
      await rest.put(
        Routes.applicationGuildCommands(client.user.id, guildId),
        { body: commands }
      );
      console.log(`✅ Registered commands in guild ${guildId}`);
    } catch (err) {
      console.error(`❌ Failed to register commands in guild ${guildId}:`, err);
    }
  }
}

module.exports = { registerCommands };
