const { sequelize } = require('../config/db');
const ProductCategory = require('../models/ProductCategory');

async function checkCategoryStatus() {
  try {
    console.log('=== 一级分类状态检查 ===');
    const level1Categories = await ProductCategory.findAll({
      where: { level: 1 },
      order: [['sortOrder', 'ASC'], ['label', 'ASC']]
    });
    
    if (level1Categories.length === 0) {
      console.log('未找到一级分类');
    } else {
      level1Categories.forEach(cat => {
        console.log(`${cat.key} -> ${cat.label} (status: ${cat.status})`);
      });
    }

    console.log('\n=== 检查新鲜蘑菇和干货蘑菇分类 ===');
    const freshMushroom = await ProductCategory.findOne({ where: { key: 'freshMushroom' } });
    const driedMushroom = await ProductCategory.findOne({ where: { key: 'driedMushroom' } });

    if (freshMushroom) {
      console.log(`新鲜蘑菇: key=${freshMushroom.key}, label=${freshMushroom.label}, status=${freshMushroom.status}`);
      if (freshMushroom.status !== 'active') {
        console.log('需要激活新鲜蘑菇分类');
        await freshMushroom.update({ status: 'active' });
        console.log('已激活新鲜蘑菇分类');
      }
    } else {
      console.log('未找到新鲜蘑菇分类');
    }

    if (driedMushroom) {
      console.log(`干货蘑菇: key=${driedMushroom.key}, label=${driedMushroom.label}, status=${driedMushroom.status}`);
      if (driedMushroom.status !== 'active') {
        console.log('需要激活干货蘑菇分类');
        await driedMushroom.update({ status: 'active' });
        console.log('已激活干货蘑菇分类');
      }
    } else {
      console.log('未找到干货蘑菇分类');
    }

    // 检查并激活所有子分类
    console.log('\n=== 激活所有子分类 ===');
    const subCategories = await ProductCategory.findAll({
      where: { level: { [sequelize.Op.gt]: 1 }, status: { [sequelize.Op.ne]: 'active' } }
    });
    
    if (subCategories.length > 0) {
      console.log(`发现 ${subCategories.length} 个非活跃状态的子分类`);
      for (const cat of subCategories) {
        await cat.update({ status: 'active' });
        console.log(`已激活: ${cat.key} -> ${cat.label}`);
      }
    } else {
      console.log('所有子分类均为活跃状态');
    }

  } catch (error) {
    console.error('检查分类状态失败:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  checkCategoryStatus().then(() => {
    process.exit(0);
  });
}