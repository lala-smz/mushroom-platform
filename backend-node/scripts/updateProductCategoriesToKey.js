const { sequelize } = require('../config/db');
const Product = require('../models/Product');

// 分类映射表：中文名称 -> 分类key
const categoryMap = {
  '新鲜蘑菇': 'freshMushroom',
  '干货蘑菇': 'driedMushroom',
  '食用菌': 'edible',
  '药用菌': 'medicinal',
  '野生菌': 'wild',
  '菌包': 'mushroomBag',
  '菌种': 'spawn',
  '时令菌菇盲盒': 'seasonalBox',
  '菌菇': 'other'
};

const subCategoryMap = {
  // 新鲜蘑菇下的二级分类
  '香菇': 'xianggu',
  '金针菇': 'jinzhen',
  '杏鲍菇': 'xingbao',
  '蟹味菇': 'xiewei',
  '牛肝菌': 'niugan',
  '松茸': 'songrong',
  '竹荪': 'zhusun',
  '羊肚菌': 'yangdu',
  // 干货蘑菇下的二级分类
  '香菇干货': 'driedXianggu',
  '松茸干货': 'driedSongrong',
  '竹荪干货': 'driedZhusun',
  '羊肚菌干货': 'driedYangdu',
  // 其他通用分类
  '香菇类': 'shiitake',
  '平菇类': 'oyster',
  '金针菇类': 'enoki',
  '木耳类': 'woodEar',
  '杏鲍菇类': 'kingOyster',
  '蟹味菇类': 'crabFlavor',
  '竹荪类': 'bambooFungus',
  '混合菌菇': 'mixed',
  '灵芝类': 'ganoderma',
  '冬虫夏草': 'cordyceps',
  '鹿茸菇': 'antler',
  '茯苓类': 'poria',
  '其他药用菌': 'otherMedicinal',
  '松茸类': 'matsutake',
  '牛肝菌类': 'bolete',
  '羊肚菌类': 'morel',
  '鸡油菌类': 'chanterelle',
  '松露类': 'truffle',
  '其他野生菌': 'otherWild',
  '香菇菌包': 'shiitakeBag',
  '平菇菌包': 'oysterBag',
  '金针菇菌包': 'enokiBag',
  '木耳菌包': 'woodEarBag',
  '杏鲍菇菌包': 'kingOysterBag',
  '趣味菌包': 'funBag',
  '香菇菌种': 'shiitakeSpawn',
  '平菇菌种': 'oysterSpawn',
  '金针菇菌种': 'enokiSpawn',
  '木耳菌种': 'woodEarSpawn',
  '其他菌种': 'otherSpawn',
  '春季盲盒': 'springBox',
  '夏季盲盒': 'summerBox',
  '秋季盲盒': 'autumnBox',
  '冬季盲盒': 'winterBox',
  '定制商品': 'custom',
  '加工食品': 'processed',
  '其他': 'misc'
};

const subSubCategoryMap = {
  // 香菇下的三级分类
  '特级': 'xianggu-premium',
  '有机': 'xianggu-organic',
  '干香菇': '干香菇',
  '鲜香菇': '鲜香菇',
  '花菇': '花菇',
  '香菇片': '香菇片',
  '香菇酱': '香菇酱',
  // 金针菇下的三级分类
  '有机金针菇': 'jinzhen-organic',
  '新鲜金针菇': 'jinzhen-fresh',
  '金针菇': '金针菇',
  '黄金针菇': '黄金针菇',
  '白金针菇': '白金针菇',
  '金针菇干货': '金针菇干货',
  // 杏鲍菇下的三级分类
  '新鲜': 'xingbao-fresh',
  '干货': 'xingbao-dried',
  '杏鲍菇': '杏鲍菇',
  '白灵菇': '白灵菇',
  '杏鲍菇切片': '杏鲍菇切片',
  '杏鲍菇干货': '杏鲍菇干货',
  // 蟹味菇下的三级分类
  '新鲜蟹味菇': 'xiewei-fresh',
  '蟹味菇': '蟹味菇',
  '白玉菇': '白玉菇',
  '海鲜菇': '海鲜菇',
  '真姬菇': '真姬菇',
  // 牛肝菌下的三级分类
  '黑牛肝': 'niugan-black',
  '黄牛肝': 'niugan-yellow',
  '黄牛肝菌': '黄牛肝菌',
  '黑牛肝菌': '黑牛肝菌',
  '白牛肝菌': '白牛肝菌',
  '牛肝菌干货': '牛肝菌干货',
  // 松茸下的三级分类
  '野生': 'songrong-wild',
  '新鲜松茸': 'songrong-fresh',
  '新鲜松茸': '新鲜松茸',
  '冻干松茸': '冻干松茸',
  '松茸干片': '松茸干片',
  '松茸酱': '松茸酱',
  // 竹荪下的三级分类
  '精选': 'zhusun-premium',
  '竹荪干货': 'zhusun-dried',
  '竹荪': '竹荪',
  '长裙竹荪': '长裙竹荪',
  '短裙竹荪': '短裙竹荪',
  '竹荪干货': '竹荪干货',
  // 羊肚菌下的三级分类
  '精选羊肚菌': 'yangdu-premium',
  '野生羊肚菌': 'yangdu-wild',
  '新鲜羊肚菌': '新鲜羊肚菌',
  '干羊肚菌': '干羊肚菌',
  '羊肚菌粉': '羊肚菌粉',
  // 干货分类下的三级分类
  '特级干货': 'driedXianggu-premium',
  '野生干货': 'driedSongrong-wild',
  '精选干货': 'driedZhusun-premium',
  '精选羊肚菌干货': 'driedYangdu-premium',
  // 其他通用三级分类
  '菌菇拼盘': '菌菇拼盘',
  '火锅菌菇组合': '火锅菌菇组合',
  '煲汤菌菇包': '煲汤菌包',
  '菌菇礼盒': '菌菇礼盒',
  '赤灵芝': '赤灵芝',
  '紫灵芝': '紫灵芝',
  '灵芝切片': '灵芝切片',
  '灵芝孢子粉': '灵芝孢子粉',
  '灵芝茶': '灵芝茶',
  '虫草花': '虫草花',
  '虫草粉': '虫草粉',
  '虫草胶囊': '虫草胶囊',
  '鹿茸菇干货': '鹿茸菇干货',
  '鹿茸菇粉': '鹿茸菇粉',
  '茯苓块': '茯苓块',
  '茯苓粉': '茯苓粉',
  '茯苓皮': '茯苓皮',
  '茯神': '茯神',
  '猴头菇': '猴头菇',
  '天麻': '天麻',
  '铁皮石斛': '铁皮石斛',
  '蛹虫草': '蛹虫草',
  '鸡油菌': '鸡油菌',
  '鸡油菌干货': '鸡油菌干货',
  '鸡油菌酱': '鸡油菌酱',
  '黑松露': '黑松露',
  '白松露': '白松露',
  '松露酱': '松露酱',
  '松露油': '松露油',
  '虎掌菌': '虎掌菌',
  '老人头菌': '老人头菌',
  '鸡枞菌': '鸡枞菌',
  '竹荪蛋': '竹荪蛋',
  '花菇菌包': '花菇菌包',
  '黑香菇菌包': '黑香菇菌包',
  '秀珍菇菌包': '秀珍菇菌包',
  '姬菇菌包': '姬菇菌包',
  '黄金针菌包': '黄金针菌包',
  '白木耳菌包': '白木耳菌包',
  '白灵菇菌包': '白灵菇菌包',
  '蘑菇乐园组合': '蘑菇乐园组合',
  '儿童种植套装': '儿童种植套装',
  'DIY种植礼盒': 'DIY种植礼盒',
  '香菇母种': '香菇母种',
  '香菇原种': '香菇原种',
  '香菇栽培种': '香菇栽培种',
  '平菇母种': '平菇母种',
  '平菇原种': '平菇原种',
  '平菇栽培种': '平菇栽培种',
  '金针菇母种': '金针菇母种',
  '金针菇原种': '金针菇原种',
  '金针菇栽培种': '金针菇栽培种',
  '黑木耳菌种': '黑木耳菌种',
  '白木耳菌种': '白木耳菌种',
  '杏鲍菇菌种': '杏鲍菇菌种',
  '猴头菇菌种': '猴头菇菌种',
  '灵芝菌种': '灵芝菌种',
  '春季尝鲜盒': '春季尝鲜盒',
  '春笋菌菇组合': '春笋菌菇组合',
  '清明菌菇礼包': '清明菌菇礼包',
  '夏季清凉菌菇盒': '夏季清凉菌菇盒',
  '消暑菌菇组合': '消暑菌菇组合',
  '秋季丰收盒': '秋季丰收盒',
  '野生菌菇盲盒': '野生菌菇盲盒',
  '中秋礼盒': '中秋礼盒',
  '冬季滋补盒': '冬季滋补盒',
  '暖冬菌菇礼包': '暖冬菌菇礼包',
  '年货礼盒': '年货礼盒',
  '企业定制礼盒': '企业定制礼盒',
  '专属定制包装': '专属定制包装',
  '菌菇零食': '菌菇零食',
  '菌菇调味品': '菌菇调味品',
  '菌菇罐头': '菌菇罐头',
  '菌菇工艺品': '菌菇工艺品',
  '菌菇相关周边': '菌菇相关周边'
};

async function updateProductCategoriesToKey() {
  try {
    console.log('开始更新商品分类字段为分类key...');

    // 查询所有商品
    const products = await Product.findAll();
    console.log(`查询到 ${products.length} 个商品`);

    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
        const updates = {};
        let needsUpdate = false;

        // 更新一级分类
        if (product.category && !product.category.startsWith('freshMushroom') && 
            !product.category.startsWith('driedMushroom') && 
            !product.category.startsWith('edible') &&
            !product.category.startsWith('medicinal') &&
            !product.category.startsWith('wild') &&
            !product.category.startsWith('mushroomBag') &&
            !product.category.startsWith('spawn') &&
            !product.category.startsWith('seasonalBox') &&
            !product.category.startsWith('other')) {
          const mappedKey = categoryMap[product.category];
          if (mappedKey) {
            updates.category = mappedKey;
            needsUpdate = true;
            console.log(`商品 "${product.name}" 一级分类: "${product.category}" -> "${mappedKey}"`);
          }
        }

        // 更新二级分类
        if (product.subCategory) {
          const mappedKey = subCategoryMap[product.subCategory];
          if (mappedKey && !product.subCategory.startsWith('xianggu') && 
              !product.subCategory.startsWith('jinzhen') &&
              !product.subCategory.startsWith('xingbao') &&
              !product.subCategory.startsWith('xiewei') &&
              !product.subCategory.startsWith('niugan') &&
              !product.subCategory.startsWith('songrong') &&
              !product.subCategory.startsWith('zhusun') &&
              !product.subCategory.startsWith('yangdu') &&
              !product.subCategory.startsWith('dried') &&
              !product.subCategory.startsWith('shiitake') &&
              !product.subCategory.startsWith('oyster') &&
              !product.subCategory.startsWith('enoki') &&
              !product.subCategory.startsWith('woodEar') &&
              !product.subCategory.startsWith('kingOyster') &&
              !product.subCategory.startsWith('crabFlavor') &&
              !product.subCategory.startsWith('bambooFungus') &&
              !product.subCategory.startsWith('mixed') &&
              !product.subCategory.startsWith('ganoderma') &&
              !product.subCategory.startsWith('cordyceps') &&
              !product.subCategory.startsWith('antler') &&
              !product.subCategory.startsWith('poria') &&
              !product.subCategory.startsWith('matsutake') &&
              !product.subCategory.startsWith('bolete') &&
              !product.subCategory.startsWith('morel') &&
              !product.subCategory.startsWith('chanterelle') &&
              !product.subCategory.startsWith('truffle') &&
              !product.subCategory.startsWith('springBox') &&
              !product.subCategory.startsWith('summerBox') &&
              !product.subCategory.startsWith('autumnBox') &&
              !product.subCategory.startsWith('winterBox') &&
              !product.subCategory.startsWith('custom') &&
              !product.subCategory.startsWith('processed') &&
              !product.subCategory.startsWith('misc')) {
            updates.subCategory = mappedKey;
            needsUpdate = true;
            console.log(`商品 "${product.name}" 二级分类: "${product.subCategory}" -> "${mappedKey}"`);
          }
        }

        // 更新三级分类
        if (product.subSubCategory) {
          const mappedKey = subSubCategoryMap[product.subSubCategory];
          if (mappedKey && !product.subSubCategory.startsWith('xianggu-') && 
              !product.subSubCategory.startsWith('jinzhen-') &&
              !product.subSubCategory.startsWith('xingbao-') &&
              !product.subSubCategory.startsWith('xiewei-') &&
              !product.subSubCategory.startsWith('niugan-') &&
              !product.subSubCategory.startsWith('songrong-') &&
              !product.subSubCategory.startsWith('zhusun-') &&
              !product.subSubCategory.startsWith('yangdu-') &&
              !product.subSubCategory.startsWith('dried')) {
            updates.subSubCategory = mappedKey;
            needsUpdate = true;
            console.log(`商品 "${product.name}" 三级分类: "${product.subSubCategory}" -> "${mappedKey}"`);
          }
        }

        if (needsUpdate) {
          await product.update(updates);
          updatedCount++;
        } else {
          skippedCount++;
        }
      } catch (error) {
        console.error(`更新商品 "${product.name}" 失败:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n更新完成！成功更新 ${updatedCount} 个商品，跳过 ${skippedCount} 个无需更新的商品，失败 ${errorCount} 个`);

  } catch (error) {
    console.error('更新商品分类失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  updateProductCategoriesToKey().then(() => {
    process.exit(0);
  });
}

module.exports = updateProductCategoriesToKey;