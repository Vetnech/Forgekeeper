require('./listener.js'); // Start the web listener first
require('dotenv').config();

// Actual Bot
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const RoleManager = require('./RoleManager'); // Handles all role chains

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

client.on('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

// Delegate guildMemberUpdate entirely to RoleManager
client.on('guildMemberUpdate', async (_, newMember) => {
  await RoleManager.handleMemberUpdate(newMember);
});

client.login(process.env.BOT_TOKEN);
