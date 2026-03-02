import { DataTypes } from 'sequelize'
import { sequelize } from '../sequelize.js'
import { AgentVisibility, AgentStatus } from '@hc/types'

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
      type: DataTypes.ENUM(...Object.values(AgentVisibility)),
      defaultValue: AgentVisibility.PRIVATE,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(AgentStatus)),
      defaultValue: AgentStatus.DRAFT,
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: 'agents',
  },
)
