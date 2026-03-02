import { DataTypes } from 'sequelize'
import { sequelize } from '../sequelize.js'

export const AgentRequiredCredential = sequelize.define(
  'AgentRequiredCredential',
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
    credential_type: {
      type: DataTypes.STRING, // 'google_maps_api_key'
      allowNull: false,
    },
    required: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: 'agent_required_credentials',
  },
)
