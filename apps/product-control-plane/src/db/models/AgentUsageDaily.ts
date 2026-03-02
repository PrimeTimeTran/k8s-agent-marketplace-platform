import { DataTypes } from 'sequelize'
import { sequelize } from '../sequelize.js'

export const AgentUsageDaily = sequelize.define(
  'AgentUsageDaily',
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
    owner_user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    executions: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    cpu_seconds: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    tokens_used: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: 'agent_usage_daily',
    indexes: [
      {
        unique: true,
        fields: ['agent_id', 'owner_user_id', 'date'],
      },
    ],
  },
)
