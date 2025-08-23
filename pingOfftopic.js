// pingOfftopic.js
// Handles /pingofftopic command with cooldowns and thread check

const Globals = require('./Globals');

// Cooldown tables for /pingofftopic
const CooldownTracker = {
  server: null,       // timestamp of last server-wide ping
  users: new Map(),   // userId => timestamp of last personal ping
};

// Cooldowns in milliseconds
const Cooldowns = {
  server: 15 * 60 * 1000, // 15 minutes
  user: 60 * 60 * 1000,   // 1 hour
};

// Main execute function
async function execute(interaction) {
  const { channel, member } = interaction;
  const now = Date.now();

  // 1️⃣ Ensure channel is whitelisted
  if (!Globals.Commands.PingOfftopic.includes(channel.id)) {
    return interaction.reply({ content: '❌ This command cannot be used here.', flags: 64 });
  }

  // 2️⃣ Ignore threads
  if (channel.isThread()) {
    return interaction.reply({ content: '❌ Cannot use this command inside threads.', flags: 64 });
  }

  // 3️⃣ Server cooldown
  if (CooldownTracker.server && now - CooldownTracker.server < Cooldowns.server) {
    const remaining = Math.ceil((Cooldowns.server - (now - CooldownTracker.server)) / 60000);
    return interaction.reply({ content: `❌ Server cooldown active. Try again in ${remaining} min.`, flags: 64 });
  }

  // 4️⃣ User cooldown
  if (CooldownTracker.users.has(member.id)) {
    const lastUsed = CooldownTracker.users.get(member.id);
    if (now - lastUsed < Cooldowns.user) {
      const remaining = Math.ceil((Cooldowns.user - (now - lastUsed)) / 60000);
      return interaction.reply({ content: `❌ You are on cooldown. Try again in ${remaining} min.`, flags: 64 });
    }
  }

  // 5️⃣ Send ping message
  const offTopicRole = channel.guild.roles.cache.find(r => r.name === 'Off-topic Notice');
  if (!offTopicRole) return interaction.reply({ content: '❌ Off-topic role not found.', flags: 64 });

  await channel.send(`${offTopicRole}. Ping sponsored by ${member}`);

  // 6️⃣ Update cooldowns
  CooldownTracker.server = now;
  CooldownTracker.users.set(member.id, now);

  // 7️⃣ Confirm to user
  try {
    await interaction.reply({ content: '✅ Off-topic ping sent!', flags: 64 });
  } catch (err) {
    if (err.code === 10062) {
      console.warn('⚠️ Interaction expired, cannot reply.');
    } else {
      throw err;
    }
  }
}

module.exports = { execute };
