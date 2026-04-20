const { sequelize } = require('../config/db');
const Product = require('../models/Product');

async function updateProductCategories() {
  try {
    console.log('开始更新商品分类...');

    // 分类映射表
    const categoryMap = {
      '新鲜蘑菇': { level1: 'freshMushroom' },
      '干货蘑菇': { level1: 'driedMushroom' }
    };

    const subCategoryMap = {
      '香菇': { level2: 'xianggu' },
      '金针菇': { level2: 'jinzhen' },
      '杏鲍菇': { level2: 'xingbao' },
      '蟹味菇': { level2: 'xiewei' },
      '牛肝菌': { level2: 'niugan' },
      '松茸': { level2: 'songrong' },
      '竹荪': { level2: 'zhusun' },
      '羊肚菌': { level2: 'yangdu' }
    };

    const subSubCategoryMap = {
      '特级': { level3: 'xianggu-premium' },
      '有机': { level3: 'jinzhen-organic' },
      '新鲜': { level3: 'xiewei-fresh' },
      '野生': { level3: 'songrong-wild' },
      '精选': { level3: 'zhusun-premium' },
      '黑牛肝': { level3: 'niugan-black' }
    };

    // 获取所有商品
    const products = await Product.findAll();
    console.log(`共找到 ${products.length} 个商品`);

    let updatedCount = 0;

    for (const product of products) {
      let hasChanges = false;
      const updates = {};

      // 更新一级分类
      if (product.category && categoryMap[product.category]) {
        updates.category = categoryMap[product.category].level1;
        hasChanges = true;
      }

      // 更新二级分类
      if (product.subCategory && subCategoryMap[product.subCategory]) {
        updates.subCategory = subCategoryMap[product.subCategory].level2;
        hasChanges = true;
      }

      // 更新三级分类
      if (product.subSubCategory && subSubCategoryMap[product.subSubCategory]) {
        updates.subSubCategory = subSubCategoryMap[product.subSubCategory].level3;
        hasChanges = true;
      }

      if (hasChanges) {
        await product.update(updates);
        console.log(`更新商品「${product.name}」: ${JSON.stringify(updates)}`);
        updatedCount++;
      }
    }

    console.log(`\n更新完成！共更新 ${updatedCount} 个商品`);
    process.exit(0);
  } catch (error) {
    console.error('更新商品分类失败:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  updateProductCategories();
}

module.exports = updateProductCategories;
