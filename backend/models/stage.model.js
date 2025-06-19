const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Stage = sequelize.define('Stage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  stage1: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  stage2: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  stage3: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'stages',
  timestamps: false,
});

module.exports = Stage; 