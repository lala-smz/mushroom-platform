const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const BusinessCategoryPermission = sequelize.define('BusinessCategoryPermission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  businessId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  categoryKey: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  categoryLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 3
    }
  },
  categoryLabel: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  parentKey: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'active'
  },
  grantedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  grantedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'business_category_permissions',
  timestamps: true
});

BusinessCategoryPermission.belongsTo(User, {
  foreignKey: 'businessId',
  as: 'business'
});

BusinessCategoryPermission.belongsTo(User, {
  foreignKey: 'grantedBy',
  as: 'grantedByUser'
});

module.exports = BusinessCategoryPermission;