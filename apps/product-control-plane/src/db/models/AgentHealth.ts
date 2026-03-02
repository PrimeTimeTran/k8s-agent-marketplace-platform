import { DataTypes } from 'sequelize'
import { sequelize } from '../sequelize.js'

export const AgentHealth = sequelize.define(
  'AgentHealth',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    agent_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    agent_version_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    window_start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    window_end: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    execution_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    success_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    failure_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    timeout_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    avg_latency_ms: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    p95_latency_ms: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    error_rate: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    health_status: {
      type: DataTypes.ENUM('HEALTHY', 'DEGRADED', 'UNHEALTHY'),
      defaultValue: 'HEALTHY',
    },
    last_error_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_error_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: 'agent_health_metrics',
  },
)
