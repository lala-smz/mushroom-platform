const { sequelize } = require('../config/db');
const ProductCategory = require('../models/ProductCategory');

async function checkCategories() {
  try {
    console.log('=== 一级分类列表 ===');
    const level1Categories = await ProductCategory.findAll({
      where: { level: 1, status: 'active' },
      order: [['sortOrder', 'ASC'], ['label', 'ASC']]
    });
    
    if (level1Categories.length === 0) {
      console.log('未找到一级分类');
    } else {
      level1Categories.forEach(cat => {
        console.log(`${cat.key} -> ${cat.label}`);
      });
    }

    console.log('\n=== 二级分类列表 ===');
    const level2Categories = await ProductCategory.findAll({
      where: { level: 2, status: 'active' },
      order: [['parentKey', 'ASC'], ['sortOrder', 'ASC'], ['label', 'ASC']]
    });
    
    if (level2Categories.length === 0) {
      console.log('未找到二级分类');
    } else {
      level2Categories.forEach(cat => {
        console.log(`${cat.parentKey} -> ${cat.key} -> ${cat.label}`);
      });
    }

    console.log('\n=== 新鲜蘑菇下的二级分类 ===');
    const freshSubCategories = await ProductCategory.findAll({
      where: { level: 2, parentKey: 'freshMushroom', status: 'active' },
      order: [['sortOrder', 'ASC'], ['label', 'ASC']]
    });
    
    if (freshSubCategories.length === 0) {
      console.log('未找到新鲜蘑菇下的二级分类');
    } else {
      freshSubCategories.forEach(cat => {
        console.log(`${cat.key} -> ${cat.label}`);
      });
    }

    console.log('\n=== 干货蘑菇下的二级分类 ===');
    const driedSubCategories = await ProductCategory.findAll({
      where: { level: 2, parentKey: 'driedMushroom', status: 'active' },
      order: [['sortOrder', 'ASC'], ['label', 'ASC']]
    });
    
    if (driedSubCategories.length === 0) {
      console.log('未找到干货蘑菇下的二级分类');
    } else {
      driedSubCategories.forEach(cat => {
        console.log(`${cat.key} -> ${cat.label}`);
      });
    }

  } catch (error) {
    console.error('查询分类失败:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  checkCategories().then(() => {
    process.exit(0);
  });
}