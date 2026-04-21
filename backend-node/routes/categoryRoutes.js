const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// 公开路由 - 获取分类和标签列表
router.get('/', categoryController.getCategories);
router.get('/tags', categoryController.getTags);

// 需要管理员权限的路由
router.post('/', authMiddleware, adminMiddleware, categoryController.createCategory);
router.put('/:id', authMiddleware, adminMiddleware, categoryController.updateCategory);
router.delete('/:id', authMiddleware, adminMiddleware, categoryController.deleteCategory);

router.post('/tags', authMiddleware, adminMiddleware, categoryController.createTag);
router.put('/tags/:id', authMiddleware, adminMiddleware, categoryController.updateTag);
router.delete('/tags/:id', authMiddleware, adminMiddleware, categoryController.deleteTag);

module.exports = router;
