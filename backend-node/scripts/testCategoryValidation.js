const { sequelize } = require('../config/db');
const ProductCategory = require('../models/ProductCategory');

const validateCategoryFromDB = async (level1, level2, level3) => {
  try {
    const level1Cat = await ProductCategory.findOne({
      where: { key: level1, level: 1, status: 'active' }
    });
    if (!level1Cat) {
      return { valid: false, message: '无效的一级分类，请先在商品分类管理中创建一级分类' };
    }

    if (level2) {
      const level2Cat = await ProductCategory.findOne({
        where: { key: level2, level: 2, parentKey: level1, status: 'active' }
      });
      if (!level2Cat) {
        return { valid: false, message: `无效的二级分类或该二级分类不属于选中的一级分类"${level1Cat.label}"，请先在商品分类管理中创建二级分类` };
      }

      if (level3) {
        const level3Cat = await ProductCategory.findOne({
          where: { key: level3, level: 3, parentKey: level2, status: 'active' }
        });
        if (!level3Cat) {
          return { valid: false, message: `无效的三级分类或该三级分类不属于选中的二级分类"${level2Cat.label}"，请先在商品分类管理中创建三级分类` };
        }
      }
    } else {
      const level2Count = await ProductCategory.count({
        where: { parentKey: level1, level: 2, status: 'active' }
      });
      if (level2Count === 0) {
        return { valid: false, message: `一级分类"${level1Cat.label}"下暂无二级分类，请先在商品分类管理中为该分类创建二级分类` };
      }
    }

    return { valid: true, message: '分类验证通过' };
  } catch (error) {
    console.error('数据库验证分类失败:', error);
    return { valid: false, message: '验证分类时发生错误' };
  }
};

async function runTests() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功\n');

    console.log('========================================');
    console.log('         分类层级验证测试');
    console.log('========================================\n');

    const testCases = [
      { name: '测试1: 有效的完整分类路径', level1: 'edible', level2: 'shiitake', level3: 'freshShiitake', expectValid: true },
      { name: '测试2: 有效的二级分类（无三级）', level1: 'edible', level2: 'oyster', level3: null, expectValid: true },
      { name: '测试3: 无效的一级分类', level1: 'invalid', level2: 'shiitake', level3: null, expectValid: false },
      { name: '测试4: 二级分类不属于一级分类', level1: 'edible', level2: 'ganoderma', level3: null, expectValid: false },
      { name: '测试5: 三级分类不属于二级分类', level1: 'edible', level2: 'shiitake', level3: 'freshOyster', expectValid: false },
      { name: '测试6: 缺少二级分类但一级下有二级', level1: 'edible', level2: null, level3: null, expectValid: true },
      { name: '测试7: 有效药用菌分类', level1: 'medicinal', level2: 'ganoderma', level3: null, expectValid: true },
      { name: '测试8: 有效野生菌分类', level1: 'wild', level2: 'matsutake', level3: null, expectValid: true },
    ];

    let passed = 0;
    let failed = 0;

    for (const testCase of testCases) {
      console.log(`${testCase.name}:`);
      console.log(`  参数: level1=${testCase.level1}, level2=${testCase.level2}, level3=${testCase.level3}`);
      
      const result = await validateCategoryFromDB(testCase.level1, testCase.level2, testCase.level3);
      console.log(`  结果: ${result.valid ? '通过' : '失败'}`);
      console.log(`  消息: ${result.message}`);
      
      const isPassed = result.valid === testCase.expectValid;
      if (isPassed) {
        passed++;
        console.log('  ✅ 测试通过\n');
      } else {
        failed++;
        console.log(`  ❌ 测试失败 (期望${testCase.expectValid ? '通过' : '失败'})\n`);
      }
    }

    console.log('========================================');
    console.log(`测试结果: ${passed} 通过, ${failed} 失败`);
    console.log('========================================');

    await sequelize.close();
    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('测试失败:', error);
    process.exit(1);
  }
}

runTests();