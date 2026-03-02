import { DataTypes } from 'sequelize'
import { sequelize } from '../sequelize.js'

export const AgentEntitlement = sequelize.define(
  'AgentEntitlement',
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
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    plan: {
      type: DataTypes.ENUM('free', 'pro', 'enterprise', 'usage_based'),
      defaultValue: 'free',
    },
    // Quotas (null = unlimited)
    max_runs_per_period: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    max_compute_seconds_per_period: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // Rate Limits (Short term protection)
    max_concurrent_runs: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // Period definition
    period: {
      type: DataTypes.ENUM('daily', 'monthly', 'lifetime'),
      defaultValue: 'monthly',
    },
    period_reset_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    starts_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    ends_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: 'agent_entitlements',
  },
)
