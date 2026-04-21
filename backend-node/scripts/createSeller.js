const { sequelize } = require('../config/db');
const User = require('../models/User');

async function createSellerUser() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');

    const existingSeller = await User.findOne({ where: { role: 'seller' } });
    if (existingSeller) {
      console.log('卖家用户已存在，ID:', existingSeller.id);
      process.exit(0);
    }
    
    const sellerUser = await User.create({
      username: 'seller',
      email: 'seller@example.com',
      password: 'seller123',
      role: 'seller',
      status: true,
      phone: '13900139000'
    });

    console.log('卖家用户创建成功:', sellerUser.id);
    process.exit(0);
  } catch (error) {
    console.error('创建卖家用户失败:', error);
    process.exit(1);
  }
}

createSellerUser();