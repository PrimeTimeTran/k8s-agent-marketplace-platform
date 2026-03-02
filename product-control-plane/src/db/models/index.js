import { sequelize } from '../sequelize.js'

import { Agent } from './Agent.js'
import { AgentVersion } from './AgentVersion.js'
import { AgentConfig } from './AgentConfig.js'
import { AgentAccessPolicy } from './AgentAccessPolicy.js'
import { ExecutionRequest } from './ExecutionRequest.js'
import { AgentExecutionLimits } from './AgentExecutionLimits.js'
import { AgentEntitlement } from './AgentEntitlement.js'
import { AgentProvidedCredential } from './AgentProvidedCredential.js'
import { AgentRequiredCredential } from './AgentRequiredCredential.js'
import { AgentHealth } from './AgentHealth.js'
import { AgentUsageDaily } from './AgentUsageDaily.js'

// --- Associations ---

// Agent & Versions
Agent.hasMany(AgentVersion, { foreignKey: 'agent_id' })
AgentVersion.belongsTo(Agent, { foreignKey: 'agent_id' })

// Agent Version & Config
AgentVersion.hasOne(AgentConfig, { foreignKey: 'agent_version_id' })
AgentConfig.belongsTo(AgentVersion, { foreignKey: 'agent_version_id' })

// Agent & Executions
Agent.hasMany(ExecutionRequest, { foreignKey: 'agent_id' })
ExecutionRequest.belongsTo(Agent, { foreignKey: 'agent_id' })

AgentVersion.hasMany(ExecutionRequest, { foreignKey: 'agent_version_id' })
ExecutionRequest.belongsTo(AgentVersion, { foreignKey: 'agent_version_id' })

// Access Policy
Agent.hasMany(AgentAccessPolicy, { foreignKey: 'agent_id' })
AgentAccessPolicy.belongsTo(Agent, { foreignKey: 'agent_id' })

// Limits
Agent.hasOne(AgentExecutionLimits, { foreignKey: 'agent_id' })
AgentExecutionLimits.belongsTo(Agent, { foreignKey: 'agent_id' })

// Entitlements
Agent.hasMany(AgentEntitlement, { foreignKey: 'agent_id' })
AgentEntitlement.belongsTo(Agent, { foreignKey: 'agent_id' })

// Usage
Agent.hasMany(AgentUsageDaily, { foreignKey: 'agent_id' })
AgentUsageDaily.belongsTo(Agent, { foreignKey: 'agent_id' })

// Credentials
Agent.hasMany(AgentRequiredCredential, { foreignKey: 'agent_id' })
AgentRequiredCredential.belongsTo(Agent, { foreignKey: 'agent_id' })

Agent.hasMany(AgentProvidedCredential, { foreignKey: 'agent_id' })
AgentProvidedCredential.belongsTo(Agent, { foreignKey: 'agent_id' })

// Health
Agent.hasMany(AgentHealth, { foreignKey: 'agent_id' })
AgentHealth.belongsTo(Agent, { foreignKey: 'agent_id' })

AgentVersion.hasMany(AgentHealth, { foreignKey: 'agent_version_id' })
AgentHealth.belongsTo(AgentVersion, { foreignKey: 'agent_version_id' })

// Sync models (Optional: strict or alter)
// await sequelize.sync({ alter: true }) // Call this in app startup, not here

export {
  sequelize,
  Agent,
  AgentVersion,
  AgentConfig,
  AgentAccessPolicy,
  ExecutionRequest,
  AgentExecutionLimits,
  AgentEntitlement,
  AgentProvidedCredential,
  AgentRequiredCredential,
  AgentHealth,
  AgentUsageDaily,
}
