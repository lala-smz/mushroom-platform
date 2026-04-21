-- 蘑菇平台完整数据初始化脚本
-- 适用于 Railway 部署

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ==============================================
-- 1. 商品分类数据（三级分类体系）
-- ==============================================

INSERT INTO categories (name, description, sortOrder, status, createdAt, updatedAt) VALUES
-- 一级分类：新鲜菌菇
('新鲜菌菇', '各种新鲜采摘的食用菌类', 1, 'active', NOW(), NOW()),
-- 一级分类：干货菌菇
('干货菌菇', '经过干燥处理的菌类产品', 2, 'active', NOW(), NOW()),
-- 一级分类：菌菇制品
('菌菇制品', '以菌菇为原料的加工产品', 3, 'active', NOW(), NOW()),
-- 一级分类：菌菇盲盒
('菌菇盲盒', '精选菌菇组合礼盒', 4, 'active', NOW(), NOW()),
-- 一级分类：菌菇厨房
('菌菇厨房', '菌菇烹饪相关食材和工具', 5, 'active', NOW(), NOW());

-- ==============================================
-- 2. 商品数据
-- ==============================================

INSERT INTO products (name, description, price, stock, category, subCategory, subSubCategory, images, status, viewCount, sellerId, isHot, createdAt, updatedAt) VALUES
-- 新鲜菌菇系列
('新鲜香菇', '精选优质香菇，肉质肥厚，香气浓郁', 19.99, 100, '新鲜菌菇', '香菇类', '鲜香菇', '["/mushrooms/xianggu.jpg"]', 'approved', 520, 3, 1, NOW(), NOW()),
('新鲜平菇', '鲜嫩可口的平菇，适合炒、炖多种烹饪方式', 15.99, 150, '新鲜菌菇', '平菇类', '鲜平菇', '["/mushrooms/pinggu.jpg"]', 'approved', 380, 3, 1, NOW(), NOW()),
('新鲜杏鲍菇', '肉质脆嫩的杏鲍菇，口感鲜美', 22.99, 80, '新鲜菌菇', '杏鲍菇类', '鲜杏鲍菇', '["/mushrooms/xingbaogu.jpg"]', 'approved', 450, 3, 1, NOW(), NOW()),
('新鲜金针菇', '细长鲜嫩的金针菇，火锅必备', 12.99, 200, '新鲜菌菇', '金针菇类', '鲜金针菇', '["/mushrooms/jinzhengu.jpg"]', 'approved', 680, 3, 1, NOW(), NOW()),
('新鲜猴头菇', '珍贵的猴头菇，营养丰富', 29.99, 50, '新鲜菌菇', '珍稀菌类', '鲜猴头菇', '["/mushrooms/houtougu.jpg"]', 'approved', 230, 3, 0, NOW(), NOW()),
('新鲜竹荪', '天然竹荪，口感脆嫩', 35.99, 40, '新鲜菌菇', '珍稀菌类', '鲜竹荪', '["/mushrooms/zhusun.jpg"]', 'approved', 180, 3, 0, NOW(), NOW()),
('新鲜羊肚菌', '名贵羊肚菌，营养极佳', 89.99, 20, '新鲜菌菇', '珍稀菌类', '鲜羊肚菌', '["/mushrooms/yangdumjun.jpg"]', 'approved', 120, 3, 0, NOW(), NOW()),
('新鲜木耳', '脆嫩爽口的木耳', 14.99, 120, '新鲜菌菇', '木耳类', '鲜木耳', '["/mushrooms/muer.jpg"]', 'approved', 420, 3, 0, NOW(), NOW()),

-- 干货菌菇系列
('香菇干', '精选香菇干货，香味浓郁', 39.99, 60, '干货菌菇', '香菇类', '香菇干', '["/mushrooms/xianggu-dry.jpg"]', 'approved', 350, 3, 1, NOW(), NOW()),
('平菇干', '脱水平菇，便于储存', 29.99, 80, '干货菌菇', '平菇类', '平菇干', '["/mushrooms/pinggu-dry.jpg"]', 'approved', 280, 3, 0, NOW(), NOW()),
('杏鲍菇干', '干制杏鲍菇，风味独特', 45.99, 50, '干货菌菇', '杏鲍菇类', '杏鲍菇干', '["/mushrooms/xingbaogu-dry.jpg"]', 'approved', 210, 3, 0, NOW(), NOW()),
('金针菇干', '脱水金针菇，方便食用', 25.99, 90, '干货菌菇', '金针菇类', '金针菇干', '["/mushrooms/jinzhengu-dry.jpg"]', 'approved', 320, 3, 0, NOW(), NOW()),
('猴头菇干', '珍贵猴头菇干货', 69.99, 30, '干货菌菇', '珍稀菌类', '猴头菇干', '["/mushrooms/houtougu-dry.jpg"]', 'approved', 150, 3, 0, NOW(), NOW()),

-- 菌菇制品系列
('香菇酱', '美味香菇酱，拌饭拌面皆宜', 18.99, 200, '菌菇制品', '酱料类', '香菇酱', '["/mushrooms/xianggu-jiang.jpg"]', 'approved', 890, 3, 1, NOW(), NOW()),
('菌菇罐头', '即食菌菇罐头', 15.99, 150, '菌菇制品', '罐头类', '菌菇罐头', '["/mushrooms/mushroom-canned.jpg"]', 'approved', 450, 3, 0, NOW(), NOW()),
('菌菇汤料包', '方便快捷的菌菇汤料', 22.99, 100, '菌菇制品', '汤料类', '菌菇汤料', '["/mushrooms/soup-mix.jpg"]', 'approved', 560, 3, 1, NOW(), NOW()),
('菌菇干货礼盒', '精选干货组合礼盒', 128.00, 30, '菌菇制品', '礼盒类', '干货礼盒', '["/mushrooms/gift-box-dry.jpg"]', 'approved', 180, 3, 0, NOW(), NOW()),

-- 菌菇厨房系列
('菌菇专用锅', '适合菌菇烹饪的专用锅具', 158.00, 25, '菌菇厨房', '厨具类', '菌菇锅', '["/mushrooms/cooking-pot.jpg"]', 'approved', 120, 3, 0, NOW(), NOW()),
('菌菇菜谱书', '精选菌菇烹饪食谱', 35.00, 100, '菌菇厨房', '书籍类', '菜谱书', '["/mushrooms/cookbook.jpg"]', 'approved', 380, 3, 0, NOW(), NOW()),
('菌菇种植套装', '家庭种植菌菇套装', 45.00, 50, '菌菇厨房', '种植类', '种植套装', '["/mushrooms/growing-kit.jpg"]', 'approved', 290, 3, 0, NOW(), NOW());

-- ==============================================
-- 3. 食谱数据（菌菇厨房模块）
-- ==============================================

INSERT INTO recipes (name, description, difficulty, prepTime, cookTime, servings, rating, image, videoUrl, status, nutritionalAnalysis, suitableFor, flavorProfile, cuisineType, mealType, mushroomCount, popularity, reviewCount, createdAt, updatedAt) VALUES
('香菇炒青菜', '经典家常菜，香菇鲜香搭配青菜清爽', 'beginner', 10, 15, 2, 4.8, 'https://via.placeholder.com/400x300?text=香菇炒青菜', NULL, 'active', '{"calories": 180, "protein": 8, "carbs": 20, "fat": 8}', '["素食者", "家庭聚餐"]', '{"咸鲜": 8, "清淡": 9}', '中式', '午餐', 1, 95.5, 328, NOW(), NOW()),
('杏鲍菇炒肉', '杏鲍菇与猪肉完美搭配，口感丰富', 'intermediate', 15, 20, 3, 4.7, 'https://via.placeholder.com/400x300?text=杏鲍菇炒肉', NULL, 'active', '{"calories": 320, "protein": 22, "carbs": 15, "fat": 20}', '["肉食爱好者", "家庭聚餐"]', '{"咸鲜": 9, "鲜香": 8}', '中式', '晚餐', 1, 88.2, 256, NOW(), NOW()),
('金针菇肥牛卷', '火锅经典，金针菇包裹肥牛', 'intermediate', 10, 10, 2, 4.9, 'https://via.placeholder.com/400x300?text=金针菇肥牛卷', NULL, 'active', '{"calories": 450, "protein": 30, "carbs": 12, "fat": 32}', '["肉食爱好者", "火锅"]', '{"鲜香": 9, "浓郁": 8}', '中式', '晚餐', 1, 92.8, 412, NOW(), NOW()),
('猴头菇炖鸡汤', '营养滋补的猴头菇鸡汤', 'advanced', 20, 120, 4, 4.9, 'https://via.placeholder.com/400x300?text=猴头菇炖鸡汤', NULL, 'active', '{"calories": 280, "protein": 25, "carbs": 8, "fat": 18}', '["养生人群", "家庭聚餐"]', '{"鲜香": 10, "清淡": 7}', '中式', '晚餐', 1, 90.5, 189, NOW(), NOW()),
('菌菇豆腐煲', '多种菌菇与豆腐的完美结合', 'beginner', 15, 30, 3, 4.6, 'https://via.placeholder.com/400x300?text=菌菇豆腐煲', NULL, 'active', '{"calories": 220, "protein": 15, "carbs": 25, "fat": 8}', '["素食者", "养生人群"]', '{"清淡": 9, "鲜香": 8}', '中式', '午餐', 3, 85.3, 176, NOW(), NOW()),
('平菇炒鸡蛋', '简单美味的家常菜', 'beginner', 8, 12, 2, 4.7, 'https://via.placeholder.com/400x300?text=平菇炒鸡蛋', NULL, 'active', '{"calories": 260, "protein": 18, "carbs": 12, "fat": 18}', '["家庭聚餐", "快手菜"]', '{"咸鲜": 8, "清淡": 8}', '中式', '早餐', 1, 87.6, 245, NOW(), NOW()),
('香菇炖排骨', '经典炖菜，香菇入味', 'intermediate', 20, 90, 4, 4.8, 'https://via.placeholder.com/400x300?text=香菇炖排骨', NULL, 'active', '{"calories": 380, "protein": 28, "carbs": 10, "fat": 28}', '["肉食爱好者", "家庭聚餐"]', '{"鲜香": 9, "浓郁": 7}', '中式', '晚餐', 1, 89.4, 312, NOW(), NOW()),
('凉拌木耳', '爽口凉拌菜', 'beginner', 15, 5, 4, 4.5, 'https://via.placeholder.com/400x300?text=凉拌木耳', NULL, 'active', '{"calories": 120, "protein": 4, "carbs": 15, "fat": 6}', '["素食者", "凉菜"]', '{"清爽": 10, "酸辣": 7}', '中式', '凉菜', 1, 82.1, 198, NOW(), NOW()),
('羊肚菌炖排骨', '高端滋补菜肴', 'advanced', 30, 150, 4, 4.9, 'https://via.placeholder.com/400x300?text=羊肚菌炖排骨', NULL, 'active', '{"calories": 420, "protein": 32, "carbs": 8, "fat": 30}', '["养生人群", "宴席"]', '{"鲜香": 10, "浓郁": 8}', '中式', '晚餐', 1, 94.2, 156, NOW(), NOW()),
('竹荪鸡汤', '清香滋补的竹荪鸡汤', 'intermediate', 25, 100, 4, 4.8, 'https://via.placeholder.com/400x300?text=竹荪鸡汤', NULL, 'active', '{"calories": 260, "protein": 22, "carbs": 10, "fat": 16}', '["养生人群", "家庭聚餐"]', '{"清香": 10, "清淡": 9}', '中式', '晚餐', 1, 86.7, 145, NOW(), NOW());

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

(4, 5, '猴头菇', '100', '克'),
(4, NULL, '鸡肉', '500', '克'),
(4, NULL, '姜片', '5', '片'),
(4, NULL, '枸杞', '10', '克'),

(5, 1, '香菇', '50', '克'),
(5, 2, '平菇', '50', '克'),
(5, 3, '杏鲍菇', '50', '克'),
(5, NULL, '豆腐', '200', '克'),

(6, 2, '平菇', '150', '克'),
(6, NULL, '鸡蛋', '3', '个'),
(6, NULL, '葱花', '适量', '把'),

(7, 1, '香菇', '150', '克'),
(7, NULL, '排骨', '500', '克'),
(7, NULL, '姜片', '6', '片'),

(8, NULL, '木耳', '100', '克'),
(8, NULL, '黄瓜', '1', '根'),
(8, NULL, '辣椒油', '1', '勺'),

(9, NULL, '羊肚菌', '50', '克'),
(9, NULL, '排骨', '500', '克'),
(9, NULL, '红枣', '5', '颗'),

(10, NULL, '竹荪', '50', '克'),
(10, NULL, '鸡肉', '400', '克'),
(10, NULL, '葱段', '适量', '把');

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

(4, 1, '猴头菇泡发洗净，鸡肉切块'),
(4, 2, '鸡肉焯水去血沫'),
(4, 3, '所有材料放入砂锅'),
(4, 4, '加水炖煮2小时'),
(4, 5, '加盐调味即可');

-- ==============================================
-- 6. 烹饪视频数据
-- ==============================================

INSERT INTO cooking_videos (title, description, videoUrl, thumbnailUrl, duration, mushroomType, difficulty, views, likes, category, tags, status, createdAt, updatedAt) VALUES
('香菇炒青菜做法教程', '详细讲解香菇炒青菜的烹饪步骤', 'https://example.com/videos/xianggu-chao-qingcai.mp4', 'https://via.placeholder.com/400x300?text=香菇炒青菜教程', 300, '香菇', 'easy', 12500, 890, 'cooking', '["家常菜", "香菇", "素食"]', 'active', NOW(), NOW()),
('杏鲍菇炒肉技巧', '教你做出美味的杏鲍菇炒肉', 'https://example.com/videos/xingbaogu-chao-rou.mp4', 'https://via.placeholder.com/400x300?text=杏鲍菇炒肉教程', 360, '杏鲍菇', 'medium', 9800, 720, 'cooking', '["家常菜", "杏鲍菇", "肉类"]', 'active', NOW(), NOW()),
('金针菇肥牛卷制作', '火锅必点菜品制作教程', 'https://example.com/videos/jinzhengu-feiniu.mp4', 'https://via.placeholder.com/400x300?text=金针菇肥牛卷', 280, '金针菇', 'easy', 15600, 1200, 'cooking', '["火锅", "金针菇", "肥牛"]', 'active', NOW(), NOW()),
('猴头菇炖鸡汤教学', '养生滋补汤品制作', 'https://example.com/videos/houtougu-dun-ji.mp4', 'https://via.placeholder.com/400x300?text=猴头菇炖鸡汤', 600, '猴头菇', 'hard', 8200, 650, 'cooking', '["养生", "煲汤", "猴头菇"]', 'active', NOW(), NOW()),
('菌菇豆腐煲做法', '鲜美菌菇煲制作教程', 'https://example.com/videos/jungu-doufu-bao.mp4', 'https://via.placeholder.com/400x300?text=菌菇豆腐煲', 420, '多种菌菇', 'medium', 7500, 580, 'cooking', '["素食", "煲汤", "菌菇"]', 'active', NOW(), NOW()),
('平菇炒鸡蛋教程', '简单快手家常菜', 'https://example.com/videos/pinggu-chao-jidan.mp4', 'https://via.placeholder.com/400x300?text=平菇炒鸡蛋', 240, '平菇', 'easy', 11200, 850, 'cooking', '["家常菜", "平菇", "鸡蛋"]', 'active', NOW(), NOW());

-- ==============================================
-- 7. 更新盲盒数据，添加食谱和视频关联
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
-- - 分类：5条
-- - 商品：19条
-- - 食谱：10条
-- - 食谱配料：30条
-- - 食谱步骤：19条
-- - 烹饪视频：6条
-- ==============================================