// RoleManager.js
const Globals = require('./Globals');

class RoleManager {
  constructor() {
    this.RoleChainsByGuild = {};
    this.SyncRules = []; // cross-guild sync rules
    this._initRoleChains();
    this._initSyncRules();
  }

  _initRoleChains() {
    this.RoleChainsByGuild[Globals.Guilds.MAIN] = [
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

    this.RoleChainsByGuild[Globals.Guilds.WIKI] = [
    ];
  }

  // Define cross-guild sync rules
  _initSyncRules() {
    this.SyncRules = [
      {
        fromGuild: Globals.Guilds.MAIN,
        requiredRoles: ['ROLE_ID_MAIN1', 'ROLE_ID_MAIN2'], // must have BOTH
        toGuild: Globals.Guilds.WIKI,
        grantRoles: ['ROLE_ID_WIKI1'], // roles to add in wiki guild
      },
      {
        fromGuild: Globals.Guilds.MAIN,
        requiredRoles: ['BOOSTER_ROLE_ID'], // server booster in main guild
        toGuild: Globals.Guilds.WIKI,
        grantRoles: ['BOOSTER_PERK_ROLE_ID'], // grant booster perk role in wiki
      },
    ];
  }

  // Normal role chain handler (same as before)
  async handleMemberUpdate(newMember) {
    const GuildChains = this.RoleChainsByGuild[newMember.guild.id];
    if (!GuildChains) return;

    for (const chain of GuildChains) {
      const hasAny = chain.requiredRoles.some(roleId =>
        newMember.roles.cache.has(roleId)
      );
      const hasCategory = newMember.roles.cache.has(chain.categoryRoleId);

      if (hasAny && !hasCategory) {
        await newMember.roles.add(chain.categoryRoleId).catch(console.error);
        console.log(`✅ Added ${chain.name} to ${newMember.user.tag} in ${newMember.guild.name}`);
      }

      if (!hasAny && hasCategory) {
        await newMember.roles.remove(chain.categoryRoleId).catch(console.error);
        console.log(`❌ Removed ${chain.name} from ${newMember.user.tag} in ${newMember.guild.name}`);
      }
    }

    // After local chains, check cross-guild sync
    await this.syncRoles(newMember);
  }

  // Cross-guild role sync
  async syncRoles(newMember) {
    const client = newMember.client;

    for (const rule of this.SyncRules) {
      if (newMember.guild.id !== rule.fromGuild) continue;

      // Check if member has all required roles in fromGuild
      const hasAll = rule.requiredRoles.every(roleId =>
        newMember.roles.cache.has(roleId)
      );

      // Find corresponding member in target guild
      const targetGuild = client.guilds.cache.get(rule.toGuild);
      if (!targetGuild) continue;

      const targetMember = await targetGuild.members.fetch(newMember.id).catch(() => null);
      if (!targetMember) continue;

      for (const roleId of rule.grantRoles) {
        const hasRole = targetMember.roles.cache.has(roleId);

        if (hasAll && !hasRole) {
          await targetMember.roles.add(roleId).catch(console.error);
          console.log(`🔄 Synced role ${roleId} → Added to ${targetMember.user.tag} in ${targetGuild.name}`);
        }

        if (!hasAll && hasRole) {
          await targetMember.roles.remove(roleId).catch(console.error);
          console.log(`🔄 Synced role ${roleId} → Removed from ${targetMember.user.tag} in ${targetGuild.name}`);
        }
      }
    }
  }
}

module.exports = new RoleManager();
