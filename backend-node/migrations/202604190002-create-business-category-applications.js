'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('business_category_applications', {
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
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
      },
      reason: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      reviewComment: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      reviewedBy: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      reviewedAt: {
        allowNull: true,
        type: Sequelize.DATE
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

    await queryInterface.addIndex('business_category_applications', ['businessId']);
    await queryInterface.addIndex('business_category_applications', ['categoryKey']);
    await queryInterface.addIndex('business_category_applications', ['status']);
    await queryInterface.addIndex('business_category_applications', ['businessId', 'categoryKey'], { unique: true });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('business_category_applications');
  }
};