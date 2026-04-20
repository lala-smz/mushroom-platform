const { sequelize } = require('../config/db');
const ProductCategory = require('../models/ProductCategory');

async function checkAndFixCategoryStatus() {
  try {
    console.log('=== 检查所有一级分类的状态 ===');
    
    // 查询所有一级分类（包括非active状态）
    const allLevel1Categories = await ProductCategory.findAll({
      where: { level: 1 },
      order: [['sortOrder', 'ASC'], ['label', 'ASC']]
    });
    
    console.log('\n所有一级分类（含非活跃状态）:');
    allLevel1Categories.forEach(cat => {
      console.log(`${cat.key} -> ${cat.label} (status: ${cat.status})`);
    });

    // 检查新鲜蘑菇和干货蘑菇的状态
    console.log('\n=== 检查新鲜蘑菇和干货蘑菇分类 ===');
    
    const freshMushroom = await ProductCategory.findOne({
      where: { key: 'freshMushroom' }
    });
    
    const driedMushroom = await ProductCategory.findOne({
      where: { key: 'driedMushroom' }
    });

    if (!freshMushroom) {
      console.log('未找到新鲜蘑菇分类，需要创建');
      await ProductCategory.create({
        key: 'freshMushroom',
        label: '新鲜蘑菇',
        description: '新鲜采摘的各类蘑菇',
        level: 1,
        parentKey: null,
        status: 'active',
        sortOrder: 7
      });
      console.log('已创建新鲜蘑菇分类');
    } else if (freshMushroom.status !== 'active') {
      console.log(`新鲜蘑菇分类状态为 ${freshMushroom.status}，需要激活`);
      await freshMushroom.update({ status: 'active' });
      console.log('已激活新鲜蘑菇分类');
    } else {
      console.log('新鲜蘑菇分类状态正常 (active)');
    }

    if (!driedMushroom) {
      console.log('未找到干货蘑菇分类，需要创建');
      await ProductCategory.create({
        key: 'driedMushroom',
        label: '干货蘑菇',
        description: '经过干燥处理的蘑菇干货',
        level: 1,
        parentKey: null,
        status: 'active',
        sortOrder: 8
      });
      console.log('已创建干货蘑菇分类');
    } else if (driedMushroom.status !== 'active') {
      console.log(`干货蘑菇分类状态为 ${driedMushroom.status}，需要激活`);
      await driedMushroom.update({ status: 'active' });
      console.log('已激活干货蘑菇分类');
    } else {
      console.log('干货蘑菇分类状态正常 (active)');
    }

    // 激活它们的子分类
    console.log('\n=== 激活子分类 ===');
    
    const freshSubCats = await ProductCategory.findAll({
      where: { parentKey: 'freshMushroom' }
    });
    
    for (const cat of freshSubCats) {
      if (cat.status !== 'active') {
        await cat.update({ status: 'active' });
        console.log(`已激活: ${cat.key} -> ${cat.label}`);
      }
    }

    const driedSubCats = await ProductCategory.findAll({
      where: { parentKey: 'driedMushroom' }
    });
    
    for (const cat of driedSubCats) {
      if (cat.status !== 'active') {
        await cat.update({ status: 'active' });
        console.log(`已激活: ${cat.key} -> ${cat.label}`);
      }
    }

    console.log('\n=== 修复完成 ===');

  } catch (error) {
    console.error('修复分类状态失败:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  checkAndFixCategoryStatus().then(() => {
    process.exit(0);
  });
}