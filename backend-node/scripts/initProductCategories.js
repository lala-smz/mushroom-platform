const { sequelize } = require('../config/db');
const ProductCategory = require('../models/ProductCategory');

const categoryData = [
  // 一级分类
  { key: 'edible', label: '食用菌', description: '日常烹饪食用的菌菇', level: 1, sortOrder: 1 },
  { key: 'medicinal', label: '药用菌', description: '具有药用价值的菌菇', level: 1, sortOrder: 2 },
  { key: 'wild', label: '野生菌', description: '野生采摘的珍稀菌菇', level: 1, sortOrder: 3 },
  { key: 'mushroomBag', label: '菌包', description: '家庭种植菌包', level: 1, sortOrder: 4 },
  { key: 'spawn', label: '菌种', description: '菌种种苗', level: 1, sortOrder: 5 },
  { key: 'seasonalBox', label: '时令菌菇盲盒', description: '季节性盲盒产品', level: 1, sortOrder: 6 },
  { key: 'other', label: '菌菇（兜底）', description: '特殊/定制商品', level: 1, sortOrder: 7 },

  // 二级分类 - 食用菌
  { key: 'shiitake', label: '香菇类', description: '香菇相关产品', level: 2, parentKey: 'edible', sortOrder: 1 },
  { key: 'oyster', label: '平菇类', description: '平菇相关产品', level: 2, parentKey: 'edible', sortOrder: 2 },
  { key: 'enoki', label: '金针菇类', description: '金针菇相关产品', level: 2, parentKey: 'edible', sortOrder: 3 },
  { key: 'woodEar', label: '木耳类', description: '木耳相关产品', level: 2, parentKey: 'edible', sortOrder: 4 },
  { key: 'kingOyster', label: '杏鲍菇类', description: '杏鲍菇相关产品', level: 2, parentKey: 'edible', sortOrder: 5 },
  { key: 'crabFlavor', label: '蟹味菇类', description: '蟹味菇相关产品', level: 2, parentKey: 'edible', sortOrder: 6 },
  { key: 'bambooFungus', label: '竹荪类', description: '竹荪相关产品', level: 2, parentKey: 'edible', sortOrder: 7 },
  { key: 'mixed', label: '混合菌菇', description: '多种菌菇组合', level: 2, parentKey: 'edible', sortOrder: 8 },

  // 二级分类 - 药用菌
  { key: 'ganoderma', label: '灵芝类', description: '灵芝相关产品', level: 2, parentKey: 'medicinal', sortOrder: 1 },
  { key: 'cordyceps', label: '冬虫夏草', description: '冬虫夏草相关产品', level: 2, parentKey: 'medicinal', sortOrder: 2 },
  { key: 'antler', label: '鹿茸菇', description: '鹿茸菇相关产品', level: 2, parentKey: 'medicinal', sortOrder: 3 },
  { key: 'poria', label: '茯苓类', description: '茯苓相关产品', level: 2, parentKey: 'medicinal', sortOrder: 4 },
  { key: 'otherMedicinal', label: '其他药用菌', description: '其他药用菌菇', level: 2, parentKey: 'medicinal', sortOrder: 5 },

  // 二级分类 - 野生菌
  { key: 'matsutake', label: '松茸类', description: '松茸相关产品', level: 2, parentKey: 'wild', sortOrder: 1 },
  { key: 'bolete', label: '牛肝菌类', description: '牛肝菌相关产品', level: 2, parentKey: 'wild', sortOrder: 2 },
  { key: 'morel', label: '羊肚菌类', description: '羊肚菌相关产品', level: 2, parentKey: 'wild', sortOrder: 3 },
  { key: 'chanterelle', label: '鸡油菌类', description: '鸡油菌相关产品', level: 2, parentKey: 'wild', sortOrder: 4 },
  { key: 'truffle', label: '松露类', description: '松露相关产品', level: 2, parentKey: 'wild', sortOrder: 5 },
  { key: 'otherWild', label: '其他野生菌', description: '其他野生菌菇', level: 2, parentKey: 'wild', sortOrder: 6 },

  // 三级分类 - 香菇类
  { key: 'driedShiitake', label: '干香菇', description: '干燥香菇', level: 3, parentKey: 'shiitake', sortOrder: 1 },
  { key: 'freshShiitake', label: '鲜香菇', description: '新鲜香菇', level: 3, parentKey: 'shiitake', sortOrder: 2 },
  { key: 'flowerShiitake', label: '花菇', description: '花菇', level: 3, parentKey: 'shiitake', sortOrder: 3 },
  { key: 'shiitakeSlice', label: '香菇片', description: '香菇切片', level: 3, parentKey: 'shiitake', sortOrder: 4 },
  { key: 'shiitakeSauce', label: '香菇酱', description: '香菇酱', level: 3, parentKey: 'shiitake', sortOrder: 5 },

  // 三级分类 - 平菇类
  { key: 'freshOyster', label: '平菇', description: '新鲜平菇', level: 3, parentKey: 'oyster', sortOrder: 1 },
  { key: 'pleurotus', label: '秀珍菇', description: '秀珍菇', level: 3, parentKey: 'oyster', sortOrder: 2 },
  { key: 'whiteOyster', label: '白平菇', description: '白平菇', level: 3, parentKey: 'oyster', sortOrder: 3 },
  { key: 'grayOyster', label: '灰平菇', description: '灰平菇', level: 3, parentKey: 'oyster', sortOrder: 4 },
  { key: 'driedOyster', label: '平菇干货', description: '平菇干货', level: 3, parentKey: 'oyster', sortOrder: 5 },

  // 三级分类 - 金针菇类
  { key: 'freshEnoki', label: '金针菇', description: '新鲜金针菇', level: 3, parentKey: 'enoki', sortOrder: 1 },
  { key: 'goldenEnoki', label: '黄金针菇', description: '黄金针菇', level: 3, parentKey: 'enoki', sortOrder: 2 },
  { key: 'whiteEnoki', label: '白金针菇', description: '白金针菇', level: 3, parentKey: 'enoki', sortOrder: 3 },
  { key: 'driedEnoki', label: '金针菇干货', description: '金针菇干货', level: 3, parentKey: 'enoki', sortOrder: 4 },

  // 三级分类 - 木耳类
  { key: 'blackWoodEar', label: '黑木耳', description: '黑木耳', level: 3, parentKey: 'woodEar', sortOrder: 1 },
  { key: 'whiteWoodEar', label: '白木耳', description: '白木耳', level: 3, parentKey: 'woodEar', sortOrder: 2 },
  { key: 'hairyWoodEar', label: '毛木耳', description: '毛木耳', level: 3, parentKey: 'woodEar', sortOrder: 3 },
  { key: 'smallBowlWoodEar', label: '小碗耳', description: '小碗耳', level: 3, parentKey: 'woodEar', sortOrder: 4 },
  { key: 'driedWoodEar', label: '木耳干货', description: '木耳干货', level: 3, parentKey: 'woodEar', sortOrder: 5 },

  // 三级分类 - 杏鲍菇类
  { key: 'freshKingOyster', label: '杏鲍菇', description: '新鲜杏鲍菇', level: 3, parentKey: 'kingOyster', sortOrder: 1 },
  { key: 'whiteLing', label: '白灵菇', description: '白灵菇', level: 3, parentKey: 'kingOyster', sortOrder: 2 },
  { key: 'kingOysterSlice', label: '杏鲍菇切片', description: '杏鲍菇切片', level: 3, parentKey: 'kingOyster', sortOrder: 3 },
  { key: 'driedKingOyster', label: '杏鲍菇干货', description: '杏鲍菇干货', level: 3, parentKey: 'kingOyster', sortOrder: 4 },

  // 三级分类 - 蟹味菇类
  { key: 'crabFlavorMushroom', label: '蟹味菇', description: '蟹味菇', level: 3, parentKey: 'crabFlavor', sortOrder: 1 },
  { key: 'whiteJade', label: '白玉菇', description: '白玉菇', level: 3, parentKey: 'crabFlavor', sortOrder: 2 },
  { key: 'seafoodMushroom', label: '海鲜菇', description: '海鲜菇', level: 3, parentKey: 'crabFlavor', sortOrder: 3 },
  { key: 'shimeji', label: '真姬菇', description: '真姬菇', level: 3, parentKey: 'crabFlavor', sortOrder: 4 },

  // 三级分类 - 竹荪类
  { key: 'bambooFungusFresh', label: '竹荪', description: '新鲜竹荪', level: 3, parentKey: 'bambooFungus', sortOrder: 1 },
  { key: 'longSkirt', label: '长裙竹荪', description: '长裙竹荪', level: 3, parentKey: 'bambooFungus', sortOrder: 2 },
  { key: 'shortSkirt', label: '短裙竹荪', description: '短裙竹荪', level: 3, parentKey: 'bambooFungus', sortOrder: 3 },
  { key: 'driedBambooFungus', label: '竹荪干货', description: '竹荪干货', level: 3, parentKey: 'bambooFungus', sortOrder: 4 },

  // 三级分类 - 混合菌菇
  { key: 'mushroomPlatter', label: '菌菇拼盘', description: '菌菇拼盘', level: 3, parentKey: 'mixed', sortOrder: 1 },
  { key: 'hotpotMix', label: '火锅菌菇组合', description: '火锅菌菇组合', level: 3, parentKey: 'mixed', sortOrder: 2 },
  { key: 'soupMix', label: '煲汤菌菇包', description: '煲汤菌菇包', level: 3, parentKey: 'mixed', sortOrder: 3 },
  { key: 'giftBox', label: '菌菇礼盒', description: '菌菇礼盒', level: 3, parentKey: 'mixed', sortOrder: 4 }
];

async function initProductCategories() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');

    console.log('正在创建商品分类数据...');
    const createdCategories = await ProductCategory.bulkCreate(
      categoryData.map(cat => ({
        ...cat,
        status: 'active'
      })),
      { ignoreDuplicates: true }
    );

    console.log(`商品分类数据创建完成，共 ${createdCategories.length} 条`);
    console.log('分类统计：');
    console.log(`- 一级分类：${createdCategories.filter(c => c.level === 1).length} 条`);
    console.log(`- 二级分类：${createdCategories.filter(c => c.level === 2).length} 条`);
    console.log(`- 三级分类：${createdCategories.filter(c => c.level === 3).length} 条`);

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('初始化商品分类失败:', error);
    process.exit(1);
  }
}

initProductCategories();