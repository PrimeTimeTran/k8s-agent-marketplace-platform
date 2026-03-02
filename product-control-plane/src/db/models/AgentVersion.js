import { DataTypes } from 'sequelize'
import { sequelize } from '../sequelize.js'

export const AgentVersion = sequelize.define(
  'AgentVersion',
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
    version: {
      type: DataTypes.STRING, // "v1.0.0", "2026-01-15"
      allowNull: false,
    },
    image_ref: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entrypoint: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    runtime: {
      type: DataTypes.ENUM('python', 'node', 'custom'),
      defaultValue: 'custom',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    reasoning_style: {
      type: DataTypes.ENUM('reactive', 'planner', 'tool-using'),
      allowNull: true,
    },
    memory_type: {
      type: DataTypes.ENUM('none', 'ephemeral', 'persistent'),
      defaultValue: 'none',
    },
    planning_depth: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    updatedAt: false, // Versions are immutable mostly? MD says created_at only but let's stick to true for consistent API or set updatedAt: false if strictly immutable.
    underscored: true,
    tableName: 'agent_versions',
  },
)
