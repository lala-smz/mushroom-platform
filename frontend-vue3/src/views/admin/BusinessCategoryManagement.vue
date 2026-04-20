<template>
  <div class="business-category-management">
    <div class="page-header">
      <div class="header-info">
        <h2>商家商品层级管理</h2>
        <p class="header-desc">管理商家的商品分类权限和审核权限申请</p>
      </div>
      <div class="header-stats">
        <div class="stat-item">
          <span class="stat-value">{{ pendingCount }}</span>
          <span class="stat-label">待审核申请</span>
        </div>
        <div class="stat-item">
          <span class="stat-value success">{{ totalBusiness }}</span>
          <span class="stat-label">商家数量</span>
        </div>
      </div>
    </div>

    <!-- 功能卡片 -->
    <div class="action-cards">
      <div class="action-card" @click="activeTab = 'applications'">
        <div class="card-icon applications">
          <el-icon :size="32"><List /></el-icon>
        </div>
        <div class="card-content">
          <h3>审核权限申请</h3>
          <p>处理商家提交的分类权限申请</p>
        </div>
        <el-badge v-if="pendingCount > 0" :value="pendingCount" class="card-badge" />
      </div>
      
      <div class="action-card" @click="activeTab = 'permissions'">
        <div class="card-icon permissions">
          <el-icon :size="32"><Key /></el-icon>
        </div>
        <div class="card-content">
          <h3>管理权限</h3>
          <p>查看和管理商家的分类权限</p>
        </div>
      </div>
      
      <div class="action-card" @click="showBatchModal = true">
        <div class="card-icon batch">
          <el-icon :size="32"><Box /></el-icon>
        </div>
        <div class="card-content">
          <h3>批量授权</h3>
          <p>为商家批量设置分类权限</p>
        </div>
      </div>
    </div>

    <!-- Tab 切换 -->
    <el-tabs v-model="activeTab" class="main-tabs">
      <el-tab-pane label="权限申请审核" name="applications">
        <div v-if="applications.length === 0" class="empty-state">
          <el-icon :size="64" class="empty-icon"><List /></el-icon>
          <p>暂无待审核的权限申请</p>
        </div>
        
        <div v-else class="applications-list">
          <div
            v-for="app in applications"
            :key="app.id"
            class="application-card"
          >
            <div class="card-header">
              <div class="app-info">
                <el-tag type="warning" size="small">待审核</el-tag>
                <span class="app-category">{{ app.categoryLabel }}</span>
                <span class="app-level">第{{ app.categoryLevel }}级</span>
              </div>
              <span class="app-time">{{ formatDate(app.createdAt) }}</span>
            </div>
            
            <div class="card-body">
              <div class="business-info">
                <el-icon :size="16" class="user-icon"><User /></el-icon>
                <span class="business-name">{{ app.business?.username || '未知商家' }}</span>
                <span class="business-id">#{{ app.businessId }}</span>
              </div>
              
              <div class="reason-section">
                <span class="reason-label">申请原因：</span>
                <span class="reason-text">{{ app.reason || '未填写' }}</span>
              </div>
            </div>
            
            <div class="card-footer">
              <div class="quick-actions">
                <el-button type="success" size="small" @click="approveApplication(app)">
                  <el-icon :size="14"><Check /></el-icon>
                  通过
                </el-button>
                <el-button type="danger" size="small" @click="rejectApplication(app)">
                  <el-icon :size="14"><Close /></el-icon>
                  拒绝
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="商家权限管理" name="permissions">
        <div class="permissions-filter">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索商家名称或ID"
            class="search-input"
            prefix-icon="Search"
          />
          <el-select
            v-model="filterLevel"
            placeholder="筛选层级"
            size="small"
          >
            <el-option label="全部层级" value="" />
            <el-option label="一级分类" :value="1" />
            <el-option label="二级分类" :value="2" />
            <el-option label="三级分类" :value="3" />
          </el-select>
        </div>
        
        <div v-if="businessPermissions.length === 0" class="empty-state">
          <el-icon :size="64" class="empty-icon"><Key /></el-icon>
          <p>暂无商家权限记录</p>
        </div>
        
        <div v-else class="business-list">
          <div
            v-for="business in filteredBusinesses"
            :key="business.id"
            class="business-card"
          >
            <div class="business-header">
              <div class="business-title">
                <el-icon :size="18" class="user-icon"><User /></el-icon>
                <span class="business-name">{{ business.username }}</span>
                <span class="business-id">#{{ business.id }}</span>
              </div>
              <span class="permission-count">已授权 {{ business.permissions.length }} 个分类</span>
            </div>
            
            <div class="permissions-tree">
              <el-tree
                :data="getBusinessPermissionTree(business.permissions)"
                :props="treeProps"
                :expand-on-click-node="false"
                default-expand-all
                class="mini-tree"
              >
                <template #default="{ data }">
                  <span class="tree-node">
                    <el-tag
                      :type="getLevelTagType(data.level)"
                      size="mini"
                    >{{ getLevelText(data.level) }}</el-tag>
                    <span>{{ data.label }}</span>
                  </span>
                </template>
              </el-tree>
            </div>
            
            <div class="business-actions">
              <el-button type="primary" size="small" @click="manageBusinessPermissions(business)">
                管理权限
              </el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 审核弹窗 -->
    <el-dialog
      v-model="showReviewModal"
      :title="reviewAction === 'approve' ? '通过申请' : '拒绝申请'"
      width="480px"
    >
      <div class="review-form">
        <div class="review-info">
          <div class="info-row">
            <span class="info-label">申请分类</span>
            <span class="info-value">{{ reviewApplication?.categoryLabel }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">分类层级</span>
            <span class="info-value">第{{ reviewApplication?.categoryLevel }}级</span>
          </div>
          <div class="info-row">
            <span class="info-label">申请商家</span>
            <span class="info-value">{{ reviewApplication?.business?.username }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">申请理由</span>
            <span class="info-value reason-value">{{ reviewApplication?.reason || '未填写' }}</span>
          </div>
        </div>
        
        <el-form-item label="审核意见" v-if="reviewAction === 'reject'">
          <el-input
            v-model="reviewComment"
            type="textarea"
            :rows="3"
            placeholder="请输入拒绝理由..."
          />
        </el-form-item>
        
        <div v-if="reviewAction === 'approve'" class="approve-tip">
          <el-icon :size="18" class="tip-icon"><InfoFilled /></el-icon>
          <span>通过后，该商家将获得此分类的商品上传权限</span>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="showReviewModal = false">取消</el-button>
        <el-button
          :type="reviewAction === 'approve' ? 'success' : 'danger'"
          @click="submitReview"
          :loading="reviewing"
        >
          {{ reviewAction === 'approve' ? '确认通过' : '确认拒绝' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 批量授权弹窗 -->
    <el-dialog
      v-model="showBatchModal"
      title="批量授权"
      width="600px"
    >
      <div class="batch-form">
        <el-form :model="batchForm" label-width="100px">
          <el-form-item label="选择商家">
            <el-select
              v-model="batchForm.businessId"
              placeholder="请选择商家"
              class="business-select"
            >
              <el-option
                v-for="business in businesses"
                :key="business.id"
                :value="business.id"
                :label="`${business.username} (#${business.id})`"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="选择分类">
            <el-tree-select
              v-model="batchForm.categoryKeys"
              :data="categoryTree"
              :props="treeProps"
              placeholder="请选择分类（可多选）"
              :render-after-expand="false"
              :multiple="true"
              class="category-select"
            />
            <div class="select-tip">
              <el-icon :size="14"><InfoFilled /></el-icon>
              <span>选择一级分类将自动包含其下所有子分类</span>
            </div>
          </el-form-item>
        </el-form>
      </div>
      
      <template #footer>
        <el-button @click="showBatchModal = false">取消</el-button>
        <el-button type="primary" @click="submitBatchGrant" :loading="batchSubmitting">
          确认授权
        </el-button>
      </template>
    </el-dialog>

    <!-- 管理商家权限弹窗 -->
    <el-dialog
      v-model="showManageModal"
      :title="`管理 ${selectedBusiness?.username} 的权限`"
      width="700px"
    >
      <div class="manage-form">
        <div class="form-intro">
          <el-icon :size="20"><InfoFilled /></el-icon>
          <span>勾选商家可售卖的商品分类，取消勾选将撤销对应权限</span>
        </div>
        
        <el-tree
          v-model="selectedPermissions"
          :data="categoryTree"
          :props="treeProps"
          show-checkbox
          :check-strictly="true"
          class="manage-tree"
        >
          <template #default="{ node, data }">
            <span>
              <el-tag :type="getLevelTagType(data.level)" size="mini">{{ getLevelText(data.level) }}</el-tag>
              {{ data.label }}
            </span>
          </template>
        </el-tree>
      </div>
      
      <template #footer>
        <el-button @click="showManageModal = false">取消</el-button>
        <el-button type="primary" @click="submitManagePermissions" :loading="manageSubmitting">
          保存修改
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  List,
  Key,
  Box,
  Check,
  Close,
  User,
  Search,
  InfoFilled
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { apiClient } from '../../api';

const activeTab = ref('applications');
const searchKeyword = ref('');
const filterLevel = ref('');

const applications = ref([]);
const businessPermissions = ref([]);
const businesses = ref([]);
const categoryTree = ref([]);

const showReviewModal = ref(false);
const reviewApplication = ref(null);
const reviewAction = ref('approve');
const reviewComment = ref('');
const reviewing = ref(false);

const showBatchModal = ref(false);
const batchForm = ref({
  businessId: '',
  categoryKeys: []
});
const batchSubmitting = ref(false);

const showManageModal = ref(false);
const selectedBusiness = ref(null);
const selectedPermissions = ref([]);
const manageSubmitting = ref(false);

const treeProps = {
  children: 'children',
  label: 'label',
  value: 'key'
};

const pendingCount = computed(() => applications.value.filter(a => a.status === 'pending').length);

const totalBusiness = computed(() => businessPermissions.value.length);

const filteredBusinesses = computed(() => {
  return businessPermissions.value.filter(business => {
    const matchKeyword = !searchKeyword.value || 
      business.username.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      business.id.toString().includes(searchKeyword.value);
    
    if (!filterLevel.value) return matchKeyword;
    
    const hasLevel = business.permissions.some(p => p.categoryLevel === parseInt(filterLevel.value));
    return matchKeyword && hasLevel;
  });
});

const getLevelTagType = (level) => {
  switch (level) {
    case 1: return 'success';
    case 2: return 'info';
    case 3: return 'warning';
    default: return 'default';
  }
};

const getLevelText = (level) => {
  switch (level) {
    case 1: return '一级';
    case 2: return '二级';
    case 3: return '三级';
    default: return '';
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getBusinessPermissionTree = (permissions) => {
  const level1 = permissions.filter(p => p.categoryLevel === 1);
  return level1.map(p1 => ({
    id: p1.id,
    key: p1.categoryKey,
    label: p1.categoryLabel,
    level: p1.categoryLevel,
    children: permissions
      .filter(p2 => p2.parentKey === p1.categoryKey && p2.categoryLevel === 2)
      .map(p2 => ({
        id: p2.id,
        key: p2.categoryKey,
        label: p2.categoryLabel,
        level: p2.categoryLevel,
        children: permissions
          .filter(p3 => p3.parentKey === p2.categoryKey && p3.categoryLevel === 3)
          .map(p3 => ({
            id: p3.id,
            key: p3.categoryKey,
            label: p3.categoryLabel,
            level: p3.categoryLevel
          }))
      }))
  }));
};

const loadApplications = async () => {
  try {
    const response = await apiClient.admin.getPendingApplications();
    if (response.success && response.data) {
      applications.value = Array.isArray(response.data.applications) ? response.data.applications : [];
    }
  } catch (error) {
    console.error('加载申请列表失败:', error);
    applications.value = [];
  }
};

const loadBusinessPermissions = async () => {
  try {
    const response = await apiClient.admin.getAllBusinessPermissions();
    if (response.success && response.data && Array.isArray(response.data.permissions)) {
      const permissions = response.data.permissions;
      const businessMap = {};
      
      permissions.forEach(perm => {
        const businessId = perm.businessId;
        if (!businessMap[businessId]) {
          businessMap[businessId] = {
            id: perm.business?.id || businessId,
            username: perm.business?.username || '未知商家',
            phone: perm.business?.phone || '',
            permissions: []
          };
        }
        businessMap[businessId].permissions.push({
          id: perm.id,
          categoryKey: perm.categoryKey,
          categoryLabel: perm.categoryLabel,
          categoryLevel: perm.categoryLevel,
          parentKey: perm.parentKey
        });
      });
      
      businessPermissions.value = Object.values(businessMap);
    } else {
      businessPermissions.value = [];
    }
  } catch (error) {
    console.error('加载商家权限失败:', error);
    businessPermissions.value = [];
  }
};

const loadBusinesses = async () => {
  try {
    const response = await apiClient.admin.getBusinessList();
    if (response.success && response.data) {
      businesses.value = response.data;
    }
  } catch (error) {
    console.error('加载商家列表失败:', error);
  }
};

const loadCategoryTree = async () => {
  try {
    const response = await apiClient.product.getCategoryTree();
    if (response.success && response.data) {
      categoryTree.value = response.data;
    }
  } catch (error) {
    console.error('加载分类树失败:', error);
  }
};

const approveApplication = (app) => {
  reviewApplication.value = app;
  reviewAction.value = 'approve';
  reviewComment.value = '';
  showReviewModal.value = true;
};

const rejectApplication = (app) => {
  reviewApplication.value = app;
  reviewAction.value = 'reject';
  reviewComment.value = '';
  showReviewModal.value = true;
};

const submitReview = async () => {
  if (!reviewApplication.value) return;
  
  reviewing.value = true;
  
  try {
    const response = await apiClient.admin.reviewApplication(reviewApplication.value.id, {
      status: reviewAction.value === 'approve' ? 'approved' : 'rejected',
      comment: reviewComment.value
    });
    
    if (response.success) {
      ElMessage.success(reviewAction.value === 'approve' ? '申请已通过' : '申请已拒绝');
      showReviewModal.value = false;
      await loadApplications();
      await loadBusinessPermissions();
    } else {
      ElMessage.error(response.message || '操作失败');
    }
  } catch (error) {
    ElMessage.error(error.message || '操作失败');
  } finally {
    reviewing.value = false;
  }
};

const submitBatchGrant = async () => {
  if (!batchForm.value.businessId || batchForm.value.categoryKeys.length === 0) {
    ElMessage.warning('请选择商家和分类');
    return;
  }
  
  batchSubmitting.value = true;
  
  try {
    const response = await apiClient.admin.batchGrantPermissions({
      businessId: batchForm.value.businessId,
      categoryKeys: batchForm.value.categoryKeys
    });
    
    if (response.success) {
      ElMessage.success('批量授权成功');
      showBatchModal.value = false;
      batchForm.value = { businessId: '', categoryKeys: [] };
      await loadBusinessPermissions();
    } else {
      ElMessage.error(response.message || '授权失败');
    }
  } catch (error) {
    ElMessage.error(error.message || '授权失败');
  } finally {
    batchSubmitting.value = false;
  }
};

const manageBusinessPermissions = (business) => {
  selectedBusiness.value = business;
  selectedPermissions.value = business.permissions.map(p => p.categoryKey);
  showManageModal.value = true;
};

const submitManagePermissions = async () => {
  if (!selectedBusiness.value) return;
  
  manageSubmitting.value = true;
  
  try {
    const response = await apiClient.admin.updateBusinessPermissions({
      businessId: selectedBusiness.value.id,
      categoryKeys: selectedPermissions.value
    });
    
    if (response.success) {
      ElMessage.success('权限更新成功');
      showManageModal.value = false;
      await loadBusinessPermissions();
    } else {
      ElMessage.error(response.message || '更新失败');
    }
  } catch (error) {
    ElMessage.error(error.message || '更新失败');
  } finally {
    manageSubmitting.value = false;
  }
};

onMounted(async () => {
  await Promise.all([
    loadApplications(),
    loadBusinessPermissions(),
    loadBusinesses(),
    loadCategoryTree()
  ]);
});
</script>

<style scoped>
.business-category-management {
  padding: 20px 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding: 24px;
  background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
  border-radius: 12px;
  color: #fff;
}

.header-info h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
}

.header-desc {
  margin: 0;
  opacity: 0.9;
}

.header-stats {
  display: flex;
  gap: 32px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 32px;
  font-weight: 700;
}

.stat-value.success {
  color: #95de64;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}

.action-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.card-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon.applications {
  background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
  color: #fff;
}

.card-icon.permissions {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: #fff;
}

.card-icon.batch {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: #fff;
}

.card-content h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  color: #333;
}

.card-content p {
  margin: 0;
  font-size: 13px;
  color: #999;
}

.card-badge {
  position: absolute;
  top: 12px;
  right: 12px;
}

.main-tabs {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #999;
}

.empty-icon {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
}

.permissions-filter {
  display: flex;
  gap: 16px;
  padding: 20px;
  border-bottom: 1px solid #e4e7ed;
}

.search-input {
  width: 300px;
}

.applications-list {
  padding: 20px;
}

.application-card {
  background: #fafafa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
}

.application-card:last-child {
  margin-bottom: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.app-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.app-category {
  font-weight: 600;
  font-size: 16px;
}

.app-level {
  font-size: 13px;
  color: #999;
}

.app-time {
  font-size: 13px;
  color: #999;
}

.card-body {
  margin-bottom: 16px;
}

.business-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.user-icon {
  color: #409eff;
}

.business-name {
  font-weight: 500;
}

.business-id {
  font-size: 13px;
  color: #999;
}

.reason-section {
  display: flex;
  gap: 8px;
}

.reason-label {
  font-size: 14px;
  color: #999;
}

.reason-text {
  font-size: 14px;
  color: #666;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
}

.quick-actions {
  display: flex;
  gap: 12px;
}

.business-list {
  padding: 20px;
}

.business-card {
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
}

.business-card:last-child {
  margin-bottom: 0;
}

.business-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.business-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.permission-count {
  font-size: 13px;
  color: #67c23a;
  font-weight: 500;
}

.permissions-tree {
  margin-bottom: 16px;
}

.mini-tree {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 12px;
}

.business-actions {
  display: flex;
  justify-content: flex-end;
}

.review-form,
.batch-form,
.manage-form {
  padding: 10px 0;
}

.review-info {
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-label {
  color: #999;
}

.info-value {
  font-weight: 500;
}

.approve-tip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  background: #f0f9ff;
  border-radius: 8px;
  color: #666;
}

.tip-icon {
  color: #409eff;
}

.business-select,
.category-select {
  width: 100%;
}

.select-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  font-size: 13px;
  color: #999;
}

.form-intro {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  background: #f0f9ff;
  border-radius: 8px;
  margin-bottom: 20px;
  color: #666;
}

.manage-tree {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 20px;
  }
  
  .header-stats {
    gap: 24px;
  }
  
  .action-cards {
    grid-template-columns: 1fr;
  }
  
  .permissions-filter {
    flex-direction: column;
  }
  
  .search-input {
    width: 100%;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .business-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>