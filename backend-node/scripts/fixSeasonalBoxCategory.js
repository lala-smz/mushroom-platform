const { sequelize } = require('../config/db');
const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');

async function fixSeasonalBoxCategory() {
  try {
    console.log('=== 修复时令盲盒商品的分类字段 ===');
    
    // 1. 获取时令盲盒分类的key
    const seasonalCategory = await ProductCategory.findOne({
      where: { level: 1, label: '时令盲盒' }
    });
    
    if (!seasonalCategory) {
      console.error('未找到时令盲盒分类配置！');
      process.exit(1);
    }
    
    console.log(`时令盲盒分类 key: ${seasonalCategory.key}`);
    
    // 2. 统计需要更新的商品数量
    const count = await Product.count({ where: { category: '时令盲盒' } });
    console.log(`需要更新 ${count} 个商品的分类字段`);
    
    // 3. 更新商品数据
    const result = await Product.update(
      { category: seasonalCategory.key },
      { where: { category: '时令盲盒' } }
    );
    
    console.log(`成功更新 ${result[0]} 个商品`);
    
    // 4. 更新二级分类
    const level2Cats = await ProductCategory.findAll({
      where: { parentKey: seasonalCategory.key, level: 2 }
    });
    
    console.log('\n=== 更新二级分类映射 ===');
    const level2Map = {
      '春季': 'chunjimanghe-mny6vifb',
      '夏季': 'xiajimanghe-mny6vifh',
      '秋季': 'qiujimanghe-mny6vifl',
      '冬季': 'dongjimanghe-mny6vifq'
    };
    
    for (const [chineseLabel, key] of Object.entries(level2Map)) {
      const updateResult = await Product.update(
        { subCategory: key },
        { where: { 
          category: seasonalCategory.key,
          subCategory: chineseLabel 
        }}
      );
      console.log(`  ${chineseLabel} -> ${key}: 更新了 ${updateResult[0]} 个商品`);
    }
    
    // 5. 验证结果
    const updatedProducts = await Product.findAll({
      where: { category: seasonalCategory.key },
      attributes: ['id', 'name', 'category', 'subCategory']
    });
    
    console.log('\n=== 更新后的商品数据 ===');
    updatedProducts.forEach(p => {
      console.log(`${p.id}: ${p.name} - category: ${p.category}, subCategory: ${p.subCategory}`);
    });
    
    console.log('\n=== 修复完成 ===');

  } catch (error) {
    console.error('修复时令盲盒分类失败:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  fixSeasonalBoxCategory().then(() => {
    process.exit(0);
  });
}