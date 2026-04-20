const { sequelize } = require('../config/db');
const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');

async function checkSeasonalBoxProducts() {
  try {
    console.log('=== 检查时令盲盒商品数据 ===');
    
    // 查看时令盲盒分类的配置
    console.log('\n--- 1. 查看时令盲盒分类配置 ---');
    const seasonalCategory = await ProductCategory.findOne({
      where: { level: 1, label: '时令盲盒' }
    });
    
    if (seasonalCategory) {
      console.log(`分类配置:`);
      console.log(`  key: ${seasonalCategory.key}`);
      console.log(`  label: ${seasonalCategory.label}`);
      console.log(`  status: ${seasonalCategory.status}`);
      
      // 查看二级分类
      const level2Cats = await ProductCategory.findAll({
        where: { parentKey: seasonalCategory.key, level: 2 }
      });
      console.log(`\n  二级分类 (${level2Cats.length}个):`);
      level2Cats.forEach(cat => console.log(`    - ${cat.key}: ${cat.label}`));
    } else {
      console.log('未找到时令盲盒分类配置！');
    }
    
    // 查看商品数据中时令盲盒相关的category值
    console.log('\n--- 2. 查看商品数据中的时令盲盒分类 ---');
    const seasonalProducts = await Product.findAll({
      where: { category: '时令盲盒' },
      attributes: ['id', 'name', 'category', 'subCategory', 'subSubCategory']
    });
    
    console.log(`使用 category='时令盲盒' 查询到 ${seasonalProducts.length} 个商品:`);
    seasonalProducts.forEach(p => {
      console.log(`${p.id}: ${p.name} - category: ${p.category}`);
    });
    
    // 使用正确的key查询
    if (seasonalCategory) {
      const seasonalProductsByKey = await Product.findAll({
        where: { category: seasonalCategory.key },
        attributes: ['id', 'name', 'category', 'subCategory', 'subSubCategory']
      });
      
      console.log(`\n使用 category='${seasonalCategory.key}' 查询到 ${seasonalProductsByKey.length} 个商品:`);
      seasonalProductsByKey.forEach(p => {
        console.log(`${p.id}: ${p.name} - category: ${p.category}`);
      });
    }

    // 统计所有分类分布
    console.log('\n--- 3. 所有商品分类统计 ---');
    const categoryStats = await Product.findAll({
      attributes: ['category', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['category'],
      raw: true
    });
    
    console.log('商品分类分布:');
    categoryStats.forEach(stat => {
      console.log(`${stat.category}: ${stat.count} 个商品`);
    });

  } catch (error) {
    console.error('检查时令盲盒数据失败:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  checkSeasonalBoxProducts().then(() => {
    process.exit(0);
  });
}