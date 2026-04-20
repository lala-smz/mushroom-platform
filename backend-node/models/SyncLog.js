const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;

const SyncLog = sequelize.define('SyncLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  syncType: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '同步类型：mushroom_data, seasonal_push, cooking_video, smart_push'
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'running',
    comment: '同步状态：running, success, failed'
  },
  startAt: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: '同步开始时间'
  },
  endAt: {
    type: DataTypes.DATE,
    comment: '同步结束时间'
  },
  duration: {
    type: DataTypes.INTEGER,
    comment: '同步持续时间（毫秒）'
  },
  totalCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '处理的总记录数'
  },
  createdCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '新增记录数'
  },
  updatedCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '更新记录数'
  },
  failedCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '失败记录数'
  },
  errorMessage: {
    type: DataTypes.TEXT,
    comment: '错误信息'
  },
  syncConfig: {
    type: DataTypes.TEXT,
    comment: '同步时使用的配置（JSON格式）'
  },
  notes: {
    type: DataTypes.TEXT,
    comment: '备注信息'
  }
}, {
  tableName: 'sync_logs',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      name: 'idx_sync_type',
      fields: ['syncType']
    },
    {
      name: 'idx_status',
      fields: ['status']
    },
    {
      name: 'idx_start_at',
      fields: ['startAt']
    }
  ],
  comment: '同步任务日志表'
});

module.exports = SyncLog;