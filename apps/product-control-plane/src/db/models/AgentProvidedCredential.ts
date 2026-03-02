import { DataTypes } from 'sequelize'
import { sequelize } from '../sequelize.js'

export const AgentProvidedCredential = sequelize.define(
  'AgentProvidedCredential',
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
    credential_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    secret_ref: {
      type: DataTypes.STRING, // e.g. "vault:v1:secret-id"
      allowNull: false,
    },
    revoked_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: 'agent_provided_credentials',
  },
)
