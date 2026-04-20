const { sequelize } = require('../config/db');
const ProductCategory = require('../models/ProductCategory');

async function addMissingCategories() {
  try {
    console.log('开始添加缺失的分类...');

    // 需要添加的分类
    const categoriesToAdd = [
      // 新鲜蘑菇下缺失的二级分类
      {
        key: 'songrong',
        label: '松茸',
        description: '松茸类产品',
        level: 2,
        parentKey: 'freshMushroom',
        sortOrder: 6
      },
      {
        key: 'zhusun',
        label: '竹荪',
        description: '竹荪类产品',
        level: 2,
        parentKey: 'freshMushroom',
        sortOrder: 7
      },
      {
        key: 'yangdu',
        label: '羊肚菌',
        description: '羊肚菌类产品',
        level: 2,
        parentKey: 'freshMushroom',
        sortOrder: 8
      },
      // 新鲜蘑菇下松茸的三级分类
      {
        key: 'songrong-fresh',
        label: '新鲜',
        description: '新鲜松茸',
        level: 3,
        parentKey: 'songrong',
        sortOrder: 1
      },
      // 新鲜蘑菇下竹荪的三级分类
      {
        key: 'zhusun-fresh',
        label: '新鲜',
        description: '新鲜竹荪',
        level: 3,
        parentKey: 'zhusun',
        sortOrder: 1
      },
      // 新鲜蘑菇下羊肚菌的三级分类
      {
        key: 'yangdu-fresh',
        label: '新鲜',
        description: '新鲜羊肚菌',
        level: 3,
        parentKey: 'yangdu',
        sortOrder: 1
      }
    ];

    let createdCount = 0;
    let skippedCount = 0;

    for (const category of categoriesToAdd) {
      try {
        const existing = await ProductCategory.findOne({
          where: { key: category.key }
        });

        if (existing) {
          console.log(`分类 "${category.label}" (${category.key}) 已存在，跳过`);
          skippedCount++;
          continue;
        }

        await ProductCategory.create(category);
        console.log(`成功创建分类: ${category.label} (${category.key})`);
        createdCount++;
      } catch (error) {
        console.error(`创建分类 "${category.label}" 失败:`, error.message);
      }
    }

    console.log(`\n分类添加完成！成功创建 ${createdCount} 个分类，跳过 ${skippedCount} 个已存在的分类`);

  } catch (error) {
    console.error('添加分类失败:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  addMissingCategories().then(() => {
    process.exit(0);
  });
}