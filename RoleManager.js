// RoleManager.js
// Handles role chain logic for multiple guilds

class RoleManager {
  constructor() {
    /** 
     * Stores role chains for each guild
     * Format:
     * { [guildId]: [{ name, categoryRoleId, requiredRoles: [] }] }
     */
    this.RoleChainsByGuild = {};

    // Initialize role chains for all guilds here
    this._initRoleChains();
  }

  // Private method to setup role chains per guild
  _initRoleChains() {
    // Guild 1: Main Discord
    this.RoleChainsByGuild['1400081340132626432'] = [
      {
        name: 'Expedition Crew',
        categoryRoleId: '1401605342495899688', // ID of Expedition Crew
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

    // Guild 2: Wiki Discord
    this.RoleChainsByGuild['GUILD_ID_2'] = [
      // Example chains for second guild
      {
        name: 'Wiki Staff',
        categoryRoleId: 'GUILD2_CATEGORY_ROLE_ID',
        requiredRoles: [
          'GUILD2_ROLE_1',
          'GUILD2_ROLE_2',
        ],
      },
    ];
  }

  // Called on guildMemberUpdate
  async handleMemberUpdate(newMember) {
    const GuildChains = this.RoleChainsByGuild[newMember.guild.id];
    if (!GuildChains) return; // No role chains configured for this guild

    for (const chain of GuildChains) {
      const hasAny = chain.requiredRoles.some(roleId =>
        newMember.roles.cache.has(roleId)
      );
      const hasCategory = newMember.roles.cache.has(chain.categoryRoleId);

      // Add category role if member has any required role but not the category
      if (hasAny && !hasCategory) {
        await newMember.roles.add(chain.categoryRoleId).catch(console.error);
        console.log(`✅ Added ${chain.name} to ${newMember.user.tag} in ${newMember.guild.name}`);
      }

      // Remove category role if member has none of the required roles but still has category
      if (!hasAny && hasCategory) {
        await newMember.roles.remove(chain.categoryRoleId).catch(console.error);
        console.log(`❌ Removed ${chain.name} from ${newMember.user.tag} in ${newMember.guild.name}`);
      }
    }
  }
}

module.exports = new RoleManager();
