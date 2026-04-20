const { sequelize } = require('../config/db');
const ProductCategory = require('../models/ProductCategory');

async function addCategories() {
  try {
    console.log('开始添加商品分类...');

    // 添加一级分类：新鲜蘑菇
    const freshMushroom = await ProductCategory.findOrCreate({
      where: { key: 'freshMushroom' },
      defaults: {
        label: '新鲜蘑菇',
        description: '新鲜采摘的各类菌菇',
        level: 1,
        parentKey: null,
        sortOrder: 1,
        status: 'active'
      }
    });
    console.log(`一级分类「新鲜蘑菇」: ${freshMushroom[1] ? '已创建' : '已存在'}`);

    // 添加一级分类：干货蘑菇
    const driedMushroom = await ProductCategory.findOrCreate({
      where: { key: 'driedMushroom' },
      defaults: {
        label: '干货蘑菇',
        description: '经过加工处理的干制菌菇',
        level: 1,
        parentKey: null,
        sortOrder: 2,
        status: 'active'
      }
    });
    console.log(`一级分类「干货蘑菇」: ${driedMushroom[1] ? '已创建' : '已存在'}`);

    // 为新鲜蘑菇添加二级分类
    const freshMushroomChildren = [
      { key: 'xianggu', label: '香菇', description: '香菇品种', sortOrder: 1 },
      { key: 'jinzhen', label: '金针菇', description: '金针菇品种', sortOrder: 2 },
      { key: 'xingbao', label: '杏鲍菇', description: '杏鲍菇品种', sortOrder: 3 },
      { key: 'xiewei', label: '蟹味菇', description: '蟹味菇品种', sortOrder: 4 },
      { key: 'niugan', label: '牛肝菌', description: '牛肝菌品种', sortOrder: 5 },
      { key: 'otherFresh', label: '其他新鲜菌', description: '其他新鲜菌菇', sortOrder: 99 }
    ];

    for (const child of freshMushroomChildren) {
      const result = await ProductCategory.findOrCreate({
        where: { key: child.key },
        defaults: {
          label: child.label,
          description: child.description,
          level: 2,
          parentKey: 'freshMushroom',
          sortOrder: child.sortOrder,
          status: 'active'
        }
      });
      console.log(`  二级分类「${child.label}」: ${result[1] ? '已创建' : '已存在'}`);
    }

    // 为干货蘑菇添加二级分类
    const driedMushroomChildren = [
      { key: 'songrong', label: '松茸', description: '松茸干货', sortOrder: 1 },
      { key: 'zhusun', label: '竹荪', description: '竹荪干货', sortOrder: 2 },
      { key: 'yangdu', label: '羊肚菌', description: '羊肚菌干货', sortOrder: 3 },
      { key: 'otherDried', label: '其他干货', description: '其他干货菌菇', sortOrder: 99 }
    ];

    for (const child of driedMushroomChildren) {
      const result = await ProductCategory.findOrCreate({
        where: { key: child.key },
        defaults: {
          label: child.label,
          description: child.description,
          level: 2,
          parentKey: 'driedMushroom',
          sortOrder: child.sortOrder,
          status: 'active'
        }
      });
      console.log(`  二级分类「${child.label}」: ${result[1] ? '已创建' : '已存在'}`);
    }

    // 添加三级分类示例
    const level3Categories = [
      // 新鲜蘑菇 -> 香菇 的三级分类
      { key: 'xianggu-premium', label: '特级', parentKey: 'xianggu', sortOrder: 1 },
      { key: 'xianggu-organic', label: '有机', parentKey: 'xianggu', sortOrder: 2 },
      { key: 'xianggu-fresh', label: '新鲜', parentKey: 'xianggu', sortOrder: 3 },
      
      // 新鲜蘑菇 -> 金针菇 的三级分类
      { key: 'jinzhen-organic', label: '有机', parentKey: 'jinzhen', sortOrder: 1 },
      { key: 'jinzhen-fresh', label: '新鲜', parentKey: 'jinzhen', sortOrder: 2 },
      
      // 新鲜蘑菇 -> 杏鲍菇 的三级分类
      { key: 'xingbao-fresh', label: '新鲜', parentKey: 'xingbao', sortOrder: 1 },
      
      // 新鲜蘑菇 -> 蟹味菇 的三级分类
      { key: 'xiewei-fresh', label: '新鲜', parentKey: 'xiewei', sortOrder: 1 },
      
      // 新鲜蘑菇 -> 牛肝菌 的三级分类
      { key: 'niugan-black', label: '黑牛肝', parentKey: 'niugan', sortOrder: 1 },
      
      // 干货蘑菇 -> 松茸 的三级分类
      { key: 'songrong-wild', label: '野生', parentKey: 'songrong', sortOrder: 1 },
      
      // 干货蘑菇 -> 竹荪 的三级分类
      { key: 'zhusun-premium', label: '精选', parentKey: 'zhusun', sortOrder: 1 },
      
      // 干货蘑菇 -> 羊肚菌 的三级分类
      { key: 'yangdu-premium', label: '精选', parentKey: 'yangdu', sortOrder: 1 }
    ];

    for (const cat of level3Categories) {
      const result = await ProductCategory.findOrCreate({
        where: { key: cat.key },
        defaults: {
          label: cat.label,
          description: '',
          level: 3,
          parentKey: cat.parentKey,
          sortOrder: cat.sortOrder,
          status: 'active'
        }
      });
      console.log(`    三级分类「${cat.label}」: ${result[1] ? '已创建' : '已存在'}`);
    }

    console.log('\n分类添加完成！');
    process.exit(0);
  } catch (error) {
    console.error('添加分类失败:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  addCategories();
}

module.exports = addCategories;
