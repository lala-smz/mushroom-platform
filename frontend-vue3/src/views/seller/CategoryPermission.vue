<template>
  <div class="category-permission-container">
    <div class="page-header">
      <div class="header-info">
        <el-button type="text" class="back-btn" @click="goBack">
          <el-icon :size="20"><ArrowLeft /></el-icon>
          <span>返回</span>
        </el-button>
        <h2>商品层级权限管理</h2>
        <p class="header-desc">管理您的商品分类权限，申请新的售卖品类</p>
      </div>
      <div class="header-stats">
        <div class="stat-item">
          <span class="stat-value">{{ approvedCount }}</span>
          <span class="stat-label">已授权分类</span>
        </div>
        <div class="stat-item">
          <span class="stat-value pending">{{ pendingCount }}</span>
          <span class="stat-label">待审核申请</span>
        </div>
      </div>
    </div>

    <!-- 功能卡片区域 -->
    <div class="action-cards">
      <div class="action-card" @click="showApplyModal = true">
        <div class="card-icon apply">
          <el-icon :size="32"><Plus /></el-icon>
        </div>
        <div class="card-content">
          <h3>申请新分类</h3>
          <p>提交商品分类售卖申请</p>
        </div>
        <el-icon :size="20" class="card-arrow"><ArrowDown /></el-icon>
      </div>
      
      <div class="action-card" @click="activeTab = 'history'">
        <div class="card-icon history">
          <el-icon :size="32"><Document /></el-icon>
        </div>
        <div class="card-content">
          <h3>申请历史</h3>
          <p>查看所有申请记录</p>
        </div>
        <el-icon :size="20" class="card-arrow"><ArrowDown /></el-icon>
      </div>
    </div>

    <!-- Tab 切换 -->
    <el-tabs v-model="activeTab" class="main-tabs" @tab-change="handleTabChange">
      <el-tab-pane label="已授权分类" name="approved">
        <div v-if="approvedPermissions.length === 0" class="empty-state">
          <el-icon :size="64" class="empty-icon"><Box /></el-icon>
          <p>暂无授权分类</p>
          <el-button type="primary" @click="showApplyModal = true">立即申请</el-button>
        </div>
        
        <div v-else class="permission-tree">
          <div class="tree-header">
            <span class="tree-title">已授权分类层级</span>
            <el-tooltip content="您可以在这些分类下上传商品" placement="top">
              <el-button type="text" size="small" class="help-btn">
                <el-icon :size="16"><HelpFilled /></el-icon>
              </el-button>
            </el-tooltip>
          </div>
          
          <el-tree
            :data="approvedTreeData"
            :props="treeProps"
            :expand-on-click-node="false"
            default-expand-all
            class="category-tree"
          >
            <template #default="{ node, data }">
              <span class="tree-node">
                <el-tag
                  v-if="data.level === 1"
                  type="success"
                  size="small"
                  class="level-tag"
                >一级</el-tag>
                <el-tag
                  v-else-if="data.level === 2"
                  type="info"
                  size="small"
                  class="level-tag"
                >二级</el-tag>
                <el-tag
                  v-else
                  type="warning"
                  size="small"
                  class="level-tag"
                >三级</el-tag>
                <span class="node-label">{{ data.label }}</span>
                <el-icon :size="14" class="check-icon"><CircleCheck /></el-icon>
              </span>
            </template>
          </el-tree>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="待审核申请" name="pending">
        <div v-if="pendingApplications.length === 0" class="empty-state">
          <el-icon :size="64" class="empty-icon"><Refresh /></el-icon>
          <p>暂无待审核申请</p>
          <el-button type="primary" @click="showApplyModal = true">申请新分类</el-button>
        </div>
        
        <div v-else class="application-list">
          <div
            v-for="app in pendingApplications"
            :key="app.id"
            class="application-item"
          >
            <div class="app-header">
              <div class="app-category">
                <el-tag type="warning" size="small">待审核</el-tag>
                <span class="category-name">{{ app.categoryLabel }}</span>
              </div>
              <span class="app-level">
                第{{ app.categoryLevel }}级分类
              </span>
            </div>
            <div class="app-info">
              <div class="info-row">
                <span class="info-label">申请时间</span>
                <span class="info-value">{{ formatDate(app.createdAt) }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">申请原因</span>
                <span class="info-value">{{ app.reason || '未填写' }}</span>
              </div>
            </div>
            <div class="app-actions">
              <el-button type="text" @click="cancelApplication(app)">取消申请</el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="申请历史" name="history">
        <div v-if="historyApplications.length === 0" class="empty-state">
          <el-icon :size="64" class="empty-icon"><Document /></el-icon>
          <p>暂无申请记录</p>
        </div>
        
        <div v-else class="history-list">
          <div
            v-for="app in historyApplications"
            :key="app.id"
            class="history-item"
          >
            <div class="history-header">
              <div class="history-category">
                <el-tag
                  :type="getStatusTagType(app.status)"
                  size="small"
                >{{ getStatusText(app.status) }}</el-tag>
                <span class="category-name">{{ app.categoryLabel }}</span>
              </div>
              <span class="history-level">
                第{{ app.categoryLevel }}级分类
              </span>
            </div>
            <div class="history-info">
              <div class="info-row">
                <span class="info-label">申请时间</span>
                <span class="info-value">{{ formatDate(app.createdAt) }}</span>
              </div>
              <div class="info-row" v-if="app.reviewedAt">
                <span class="info-label">审核时间</span>
                <span class="info-value">{{ formatDate(app.reviewedAt) }}</span>
              </div>
              <div class="info-row" v-if="app.reviewComment">
                <span class="info-label">审核意见</span>
                <span class="info-value comment">{{ app.reviewComment }}</span>
              </div>
            </div>
            <div v-if="app.status === 'rejected'" class="reapply-btn">
              <el-button type="primary" size="small" @click="reapply(app)">重新申请</el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 申请弹窗 -->
    <el-dialog
      v-model="showApplyModal"
      title="申请商品分类权限"
      width="600px"
      :before-close="handleModalClose"
    >
      <div class="apply-form">
        <div class="form-intro">
          <el-icon :size="24" class="intro-icon"><InfoFilled /></el-icon>
          <p>选择您想要申请的商品分类层级，申请提交后将由管理员审核</p>
        </div>
        
        <el-form ref="applyFormRef" :model="applyForm" :rules="applyRules" label-width="120px">
          <el-form-item label="选择分类" prop="categoryKeys">
            <el-tree-select
              v-model="applyForm.categoryKeys"
              :data="allCategoriesTree"
              :props="treeProps"
              value-key="key"
              placeholder="请选择分类（可多选）"
              :render-after-expand="false"
              :multiple="true"
              class="tree-select"
              @change="handleCategoryChange"
            >
              <template #default="{ node }">
                <span :class="{ 'disabled-node': node.data.disabled }">
                  {{ node.label }}
                  <span v-if="node.data.authorized" class="disabled-text">(已授权)</span>
                </span>
              </template>
            </el-tree-select>
            <div class="select-tip">
              <el-icon :size="14"><InfoFilled /></el-icon>
              <span>层级选择规则：选择父分类将自动包含其所有子分类；选择子分类仅选中该分类本身；已授权的分类将显示为灰色不可选</span>
            </div>
          </el-form-item>
          
          <el-form-item label="申请原因" prop="reason">
            <el-input
              v-model="applyForm.reason"
              type="textarea"
              :rows="3"
              placeholder="请简要说明申请该分类的原因..."
            />
          </el-form-item>
        </el-form>
      </div>
      
      <template #footer>
        <el-button @click="showApplyModal = false">取消</el-button>
        <el-button type="primary" @click="submitApplication" :loading="submitting">
          提交申请
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import {
  Plus,
  Document,
  ArrowDown,
  HelpFilled,
  Box,
  Refresh,
  CircleCheck,
  InfoFilled,
  ArrowLeft
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { apiClient } from '../../api';

const router = useRouter();

const goBack = () => {
  router.back();
};

const activeTab = ref('approved');
const showApplyModal = ref(false);
const applyFormRef = ref(null);
const submitting = ref(false);

const approvedPermissions = ref([]);
const pendingApplications = ref([]);
const historyApplications = ref([]);
const allCategories = ref([]);

const applyForm = ref({
  categoryKeys: [],
  reason: ''
});

const selectedCategories = ref([]);
const autoSelectedCategories = ref([]);

const applyRules = {
  categoryKeys: [
    { 
      validator: (rule, value, callback) => {
        if (!value || !Array.isArray(value) || value.length === 0) {
          callback(new Error('至少选择一个分类'));
        } else {
          callback();
        }
      }, 
      trigger: 'change' 
    }
  ],
  reason: [
    { required: true, message: '请填写申请原因', trigger: 'blur' },
    { min: 10, message: '申请原因至少10个字符', trigger: 'blur' }
  ]
};

const getAllChildCategories = (parentKey, categories) => {
  const children = [];
  const parentCategory = categories.find(c => c.key === parentKey);
  if (!parentCategory) return children;
  
  const findChildren = (key, level) => {
    const found = categories.filter(c => c.parentKey === key && c.level === level);
    found.forEach(child => {
      children.push(child);
      if (level < 3) {
        findChildren(child.key, level + 1);
      }
    });
  };
  
  findChildren(parentKey, parentCategory.level + 1);
  return children;
};

const getAllParentCategories = (childKey, categories) => {
  const parents = [];
  let currentKey = childKey;
  
  while (currentKey) {
    const category = categories.find(c => c.key === currentKey);
    if (!category) break;
    
    if (category.parentKey) {
      const parent = categories.find(c => c.key === category.parentKey);
      if (parent && !parents.find(p => p.key === parent.key)) {
        parents.push(parent);
        currentKey = parent.parentKey;
      } else {
        break;
      }
    } else {
      break;
    }
  }
  
  return parents;
};

const handleCategoryChange = (val) => {
  if (applyFormRef.value) {
    applyFormRef.value.validateField('categoryKeys');
  }
};

const getFinalCategoryKeys = () => {
  const categories = flattenCategories(allCategories.value);
  const selected = new Set(applyForm.value.categoryKeys);
  
  applyForm.value.categoryKeys.forEach(key => {
    const category = categories.find(c => c.key === key);
    if (!category) return;
    
    if (category.level === 1 || category.level === 2) {
      const children = getAllChildCategories(key, categories);
      children.forEach(child => {
        if (!selected.has(child.key)) {
          selected.add(child.key);
        }
      });
    }
  });
  
  return [...selected];
};

const flattenCategories = (categories) => {
  const result = [];
  const flatten = (items) => {
    items.forEach(item => {
      result.push(item);
      if (item.children) {
        flatten(item.children);
      }
    });
  };
  flatten(categories);
  return result;
};

const treeProps = {
  children: 'children',
  label: 'label',
  value: 'key',
  disabled: 'disabled'
};

const approvedCount = computed(() => {
  let count = 0;
  const countNodes = (nodes) => {
    nodes.forEach(node => {
      count++;
      if (node.children) countNodes(node.children);
    });
  };
  countNodes(approvedTreeData.value);
  return count;
});

const pendingCount = computed(() => pendingApplications.value.length);

const approvedTreeData = computed(() => {
  return buildTree(approvedPermissions.value);
});

const allCategoriesTree = computed(() => {
  const approvedKeys = new Set(approvedPermissions.value.map(p => p.categoryKey));
  return buildTreeWithDisabled(allCategories.value, approvedKeys);
});

const buildTree = (permissions) => {
  const level1 = permissions.filter(p => p.categoryLevel === 1);
  const level2 = permissions.filter(p => p.categoryLevel === 2);
  const level3 = permissions.filter(p => p.categoryLevel === 3);
  
  const result = [];
  
  const level1Keys = new Set(level1.map(p => p.categoryKey));
  
  const level2ByParent = {};
  level2.forEach(p => {
    if (!level2ByParent[p.parentKey]) {
      level2ByParent[p.parentKey] = [];
    }
    level2ByParent[p.parentKey].push(p);
  });
  
  const level3ByParent = {};
  level3.forEach(p => {
    if (!level3ByParent[p.parentKey]) {
      level3ByParent[p.parentKey] = [];
    }
    level3ByParent[p.parentKey].push(p);
  });
  
  const processedParents = new Set();
  
  level1.forEach(p1 => {
    processedParents.add(p1.categoryKey);
    const children2 = level2ByParent[p1.categoryKey] || [];
    
    const childrenWith3 = children2.map(p2 => {
      const children3 = level3ByParent[p2.categoryKey] || [];
      return {
        id: p2.id,
        key: p2.categoryKey,
        label: p2.categoryLabel,
        level: p2.categoryLevel,
        children: children3.map(p3 => ({
          id: p3.id,
          key: p3.categoryKey,
          label: p3.categoryLabel,
          level: p3.categoryLevel,
          isLeaf: true
        }))
      };
    });
    
    result.push({
      id: p1.id,
      key: p1.categoryKey,
      label: p1.categoryLabel,
      level: p1.categoryLevel,
      children: childrenWith3
    });
  });
  
  level2.forEach(p2 => {
    if (!processedParents.has(p2.parentKey)) {
      processedParents.add(p2.parentKey);
      const children3 = level3ByParent[p2.categoryKey] || [];
      
      const parentInfo = {
        id: `parent-${p2.parentKey}`,
        key: p2.parentKey,
        label: getParentLabel(p2.parentKey),
        level: 1,
        children: [{
          id: p2.id,
          key: p2.categoryKey,
          label: p2.categoryLabel,
          level: p2.categoryLevel,
          children: children3.map(p3 => ({
            id: p3.id,
            key: p3.categoryKey,
            label: p3.categoryLabel,
            level: p3.categoryLevel,
            isLeaf: true
          }))
        }]
      };
      
      result.push(parentInfo);
    }
  });
  
  level3.forEach(p3 => {
    if (!processedParents.has(p3.parentKey)) {
      processedParents.add(p3.parentKey);
      const grandParentKey = getParentKey(p3.parentKey);
      
      if (!processedParents.has(grandParentKey)) {
        processedParents.add(grandParentKey);
        
        const grandParentInfo = {
          id: `parent-${grandParentKey}`,
          key: grandParentKey,
          label: getParentLabel(grandParentKey),
          level: 1,
          children: [{
            id: `parent-${p3.parentKey}`,
            key: p3.parentKey,
            label: getParentLabel(p3.parentKey),
            level: 2,
            children: [{
              id: p3.id,
              key: p3.categoryKey,
              label: p3.categoryLabel,
              level: p3.categoryLevel,
              isLeaf: true
            }]
          }]
        };
        
        result.push(grandParentInfo);
      }
    }
  });
  
  return result;
};

const getParentLabel = (parentKey) => {
  const category = allCategories.value.find(c => c.key === parentKey);
  return category ? category.label : parentKey;
};

const getParentKey = (childKey) => {
  const category = allCategories.value.find(c => c.key === childKey);
  return category ? category.parentKey : null;
};

const buildTreeWithDisabled = (categories, approvedKeys) => {
  const level1 = categories.filter(c => c.level === 1);
  return level1.map(c1 => {
    const c1Authorized = approvedKeys.has(c1.key);
    const level2Categories = categories.filter(c2 => c2.parentKey === c1.key && c2.level === 2);
    
    const children2 = level2Categories.map(c2 => {
      const c2Authorized = approvedKeys.has(c2.key);
      const level3Categories = categories.filter(c3 => c3.parentKey === c2.key && c3.level === 3);
      
      const children3 = level3Categories.map(c3 => ({
        id: c3.id,
        key: c3.key,
        label: c3.label,
        level: c3.level,
        authorized: approvedKeys.has(c3.key),
        disabled: approvedKeys.has(c3.key),
        isLeaf: true
      }));
      
      return {
        id: c2.id,
        key: c2.key,
        label: c2.label,
        level: c2.level,
        authorized: c2Authorized,
        disabled: c2Authorized,
        children: children3
      };
    });
    
    return {
      id: c1.id,
      key: c1.key,
      label: c1.label,
      level: c1.level,
      authorized: c1Authorized,
      disabled: c1Authorized,
      children: children2
    };
  });
};

const getStatusTagType = (status) => {
  switch (status) {
    case 'approved': return 'success';
    case 'rejected': return 'danger';
    default: return 'warning';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'approved': return '已通过';
    case 'rejected': return '已拒绝';
    default: return '待审核';
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const loadPermissions = async () => {
  try {
    const response = await apiClient.seller.getPermissions();
    if (response.success && response.data) {
      approvedPermissions.value = response.data;
    }
  } catch (error) {
    console.error('加载权限失败:', error);
  }
};

const loadApplications = async () => {
  try {
    const response = await apiClient.seller.getApplications();
    if (response.success && Array.isArray(response.data)) {
      pendingApplications.value = response.data.filter(a => a.status === 'pending');
      historyApplications.value = response.data.filter(a => a.status !== 'pending');
    } else {
      pendingApplications.value = [];
      historyApplications.value = [];
    }
  } catch (error) {
    console.error('加载申请记录失败:', error);
    pendingApplications.value = [];
    historyApplications.value = [];
  }
};

const loadAllCategories = async () => {
  try {
    const response = await apiClient.seller.getAvailableCategories();
    if (response.success && response.data) {
      allCategories.value = response.data;
    }
  } catch (error) {
    console.error('加载分类列表失败:', error);
  }
};

const handleTabChange = () => {
  if (activeTab.value === 'pending') {
    loadApplications();
  }
};

const handleModalClose = () => {
  showApplyModal.value = false;
  applyForm.value = { categoryKeys: [], reason: '' };
  selectedCategories.value = [];
  autoSelectedCategories.value = [];
  if (applyFormRef.value) {
    applyFormRef.value.resetFields();
  }
};

const submitApplication = async () => {
  if (!applyFormRef.value) return;
  
  const valid = await applyFormRef.value.validate().catch(() => false);
  if (!valid) return;
  
  submitting.value = true;
  
  try {
    const finalCategoryKeys = getFinalCategoryKeys();
    const categories = flattenCategories(allCategories.value);
    const applications = finalCategoryKeys.map(key => {
      const category = categories.find(c => c.key === key);
      return {
        categoryKey: key,
        categoryLevel: category?.level || 1,
        categoryLabel: category?.label || key,
        parentKey: category?.parentKey || null
      };
    });
    
    const response = await apiClient.seller.applyCategories({
      applications,
      reason: applyForm.value.reason
    });
    
    if (response.success) {
      ElMessage.success(`成功提交 ${response.data.count} 个分类申请，等待管理员审核`);
      showApplyModal.value = false;
      applyForm.value = { categoryKeys: [], reason: '' };
      selectedCategories.value = [];
      autoSelectedCategories.value = [];
      await loadApplications();
      await loadPermissions();
    } else {
      ElMessage.error(response.message || '提交失败');
    }
  } catch (error) {
    ElMessage.error(error.message || '提交失败');
  } finally {
    submitting.value = false;
  }
};

const findCategoryByKey = (key) => {
  const findInArray = (arr) => {
    for (const item of arr) {
      if (item.key === key) return item;
      if (item.children) {
        const found = findInArray(item.children);
        if (found) return found;
      }
    }
    return null;
  };
  return findInArray(allCategoriesTree.value);
};

const cancelApplication = async (app) => {
  const originalPending = [...pendingApplications.value];
  
  try {
    const response = await apiClient.seller.cancelApplication(app.id);
    if (response.success) {
      pendingApplications.value = pendingApplications.value.filter(a => a.id !== app.id);
      ElMessage.success('申请已取消');
      
      setTimeout(async () => {
        try {
          await loadApplications();
        } catch (reloadError) {
          console.error('重新加载申请列表失败:', reloadError);
          pendingApplications.value = originalPending;
          ElMessage.warning('状态同步失败，请刷新页面');
        }
      }, 300);
    } else {
      ElMessage.error(response.message || '取消失败');
    }
  } catch (error) {
    ElMessage.error(error.message || '取消失败');
  }
};

const reapply = (app) => {
  applyForm.value = {
    categoryKeys: [app.categoryKey],
    reason: ''
  };
  selectedCategories.value = [];
  autoSelectedCategories.value = [];
  showApplyModal.value = true;
};

watch(() => applyForm.value.categoryKeys, (newVal) => {
  selectedCategories.value = newVal.map(key => {
    const categories = flattenCategories(allCategories.value);
    return categories.find(c => c.key === key);
  }).filter(Boolean);
}, { deep: true });

onMounted(async () => {
  await Promise.all([
    loadPermissions(),
    loadApplications(),
    loadAllCategories()
  ]);
});
</script>

<style scoped>
.category-permission-container {
  padding: 20px 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: #fff;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.back-btn span {
  font-weight: 500;
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

.stat-value.pending {
  color: #ffd700;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}

.action-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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

.card-icon.apply {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.card-icon.history {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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

.card-arrow {
  margin-left: auto;
  color: #ccc;
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
  margin: 0 0 20px 0;
}

.permission-tree {
  padding: 20px;
}

.tree-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.tree-title {
  font-weight: 600;
  color: #333;
}

.help-btn {
  padding: 0;
  color: #606266;
}

.category-tree {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
}

.level-tag {
  margin-right: 8px;
}

.node-label {
  flex: 1;
}

.check-icon {
  color: #67c23a;
}

.application-list,
.history-list {
  padding: 20px;
}

.application-item,
.history-item {
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  margin-bottom: 16px;
}

.application-item:last-child,
.history-item:last-child {
  margin-bottom: 0;
}

.app-header,
.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.app-category,
.history-category {
  display: flex;
  align-items: center;
  gap: 10px;
}

.category-name {
  font-weight: 600;
  font-size: 16px;
}

.app-level,
.history-level {
  font-size: 13px;
  color: #999;
}

.app-info,
.history-info {
  margin-bottom: 16px;
}

.info-row {
  display: flex;
  margin-bottom: 8px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  width: 80px;
  color: #999;
  font-size: 14px;
}

.info-value {
  flex: 1;
  font-size: 14px;
}

.info-value.comment {
  color: #666;
  font-style: italic;
}

.app-actions {
  display: flex;
  justify-content: flex-end;
}

.reapply-btn {
  display: flex;
  justify-content: flex-end;
}

.apply-form {
  padding: 10px 0;
}

.form-intro {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 16px;
  background: #f0f9ff;
  border-radius: 8px;
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
}

.intro-icon {
  color: #409eff;
  flex-shrink: 0;
}

.select-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  font-size: 13px;
  color: #999;
}

.tree-select {
  width: 100%;
}

.disabled-node {
  color: #999;
}

.disabled-text {
  font-size: 12px;
  color: #999;
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
  
  .app-header,
  .history-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .info-row {
    flex-direction: column;
    gap: 4px;
  }
}
</style>