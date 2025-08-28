require('./listener.js'); // Start web listener first
require('dotenv').config();

// Actual Bot
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const RoleManager = require('./RoleManager');
const PingOfftopic = require('./pingOfftopic');
const Globals = require('./Globals');
const { registerCommands } = require('./registerCommands');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.GuildMember],
});

// On ready
client.on('ready', async () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);

  // Auto-register slash commands in all guilds
  await registerCommands(client);
});

// Delegate guildMemberUpdate entirely to RoleManager
client.on('guildMemberUpdate', async (_, newMember) => {
  await RoleManager.handleMemberUpdate(newMember);
});

// Slash command handler for /pingofftopic
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'pingofftopic') {
    try {
      // Step 1: Acknowledge immediately to avoid timeout
      await interaction.deferReply({ ephemeral: false }); // bot is "thinking"

      // Step 2: Execute the command
      const result = await PingOfftopic.execute(interaction);

      // Step 3: Send the actual response
      await interaction.editReply(result);
    } catch (error) {
      console.error('Error executing /pingofftopic:', error);
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply('❌ Something went wrong while processing your request.');
      } else {
        await interaction.reply('❌ Something went wrong while processing your request.');
      }
    }
  }
});

client.login(process.env.BOT_TOKEN);
