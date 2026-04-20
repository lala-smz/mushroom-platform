const { sequelize } = require('../config/db');
const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');

async function fixSeasonalBoxSubCategory() {
  try {
    console.log('=== 修复时令盲盒商品的二级分类字段 ===');
    
    // 获取时令盲盒分类的key
    const seasonalCategory = await ProductCategory.findOne({
      where: { level: 1, label: '时令盲盒' }
    });
    
    if (!seasonalCategory) {
      console.error('未找到时令盲盒分类配置！');
      process.exit(1);
    }
    
    // 当前商品的二级分类值映射到正确的key
    const subCategoryMap = {
      'springBox': 'chunjimanghe-mny6vifb',
      'summerBox': 'xiajimanghe-mny6vifh',
      'autumnBox': 'qiujimanghe-mny6vifl',
      'winterBox': 'dongjimanghe-mny6vifq'
    };
    
    // 更新二级分类
    for (const [oldSubCat, newSubCat] of Object.entries(subCategoryMap)) {
      const result = await Product.update(
        { subCategory: newSubCat },
        { where: { 
          category: seasonalCategory.key,
          subCategory: oldSubCat 
        }}
      );
      console.log(`  ${oldSubCat} -> ${newSubCat}: 更新了 ${result[0]} 个商品`);
    }
    
    // 验证结果
    const updatedProducts = await Product.findAll({
      where: { category: seasonalCategory.key },
      attributes: ['id', 'name', 'category', 'subCategory']
    });
    
    console.log('\n=== 更新后的商品数据 ===');
    updatedProducts.forEach(p => {
      console.log(`${p.id}: ${p.name} - category: ${p.category}, subCategory: ${p.subCategory}`);
    });
    
    // 测试筛选功能
    console.log('\n=== 测试筛选功能 ===');
    const filteredProducts = await Product.findAll({
      where: { 
        category: seasonalCategory.key,
        subCategory: 'chunjimanghe-mny6vifb' // 春季盲盒
      },
      attributes: ['id', 'name']
    });
    
    console.log(`筛选春季盲盒找到 ${filteredProducts.length} 个商品:`);
    filteredProducts.forEach(p => console.log(`  ${p.id}: ${p.name}`));
    
    console.log('\n=== 修复完成 ===');

  } catch (error) {
    console.error('修复时令盲盒二级分类失败:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  fixSeasonalBoxSubCategory().then(() => {
    process.exit(0);
  });
}