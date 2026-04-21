-- 蘑菇平台完整数据初始化脚本（包含商品分类层级）
-- 适用于 Railway 部署

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ==============================================
-- 1. 商品分类数据（三级分类体系）
-- ==============================================

-- 一级分类 (Level 1)
INSERT INTO product_categories (key, label, description, level, parentKey, sortOrder, status, createdAt, updatedAt) VALUES
('edible', '食用菌', '日常烹饪食用的菌菇', 1, NULL, 1, 'active', NOW(), NOW()),
('medicinal', '药用菌', '具有药用价值的菌菇', 1, NULL, 2, 'active', NOW(), NOW()),
('wild', '野生菌', '野生采摘的珍稀菌菇', 1, NULL, 3, 'active', NOW(), NOW()),
('mushroomBag', '菌包', '家庭种植菌包', 1, NULL, 4, 'active', NOW(), NOW()),
('spawn', '菌种', '菌种种苗', 1, NULL, 5, 'active', NOW(), NOW()),
('seasonalBox', '时令菌菇盲盒', '季节性盲盒产品', 1, NULL, 6, 'active', NOW(), NOW()),
('other', '菌菇（兜底）', '特殊/定制商品', 1, NULL, 7, 'active', NOW(), NOW());

-- 二级分类 (Level 2) - 食用菌
INSERT INTO product_categories (key, label, description, level, parentKey, sortOrder, status, createdAt, updatedAt) VALUES
('shiitake', '香菇类', '香菇相关产品', 2, 'edible', 1, 'active', NOW(), NOW()),
('oyster', '平菇类', '平菇相关产品', 2, 'edible', 2, 'active', NOW(), NOW()),
('enoki', '金针菇类', '金针菇相关产品', 2, 'edible', 3, 'active', NOW(), NOW()),
('woodEar', '木耳类', '木耳相关产品', 2, 'edible', 4, 'active', NOW(), NOW()),
('kingOyster', '杏鲍菇类', '杏鲍菇相关产品', 2, 'edible', 5, 'active', NOW(), NOW()),
('crabFlavor', '蟹味菇类', '蟹味菇相关产品', 2, 'edible', 6, 'active', NOW(), NOW()),
('bambooFungus', '竹荪类', '竹荪相关产品', 2, 'edible', 7, 'active', NOW(), NOW()),
('mixed', '混合菌菇', '多种菌菇组合', 2, 'edible', 8, 'active', NOW(), NOW());

-- 二级分类 (Level 2) - 药用菌
INSERT INTO product_categories (key, label, description, level, parentKey, sortOrder, status, createdAt, updatedAt) VALUES
('ganoderma', '灵芝类', '灵芝相关产品', 2, 'medicinal', 1, 'active', NOW(), NOW()),
('cordyceps', '冬虫夏草', '冬虫夏草相关产品', 2, 'medicinal', 2, 'active', NOW(), NOW()),
('antler', '鹿茸菇', '鹿茸菇相关产品', 2, 'medicinal', 3, 'active', NOW(), NOW()),
('poria', '茯苓类', '茯苓相关产品', 2, 'medicinal', 4, 'active', NOW(), NOW()),
('otherMedicinal', '其他药用菌', '其他药用菌菇', 2, 'medicinal', 5, 'active', NOW(), NOW());

-- 二级分类 (Level 2) - 野生菌
INSERT INTO product_categories (key, label, description, level, parentKey, sortOrder, status, createdAt, updatedAt) VALUES
('matsutake', '松茸类', '松茸相关产品', 2, 'wild', 1, 'active', NOW(), NOW()),
('bolete', '牛肝菌类', '牛肝菌相关产品', 2, 'wild', 2, 'active', NOW(), NOW()),
('morel', '羊肚菌类', '羊肚菌相关产品', 2, 'wild', 3, 'active', NOW(), NOW()),
('chanterelle', '鸡油菌类', '鸡油菌相关产品', 2, 'wild', 4, 'active', NOW(), NOW()),
('truffle', '松露类', '松露相关产品', 2, 'wild', 5, 'active', NOW(), NOW()),
('otherWild', '其他野生菌', '其他野生菌菇', 2, 'wild', 6, 'active', NOW(), NOW());

-- 三级分类 (Level 3) - 香菇类
INSERT INTO product_categories (key, label, description, level, parentKey, sortOrder, status, createdAt, updatedAt) VALUES
('driedShiitake', '干香菇', '干燥香菇', 3, 'shiitake', 1, 'active', NOW(), NOW()),
('freshShiitake', '鲜香菇', '新鲜香菇', 3, 'shiitake', 2, 'active', NOW(), NOW()),
('flowerShiitake', '花菇', '花菇', 3, 'shiitake', 3, 'active', NOW(), NOW()),
('shiitakeSlice', '香菇片', '香菇切片', 3, 'shiitake', 4, 'active', NOW(), NOW()),
('shiitakeSauce', '香菇酱', '香菇酱', 3, 'shiitake', 5, 'active', NOW(), NOW());

-- 三级分类 (Level 3) - 平菇类
INSERT INTO product_categories (key, label, description, level, parentKey, sortOrder, status, createdAt, updatedAt) VALUES
('freshOyster', '平菇', '新鲜平菇', 3, 'oyster', 1, 'active', NOW(), NOW()),
('pleurotus', '秀珍菇', '秀珍菇', 3, 'oyster', 2, 'active', NOW(), NOW()),
('whiteOyster', '白平菇', '白平菇', 3, 'oyster', 3, 'active', NOW(), NOW()),
('grayOyster', '灰平菇', '灰平菇', 3, 'oyster', 4, 'active', NOW(), NOW()),
('driedOyster', '平菇干货', '平菇干货', 3, 'oyster', 5, 'active', NOW(), NOW());

-- 三级分类 (Level 3) - 金针菇类
INSERT INTO product_categories (key, label, description, level, parentKey, sortOrder, status, createdAt, updatedAt) VALUES
('freshEnoki', '金针菇', '新鲜金针菇', 3, 'enoki', 1, 'active', NOW(), NOW()),
('goldenEnoki', '黄金针菇', '黄金针菇', 3, 'enoki', 2, 'active', NOW(), NOW()),
('whiteEnoki', '白金针菇', '白金针菇', 3, 'enoki', 3, 'active', NOW(), NOW()),
('driedEnoki', '金针菇干货', '金针菇干货', 3, 'enoki', 4, 'active', NOW(), NOW());

-- 三级分类 (Level 3) - 木耳类
INSERT INTO product_categories (key, label, description, level, parentKey, sortOrder, status, createdAt, updatedAt) VALUES
('blackWoodEar', '黑木耳', '黑木耳', 3, 'woodEar', 1, 'active', NOW(), NOW()),
('whiteWoodEar', '白木耳', '白木耳', 3, 'woodEar', 2, 'active', NOW(), NOW()),
('hairyWoodEar', '毛木耳', '毛木耳', 3, 'woodEar', 3, 'active', NOW(), NOW()),
('smallBowlWoodEar', '小碗耳', '小碗耳', 3, 'woodEar', 4, 'active', NOW(), NOW()),
('driedWoodEar', '木耳干货', '木耳干货', 3, 'woodEar', 5, 'active', NOW(), NOW());

-- 三级分类 (Level 3) - 杏鲍菇类
INSERT INTO product_categories (key, label, description, level, parentKey, sortOrder, status, createdAt, updatedAt) VALUES
('freshKingOyster', '杏鲍菇', '新鲜杏鲍菇', 3, 'kingOyster', 1, 'active', NOW(), NOW()),
('whiteLing', '白灵菇', '白灵菇', 3, 'kingOyster', 2, 'active', NOW(), NOW()),
('kingOysterSlice', '杏鲍菇切片', '杏鲍菇切片', 3, 'kingOyster', 3, 'active', NOW(), NOW()),
('driedKingOyster', '杏鲍菇干货', '杏鲍菇干货', 3, 'kingOyster', 4, 'active', NOW(), NOW());

-- 三级分类 (Level 3) - 蟹味菇类
INSERT INTO product_categories (key, label, description, level, parentKey, sortOrder, status, createdAt, updatedAt) VALUES
('crabFlavorMushroom', '蟹味菇', '蟹味菇', 3, 'crabFlavor', 1, 'active', NOW(), NOW()),
('whiteJade', '白玉菇', '白玉菇', 3, 'crabFlavor', 2, 'active', NOW(), NOW()),
('seafoodMushroom', '海鲜菇', '海鲜菇', 3, 'crabFlavor', 3, 'active', NOW(), NOW()),
('shimeji', '真姬菇', '真姬菇', 3, 'crabFlavor', 4, 'active', NOW(), NOW());

-- 三级分类 (Level 3) - 竹荪类
INSERT INTO product_categories (key, label, description, level, parentKey, sortOrder, status, createdAt, updatedAt) VALUES
('bambooFungusFresh', '竹荪', '新鲜竹荪', 3, 'bambooFungus', 1, 'active', NOW(), NOW()),
('longSkirt', '长裙竹荪', '长裙竹荪', 3, 'bambooFungus', 2, 'active', NOW(), NOW()),
('shortSkirt', '短裙竹荪', '短裙竹荪', 3, 'bambooFungus', 3, 'active', NOW(), NOW()),
('driedBambooFungus', '竹荪干货', '竹荪干货', 3, 'bambooFungus', 4, 'active', NOW(), NOW());

-- 三级分类 (Level 3) - 混合菌菇
INSERT INTO product_categories (key, label, description, level, parentKey, sortOrder, status, createdAt, updatedAt) VALUES
('mushroomPlatter', '菌菇拼盘', '菌菇拼盘', 3, 'mixed', 1, 'active', NOW(), NOW()),
('hotpotMix', '火锅菌菇组合', '火锅菌菇组合', 3, 'mixed', 2, 'active', NOW(), NOW()),
('soupMix', '煲汤菌菇包', '煲汤菌菇包', 3, 'mixed', 3, 'active', NOW(), NOW()),
('giftBox', '菌菇礼盒', '菌菇礼盒', 3, 'mixed', 4, 'active', NOW(), NOW());

-- 三级分类 (Level 3) - 野生菌
INSERT INTO product_categories (key, label, description, level, parentKey, sortOrder, status, createdAt, updatedAt) VALUES
('freshMatsutake', '新鲜松茸', '新鲜松茸', 3, 'matsutake', 1, 'active', NOW(), NOW()),
('freezeDriedMatsutake', '冻干松茸', '冻干松茸', 3, 'matsutake', 2, 'active', NOW(), NOW()),
('driedMatsutake', '松茸干片', '松茸干片', 3, 'matsutake', 3, 'active', NOW(), NOW()),
('freshMorel', '新鲜羊肚菌', '新鲜羊肚菌', 3, 'morel', 1, 'active', NOW(), NOW()),
('driedMorel', '干羊肚菌', '干羊肚菌', 3, 'morel', 2, 'active', NOW(), NOW());

-- ==============================================
-- 2. 商品数据（关联新的分类层级）
-- ==============================================

INSERT INTO products (name, description, price, stock, level1Category, level2Category, level3Category, images, status, viewCount, sellerId, isHot, createdAt, updatedAt) VALUES
-- 新鲜菌菇系列
('新鲜香菇', '精选优质香菇，肉质肥厚，香气浓郁', 19.99, 100, 'edible', 'shiitake', 'freshShiitake', '["/mushrooms/xianggu.jpg"]', 'approved', 520, 3, 1, NOW(), NOW()),
('新鲜平菇', '鲜嫩可口的平菇，适合炒、炖多种烹饪方式', 15.99, 150, 'edible', 'oyster', 'freshOyster', '["/mushrooms/pinggu.jpg"]', 'approved', 380, 3, 1, NOW(), NOW()),
('新鲜杏鲍菇', '肉质脆嫩的杏鲍菇，口感鲜美', 22.99, 80, 'edible', 'kingOyster', 'freshKingOyster', '["/mushrooms/xingbaogu.jpg"]', 'approved', 450, 3, 1, NOW(), NOW()),
('新鲜金针菇', '细长鲜嫩的金针菇，火锅必备', 12.99, 200, 'edible', 'enoki', 'freshEnoki', '["/mushrooms/jinzhengu.jpg"]', 'approved', 680, 3, 1, NOW(), NOW()),
('新鲜木耳', '脆嫩爽口的木耳', 14.99, 120, 'edible', 'woodEar', 'blackWoodEar', '["/mushrooms/muer.jpg"]', 'approved', 420, 3, 0, NOW(), NOW()),
('新鲜竹荪', '天然竹荪，口感脆嫩', 35.99, 40, 'edible', 'bambooFungus', 'bambooFungusFresh', '["/mushrooms/zhusun.jpg"]', 'approved', 180, 3, 0, NOW(), NOW()),
('新鲜羊肚菌', '名贵羊肚菌，营养极佳', 89.99, 20, 'wild', 'morel', 'freshMorel', '["/mushrooms/yangdumjun.jpg"]', 'approved', 120, 3, 0, NOW(), NOW()),
('新鲜松茸', '珍贵新鲜松茸', 199.99, 10, 'wild', 'matsutake', 'freshMatsutake', '["/mushrooms/songrong.jpg"]', 'approved', 95, 3, 0, NOW(), NOW()),

-- 干货菌菇系列
('香菇干', '精选香菇干货，香味浓郁', 39.99, 60, 'edible', 'shiitake', 'driedShiitake', '["/mushrooms/xianggu-dry.jpg"]', 'approved', 350, 3, 1, NOW(), NOW()),
('平菇干', '脱水平菇，便于储存', 29.99, 80, 'edible', 'oyster', 'driedOyster', '["/mushrooms/pinggu-dry.jpg"]', 'approved', 280, 3, 0, NOW(), NOW()),
('杏鲍菇干', '干制杏鲍菇，风味独特', 45.99, 50, 'edible', 'kingOyster', 'driedKingOyster', '["/mushrooms/xingbaogu-dry.jpg"]', 'approved', 210, 3, 0, NOW(), NOW()),
('金针菇干', '脱水金针菇，方便食用', 25.99, 90, 'edible', 'enoki', 'driedEnoki', '["/mushrooms/jinzhengu-dry.jpg"]', 'approved', 320, 3, 0, NOW(), NOW()),
('木耳干货', '木耳干货', 28.99, 70, 'edible', 'woodEar', 'driedWoodEar', '["/mushrooms/muer-dry.jpg"]', 'approved', 290, 3, 0, NOW(), NOW()),
('竹荪干货', '竹荪干货', 68.99, 30, 'edible', 'bambooFungus', 'driedBambooFungus', '["/mushrooms/zhusun-dry.jpg"]', 'approved', 140, 3, 0, NOW(), NOW()),
('羊肚菌干货', '干羊肚菌', 168.00, 15, 'wild', 'morel', 'driedMorel', '["/mushrooms/yangdumjun-dry.jpg"]', 'approved', 88, 3, 0, NOW(), NOW()),

-- 菌菇制品系列
('香菇酱', '美味香菇酱，拌饭拌面皆宜', 18.99, 200, 'edible', 'shiitake', 'shiitakeSauce', '["/mushrooms/xianggu-jiang.jpg"]', 'approved', 890, 3, 1, NOW(), NOW()),
('菌菇罐头', '即食菌菇罐头', 15.99, 150, 'other', 'processed', NULL, '["/mushrooms/mushroom-canned.jpg"]', 'approved', 450, 3, 0, NOW(), NOW()),
('菌菇汤料包', '方便快捷的菌菇汤料', 22.99, 100, 'edible', 'mixed', 'soupMix', '["/mushrooms/soup-mix.jpg"]', 'approved', 560, 3, 1, NOW(), NOW()),
('菌菇干货礼盒', '精选干货组合礼盒', 128.00, 30, 'edible', 'mixed', 'giftBox', '["/mushrooms/gift-box-dry.jpg"]', 'approved', 180, 3, 0, NOW(), NOW()),
('火锅菌菇组合', '火锅专用菌菇拼盘', 45.99, 80, 'edible', 'mixed', 'hotpotMix', '["/mushrooms/hotpot-mix.jpg"]', 'approved', 340, 3, 1, NOW(), NOW());

-- ==============================================
-- 3. 食谱数据（菌菇厨房模块）
-- ==============================================

INSERT INTO recipes (name, description, difficulty, prepTime, cookTime, servings, rating, image, videoUrl, status, nutritionalAnalysis, suitableFor, flavorProfile, cuisineType, mealType, mushroomCount, popularity, reviewCount, createdAt, updatedAt) VALUES
('香菇炒青菜', '经典家常菜，香菇鲜香搭配青菜清爽', 'beginner', 10, 15, 2, 4.8, 'https://via.placeholder.com/400x300?text=香菇炒青菜', NULL, 'active', '{"calories": 180, "protein": 8, "carbs": 20, "fat": 8}', '["素食者", "家庭聚餐"]', '{"咸鲜": 8, "清淡": 9}', '中式', '午餐', 1, 95.5, 328, NOW(), NOW()),
('杏鲍菇炒肉', '杏鲍菇与猪肉完美搭配，口感丰富', 'intermediate', 15, 20, 3, 4.7, 'https://via.placeholder.com/400x300?text=杏鲍菇炒肉', NULL, 'active', '{"calories": 320, "protein": 22, "carbs": 15, "fat": 20}', '["肉食爱好者", "家庭聚餐"]', '{"咸鲜": 9, "鲜香": 8}', '中式', '晚餐', 1, 88.2, 256, NOW(), NOW()),
('金针菇肥牛卷', '火锅经典，金针菇包裹肥牛', 'intermediate', 10, 10, 2, 4.9, 'https://via.placeholder.com/400x300?text=金针菇肥牛卷', NULL, 'active', '{"calories": 450, "protein": 30, "carbs": 12, "fat": 32}', '["肉食爱好者", "火锅"]', '{"鲜香": 9, "浓郁": 8}', '中式', '晚餐', 1, 92.8, 412, NOW(), NOW()),
('菌菇豆腐煲', '多种菌菇与豆腐的完美结合', 'beginner', 15, 30, 3, 4.6, 'https://via.placeholder.com/400x300?text=菌菇豆腐煲', NULL, 'active', '{"calories": 220, "protein": 15, "carbs": 25, "fat": 8}', '["素食者", "养生人群"]', '{"清淡": 9, "鲜香": 8}', '中式', '午餐', 3, 85.3, 176, NOW(), NOW()),
('平菇炒鸡蛋', '简单美味的家常菜', 'beginner', 8, 12, 2, 4.7, 'https://via.placeholder.com/400x300?text=平菇炒鸡蛋', NULL, 'active', '{"calories": 260, "protein": 18, "carbs": 12, "fat": 18}', '["家庭聚餐", "快手菜"]', '{"咸鲜": 8, "清淡": 8}', '中式', '早餐', 1, 87.6, 245, NOW(), NOW()),
('香菇炖排骨', '经典炖菜，香菇入味', 'intermediate', 20, 90, 4, 4.8, 'https://via.placeholder.com/400x300?text=香菇炖排骨', NULL, 'active', '{"calories": 380, "protein": 28, "carbs": 10, "fat": 28}', '["肉食爱好者", "家庭聚餐"]', '{"鲜香": 9, "浓郁": 7}', '中式', '晚餐', 1, 89.4, 312, NOW(), NOW()),
('凉拌木耳', '爽口凉拌菜', 'beginner', 15, 5, 4, 4.5, 'https://via.placeholder.com/400x300?text=凉拌木耳', NULL, 'active', '{"calories": 120, "protein": 4, "carbs": 15, "fat": 6}', '["素食者", "凉菜"]', '{"清爽": 10, "酸辣": 7}', '中式', '凉菜', 1, 82.1, 198, NOW(), NOW()),
('羊肚菌炖排骨', '高端滋补菜肴', 'advanced', 30, 150, 4, 4.9, 'https://via.placeholder.com/400x300?text=羊肚菌炖排骨', NULL, 'active', '{"calories": 420, "protein": 32, "carbs": 8, "fat": 30}', '["养生人群", "宴席"]', '{"鲜香": 10, "浓郁": 8}', '中式', '晚餐', 1, 94.2, 156, NOW(), NOW()),
('竹荪鸡汤', '清香滋补的竹荪鸡汤', 'intermediate', 25, 100, 4, 4.8, 'https://via.placeholder.com/400x300?text=竹荪鸡汤', NULL, 'active', '{"calories": 260, "protein": 22, "carbs": 10, "fat": 16}', '["养生人群", "家庭聚餐"]', '{"清香": 10, "清淡": 9}', '中式', '晚餐', 1, 86.7, 145, NOW(), NOW()),
('菌菇火锅', '美味菌菇火锅', 'intermediate', 30, 60, 4, 4.8, 'https://via.placeholder.com/400x300?text=菌菇火锅', NULL, 'active', '{"calories": 520, "protein": 35, "carbs": 25, "fat": 35}', '["家庭聚餐", "火锅"]', '{"鲜香": 9, "浓郁": 9}', '中式', '晚餐', 4, 91.3, 289, NOW(), NOW());

-- ==============================================
-- 4. 食谱配料数据
-- ==============================================

INSERT INTO recipe_ingredients (recipeId, mushroomId, ingredientName, quantity, unit) VALUES
(1, 1, '香菇', '100', '克'),
(1, NULL, '青菜', '200', '克'),
(1, NULL, '蒜末', '10', '克'),
(1, NULL, '盐', '适量', '勺'),

(2, 3, '杏鲍菇', '200', '克'),
(2, NULL, '猪肉', '150', '克'),
(2, NULL, '青椒', '1', '个'),
(2, NULL, '生抽', '1', '勺'),

(3, 4, '金针菇', '200', '克'),
(3, NULL, '肥牛片', '200', '克'),
(3, NULL, '火锅底料', '1', '包'),

(4, 1, '香菇', '50', '克'),
(4, 2, '平菇', '50', '克'),
(4, 3, '杏鲍菇', '50', '克'),
(4, NULL, '豆腐', '200', '克'),

(5, 2, '平菇', '150', '克'),
(5, NULL, '鸡蛋', '3', '个'),
(5, NULL, '葱花', '适量', '把'),

(6, 1, '香菇', '150', '克'),
(6, NULL, '排骨', '500', '克'),
(6, NULL, '姜片', '6', '片'),

(7, 5, '木耳', '100', '克'),
(7, NULL, '黄瓜', '1', '根'),
(7, NULL, '辣椒油', '1', '勺'),

(8, 7, '羊肚菌', '50', '克'),
(8, NULL, '排骨', '500', '克'),
(8, NULL, '红枣', '5', '颗'),

(9, 6, '竹荪', '50', '克'),
(9, NULL, '鸡肉', '400', '克'),
(9, NULL, '葱段', '适量', '把'),

(10, 1, '香菇', '80', '克'),
(10, 2, '平菇', '80', '克'),
(10, 3, '杏鲍菇', '80', '克'),
(10, 4, '金针菇', '80', '克'),
(10, NULL, '火锅底料', '1', '包');

-- ==============================================
-- 5. 食谱步骤数据
-- ==============================================

INSERT INTO recipe_steps (recipeId, stepNumber, description) VALUES
(1, 1, '香菇洗净切片，青菜洗净备用'),
(1, 2, '热锅凉油，爆香蒜末'),
(1, 3, '加入香菇翻炒至变软'),
(1, 4, '加入青菜翻炒，加盐调味'),
(1, 5, '翻炒均匀后出锅'),

(2, 1, '杏鲍菇切片，猪肉切片，青椒切块'),
(2, 2, '猪肉用生抽腌制10分钟'),
(2, 3, '热锅倒油，炒香猪肉至变色'),
(2, 4, '加入杏鲍菇和青椒翻炒'),
(2, 5, '调味后出锅'),

(3, 1, '金针菇洗净，肥牛片备用'),
(3, 2, '锅中加水烧开，放入火锅底料'),
(3, 3, '将金针菇和肥牛片卷在一起'),
(3, 4, '放入锅中煮熟即可'),

(4, 1, '香菇、平菇、杏鲍菇洗净切块'),
(4, 2, '豆腐切块备用'),
(4, 3, '热锅倒油，炒香菌菇'),
(4, 4, '加入豆腐和高汤，慢炖15分钟'),
(4, 5, '加盐调味即可'),

(5, 1, '平菇洗净撕成小片'),
(5, 2, '鸡蛋打散备用'),
(5, 3, '热锅倒油，炒平菇至软'),
(5, 4, '倒入鸡蛋液翻炒'),
(5, 5, '撒葱花出锅');

-- ==============================================
-- 6. 烹饪视频数据
-- ==============================================

INSERT INTO cooking_videos (title, description, videoUrl, thumbnailUrl, duration, mushroomType, difficulty, views, likes, category, tags, status, createdAt, updatedAt) VALUES
('香菇炒青菜做法教程', '详细讲解香菇炒青菜的烹饪步骤', 'https://example.com/videos/xianggu-chao-qingcai.mp4', 'https://via.placeholder.com/400x300?text=香菇炒青菜教程', 300, '香菇', 'easy', 12500, 890, 'cooking', '["家常菜", "香菇", "素食"]', 'active', NOW(), NOW()),
('杏鲍菇炒肉技巧', '教你做出美味的杏鲍菇炒肉', 'https://example.com/videos/xingbaogu-chao-rou.mp4', 'https://via.placeholder.com/400x300?text=杏鲍菇炒肉教程', 360, '杏鲍菇', 'medium', 9800, 720, 'cooking', '["家常菜", "杏鲍菇", "肉类"]', 'active', NOW(), NOW()),
('金针菇肥牛卷制作', '火锅必点菜品制作教程', 'https://example.com/videos/jinzhengu-feiniu.mp4', 'https://via.placeholder.com/400x300?text=金针菇肥牛卷', 280, '金针菇', 'easy', 15600, 1200, 'cooking', '["火锅", "金针菇", "肥牛"]', 'active', NOW(), NOW()),
('菌菇豆腐煲做法', '鲜美菌菇煲制作教程', 'https://example.com/videos/jungu-doufu-bao.mp4', 'https://via.placeholder.com/400x300?text=菌菇豆腐煲', 420, '多种菌菇', 'medium', 7500, 580, 'cooking', '["素食", "煲汤", "菌菇"]', 'active', NOW(), NOW()),
('平菇炒鸡蛋教程', '简单快手家常菜', 'https://example.com/videos/pinggu-chao-jidan.mp4', 'https://via.placeholder.com/400x300?text=平菇炒鸡蛋', 240, '平菇', 'easy', 11200, 850, 'cooking', '["家常菜", "平菇", "鸡蛋"]', 'active', NOW(), NOW()),
('菌菇火锅制作', '家庭菌菇火锅教程', 'https://example.com/videos/jungu-huoguo.mp4', 'https://via.placeholder.com/400x300?text=菌菇火锅', 480, '多种菌菇', 'medium', 14200, 980, 'cooking', '["火锅", "菌菇", "家庭"]', 'active', NOW(), NOW());

-- ==============================================
-- 7. 更新盲盒数据
-- ==============================================

UPDATE mushroom_boxes SET 
  image = 'https://via.placeholder.com/300x200?text=春季时令盲盒',
  status = 'active'
WHERE id = 1;

UPDATE mushroom_boxes SET 
  image = 'https://via.placeholder.com/300x200?text=夏季清凉盲盒',
  status = 'active'
WHERE id = 2;

UPDATE mushroom_boxes SET 
  image = 'https://via.placeholder.com/300x200?text=秋季丰收盲盒',
  status = 'active'
WHERE id = 3;

UPDATE mushroom_boxes SET 
  image = 'https://via.placeholder.com/300x200?text=冬季滋补盲盒',
  status = 'active'
WHERE id = 4;

UPDATE mushroom_boxes SET 
  image = 'https://via.placeholder.com/300x200?text=初学者体验盲盒',
  status = 'active'
WHERE id = 5;

SET FOREIGN_KEY_CHECKS = 1;

-- ==============================================
-- 数据初始化完成
-- ==============================================
-- 插入记录统计：
-- - 商品分类：61条（7一级 + 19二级 + 35三级）
-- - 商品：20条
-- - 食谱：10条
-- - 食谱配料：35条
-- - 食谱步骤：24条
-- - 烹饪视频：6条
-- ==============================================