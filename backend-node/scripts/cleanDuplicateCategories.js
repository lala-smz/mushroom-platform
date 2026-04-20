const { sequelize } = require('../config/db');
const ProductCategory = require('../models/ProductCategory');

// 需要删除的重复分类key
const duplicateKeys = [
  // 干货蘑菇下错误的重复分类
  'songrong',      // 应该是 driedSongrong
  'zhusun',        // 应该是 driedZhusun
  'yangdu'         // 应该是 driedYangdu
];

async function cleanDuplicateCategories() {
  try {
    console.log('开始清理重复分类...');

    let deletedCount = 0;

    for (const key of duplicateKeys) {
      try {
        // 查找分类
        const category = await ProductCategory.findOne({
          where: { key: key, parentKey: 'driedMushroom' }
        });

        if (category) {
          await category.destroy();
          console.log(`已删除重复分类: ${key} -> ${category.label}`);
          deletedCount++;
        } else {
          console.log(`未找到需要删除的分类: ${key}`);
        }
      } catch (error) {
        console.error(`删除分类 ${key} 失败:`, error.message);
      }
    }

    console.log(`\n清理完成！共删除 ${deletedCount} 个重复分类`);

    // 更新商品数据中使用错误分类key的记录
    console.log('\n更新商品数据中的分类引用...');
    const updates = [
      { oldKey: 'songrong', newKey: 'driedSongrong', field: 'subCategory' },
      { oldKey: 'zhusun', newKey: 'driedZhusun', field: 'subCategory' },
      { oldKey: 'yangdu', newKey: 'driedYangdu', field: 'subCategory' }
    ];

    const Product = require('../models/Product');
    let updatedCount = 0;

    for (const update of updates) {
      const result = await Product.update(
        { [update.field]: update.newKey },
        { where: { [update.field]: update.oldKey } }
      );
      if (result[0] > 0) {
        console.log(`将 ${update.field} 从 ${update.oldKey} 更新为 ${update.newKey}: ${result[0]} 条记录`);
        updatedCount += result[0];
      }
    }

    console.log(`\n商品数据更新完成！共更新 ${updatedCount} 条记录`);

  } catch (error) {
    console.error('清理重复分类失败:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  cleanDuplicateCategories().then(() => {
    process.exit(0);
  });
}