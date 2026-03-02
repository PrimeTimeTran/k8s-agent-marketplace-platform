import { DataTypes } from 'sequelize'
import { sequelize } from '../sequelize.js'

export const Agent = sequelize.define(
  'Agent',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    owner_user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    owner_org_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    visibility: {
      type: DataTypes.ENUM('private', 'org', 'public'),
      defaultValue: 'private',
    },
    status: {
      type: DataTypes.ENUM('draft', 'active', 'disabled', 'deprecated'),
      defaultValue: 'draft',
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: 'agents',
  },
)
