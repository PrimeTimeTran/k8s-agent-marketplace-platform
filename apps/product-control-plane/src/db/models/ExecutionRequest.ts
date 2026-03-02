import { DataTypes } from 'sequelize'
import { sequelize } from '../sequelize.js'

export const ExecutionRequest = sequelize.define(
  'ExecutionRequest',
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
      allowNull: false,
    },
    requester_user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        'pending',
        'accepted',
        'rejected',
        'running',
        'completed',
        'failed',
      ),
      defaultValue: 'pending',
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Timing
    started_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Usage / Billing
    duration_ms: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cpu_time_ms: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    memory_max_mb: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    exit_code: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: 'execution_requests',
  },
)
