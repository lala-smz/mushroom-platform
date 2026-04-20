const express = require('express');
const router = express.Router();
const businessCategoryController = require('../controllers/businessCategoryController');
const { authMiddleware, adminMiddleware, permissionMiddleware } = require('../middleware/auth');

// 商家相关路由
router.get('/permissions', authMiddleware, permissionMiddleware(['product:read']), businessCategoryController.getBusinessPermissions);
router.get('/applications', authMiddleware, permissionMiddleware(['product:read']), businessCategoryController.getBusinessApplications);
router.get('/available-categories', authMiddleware, businessCategoryController.getAvailableCategories);
router.post('/applications', authMiddleware, permissionMiddleware(['product:create']), businessCategoryController.submitApplication);
router.post('/applications/batch', authMiddleware, permissionMiddleware(['product:create']), businessCategoryController.submitBatchApplications);
router.delete('/applications/:id', authMiddleware, permissionMiddleware(['product:delete']), businessCategoryController.cancelApplication);
router.get('/check-permission', authMiddleware, permissionMiddleware(['product:read']), businessCategoryController.checkPermission);
router.get('/permission-keys', authMiddleware, permissionMiddleware(['product:read']), businessCategoryController.getPermissionKeys);

// 公开路由（注册时使用）
router.post('/initialize', businessCategoryController.initializePermissions);
router.get('/public/available-categories', businessCategoryController.getAvailableCategories);

// 管理员路由
router.get('/admin/applications/pending', authMiddleware, adminMiddleware, businessCategoryController.getPendingApplications);
router.get('/admin/applications', authMiddleware, adminMiddleware, businessCategoryController.getAllApplications);
router.get('/admin/permissions', authMiddleware, adminMiddleware, businessCategoryController.getAllPermissions);
router.get('/admin/permissions/all', authMiddleware, adminMiddleware, businessCategoryController.getAllPermissions);
router.post('/admin/applications/review', authMiddleware, adminMiddleware, businessCategoryController.reviewApplication);
router.put('/admin/applications/:id/review', authMiddleware, adminMiddleware, businessCategoryController.reviewApplicationById);
router.post('/admin/permissions/set', authMiddleware, adminMiddleware, businessCategoryController.setPermission);
router.post('/admin/permissions/batch', authMiddleware, adminMiddleware, businessCategoryController.batchSetPermissions);

module.exports = router;