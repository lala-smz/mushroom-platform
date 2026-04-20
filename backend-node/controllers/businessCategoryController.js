const BusinessCategoryPermission = require('../models/BusinessCategoryPermission');
const BusinessCategoryApplication = require('../models/BusinessCategoryApplication');
const ProductCategory = require('../models/ProductCategory');
const User = require('../models/User');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');
const operationLogService = require('../services/operationLogService');

const businessCategoryController = {
  // 获取商家可售卖的商品层级
  getBusinessPermissions: async (req, res) => {
    try {
      const businessId = req.user.id;
      
      const permissions = await BusinessCategoryPermission.findAll({
        where: {
          businessId,
          status: 'active'
        },
        order: [['categoryLevel', 'ASC'], ['categoryLabel', 'ASC']]
      });

      res.status(200).json({
        success: true,
        data: permissions
      });
    } catch (error) {
      console.error('获取商家商品层级权限失败:', error);
      res.status(500).json({
        success: false,
        error: '获取商家商品层级权限失败'
      });
    }
  },

  // 获取商家的申请记录
  getBusinessApplications: async (req, res) => {
    try {
      const businessId = req.user.id;
      
      const applications = await BusinessCategoryApplication.findAll({
        where: { businessId },
        order: [['createdAt', 'DESC']],
        include: [{
          model: User,
          as: 'reviewedByUser',
          attributes: ['id', 'username']
        }]
      });

      res.status(200).json({
        success: true,
        data: applications
      });
    } catch (error) {
      console.error('获取商家申请记录失败:', error);
      res.status(500).json({
        success: false,
        error: '获取商家申请记录失败'
      });
    }
  },

  // 获取可用的商品层级（用于注册和申请）
  getAvailableCategories: async (req, res) => {
    try {
      const { level } = req.query;
      const businessId = req.user?.id;

      let where = { status: 'active' };
      if (level) {
        where.level = parseInt(level);
      }

      const categories = await ProductCategory.findAll({
        where,
        order: [['sortOrder', 'ASC'], ['label', 'ASC']]
      });

      let result = categories;

      if (businessId) {
        const permissions = await BusinessCategoryPermission.findAll({
          where: { businessId, status: 'active' },
          attributes: ['categoryKey']
        });

        const grantedKeys = new Set(permissions.map(p => p.categoryKey));

        result = categories.map(cat => ({
          ...cat.toJSON(),
          hasPermission: grantedKeys.has(cat.key)
        }));
      }

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('获取可用商品层级失败:', error);
      res.status(500).json({
        success: false,
        error: '获取可用商品层级失败'
      });
    }
  },

  // 商家提交层级申请
  submitApplication: async (req, res) => {
    try {
      const { categoryKey, reason } = req.body;
      const businessId = req.user.id;

      if (!categoryKey) {
        return res.status(400).json({
          success: false,
          error: '分类key不能为空'
        });
      }

      const category = await ProductCategory.findOne({
        where: { key: categoryKey, status: 'active' }
      });

      if (!category) {
        return res.status(400).json({
          success: false,
          error: '无效的分类key'
        });
      }

      const existingPermission = await BusinessCategoryPermission.findOne({
        where: { businessId, categoryKey, status: 'active' }
      });

      if (existingPermission) {
        return res.status(400).json({
          success: false,
          error: '已拥有该分类的售卖权限'
        });
      }

      const existingApplication = await BusinessCategoryApplication.findOne({
        where: { businessId, categoryKey }
      });

      if (existingApplication) {
        if (existingApplication.status === 'pending') {
          return res.status(400).json({
            success: false,
            error: '已有该分类的申请正在审核中'
          });
        } else if (existingApplication.status === 'approved') {
          return res.status(400).json({
            success: false,
            error: '已拥有该分类的售卖权限，无需重复申请'
          });
        } else {
          return res.status(400).json({
            success: false,
            error: `该分类申请已被${existingApplication.status === 'rejected' ? '拒绝' : '处理'}，如需重新申请，请在申请历史中操作`
          });
        }
      }

      const application = await BusinessCategoryApplication.create({
        businessId,
        categoryKey,
        categoryLevel: category.level,
        categoryLabel: category.label,
        parentKey: category.parentKey,
        reason
      });

      await operationLogService.logOperation({
        userId: req.user.id,
        username: req.user.username,
        role: req.user.role,
        action: 'create',
        module: 'business_category_application',
        targetId: application.id,
        targetName: category.label,
        description: `商家申请分类权限: ${category.label}`,
        req
      });

      res.status(201).json({
        success: true,
        data: application
      });
    } catch (error) {
      console.error('提交层级申请失败:', error);
      res.status(500).json({
        success: false,
        error: '提交层级申请失败'
      });
    }
  },

  // 商家批量提交申请
  submitBatchApplications: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { applications, reason } = req.body;
      const businessId = req.user.id;

      if (!applications || !Array.isArray(applications) || applications.length === 0) {
        return res.status(400).json({
          success: false,
          error: '申请列表不能为空'
        });
      }

      const existingPermissions = await BusinessCategoryPermission.findAll({
        where: { businessId },
        transaction
      });
      const existingPermissionKeys = new Set(existingPermissions.map(p => p.categoryKey));

      const existingApplications = await BusinessCategoryApplication.findAll({
        where: { businessId },
        transaction
      });
      const existingApplicationKeys = new Set(existingApplications.map(a => a.categoryKey));

      const createdApplications = [];
      const skippedCount = { existingPermission: 0, existingApplication: 0 };

      for (const app of applications) {
        const { categoryKey, categoryLevel, categoryLabel, parentKey } = app;

        if (!categoryKey) continue;

        if (existingPermissionKeys.has(categoryKey)) {
          skippedCount.existingPermission++;
          continue;
        }

        if (existingApplicationKeys.has(categoryKey)) {
          skippedCount.existingApplication++;
          continue;
        }

        const application = await BusinessCategoryApplication.create({
          businessId,
          categoryKey,
          categoryLevel: categoryLevel || 1,
          categoryLabel: categoryLabel || categoryKey,
          parentKey: parentKey || null,
          status: 'pending',
          reason
        }, { transaction });

        createdApplications.push(application);
        existingApplicationKeys.add(categoryKey);
      }

      if (createdApplications.length === 0) {
        await transaction.rollback();
        let errorMsg = '';
        if (skippedCount.existingPermission > 0) {
          errorMsg += `${skippedCount.existingPermission} 个分类已拥有权限`;
        }
        if (skippedCount.existingApplication > 0) {
          if (errorMsg) errorMsg += '，';
          errorMsg += `${skippedCount.existingApplication} 个分类已有申请`;
        }
        return res.status(400).json({
          success: false,
          error: `没有可提交的申请（${errorMsg}）`
        });
      }

      await operationLogService.logOperation({
        userId: req.user.id,
        username: req.user.username,
        role: req.user.role,
        action: 'create',
        module: 'business_category_application',
        targetId: createdApplications.map(a => a.id).join(','),
        targetName: createdApplications.map(a => a.categoryLabel).join(','),
        description: `商家批量申请分类权限: ${createdApplications.length} 个`,
        req
      });

      await transaction.commit();

      res.status(201).json({
        success: true,
        data: {
          count: createdApplications.length,
          skipped: skippedCount
        }
      });
    } catch (error) {
      await transaction.rollback();
      console.error('批量提交层级申请失败:', error);
      res.status(500).json({
        success: false,
        error: '批量提交层级申请失败'
      });
    }
  },

  // 商家取消申请
  cancelApplication: async (req, res) => {
    try {
      const { id } = req.params;
      const businessId = req.user.id;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: '申请ID不能为空'
        });
      }

      const application = await BusinessCategoryApplication.findOne({
        where: { id, businessId, status: 'pending' }
      });

      if (!application) {
        return res.status(404).json({
          success: false,
          error: '申请不存在或已被处理'
        });
      }

      await application.destroy();

      await operationLogService.logOperation({
        userId: req.user.id,
        username: req.user.username,
        role: req.user.role,
        action: 'delete',
        module: 'business_category_application',
        targetId: id,
        targetName: application.categoryLabel,
        description: `商家取消申请: ${application.categoryLabel}`,
        req
      });

      res.status(200).json({
        success: true,
        message: '申请已取消'
      });
    } catch (error) {
      console.error('取消申请失败:', error);
      res.status(500).json({
        success: false,
        error: '取消申请失败'
      });
    }
  },

  // 注册时初始化商家层级权限
  initializePermissions: async (req, res) => {
    try {
      const { businessId, categoryKeys } = req.body;

      if (!businessId || !categoryKeys || !Array.isArray(categoryKeys)) {
        return res.status(400).json({
          success: false,
          error: '参数错误'
        });
      }

      const permissions = [];

      for (const categoryKey of categoryKeys) {
        const category = await ProductCategory.findOne({
          where: { key: categoryKey, status: 'active', level: 1 }
        });

        if (!category) {
          return res.status(400).json({
            success: false,
            error: `无效的一级分类: ${categoryKey}`
          });
        }

        const existing = await BusinessCategoryPermission.findOne({
          where: { businessId, categoryKey }
        });

        if (!existing) {
          permissions.push({
            businessId,
            categoryKey: category.key,
            categoryLevel: category.level,
            categoryLabel: category.label,
            parentKey: category.parentKey,
            grantedAt: new Date(),
            grantedBy: null
          });
        }
      }

      if (permissions.length > 0) {
        await BusinessCategoryPermission.bulkCreate(permissions);
      }

      await operationLogService.logOperation({
        userId: null,
        action: 'initialize',
        module: 'business_category_permission',
        description: `商家初始化权限: businessId=${businessId}, categories=${categoryKeys.join(',')}`
      });

      res.status(200).json({
        success: true,
        data: { count: permissions.length }
      });
    } catch (error) {
      console.error('初始化商家层级权限失败:', error);
      res.status(500).json({
        success: false,
        error: '初始化商家层级权限失败'
      });
    }
  },

  // 检查商家是否有商品分类权限
  checkPermission: async (req, res) => {
    try {
      const { categoryKey } = req.query;
      const businessId = req.user.id;

      if (!categoryKey) {
        return res.status(400).json({
          success: false,
          error: '分类key不能为空'
        });
      }

      const hasPermission = await BusinessCategoryPermission.findOne({
        where: { businessId, categoryKey, status: 'active' }
      });

      res.status(200).json({
        success: true,
        data: { hasPermission: !!hasPermission }
      });
    } catch (error) {
      console.error('检查权限失败:', error);
      res.status(500).json({
        success: false,
        error: '检查权限失败'
      });
    }
  },

  // 获取商家可售卖的所有分类key（用于验证）
  getPermissionKeys: async (req, res) => {
    try {
      const businessId = req.user.id;

      const permissions = await BusinessCategoryPermission.findAll({
        where: { businessId, status: 'active' },
        attributes: ['categoryKey', 'categoryLevel']
      });

      const keys = permissions.map(p => p.categoryKey);
      const level1Keys = permissions.filter(p => p.categoryLevel === 1).map(p => p.categoryKey);

      res.status(200).json({
        success: true,
        data: {
          allKeys: keys,
          level1Keys,
          count: keys.length
        }
      });
    } catch (error) {
      console.error('获取权限key失败:', error);
      res.status(500).json({
        success: false,
        error: '获取权限key失败'
      });
    }
  },

  // 管理员获取待审核的申请列表
  getPendingApplications: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const { count, rows: applications } = await BusinessCategoryApplication.findAndCountAll({
        where: { status: 'pending' },
        order: [['createdAt', 'ASC']],
        limit: parseInt(limit),
        offset,
        include: [{
          model: User,
          as: 'business',
          attributes: ['id', 'username', 'phone']
        }]
      });

      res.status(200).json({
        success: true,
        data: {
          applications,
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('获取待审核申请失败:', error);
      res.status(500).json({
        success: false,
        error: '获取待审核申请失败'
      });
    }
  },

  // 管理员审核申请
  reviewApplication: async (req, res) => {
    try {
      const { applicationId, status, comment } = req.body;
      const adminId = req.user.id;

      if (!applicationId || !status || !['approved', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: '参数错误'
        });
      }

      const application = await BusinessCategoryApplication.findOne({
        where: { id: applicationId, status: 'pending' }
      });

      if (!application) {
        return res.status(404).json({
          success: false,
          error: '申请不存在或已被处理'
        });
      }

      await application.update({
        status,
        reviewComment: comment,
        reviewedBy: adminId,
        reviewedAt: new Date()
      });

      if (status === 'approved') {
        const existingPermission = await BusinessCategoryPermission.findOne({
          where: {
            businessId: application.businessId,
            categoryKey: application.categoryKey
          }
        });

        if (!existingPermission) {
          await BusinessCategoryPermission.create({
            businessId: application.businessId,
            categoryKey: application.categoryKey,
            categoryLevel: application.categoryLevel,
            categoryLabel: application.categoryLabel,
            parentKey: application.parentKey,
            grantedAt: new Date(),
            grantedBy: adminId
          });
        } else if (existingPermission.status === 'inactive') {
          await existingPermission.update({
            status: 'active',
            grantedAt: new Date(),
            grantedBy: adminId
          });
        }
      }

      await operationLogService.logOperation({
        userId: adminId,
        username: req.user.username,
        role: req.user.role,
        action: 'review',
        module: 'business_category_application',
        targetId: applicationId,
        targetName: application.categoryLabel,
        description: `管理员审核申请: ${application.categoryLabel} - ${status}`,
        req
      });

      res.status(200).json({
        success: true,
        data: application
      });
    } catch (error) {
      console.error('审核申请失败:', error);
      res.status(500).json({
        success: false,
        error: '审核申请失败'
      });
    }
  },

  // 管理员审核申请（通过URL参数）
  reviewApplicationById: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, comment } = req.body;
      const adminId = req.user.id;

      if (!id || !status || !['approved', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: '参数错误'
        });
      }

      const application = await BusinessCategoryApplication.findOne({
        where: { id, status: 'pending' }
      });

      if (!application) {
        return res.status(404).json({
          success: false,
          error: '申请不存在或已被处理'
        });
      }

      await application.update({
        status,
        reviewComment: comment,
        reviewedBy: adminId,
        reviewedAt: new Date()
      });

      if (status === 'approved') {
        const existingPermission = await BusinessCategoryPermission.findOne({
          where: {
            businessId: application.businessId,
            categoryKey: application.categoryKey
          }
        });

        if (!existingPermission) {
          await BusinessCategoryPermission.create({
            businessId: application.businessId,
            categoryKey: application.categoryKey,
            categoryLevel: application.categoryLevel,
            categoryLabel: application.categoryLabel,
            parentKey: application.parentKey,
            grantedAt: new Date(),
            grantedBy: adminId
          });
        } else if (existingPermission.status === 'inactive') {
          await existingPermission.update({
            status: 'active',
            grantedAt: new Date(),
            grantedBy: adminId
          });
        }
      }

      await operationLogService.logOperation({
        userId: adminId,
        username: req.user.username,
        role: req.user.role,
        action: 'review',
        module: 'business_category_application',
        targetId: id,
        targetName: application.categoryLabel,
        description: `管理员审核申请: ${application.categoryLabel} - ${status}`,
        req
      });

      res.status(200).json({
        success: true,
        data: application
      });
    } catch (error) {
      console.error('审核申请失败:', error);
      res.status(500).json({
        success: false,
        error: '审核申请失败'
      });
    }
  },

  // 管理员获取所有申请记录
  getAllApplications: async (req, res) => {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (status && ['pending', 'approved', 'rejected'].includes(status)) {
        where.status = status;
      }

      const { count, rows: applications } = await BusinessCategoryApplication.findAndCountAll({
        where,
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset,
        include: [
          {
            model: User,
            as: 'business',
            attributes: ['id', 'username', 'phone']
          },
          {
            model: User,
            as: 'reviewedByUser',
            attributes: ['id', 'username']
          }
        ]
      });

      res.status(200).json({
        success: true,
        data: {
          applications,
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('获取所有申请记录失败:', error);
      res.status(500).json({
        success: false,
        error: '获取所有申请记录失败'
      });
    }
  },

  // 管理员获取商家权限列表
  getAllPermissions: async (req, res) => {
    try {
      const { page = 1, limit = 10, businessId } = req.query;
      const offset = (page - 1) * limit;

      const where = { status: 'active' };
      if (businessId) {
        where.businessId = parseInt(businessId);
      }

      const { count, rows: permissions } = await BusinessCategoryPermission.findAndCountAll({
        where,
        order: [['businessId', 'ASC'], ['categoryLevel', 'ASC'], ['categoryLabel', 'ASC']],
        limit: parseInt(limit),
        offset,
        include: [{
          model: User,
          as: 'business',
          attributes: ['id', 'username', 'phone']
        }]
      });

      res.status(200).json({
        success: true,
        data: {
          permissions,
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('获取所有权限失败:', error);
      res.status(500).json({
        success: false,
        error: '获取所有权限失败'
      });
    }
  },

  // 管理员手动设置商家权限
  setPermission: async (req, res) => {
    try {
      const { businessId, categoryKey, status } = req.body;
      const adminId = req.user.id;

      if (!businessId || !categoryKey || !status || !['active', 'inactive'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: '参数错误'
        });
      }

      const category = await ProductCategory.findOne({
        where: { key: categoryKey, status: 'active' }
      });

      if (!category) {
        return res.status(400).json({
          success: false,
          error: '无效的分类key'
        });
      }

      const business = await User.findOne({
        where: { id: businessId, role: 'seller' }
      });

      if (!business) {
        return res.status(400).json({
          success: false,
          error: '无效的商家ID'
        });
      }

      let permission = await BusinessCategoryPermission.findOne({
        where: { businessId, categoryKey }
      });

      if (permission) {
        await permission.update({
          status,
          grantedBy: adminId,
          grantedAt: new Date()
        });
      } else {
        permission = await BusinessCategoryPermission.create({
          businessId,
          categoryKey,
          categoryLevel: category.level,
          categoryLabel: category.label,
          parentKey: category.parentKey,
          status,
          grantedBy: adminId,
          grantedAt: new Date()
        });
      }

      await operationLogService.logOperation({
        userId: adminId,
        username: req.user.username,
        role: req.user.role,
        action: 'update',
        module: 'business_category_permission',
        targetName: category.label,
        description: `管理员设置权限: ${category.label} - ${status}`,
        req
      });

      res.status(200).json({
        success: true,
        data: permission
      });
    } catch (error) {
      console.error('设置商家权限失败:', error);
      res.status(500).json({
        success: false,
        error: '设置商家权限失败'
      });
    }
  },

  // 管理员批量设置商家权限
  batchSetPermissions: async (req, res) => {
    try {
      const { businessId, categoryKeys, status } = req.body;
      const adminId = req.user.id;

      if (!businessId || !categoryKeys || !Array.isArray(categoryKeys) || !status || !['active', 'inactive'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: '参数错误'
        });
      }

      const business = await User.findOne({
        where: { id: businessId, role: 'seller' }
      });

      if (!business) {
        return res.status(400).json({
          success: false,
          error: '无效的商家ID'
        });
      }

      let successCount = 0;
      let failedCount = 0;

      for (const categoryKey of categoryKeys) {
        try {
          const category = await ProductCategory.findOne({
            where: { key: categoryKey, status: 'active' }
          });

          if (!category) {
            failedCount++;
            continue;
          }

          let permission = await BusinessCategoryPermission.findOne({
            where: { businessId, categoryKey }
          });

          if (permission) {
            await permission.update({
              status,
              grantedBy: adminId,
              grantedAt: new Date()
            });
          } else {
            await BusinessCategoryPermission.create({
              businessId,
              categoryKey,
              categoryLevel: category.level,
              categoryLabel: category.label,
              parentKey: category.parentKey,
              status,
              grantedBy: adminId,
              grantedAt: new Date()
            });
          }

          successCount++;
        } catch (error) {
          failedCount++;
        }
      }

      await operationLogService.logOperation({
        userId: adminId,
        username: req.user.username,
        role: req.user.role,
        action: 'batch_update',
        module: 'business_category_permission',
        description: `管理员批量设置权限: businessId=${businessId}, count=${categoryKeys.length}, success=${successCount}, failed=${failedCount}`,
        req
      });

      res.status(200).json({
        success: true,
        data: {
          successCount,
          failedCount,
          total: categoryKeys.length
        }
      });
    } catch (error) {
      console.error('批量设置商家权限失败:', error);
      res.status(500).json({
        success: false,
        error: '批量设置商家权限失败'
      });
    }
  }
};

module.exports = businessCategoryController;