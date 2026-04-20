const { sequelize } = require('../config/db');
const Product = require('../models/Product');

async function checkFreshMushroomProducts() {
  try {
    console.log('=== 检查新鲜蘑菇分类下的商品 ===');
    
    const products = await Product.findAll({
      where: { category: 'freshMushroom' },
      attributes: ['id', 'name', 'category', 'subCategory', 'subSubCategory']
    });
    
    console.log(`\n新鲜蘑菇分类下共有 ${products.length} 个商品:`);
    products.forEach(p => {
      console.log(`${p.id}: ${p.name}`);
      console.log(`  category: ${p.category}`);
      console.log(`  subCategory: ${p.subCategory || '(空)'}`);
      console.log(`  subSubCategory: ${p.subSubCategory || '(空)'}`);
      console.log('---');
    });

    // 统计二级分类分布
    console.log('\n=== 二级分类统计 ===');
    const subCategoryStats = await Product.findAll({
      where: { category: 'freshMushroom' },
      attributes: ['subCategory', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['subCategory'],
      raw: true
    });
    
    console.log('新鲜蘑菇下二级分类分布:');
    subCategoryStats.forEach(stat => {
      console.log(`${stat.subCategory || '(空)'}: ${stat.count} 个商品`);
    });

  } catch (error) {
    console.error('检查商品分类失败:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  checkFreshMushroomProducts().then(() => {
    process.exit(0);
  });
}