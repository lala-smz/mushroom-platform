'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sync_logs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      syncType: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: '同步类型：mushroom_data, seasonal_push, cooking_video, smart_push'
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'running',
        comment: '同步状态：running, success, failed'
      },
      startAt: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: '同步开始时间'
      },
      endAt: {
        type: Sequelize.DATE,
        comment: '同步结束时间'
      },
      duration: {
        type: Sequelize.INTEGER,
        comment: '同步持续时间（毫秒）'
      },
      totalCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: '处理的总记录数'
      },
      createdCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: '新增记录数'
      },
      updatedCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: '更新记录数'
      },
      failedCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: '失败记录数'
      },
      errorMessage: {
        type: Sequelize.TEXT,
        comment: '错误信息'
      },
      syncConfig: {
        type: Sequelize.TEXT,
        comment: '同步时使用的配置（JSON格式）'
      },
      notes: {
        type: Sequelize.TEXT,
        comment: '备注信息'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    await queryInterface.addIndex('sync_logs', ['syncType'], { name: 'idx_sync_type' });
    await queryInterface.addIndex('sync_logs', ['status'], { name: 'idx_status' });
    await queryInterface.addIndex('sync_logs', ['startAt'], { name: 'idx_start_at' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sync_logs');
  }
};