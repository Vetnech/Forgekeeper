const { Client, GatewayIntentBits, Partials } = require('discord.js');
require('dotenv').config();

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

// Example category role setup
const RoleChains = [
  {
    name: 'Expedition Crew',
    categoryRoleId: '1401606566364577843', // ID of Expedition Crew
    requiredRoles: [
      '1401605724542468157', // Expedition Scout
      '1401605833275609167', // Expedition Pathfinder
      '1401606564045000724', // Expedition Leader
    ],
  },
  
  {
    name: 'Common Guild',
    categoryRoleId: '1401606566364577843', // ID of Common Guild
    requiredRoles: [
      '1401606565802545262', // Guild Apprentice
      '1401606566914035863', // Guild Artisan
      '1401606568113606717', // Guild Strategist
    ],
  },
  
  {
    name: 'Colony Command',
    categoryRoleId: '1401607220063375370', // ID of Colony Command
    requiredRoles: [
      '1401607222617833522', // Council Envoy
      '1401607225016975371', // Councilor
      '1401612980797440142', // High Councilor
      '1401613087530025170', // Colony Commander
    ],
  },
];

client.on('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
  for (const chain of RoleChains) {
    const hasAny = chain.requiredRoles.some(roleId =>
      newMember.roles.cache.has(roleId)
    );
    const hasCategory = newMember.roles.cache.has(chain.categoryRoleId);

    // Assign if missing and conditions met
    if (hasAny && !hasCategory) {
      await newMember.roles.add(chain.categoryRoleId);
      console.log(`✅ Added ${chain.name} to ${newMember.user.tag}`);
    }

    // Remove if doesn't meet any
    if (!hasAny && hasCategory) {
      await newMember.roles.remove(chain.categoryRoleId);
      console.log(`❌ Removed ${chain.name} from ${newMember.user.tag}`);
    }
  }
});

client.login(process.env.BOT_TOKEN);
