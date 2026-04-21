-- 商品分类层级数据初始化 SQL 脚本
-- 适用于 Railway 部署
-- 包含：7个一级分类、19个二级分类、35个三级分类

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ==============================================
-- 一级分类 (Level 1)
-- ==============================================

INSERT INTO product_categories (key, label, description, level, parentKey, sortOrder, status, createdAt, updatedAt) VALUES
-- 食用菌
('edible', '食用菌', '日常烹饪食用的菌菇', 1, NULL, 1, 'active', NOW(), NOW()),
-- 药用菌
('medicinal', '药用菌', '具有药用价值的菌菇', 1, NULL, 2, 'active', NOW(), NOW()),
-- 野生菌
('wild', '野生菌', '野生采摘的珍稀菌菇', 1, NULL, 3, 'active', NOW(), NOW()),
-- 菌包
('mushroomBag', '菌包', '家庭种植菌包', 1, NULL, 4, 'active', NOW(), NOW()),
-- 菌种
('spawn', '菌种', '菌种种苗', 1, NULL, 5, 'active', NOW(), NOW()),
-- 时令菌菇盲盒
('seasonalBox', '时令菌菇盲盒', '季节性盲盒产品', 1, NULL, 6, 'active', NOW(), NOW()),
-- 菌菇（兜底）
('other', '菌菇（兜底）', '特殊/定制商品', 1, NULL, 7, 'active', NOW(), NOW());

-- ==============================================
-- 二级分类 (Level 2) - 食用菌
-- ==============================================

INSERT INTO product_categories (key, label, description, level, parentKey, sortOrder, status, createdAt, updatedAt) VALUES
-- 香菇类
('shiitake', '香菇类', '香菇相关产品', 2, 'edible', 1, 'active', NOW(), NOW()),
-- 平菇类
('oyster', '平菇类', '平菇相关产品', 2, 'edible', 2, 'active', NOW(), NOW()),
-- 金针菇类
('enoki', '金针菇类', '金针菇相关产品', 2, 'edible', 3, 'active', NOW(), NOW()),
-- 木耳类
('woodEar', '木耳类', '木耳相关产品', 2, 'edible', 4, 'active', NOW(), NOW()),
-- 杏鲍菇类
('kingOyster', '杏鲍菇类', '杏鲍菇相关产品', 2, 'edible', 5, 'active', NOW(), NOW()),
-- 蟹味菇类
('crabFlavor', '蟹味菇类', '蟹味菇相关产品', 2, 'edible', 6, 'active', NOW(), NOW()),
-- 竹荪类
('bambooFungus', '竹荪类', '竹荪相关产品', 2, 'edible', 7, 'active', NOW(), NOW()),
-- 混合菌菇
('mixed', '混合菌菇', '多种菌菇组合', 2, 'edible', 8, 'active', NOW(), NOW());

-- ==============================================
-- 二级分类 (Level 2) - 药用菌
-- ==============================================

INSERT INTO product_categories (key, label, description, level, parentKey, sortOrder, status, createdAt, updatedAt) VALUES
-- 灵芝类
('ganoderma', '灵芝类', '灵芝相关产品', 2, 'medicinal', 1, 'active', NOW(), NOW()),
-- 冬虫夏草
('cordyceps', '冬虫夏草', '冬虫夏草相关产品', 2, 'medicinal', 2, 'active', NOW(), NOW()),
-- 鹿茸菇
('antler', '鹿茸菇', '鹿茸菇相关产品', 2, 'medicinal', 3, 'active', NOW(), NOW()),
-- 茯苓类
('poria', '茯苓类', '茯苓相关产品', 2, 'medicinal', 4, 'active', NOW(), NOW()),
-- 其他药用菌
('otherMedicinal', '其他药用菌', '其他药用菌菇', 2, 'medicinal', 5, 'active', NOW(), NOW());

-- ==============================================
-- 二级分类 (Level 2) - 野生菌
-- ==============================================

INSERT INTO product_categories (key, label, description, level, parentKey, sortOrder, status, createdAt, updatedAt) VALUES
-- 松茸类
('matsutake', '松茸类', '松茸相关产品', 2, 'wild', 1, 'active', NOW(), NOW()),
-- 牛肝菌类
('bolete', '牛肝菌类', '牛肝菌相关产品', 2, 'wild', 2, 'active', NOW(), NOW()),
-- 羊肚菌类
('morel', '羊肚菌类', '羊肚菌相关产品', 2, 'wild', 3, 'active', NOW(), NOW()),
-- 鸡油菌类
('chanterelle', '鸡油菌类', '鸡油菌相关产品', 2, 'wild', 4, 'active', NOW(), NOW()),
-- 松露类
('truffle', '松露类', '松露相关产品', 2, 'wild', 5, 'active', NOW(), NOW()),
-- 其他野生菌
('otherWild', '其他野生菌', '其他野生菌菇', 2, 'wild', 6, 'active', NOW(), NOW());

-- ==============================================
-- 二级分类 (Level 2) - 菌包
-- ==============================================

INSERT INTO product_categories (key, label, description, level, parentKey, sortOrder, status, createdAt, updatedAt) VALUES
-- 香菇菌包
('shiitakeBag', '香菇菌包', '香菇种植菌包', 2, 'mushroomBag', 1, 'active', NOW(), NOW()),
-- 平菇菌包
('oysterBag', '平菇菌包', '平菇种植菌包', 2, 'mushroomBag', 2, 'active', NOW(), NOW()),
-- 金针菇菌包
('enokiBag', '金针菇菌包', '金针菇种植菌包', 2, 'mushroomBag', 3, 'active', NOW(), NOW()),
-- 木耳菌包
('woodEarBag', '木耳菌包', '木耳种植菌包', 2, 'mushroomBag', 4, 'active', NOW(), NOW()),
-- 杏鲍菇菌包
('kingOysterBag', '杏鲍菇菌包', '杏鲍菇种植菌包', 2, 'mushroomBag', 5, 'active', NOW(), NOW()),
-- 趣味菌包
('funBag', '趣味菌包', '趣味种植套装', 2, 'mushroomBag', 6, 'active', NOW(), NOW());

-- ==============================================
-- 二级分类 (Level 2) - 菌种
-- ==============================================

INSERT INTO product_categories (key, label, description, level, parentKey, sortOrder, status, createdAt, updatedAt) VALUES
-- 香菇菌种
('shiitakeSpawn', '香菇菌种', '香菇菌种', 2, 'spawn', 1, 'active', NOW(), NOW()),
-- 平菇菌种
('oysterSpawn', '平菇菌种', '平菇菌种', 2, 'spawn', 2, 'active', NOW(), NOW()),
-- 金针菇菌种
('enokiSpawn', '金针菇菌种', '金针菇菌种', 2, 'spawn', 3, 'active', NOW(), NOW()),
-- 木耳菌种
('woodEarSpawn', '木耳菌种', '木耳菌种', 2, 'spawn', 4, 'active', NOW(), NOW()),
-- 其他菌种
('otherSpawn', '其他菌种', '其他珍稀菌种', 2, 'spawn', 5, 'active', NOW(), NOW());

-- ==============================================
-- 二级分类 (Level 2) - 时令菌菇盲盒
-- ==============================================

INSERT INTO product_categories (key, label, description, level, parentKey, sortOrder, status, createdAt, updatedAt) VALUES
-- 春季盲盒
('springBox', '春季盲盒', '春季限定盲盒', 2, 'seasonalBox', 1, 'active', NOW(), NOW()),
-- 夏季盲盒
('summerBox', '夏季盲盒', '夏季限定盲盒', 2, 'seasonalBox', 2, 'active', NOW(), NOW()),
-- 秋季盲盒
('autumnBox', '秋季盲盒', '秋季限定盲盒', 2, 'seasonalBox', 3, 'active', NOW(), NOW()),
-- 冬季盲盒
('winterBox', '冬季盲盒', '冬季限定盲盒', 2, 'seasonalBox', 4, 'active', NOW(), NOW());

-- ==============================================
-- 二级分类 (Level 2) - 菌菇（兜底）
-- ==============================================

INSERT INTO product_categories (key, label, description, level, parentKey, sortOrder, status, createdAt, updatedAt) VALUES
-- 定制商品
('custom', '定制商品', '客户定制商品', 2, 'other', 1, 'active', NOW(), NOW()),
-- 加工食品
('processed', '加工食品', '菌菇深加工产品', 2, 'other', 2, 'active', NOW(), NOW()),
-- 其他
('misc', '其他', '无法归入其他分类的商品', 2, 'other', 3, 'active', NOW(), NOW());

-- ==============================================
-- 三级分类 (Level 3) - 香菇类
-- ==============================================

INSERT INTO product_categories (key, label, description, level, parentKey, sortOrder, status, createdAt, updatedAt) VALUES
('driedShiitake', '干香菇', '干燥香菇', 3, 'shiitake', 1, 'active', NOW(), NOW()),
('freshShiitake', '鲜香菇', '新鲜香菇', 3, 'shiitake', 2, 'active', NOW(), NOW()),
('flowerShiitake', '花菇', '花菇', 3, 'shiitake', 3, 'active', NOW(), NOW()),
('shiitakeSlice', '香菇片', '香菇切片', 3, 'shiitake', 4, 'active', NOW(), NOW()),
('shiitakeSauce', '香菇酱', '香菇酱', 3, 'shiitake', 5, 'active', NOW(), NOW());

-- ==============================================
-- 三级分类 (Level 3) - 平菇类
-- ==============================================

INSERT INTO product_categories (key, label, description, level, parentKey, sortOrder, status, createdAt, updatedAt) VALUES
('freshOyster', '平菇', '新鲜平菇', 3, 'oyster', 1, 'active', NOW(), NOW()),
('pleurotus', '秀珍菇', '秀珍菇', 3, 'oyster', 2, 'active', NOW(), NOW()),
('whiteOyster', '白平菇', '白平菇', 3, 'oyster', 3, 'active', NOW(), NOW()),
('grayOyster', '灰平菇', '灰平菇', 3, 'oyster', 4, 'active', NOW(), NOW()),
('driedOyster', '平菇干货', '平菇干货', 3, 'oyster', 5, 'active', NOW(), NOW());

-- ==============================================
-- 三级分类 (Level 3) - 金针菇类
-- ==============================================

INSERT INTO product_categories (key, label, description, level, parentKey, sortOrder, status, createdAt, updatedAt) VALUES
('freshEnoki', '金针菇', '新鲜金针菇', 3, 'enoki', 1, 'active', NOW(), NOW()),
('goldenEnoki', '黄金针菇', '黄金针菇', 3, 'enoki', 2, 'active', NOW(), NOW()),
('whiteEnoki', '白金针菇', '白金针菇', 3, 'enoki', 3, 'active', NOW(), NOW()),
('driedEnoki', '金针菇干货', '金针菇干货', 3, 'enoki', 4, 'active', NOW(), NOW());

-- ==============================================
-- 三级分类 (Level 3) - 木耳类
-- ==============================================

INSERT INTO product_categories (key, label, description, level, parentKey, sortOrder, status, createdAt, updatedAt) VALUES
('blackWoodEar', '黑木耳', '黑木耳', 3, 'woodEar', 1, 'active', NOW(), NOW()),
('whiteWoodEar', '白木耳', '白木耳', 3, 'woodEar', 2, 'active', NOW(), NOW()),
('hairyWoodEar', '毛木耳', '毛木耳', 3, 'woodEar', 3, 'active', NOW(), NOW()),
('smallBowlWoodEar', '小碗耳', '小碗耳', 3, 'woodEar', 4, 'active', NOW(), NOW()),
('driedWoodEar', '木耳干货', '木耳干货', 3, 'woodEar', 5, 'active', NOW(), NOW());

-- ==============================================
-- 三级分类 (Level 3) - 杏鲍菇类
-- ==============================================

INSERT INTO product_categories (key, label, description, level, parentKey, sortOrder, status, createdAt, updatedAt) VALUES
('freshKingOyster', '杏鲍菇', '新鲜杏鲍菇', 3, 'kingOyster', 1, 'active', NOW(), NOW()),
('whiteLing', '白灵菇', '白灵菇', 3, 'kingOyster', 2, 'active', NOW(), NOW()),
('kingOysterSlice', '杏鲍菇切片', '杏鲍菇切片', 3, 'kingOyster', 3, 'active', NOW(), NOW()),
('driedKingOyster', '杏鲍菇干货', '杏鲍菇干货', 3, 'kingOyster', 4, 'active', NOW(), NOW());

-- ==============================================
-- 三级分类 (Level 3) - 蟹味菇类
-- ==============================================

INSERT INTO product_categories (key, label, description, level, parentKey, sortOrder, status, createdAt, updatedAt) VALUES
('crabFlavorMushroom', '蟹味菇', '蟹味菇', 3, 'crabFlavor', 1, 'active', NOW(), NOW()),
('whiteJade', '白玉菇', '白玉菇', 3, 'crabFlavor', 2, 'active', NOW(), NOW()),
('seafoodMushroom', '海鲜菇', '海鲜菇', 3, 'crabFlavor', 3, 'active', NOW(), NOW()),
('shimeji', '真姬菇', '真姬菇', 3, 'crabFlavor', 4, 'active', NOW(), NOW());

-- ==============================================
-- 三级分类 (Level 3) - 竹荪类
-- ==============================================

INSERT INTO product_categories (key, label, description, level, parentKey, sortOrder, status, createdAt, updatedAt) VALUES
('bambooFungusFresh', '竹荪', '新鲜竹荪', 3, 'bambooFungus', 1, 'active', NOW(), NOW()),
('longSkirt', '长裙竹荪', '长裙竹荪', 3, 'bambooFungus', 2, 'active', NOW(), NOW()),
('shortSkirt', '短裙竹荪', '短裙竹荪', 3, 'bambooFungus', 3, 'active', NOW(), NOW()),
('driedBambooFungus', '竹荪干货', '竹荪干货', 3, 'bambooFungus', 4, 'active', NOW(), NOW());

-- ==============================================
-- 三级分类 (Level 3) - 混合菌菇
-- ==============================================

INSERT INTO product_categories (key, label, description, level, parentKey, sortOrder, status, createdAt, updatedAt) VALUES
('mushroomPlatter', '菌菇拼盘', '菌菇拼盘', 3, 'mixed', 1, 'active', NOW(), NOW()),
('hotpotMix', '火锅菌菇组合', '火锅菌菇组合', 3, 'mixed', 2, 'active', NOW(), NOW()),
('soupMix', '煲汤菌菇包', '煲汤菌菇包', 3, 'mixed', 3, 'active', NOW(), NOW()),
('giftBox', '菌菇礼盒', '菌菇礼盒', 3, 'mixed', 4, 'active', NOW(), NOW());

-- ==============================================
-- 三级分类 (Level 3) - 灵芝类
-- ==============================================

INSERT INTO product_categories (key, label, description, level, parentKey, sortOrder, status, createdAt, updatedAt) VALUES
('redGanoderma', '赤灵芝', '赤灵芝', 3, 'ganoderma', 1, 'active', NOW(), NOW()),
('purpleGanoderma', '紫灵芝', '紫灵芝', 3, 'ganoderma', 2, 'active', NOW(), NOW()),
('ganodermaSlice', '灵芝切片', '灵芝切片', 3, 'ganoderma', 3, 'active', NOW(), NOW()),
('ganodermaSpore', '灵芝孢子粉', '灵芝孢子粉', 3, 'ganoderma', 4, 'active', NOW(), NOW()),
('ganodermaTea', '灵芝茶', '灵芝茶', 3, 'ganoderma', 5, 'active', NOW(), NOW());

-- ==============================================
-- 三级分类 (Level 3) - 冬虫夏草
-- ==============================================

INSERT INTO product_categories (key, label, description, level, parentKey, sortOrder, status, createdAt, updatedAt) VALUES
('cordycepsSinensis', '冬虫夏草', '冬虫夏草', 3, 'cordyceps', 1, 'active', NOW(), NOW()),
('cordycepsFlower', '虫草花', '虫草花', 3, 'cordyceps', 2, 'active', NOW(), NOW()),
('cordycepsPowder', '虫草粉', '虫草粉', 3, 'cordyceps', 3, 'active', NOW(), NOW()),
('cordycepsCapsule', '虫草胶囊', '虫草胶囊', 3, 'cordyceps', 4, 'active', NOW(), NOW());

-- ==============================================
-- 三级分类 (Level 3) - 野生菌
-- ==============================================

INSERT INTO product_categories (key, label, description, level, parentKey, sortOrder, status, createdAt, updatedAt) VALUES
-- 松茸类
('freshMatsutake', '新鲜松茸', '新鲜松茸', 3, 'matsutake', 1, 'active', NOW(), NOW()),
('freezeDriedMatsutake', '冻干松茸', '冻干松茸', 3, 'matsutake', 2, 'active', NOW(), NOW()),
('driedMatsutake', '松茸干片', '松茸干片', 3, 'matsutake', 3, 'active', NOW(), NOW()),
('matsutakeSauce', '松茸酱', '松茸酱', 3, 'matsutake', 4, 'active', NOW(), NOW()),

-- 牛肝菌类
('yellowBolete', '黄牛肝菌', '黄牛肝菌', 3, 'bolete', 1, 'active', NOW(), NOW()),
('blackBolete', '黑牛肝菌', '黑牛肝菌', 3, 'bolete', 2, 'active', NOW(), NOW()),
('whiteBolete', '白牛肝菌', '白牛肝菌', 3, 'bolete', 3, 'active', NOW(), NOW()),
('driedBolete', '牛肝菌干货', '牛肝菌干货', 3, 'bolete', 4, 'active', NOW(), NOW()),

-- 羊肚菌类
('freshMorel', '新鲜羊肚菌', '新鲜羊肚菌', 3, 'morel', 1, 'active', NOW(), NOW()),
('driedMorel', '干羊肚菌', '干羊肚菌', 3, 'morel', 2, 'active', NOW(), NOW()),
('morelPowder', '羊肚菌粉', '羊肚菌粉', 3, 'morel', 3, 'active', NOW(), NOW()),

-- 鸡油菌类
('chanterelleFresh', '鸡油菌', '鸡油菌', 3, 'chanterelle', 1, 'active', NOW(), NOW()),
('chanterelleDried', '鸡油菌干货', '鸡油菌干货', 3, 'chanterelle', 2, 'active', NOW(), NOW()),
('chanterelleSauce', '鸡油菌酱', '鸡油菌酱', 3, 'chanterelle', 3, 'active', NOW(), NOW()),

-- 松露类
('blackTruffle', '黑松露', '黑松露', 3, 'truffle', 1, 'active', NOW(), NOW()),
('whiteTruffle', '白松露', '白松露', 3, 'truffle', 2, 'active', NOW(), NOW()),
('truffleSauce', '松露酱', '松露酱', 3, 'truffle', 3, 'active', NOW(), NOW()),
('truffleOil', '松露油', '松露油', 3, 'truffle', 4, 'active', NOW(), NOW()),

-- 其他野生菌
('tigerPalm', '虎掌菌', '虎掌菌', 3, 'otherWild', 1, 'active', NOW(), NOW()),
('oldManHead', '老人头菌', '老人头菌', 3, 'otherWild', 2, 'active', NOW(), NOW()),
('termiteMushroom', '鸡枞菌', '鸡枞菌', 3, 'otherWild', 3, 'active', NOW(), NOW()),
('bambooFungusEgg', '竹荪蛋', '竹荪蛋', 3, 'otherWild', 4, 'active', NOW(), NOW());

SET FOREIGN_KEY_CHECKS = 1;

-- ==============================================
-- 数据初始化完成
-- ==============================================
-- 插入记录统计：
-- - 一级分类：7条
-- - 二级分类：37条
-- - 三级分类：61条
-- - 总计：105条
-- ==============================================