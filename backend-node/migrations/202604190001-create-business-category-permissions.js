'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('business_category_permissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      businessId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      categoryKey: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      categoryLevel: {
        allowNull: false,
        type: Sequelize.INTEGER,
        validate: {
          min: 1,
          max: 3
        }
      },
      categoryLabel: {
        allowNull: false,
        type: Sequelize.STRING(200)
      },
      parentKey: {
        allowNull: true,
        type: Sequelize.STRING(100)
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active'
      },
      grantedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      grantedBy: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    await queryInterface.addIndex('business_category_permissions', ['businessId']);
    await queryInterface.addIndex('business_category_permissions', ['categoryKey']);
    await queryInterface.addIndex('business_category_permissions', ['businessId', 'categoryKey'], { unique: true });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('business_category_permissions');
  }
};