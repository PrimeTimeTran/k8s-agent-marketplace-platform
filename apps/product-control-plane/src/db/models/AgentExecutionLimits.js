import { DataTypes } from 'sequelize'
import { sequelize } from '../sequelize.js'

export const AgentExecutionLimits = sequelize.define(
  'AgentExecutionLimits',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    agent_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
    max_concurrent_runs: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
    },
    max_cpu_seconds_per_run: {
      type: DataTypes.INTEGER,
      defaultValue: 3600,
    },
    max_memory_mb: {
      type: DataTypes.INTEGER,
      defaultValue: 2048,
    },
    max_timeout_seconds: {
      type: DataTypes.INTEGER,
      defaultValue: 3600,
    },
    enforced: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true, // MD doesn't specify but good to have
    underscored: true,
    tableName: 'agent_execution_limits',
  },
)
