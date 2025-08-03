// index.js
require('./listener.js'); // Start the web listener first
require('dotenv').config();

const { Client, GatewayIntentBits, Partials } = require('discord.js');

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

const RoleChains = [
  {
    name: 'Expedition Crew',
    categoryRoleId: '1401605342495899688',
    requiredRoles: [
      '1401605724542468157',
      '1401605833275609167',
      '1401606564045000724',
    ],
  },
  {
    name: 'Common Guild',
    categoryRoleId: '1401606566364577843',
    requiredRoles: [
      '1401606565802545262',
      '1401606566914035863',
      '1401606568113606717',
    ],
  },
  {
    name: 'Colony Command',
    categoryRoleId: '1401607220063375370',
    requiredRoles: [
      '1401607222617833522',
      '1401607225016975371',
      '1401612980797440142',
      '1401613087530025170',
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

    if (hasAny && !hasCategory) {
      await newMember.roles.add(chain.categoryRoleId);
      console.log(`✅ Added ${chain.name} to ${newMember.user.tag}`);
    }

    if (!hasAny && hasCategory) {
      await newMember.roles.remove(chain.categoryRoleId);
      console.log(`❌ Removed ${chain.name} from ${newMember.user.tag}`);
    }
  }
});

client.login(process.env.BOT_TOKEN);
