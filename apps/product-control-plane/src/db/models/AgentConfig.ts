import { DataTypes } from 'sequelize'
import { sequelize } from '../sequelize.js'

export const AgentConfig = sequelize.define(
  'AgentConfig',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    agent_version_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true, // One config per version? MD implied 1:1.
    },
    cpu_limit: {
      type: DataTypes.FLOAT, // e.g. 0.5 cores
      allowNull: false,
    },
    memory_limit_mb: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    timeout_seconds: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    max_concurrent_runs: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    allowed_tools: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    allowed_network: {
      type: DataTypes.ENUM('none', 'internal', 'external'),
      defaultValue: 'none',
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: 'agent_configs',
  },
)
