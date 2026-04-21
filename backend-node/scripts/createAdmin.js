const { sequelize } = require('../config/db');
const User = require('../models/User');

async function createAdminUser() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');

    const existingAdmin = await User.findOne({ where: { role: 'admin' } });
    if (existingAdmin) {
      console.log('管理员用户已存在');
      process.exit(0);
    }
    
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      status: true,
      phone: '13800138000'
    });

    console.log('管理员用户创建成功:', adminUser.id);
    process.exit(0);
  } catch (error) {
    console.error('创建管理员用户失败:', error);
    process.exit(1);
  }
}

createAdminUser();