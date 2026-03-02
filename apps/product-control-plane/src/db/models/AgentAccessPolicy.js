import { DataTypes } from 'sequelize'
import { sequelize } from '../sequelize.js'

export const AgentAccessPolicy = sequelize.define(
  'AgentAccessPolicy',
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
    subject_type: {
      type: DataTypes.ENUM('user', 'org'),
      allowNull: false,
    },
    subject_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    can_execute: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    can_view: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: 'agent_access_policies',
  },
)
