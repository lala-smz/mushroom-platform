const { sequelize } = require('../config/db');
const Product = require('../models/Product');

async function checkProductCategories() {
  try {
    console.log('=== 检查商品分类数据 ===');
    
    const products = await Product.findAll({
      attributes: ['id', 'name', 'category', 'subCategory', 'subSubCategory'],
      limit: 10
    });
    
    console.log('\n商品分类数据:');
    products.forEach(p => {
      console.log(`${p.id}: ${p.name}`);
      console.log(`  category: ${p.category}`);
      console.log(`  subCategory: ${p.subCategory}`);
      console.log(`  subSubCategory: ${p.subSubCategory}`);
      console.log('---');
    });

    // 统计分类分布
    console.log('\n=== 分类统计 ===');
    const categoryStats = await Product.findAll({
      attributes: ['category', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['category'],
      raw: true
    });
    
    console.log('一级分类分布:');
    categoryStats.forEach(stat => {
      console.log(`${stat.category}: ${stat.count} 个商品`);
    });

  } catch (error) {
    console.error('检查商品分类失败:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  checkProductCategories().then(() => {
    process.exit(0);
  });
}