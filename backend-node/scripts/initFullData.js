const { sequelize } = require('../config/db');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Recipe = require('../models/Recipe');
const RecipeIngredient = require('../models/RecipeIngredient');
const RecipeStep = require('../models/RecipeStep');
const CookingVideo = require('../models/CookingVideo');
const MushroomBox = require('../models/MushroomBox');

async function initFullData() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');

    // ==============================================
    // 1. 商品分类数据
    // ==============================================
    console.log('正在插入分类数据...');
    const categories = await Category.bulkCreate([
      { name: 'fresh-mushroom', description: 'Fresh mushrooms', sortOrder: 1, status: 'active' },
      { name: 'dried-mushroom', description: 'Dried mushrooms', sortOrder: 2, status: 'active' },
      { name: 'mushroom-products', description: 'Mushroom products', sortOrder: 3, status: 'active' },
      { name: 'mushroom-box', description: 'Mushroom boxes', sortOrder: 4, status: 'active' },
      { name: 'mushroom-kitchen', description: 'Mushroom kitchen', sortOrder: 5, status: 'active' }
    ], { ignoreDuplicates: true });
    console.log(`分类数据插入完成，共 ${categories.length} 条`);

    // ==============================================
    // 2. 商品数据
    // ==============================================
    console.log('正在插入商品数据...');
    const products = await Product.bulkCreate([
      // Fresh mushrooms
      { name: 'Fresh Shiitake', description: 'Premium shiitake mushrooms', price: 19.99, stock: 100, category: 'fresh-mushroom', subCategory: 'shiitake', images: '["/mushrooms/xianggu.jpg"]', status: 'approved', sellerId: 3, isHot: true },
      { name: 'Fresh Oyster', description: 'Fresh oyster mushrooms', price: 15.99, stock: 150, category: 'fresh-mushroom', subCategory: 'oyster', images: '["/mushrooms/pinggu.jpg"]', status: 'approved', sellerId: 3, isHot: true },
      { name: 'Fresh King Oyster', description: 'King oyster mushrooms', price: 22.99, stock: 80, category: 'fresh-mushroom', subCategory: 'king-oyster', images: '["/mushrooms/xingbaogu.jpg"]', status: 'approved', sellerId: 3, isHot: true },
      { name: 'Fresh Enoki', description: 'Enoki mushrooms', price: 12.99, stock: 200, category: 'fresh-mushroom', subCategory: 'enoki', images: '["/mushrooms/jinzhengu.jpg"]', status: 'approved', sellerId: 3, isHot: true },
      { name: 'Fresh Lion\'s Mane', description: 'Lions mane mushrooms', price: 29.99, stock: 50, category: 'fresh-mushroom', subCategory: 'rare', images: '["/mushrooms/houtougu.jpg"]', status: 'approved', sellerId: 3, isHot: false },
      { name: 'Fresh Bamboo Fungus', description: 'Bamboo fungus', price: 35.99, stock: 40, category: 'fresh-mushroom', subCategory: 'rare', images: '["/mushrooms/zhusun.jpg"]', status: 'approved', sellerId: 3, isHot: false },
      { name: 'Fresh Morel', description: 'Morel mushrooms', price: 89.99, stock: 20, category: 'fresh-mushroom', subCategory: 'rare', images: '["/mushrooms/yangdumjun.jpg"]', status: 'approved', sellerId: 3, isHot: false },
      { name: 'Fresh Wood Ear', description: 'Wood ear mushrooms', price: 14.99, stock: 120, category: 'fresh-mushroom', subCategory: 'wood-ear', images: '["/mushrooms/muer.jpg"]', status: 'approved', sellerId: 3, isHot: false },
      
      // Dried mushrooms
      { name: 'Dried Shiitake', description: 'Dried shiitake mushrooms', price: 39.99, stock: 60, category: 'dried-mushroom', subCategory: 'shiitake', images: '["/mushrooms/xianggu-dry.jpg"]', status: 'approved', sellerId: 3, isHot: true },
      { name: 'Dried Oyster', description: 'Dried oyster mushrooms', price: 29.99, stock: 80, category: 'dried-mushroom', subCategory: 'oyster', images: '["/mushrooms/pinggu-dry.jpg"]', status: 'approved', sellerId: 3, isHot: false },
      { name: 'Dried King Oyster', description: 'Dried king oyster mushrooms', price: 45.99, stock: 50, category: 'dried-mushroom', subCategory: 'king-oyster', images: '["/mushrooms/xingbaogu-dry.jpg"]', status: 'approved', sellerId: 3, isHot: false },
      { name: 'Dried Enoki', description: 'Dried enoki mushrooms', price: 25.99, stock: 90, category: 'dried-mushroom', subCategory: 'enoki', images: '["/mushrooms/jinzhengu-dry.jpg"]', status: 'approved', sellerId: 3, isHot: false },
      { name: 'Dried Lion\'s Mane', description: 'Dried lions mane mushrooms', price: 69.99, stock: 30, category: 'dried-mushroom', subCategory: 'rare', images: '["/mushrooms/houtougu-dry.jpg"]', status: 'approved', sellerId: 3, isHot: false },
      
      // Mushroom products
      { name: 'Mushroom Sauce', description: 'Delicious mushroom sauce', price: 18.99, stock: 200, category: 'mushroom-products', subCategory: 'sauce', images: '["/mushrooms/xianggu-jiang.jpg"]', status: 'approved', sellerId: 3, isHot: true },
      { name: 'Mushroom Canned', description: 'Canned mushrooms', price: 15.99, stock: 150, category: 'mushroom-products', subCategory: 'canned', images: '["/mushrooms/mushroom-canned.jpg"]', status: 'approved', sellerId: 3, isHot: false },
      { name: 'Mushroom Soup Mix', description: 'Mushroom soup mix', price: 22.99, stock: 100, category: 'mushroom-products', subCategory: 'soup', images: '["/mushrooms/soup-mix.jpg"]', status: 'approved', sellerId: 3, isHot: true },
      { name: 'Dried Mushroom Gift Box', description: 'Premium dried mushroom gift box', price: 128.00, stock: 30, category: 'mushroom-products', subCategory: 'gift-box', images: '["/mushrooms/gift-box-dry.jpg"]', status: 'approved', sellerId: 3, isHot: false },
      
      // Mushroom kitchen
      { name: 'Mushroom Cooking Pot', description: 'Special pot for mushroom cooking', price: 158.00, stock: 25, category: 'mushroom-kitchen', subCategory: 'cookware', images: '["/mushrooms/cooking-pot.jpg"]', status: 'approved', sellerId: 3, isHot: false },
      { name: 'Mushroom Cookbook', description: 'Mushroom recipe book', price: 35.00, stock: 100, category: 'mushroom-kitchen', subCategory: 'books', images: '["/mushrooms/cookbook.jpg"]', status: 'approved', sellerId: 3, isHot: false },
      { name: 'Mushroom Growing Kit', description: 'Home mushroom growing kit', price: 45.00, stock: 50, category: 'mushroom-kitchen', subCategory: 'growing', images: '["/mushrooms/growing-kit.jpg"]', status: 'approved', sellerId: 3, isHot: false }
    ], { ignoreDuplicates: true });
    console.log(`商品数据插入完成，共 ${products.length} 条`);

    // ==============================================
    // 3. 食谱数据
    // ==============================================
    console.log('正在插入食谱数据...');
    const recipes = await Recipe.bulkCreate([
      { name: 'Shiitake with Greens', description: 'Classic home dish', difficulty: 'beginner', prepTime: 10, cookTime: 15, servings: 2, rating: 4.8, image: 'https://via.placeholder.com/400x300?text=Shiitake+Greens', status: 'active', cuisineType: 'Chinese', mealType: 'Lunch', mushroomCount: 1, popularity: 95.5, reviewCount: 328 },
      { name: 'King Oyster with Pork', description: 'Perfect combination', difficulty: 'intermediate', prepTime: 15, cookTime: 20, servings: 3, rating: 4.7, image: 'https://via.placeholder.com/400x300?text=King+Oyster+Pork', status: 'active', cuisineType: 'Chinese', mealType: 'Dinner', mushroomCount: 1, popularity: 88.2, reviewCount: 256 },
      { name: 'Enoki Beef Roll', description: 'Hot pot classic', difficulty: 'intermediate', prepTime: 10, cookTime: 10, servings: 2, rating: 4.9, image: 'https://via.placeholder.com/400x300?text=Enoki+Beef', status: 'active', cuisineType: 'Chinese', mealType: 'Dinner', mushroomCount: 1, popularity: 92.8, reviewCount: 412 },
      { name: 'Lions Mane Chicken Soup', description: 'Nutritious soup', difficulty: 'advanced', prepTime: 20, cookTime: 120, servings: 4, rating: 4.9, image: 'https://via.placeholder.com/400x300?text=Lions+Mane+Soup', status: 'active', cuisineType: 'Chinese', mealType: 'Dinner', mushroomCount: 1, popularity: 90.5, reviewCount: 189 },
      { name: 'Mushroom Tofu Pot', description: 'Mixed mushroom dish', difficulty: 'beginner', prepTime: 15, cookTime: 30, servings: 3, rating: 4.6, image: 'https://via.placeholder.com/400x300?text=Mushroom+Tofu', status: 'active', cuisineType: 'Chinese', mealType: 'Lunch', mushroomCount: 3, popularity: 85.3, reviewCount: 176 },
      { name: 'Oyster with Eggs', description: 'Simple home dish', difficulty: 'beginner', prepTime: 8, cookTime: 12, servings: 2, rating: 4.7, image: 'https://via.placeholder.com/400x300?text=Oyster+Eggs', status: 'active', cuisineType: 'Chinese', mealType: 'Breakfast', mushroomCount: 1, popularity: 87.6, reviewCount: 245 },
      { name: 'Shiitake Rib Soup', description: 'Classic stew', difficulty: 'intermediate', prepTime: 20, cookTime: 90, servings: 4, rating: 4.8, image: 'https://via.placeholder.com/400x300?text=Shiitake+Ribs', status: 'active', cuisineType: 'Chinese', mealType: 'Dinner', mushroomCount: 1, popularity: 89.4, reviewCount: 312 },
      { name: 'Wood Ear Salad', description: 'Refreshing salad', difficulty: 'beginner', prepTime: 15, cookTime: 5, servings: 4, rating: 4.5, image: 'https://via.placeholder.com/400x300?text=Wood+Ear+Salad', status: 'active', cuisineType: 'Chinese', mealType: 'Appetizer', mushroomCount: 1, popularity: 82.1, reviewCount: 198 },
      { name: 'Morel Rib Soup', description: 'Premium dish', difficulty: 'advanced', prepTime: 30, cookTime: 150, servings: 4, rating: 4.9, image: 'https://via.placeholder.com/400x300?text=Morel+Ribs', status: 'active', cuisineType: 'Chinese', mealType: 'Dinner', mushroomCount: 1, popularity: 94.2, reviewCount: 156 },
      { name: 'Bamboo Fungus Chicken Soup', description: 'Light soup', difficulty: 'intermediate', prepTime: 25, cookTime: 100, servings: 4, rating: 4.8, image: 'https://via.placeholder.com/400x300?text=Bamboo+Fungus', status: 'active', cuisineType: 'Chinese', mealType: 'Dinner', mushroomCount: 1, popularity: 86.7, reviewCount: 145 }
    ], { ignoreDuplicates: true });
    console.log(`食谱数据插入完成，共 ${recipes.length} 条`);

    // ==============================================
    // 4. 食谱配料数据
    // ==============================================
    console.log('正在插入食谱配料数据...');
    const ingredients = await RecipeIngredient.bulkCreate([
      { recipeId: 1, mushroomId: 1, ingredientName: 'Shiitake', quantity: '100', unit: 'g' },
      { recipeId: 1, ingredientName: 'Greens', quantity: '200', unit: 'g' },
      { recipeId: 1, ingredientName: 'Garlic', quantity: '10', unit: 'g' },
      { recipeId: 2, mushroomId: 3, ingredientName: 'King Oyster', quantity: '200', unit: 'g' },
      { recipeId: 2, ingredientName: 'Pork', quantity: '150', unit: 'g' },
      { recipeId: 2, ingredientName: 'Green Pepper', quantity: '1', unit: 'piece' },
      { recipeId: 3, mushroomId: 4, ingredientName: 'Enoki', quantity: '200', unit: 'g' },
      { recipeId: 3, ingredientName: 'Beef', quantity: '200', unit: 'g' },
      { recipeId: 4, mushroomId: 5, ingredientName: 'Lions Mane', quantity: '100', unit: 'g' },
      { recipeId: 4, ingredientName: 'Chicken', quantity: '500', unit: 'g' },
      { recipeId: 5, mushroomId: 1, ingredientName: 'Shiitake', quantity: '50', unit: 'g' },
      { recipeId: 5, mushroomId: 2, ingredientName: 'Oyster', quantity: '50', unit: 'g' },
      { recipeId: 5, mushroomId: 3, ingredientName: 'King Oyster', quantity: '50', unit: 'g' },
      { recipeId: 5, ingredientName: 'Tofu', quantity: '200', unit: 'g' },
      { recipeId: 6, mushroomId: 2, ingredientName: 'Oyster', quantity: '150', unit: 'g' },
      { recipeId: 6, ingredientName: 'Eggs', quantity: '3', unit: 'pieces' },
      { recipeId: 7, mushroomId: 1, ingredientName: 'Shiitake', quantity: '150', unit: 'g' },
      { recipeId: 7, ingredientName: 'Ribs', quantity: '500', unit: 'g' },
      { recipeId: 8, ingredientName: 'Wood Ear', quantity: '100', unit: 'g' },
      { recipeId: 8, ingredientName: 'Cucumber', quantity: '1', unit: 'piece' },
      { recipeId: 9, ingredientName: 'Morel', quantity: '50', unit: 'g' },
      { recipeId: 9, ingredientName: 'Ribs', quantity: '500', unit: 'g' },
      { recipeId: 10, ingredientName: 'Bamboo Fungus', quantity: '50', unit: 'g' },
      { recipeId: 10, ingredientName: 'Chicken', quantity: '400', unit: 'g' }
    ], { ignoreDuplicates: true });
    console.log(`食谱配料数据插入完成，共 ${ingredients.length} 条`);

    // ==============================================
    // 5. 食谱步骤数据
    // ==============================================
    console.log('正在插入食谱步骤数据...');
    const steps = await RecipeStep.bulkCreate([
      { recipeId: 1, stepNumber: 1, description: 'Wash shiitake and greens' },
      { recipeId: 1, stepNumber: 2, description: 'Heat oil and sauté garlic' },
      { recipeId: 1, stepNumber: 3, description: 'Add shiitake and stir fry' },
      { recipeId: 1, stepNumber: 4, description: 'Add greens and season' },
      { recipeId: 2, stepNumber: 1, description: 'Slice mushrooms and pork' },
      { recipeId: 2, stepNumber: 2, description: 'Marinate pork' },
      { recipeId: 2, stepNumber: 3, description: 'Stir fry pork until done' },
      { recipeId: 2, stepNumber: 4, description: 'Add mushrooms and pepper' },
      { recipeId: 3, stepNumber: 1, description: 'Prepare enoki and beef' },
      { recipeId: 3, stepNumber: 2, description: 'Roll enoki with beef' },
      { recipeId: 3, stepNumber: 3, description: 'Cook in hot pot' },
      { recipeId: 4, stepNumber: 1, description: 'Soak lions mane' },
      { recipeId: 4, stepNumber: 2, description: 'Boil chicken to remove blood' },
      { recipeId: 4, stepNumber: 3, description: 'Simmer for 2 hours' }
    ], { ignoreDuplicates: true });
    console.log(`食谱步骤数据插入完成，共 ${steps.length} 条`);

    // ==============================================
    // 6. 烹饪视频数据
    // ==============================================
    console.log('正在插入烹饪视频数据...');
    const videos = await CookingVideo.bulkCreate([
      { title: 'Shiitake Greens Tutorial', description: 'How to cook shiitake greens', videoUrl: 'https://example.com/videos/shiitake.mp4', thumbnailUrl: 'https://via.placeholder.com/400x300?text=Shiitake+Tutorial', duration: 300, mushroomType: 'Shiitake', difficulty: 'easy', views: 12500, likes: 890, category: 'cooking', tags: '["home", "shiitake", "vegetarian"]', status: 'active' },
      { title: 'King Oyster Pork Recipe', description: 'Delicious king oyster stir fry', videoUrl: 'https://example.com/videos/king-oyster.mp4', thumbnailUrl: 'https://via.placeholder.com/400x300?text=King+Oyster+Recipe', duration: 360, mushroomType: 'King Oyster', difficulty: 'medium', views: 9800, likes: 720, category: 'cooking', tags: '["home", "king oyster", "pork"]', status: 'active' },
      { title: 'Enoki Beef Roll', description: 'Hot pot favorite', videoUrl: 'https://example.com/videos/enoki-beef.mp4', thumbnailUrl: 'https://via.placeholder.com/400x300?text=Enoki+Beef+Roll', duration: 280, mushroomType: 'Enoki', difficulty: 'easy', views: 15600, likes: 1200, category: 'cooking', tags: '["hot pot", "enoki", "beef"]', status: 'active' },
      { title: 'Lions Mane Soup', description: 'Nutritious soup recipe', videoUrl: 'https://example.com/videos/lions-mane.mp4', thumbnailUrl: 'https://via.placeholder.com/400x300?text=Lions+Mane+Soup', duration: 600, mushroomType: 'Lions Mane', difficulty: 'hard', views: 8200, likes: 650, category: 'cooking', tags: '["soup", "lions mane", "healthy"]', status: 'active' },
      { title: 'Mushroom Tofu Pot', description: 'Vegetarian delight', videoUrl: 'https://example.com/videos/mushroom-tofu.mp4', thumbnailUrl: 'https://via.placeholder.com/400x300?text=Mushroom+Tofu+Pot', duration: 420, mushroomType: 'Mixed', difficulty: 'medium', views: 7500, likes: 580, category: 'cooking', tags: '["vegetarian", "tofu", "mushroom"]', status: 'active' },
      { title: 'Oyster Egg Stir Fry', description: 'Quick and easy dish', videoUrl: 'https://example.com/videos/oyster-egg.mp4', thumbnailUrl: 'https://via.placeholder.com/400x300?text=Oyster+Egg', duration: 240, mushroomType: 'Oyster', difficulty: 'easy', views: 11200, likes: 850, category: 'cooking', tags: '["quick", "oyster", "egg"]', status: 'active' }
    ], { ignoreDuplicates: true });
    console.log(`烹饪视频数据插入完成，共 ${videos.length} 条`);

    // ==============================================
    // 7. 更新盲盒数据
    // ==============================================
    console.log('正在更新盲盒数据...');
    await MushroomBox.update(
      { image: 'https://via.placeholder.com/300x200?text=Spring+Box', status: 'active' },
      { where: { id: 1 } }
    );
    await MushroomBox.update(
      { image: 'https://via.placeholder.com/300x200?text=Summer+Box', status: 'active' },
      { where: { id: 2 } }
    );
    await MushroomBox.update(
      { image: 'https://via.placeholder.com/300x200?text=Autumn+Box', status: 'active' },
      { where: { id: 3 } }
    );
    await MushroomBox.update(
      { image: 'https://via.placeholder.com/300x200?text=Winter+Box', status: 'active' },
      { where: { id: 4 } }
    );
    await MushroomBox.update(
      { image: 'https://via.placeholder.com/300x200?text=Starter+Box', status: 'active' },
      { where: { id: 5 } }
    );
    console.log('盲盒数据更新完成');

    console.log('==============================================');
    console.log('所有数据初始化完成！');
    console.log('==============================================');
    console.log('插入记录统计：');
    console.log('- 分类：5条');
    console.log('- 商品：20条');
    console.log('- 食谱：10条');
    console.log('- 食谱配料：24条');
    console.log('- 食谱步骤：14条');
    console.log('- 烹饪视频：6条');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('数据初始化失败:', error);
    process.exit(1);
  }
}

initFullData();