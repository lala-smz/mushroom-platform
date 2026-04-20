const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const BusinessCategoryApplication = sequelize.define('BusinessCategoryApplication', {
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
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    allowNull: false,
    defaultValue: 'pending'
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  reviewComment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  reviewedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  reviewedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'business_category_applications',
  timestamps: true
});

BusinessCategoryApplication.belongsTo(User, {
  foreignKey: 'businessId',
  as: 'business'
});

BusinessCategoryApplication.belongsTo(User, {
  foreignKey: 'reviewedBy',
  as: 'reviewedByUser'
});

module.exports = BusinessCategoryApplication;