<template>
  <div class="product-manage-container">
    <h2>商品管理</h2>
    
    <!-- 操作栏 -->
    <div class="operation-bar">
      <div class="left-actions">
        <el-button
          v-if="userStore.isAdmin"
          type="success"
          @click="openStatisticsDialog"
        >
          <el-icon><DataAnalysis /></el-icon> 数据统计
        </el-button>
      </div>
    </div>
    
    <!-- 筛选条件 -->
    <div class="filter-section">
      <div class="filter-header">
        <h3 class="filter-title">
          筛选条件
        </h3>
      </div>
      <div class="filter-form">
        <div class="filter-group">
          <span class="filter-label">一级分类</span>
          <el-select
            v-model="filterForm.level1"
            class="filter-select"
            placeholder="请选择一级分类"
            @change="handleLevel1Change"
          >
            <el-option
              value=""
              label="全部"
            />
            <el-option
              v-for="item in level1Options"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </div>
        
        <div class="filter-group">
          <span class="filter-label">二级分类</span>
          <el-select
            v-model="filterForm.level2"
            class="filter-select"
            placeholder="请选择二级分类"
            :disabled="!filterForm.level1"
            @change="handleLevel2Change"
          >
            <el-option
              value=""
              label="全部"
            />
            <el-option
              v-for="item in level2Options"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </div>
        
        <div class="filter-group">
          <span class="filter-label">三级分类</span>
          <el-select
            v-model="filterForm.level3"
            class="filter-select"
            placeholder="请选择三级分类"
            :disabled="!filterForm.level2"
          >
            <el-option
              value=""
              label="全部"
            />
            <el-option
              v-for="item in level3Options"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </div>
        
        <div class="filter-group">
          <span class="filter-label">状态</span>
          <el-select
            v-model="filterForm.status"
            class="filter-select"
          >
            <el-option
              value=""
              label="全部状态"
            />
            <el-option
              value="pending"
              label="待审核"
            />
            <el-option
              value="approved"
              label="已审核"
            />
            <el-option
              value="rejected"
              label="已拒绝"
            />
          </el-select>
        </div>
        
        <div class="filter-actions">
          <el-button
            type="primary"
            class="filter-btn primary"
            @click="fetchProducts"
          >
            <el-icon><Search /></el-icon>
            筛选
          </el-button>
          <el-button
            type="default"
            class="filter-btn reset"
            @click="resetFilter"
          >
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </div>
      </div>
    </div>
    
    <!-- 商品列表 -->
    <div class="product-list">
      <el-table
        v-loading="loading"
        :data="products"
        style="width: 100%"
        :header-cell-style="headerCellStyle"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="70"
        />
        <el-table-column
          prop="name"
          label="商品名称"
          min-width="220"
        >
          <template #default="scope">
            <div class="product-name">
              <img
                :key="`${scope.row.id}-${imageRefreshKey}`"
                :src="getImageUrl(scope.row.images?.[0], imageRefreshKey > 0)"
                alt="商品图片"
                class="product-image"
                @error="(e) => handleImageError(e, DEFAULT_PLACEHOLDER_URL)"
              >
              <span class="product-name-text">{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          width="100"
        >
          <template #default="scope">
            ¥{{ Number(scope.row.price || 0).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="stock"
          label="库存"
          width="80"
        />
        <el-table-column
          label="一级分类"
          width="100"
        >
          <template #default="scope">
            {{ getCategoryLabel(scope.row.category, 1) }}
          </template>
        </el-table-column>
        <el-table-column
          label="二级分类"
          width="100"
        >
          <template #default="scope">
            {{ getCategoryLabel(scope.row.subCategory, 2) }}
          </template>
        </el-table-column>
        <el-table-column
          label="三级分类"
          width="120"
        >
          <template #default="scope">
            {{ getCategoryLabel(scope.row.subSubCategory, 3) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="120"
        >
          <template #default="scope">
            <div class="status-cell">
              <el-icon
                class="status-icon"
                :class="getStatusIconClass(scope.row.status)"
              >
                <svg
                  v-if="scope.row.status === 'approved'"
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                <svg
                  v-else-if="scope.row.status === 'pending'"
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ><circle
                  cx="12"
                  cy="12"
                  r="10"
                /><polyline points="12 6 12 12 16 14" /></svg>
                <svg
                  v-else-if="scope.row.status === 'rejected'"
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ><circle
                  cx="12"
                  cy="12"
                  r="10"
                /><line
                  x1="15"
                  y1="9"
                  x2="9"
                  y2="15"
                /><line
                  x1="9"
                  y1="9"
                  x2="15"
                  y2="15"
                /></svg>
              </el-icon>
              <el-tag
                :type="getStatusType(scope.row.status)"
                size="small"
              >
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="isHot"
          label="热门"
          width="70"
        >
          <template #default="scope">
            <el-tag
              v-if="scope.row.isHot"
              type="danger"
              size="small"
            >
              热门
            </el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="viewCount"
          label="浏览"
          width="70"
        />
        <el-table-column
          v-if="userStore.isAdmin"
          prop="sellerId"
          label="卖家ID"
          width="80"
        />
        <el-table-column
          label="拒绝原因"
          width="120"
        >
          <template #default="scope">
            <div
              v-if="scope.row.status === 'rejected'"
              class="reject-reason-cell"
            >
              <el-tooltip
                :content="scope.row.rejectReason || '无拒绝原因'"
                placement="top"
              >
                <span class="reject-reason-text">{{ truncateText(scope.row.rejectReason || '无', 10) }}</span>
              </el-tooltip>
              <el-button 
                v-if="userStore.isAdmin"
                type="primary" 
                size="small" 
                class="view-detail-btn"
                link
                @click="showRejectDetail(scope.row)"
              >
                详情
              </el-button>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createdAt"
          label="创建时间"
          width="160"
        >
          <template #default="scope">
            {{ formatDateShort(scope.row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120"
          fixed="right"
        >
          <template #default="scope">
            <el-dropdown
              trigger="click"
            >
              <el-button
                type="primary"
                size="small"
                link
              >
                操作
                <el-icon class="el-icon--right">
                  <ArrowDown />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="viewProduct(scope.row.id)">
                    <el-icon><View /></el-icon>
                    查看
                  </el-dropdown-item>
                  <el-dropdown-item 
                    v-if="userStore.hasPermission('product:update')" 
                    @click="editProduct(scope.row.id)"
                  >
                    <el-icon><Edit /></el-icon>
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item 
                    v-if="userStore.hasPermission('product:delete')" 
                    divided
                    @click="deleteProduct(scope.row.id)"
                  >
                    <el-icon><Delete /></el-icon>
                    删除
                  </el-dropdown-item>
                  <el-dropdown-item 
                    v-if="userStore.hasPermission('product:approve') && scope.row.status === 'pending'" 
                    @click="approveProduct(scope.row.id)"
                  >
                    <el-icon><Check /></el-icon>
                    审核
                  </el-dropdown-item>
                  <el-dropdown-item 
                    v-if="userStore.isAdmin" 
                    @click="setHotProduct(scope.row.id, !scope.row.isHot)"
                  >
                    <el-icon><TrendCharts /></el-icon>
                    {{ scope.row.isHot ? '取消热门' : '设为热门' }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div
        v-if="total > 0"
        class="pagination"
      >
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    
    <!-- 审核对话框 -->
    <el-dialog
      v-model="approveDialogVisible"
      title="商品审核"
      width="500px"
    >
      <el-form
        ref="approveFormRef"
        :model="approveForm"
        :rules="approveRules"
        label-width="100px"
      >
        <el-form-item
          label="审核结果"
          prop="status"
        >
          <el-radio-group v-model="approveForm.status">
            <el-radio label="approved">
              通过
            </el-radio>
            <el-radio label="rejected">
              拒绝
            </el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item
          v-if="approveForm.status === 'rejected'"
          label="拒绝类型"
          prop="rejectType"
        >
          <el-select
            v-model="approveForm.rejectType"
            placeholder="请选择拒绝类型"
          >
            <el-option
              label="内容违规"
              value="content"
            />
            <el-option
              label="质量问题"
              value="quality"
            />
            <el-option
              label="价格异常"
              value="price"
            />
            <el-option
              label="分类错误"
              value="category"
            />
            <el-option
              label="版权问题"
              value="copyright"
            />
            <el-option
              label="其他原因"
              value="other"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item
          v-if="approveForm.status === 'rejected'"
          label="拒绝原因"
          prop="rejectReason"
        >
          <el-input
            v-model="approveForm.rejectReason"
            type="textarea"
            placeholder="请输入详细拒绝原因"
            rows="3"
          />
        </el-form-item>
        
        <el-form-item
          v-if="approveForm.status === 'rejected'"
          label="规则依据"
          prop="rejectRule"
        >
          <el-input
            v-model="approveForm.rejectRule"
            type="textarea"
            placeholder="请输入相关规则依据"
            rows="2"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="approveDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="submitApprove"
          >提交</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 拒绝详情弹窗 -->
    <el-dialog
      v-model="rejectDetailVisible"
      title="拒绝详情"
      width="500px"
    >
      <div class="reject-detail-content">
        <el-descriptions
          :column="1"
          border
        >
          <el-descriptions-item label="拒绝类型">
            <el-tag :type="'danger'">
              {{ getRejectTypeText(currentRejectDetail.rejectType) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="详细说明">
            {{ currentRejectDetail.rejectReason || '无详细说明' }}
          </el-descriptions-item>
          <el-descriptions-item label="规则依据">
            {{ currentRejectDetail.rejectRule || '无规则依据' }}
          </el-descriptions-item>
          <el-descriptions-item label="拒绝时间">
            {{ formatDate(currentRejectDetail.rejectedAt) }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="rejectDetailVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 数据统计对话框 -->
    <el-dialog
      v-model="statisticsDialogVisible"
      title="商品数据统计"
      width="85%"
    >
      <div class="statistics-content">
        <div
          v-if="loadingStatistics"
          class="loading-statistics"
        >
          <el-skeleton
            :rows="10"
            animated
          />
        </div>
        <div v-else>
          <!-- 基本统计 -->
          <el-row :gutter="20">
            <el-col :span="6">
              <el-card
                shadow="hover"
                class="stat-card"
              >
                <div class="stat-item">
                  <el-icon class="stat-icon">
                    <Document />
                  </el-icon>
                  <div class="stat-info">
                    <div class="stat-value">
                      {{ statistics.totalProducts }}
                    </div>
                    <div class="stat-label">
                      总商品数
                    </div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card
                shadow="hover"
                class="stat-card"
              >
                <div class="stat-item">
                  <el-icon class="stat-icon">
                    <View />
                  </el-icon>
                  <div class="stat-info">
                    <div class="stat-value">
                      {{ statistics.totalViews }}
                    </div>
                    <div class="stat-label">
                      总浏览次数
                    </div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card
                shadow="hover"
                class="stat-card"
              >
                <div class="stat-item">
                  <el-icon class="stat-icon">
                    <TrendCharts />
                  </el-icon>
                  <div class="stat-info">
                    <div class="stat-value">
                      {{ statistics.hotProductsCount }}
                    </div>
                    <div class="stat-label">
                      热门商品
                    </div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card
                shadow="hover"
                class="stat-card"
              >
                <div class="stat-item">
                  <el-icon class="stat-icon">
                    <Check />
                  </el-icon>
                  <div class="stat-info">
                    <div class="stat-value">
                      {{ approvedCount }}
                    </div>
                    <div class="stat-label">
                      已审核
                    </div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
          
          <!-- 分类分布 -->
          <el-card
            shadow="hover"
            class="category-stat-card"
          >
            <template #header>
              <div class="card-header">
                <span>分类分布</span>
              </div>
            </template>
            <div class="category-stat-container">
              <div
                v-for="stat in statistics.categoryStats"
                :key="stat.category"
                class="category-stat-item"
              >
                <div class="category-info">
                  <span class="category-name">{{ stat.category }}</span>
                  <span class="category-count">{{ stat.count }}个</span>
                </div>
                <el-progress 
                  :percentage="statistics.totalProducts > 0 ? (stat.count / statistics.totalProducts) * 100 : 0" 
                  :color="getProgressColor(statistics.categoryStats.findIndex(s => s.category === stat.category))"
                  :stroke-width="12"
                  class="category-progress"
                />
              </div>
              <div
                v-if="!statistics.categoryStats || statistics.categoryStats.length === 0"
                class="no-data"
              >
                暂无分类数据
              </div>
            </div>
          </el-card>
          
          <!-- 状态分布 -->
          <el-card
            shadow="hover"
            class="status-stat-card"
          >
            <template #header>
              <div class="card-header">
                <span>状态分布</span>
                <el-tag
                  type="info"
                  size="small"
                >
                  更新时间: {{ new Date(statistics.lastUpdated).toLocaleString() }}
                </el-tag>
              </div>
            </template>
            <div class="status-stat-container">
              <div
                v-for="stat in statistics.statusStats"
                :key="stat.status"
                class="status-stat-item"
              >
                <div class="status-info">
                  <span class="status-name">{{ getStatusText(stat.status) }}</span>
                  <span class="status-count">{{ stat.count }}个</span>
                </div>
                <el-progress 
                  :percentage="statistics.totalProducts > 0 ? (stat.count / statistics.totalProducts) * 100 : 0" 
                  :color="getStatStatusColor(stat.status)"
                  :stroke-width="12"
                  class="status-progress"
                />
              </div>
            </div>
          </el-card>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="statisticsDialogVisible = false">
            关闭
          </el-button>
          <el-button
            type="primary"
            @click="refreshStatistics"
          >
            <el-icon><Refresh /></el-icon> 刷新数据
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Search, Edit, Delete, Check, Close, Refresh, DataAnalysis, Document, View, TrendCharts, ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useProductStore } from '../../stores/useProductStore'
import { useUserStore } from '../../stores/useUserStore'
import { message } from '../../utils/message'
import { apiClient } from '../../api'
import { getImageUrl, handleImageError, DEFAULT_PLACEHOLDER_URL } from '../../utils/imageUtils'

const router = useRouter()
const productStore = useProductStore()
const userStore = useUserStore()
const imageRefreshKey = ref(0)

// 数据统计相关
const statisticsDialogVisible = ref(false)
const loadingStatistics = ref(false)
const statistics = ref({
  totalProducts: 0,
  totalViews: 0,
  statusStats: [],
  categoryStats: [],
  hotProductsCount: 0,
  lastUpdated: new Date().toISOString()
})

const approvedCount = computed(() => {
  const stat = statistics.value.statusStats?.find(s => s.status === 'approved')
  return stat?.count || 0
})

const headerCellStyle = computed(() => {
  return {
    background: '#f5f7fa',
    color: '#303133'
  }
})

// 获取进度条颜色
const getProgressColor = (index) => {
  const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399', '#00CED1', '#FF69B4', '#9370DB']
  return colors[index % colors.length]
}

// 获取统计状态颜色
const getStatStatusColor = (status) => {
  switch (status) {
    case 'approved': return '#67C23A'
    case 'pending': return '#E6A23C'
    case 'rejected': return '#F56C6C'
    default: return '#909399'
  }
}

// 打开统计对话框
const openStatisticsDialog = async () => {
  statisticsDialogVisible.value = true
  await loadStatistics()
}

// 加载统计数据
const loadStatistics = async () => {
  loadingStatistics.value = true
  try {
    const response = await apiClient.product.getStats()
    if (response.success && response.data) {
      statistics.value = {
        ...response.data,
        lastUpdated: new Date().toISOString()
      }
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
    ElMessage.error('加载统计数据失败，请稍后重试')
  } finally {
    loadingStatistics.value = false
  }
}

// 刷新统计数据
const refreshStatistics = async () => {
  await loadStatistics()
  ElMessage.success('统计数据已刷新')
}

// 三级分类选项
const level1Options = ref([])
const level2Options = ref([])
const level3Options = ref([])

// 分类树数据
const categoryTree = ref([])

// 筛选表单
const filterForm = ref({
  level1: '',
  level2: '',
  level3: '',
  status: ''
})

// 商品列表
const products = ref([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 分类列表
const categories = productStore.categories

// 审核对话框
const approveDialogVisible = ref(false)

// 审核表单
const approveForm = ref({
  status: 'approved',
  rejectReason: '',
  rejectType: '',
  rejectRule: ''
})
const approveFormRef = ref()
const currentProductId = ref(null)

// 拒绝详情弹窗
const rejectDetailVisible = ref(false)
const currentRejectDetail = ref({
  rejectType: '',
  rejectReason: '',
  rejectRule: '',
  rejectedAt: ''
})

// 审核表单验证规则
const approveRules = {
  status: [
    { required: true, message: '请选择审核结果', trigger: 'change' }
  ],
  rejectReason: [
    { required: true, message: '请输入审核意见', trigger: 'blur', validator: (rule, value, callback) => {
      if (approveForm.value.status === 'rejected' && !value) {
        return callback(new Error('拒绝时必须填写拒绝原因'))
      }
      callback()
    }} 
  ],
  rejectType: [
    { required: true, message: '请选择拒绝类型', trigger: 'blur', validator: (rule, value, callback) => {
      if (approveForm.value.status === 'rejected' && !value) {
        return callback(new Error('拒绝时必须选择拒绝类型'))
      }
      callback()
    }} 
  ]
}

// 加载分类树数据
const loadCategoryTree = async () => {
  try {
    const response = await apiClient.product.getCategoryTree()
    if (response.success && response.data) {
      categoryTree.value = response.data
      // 转换为一级分类选项
      level1Options.value = response.data.map(item => ({
        value: item.key,
        label: item.label
      }))
    }
  } catch (error) {
    console.error('加载分类树失败:', error)
  }
}

// 处理一级分类变化
const handleLevel1Change = () => {
  // 清空二级和三级分类
  filterForm.value.level2 = ''
  filterForm.value.level3 = ''
  level2Options.value = []
  level3Options.value = []
  
  if (filterForm.value.level1) {
    // 查找对应的二级分类
    const level1Item = categoryTree.value.find(item => item.key === filterForm.value.level1)
    if (level1Item && level1Item.children) {
      level2Options.value = level1Item.children.map(item => ({
        value: item.key,
        label: item.label
      }))
    }
  }
}

// 处理二级分类变化
const handleLevel2Change = () => {
  // 清空三级分类
  filterForm.value.level3 = ''
  level3Options.value = []
  
  if (filterForm.value.level1 && filterForm.value.level2) {
    // 查找对应的三级分类
    const level1Item = categoryTree.value.find(item => item.key === filterForm.value.level1)
    if (level1Item && level1Item.children) {
      const level2Item = level1Item.children.find(item => item.key === filterForm.value.level2)
      if (level2Item && level2Item.children) {
        level3Options.value = level2Item.children.map(item => ({
          value: item.key,
          label: item.label
        }))
      }
    }
  }
}

// 备用分类映射表（作为兜底方案）
const fallbackCategoryMap = {
  level1: {
    'edible': '食用菌',
    'medicinal': '药用菌',
    'wild': '野生菌',
    'mushroomBag': '菌包',
    'spawn': '菌种',
    'seasonalBox': '时令菌菇盲盒',
    'other': '菌菇（兜底）',
    'freshMushroom': '新鲜蘑菇',
    'driedMushroom': '干货蘑菇'
  },
  level2: {
    'shiitake': '香菇类',
    'oyster': '平菇类',
    'enoki': '金针菇类',
    'woodEar': '木耳类',
    'kingOyster': '杏鲍菇类',
    'crabFlavor': '蟹味菇类',
    'bambooFungus': '竹荪类',
    'mixed': '混合菌菇',
    'ganoderma': '灵芝类',
    'cordyceps': '冬虫夏草',
    'antler': '鹿茸菇',
    'poria': '茯苓类',
    'otherMedicinal': '其他药用菌',
    'matsutake': '松茸类',
    'bolete': '牛肝菌类',
    'morel': '羊肚菌类',
    'chanterelle': '鸡油菌类',
    'truffle': '松露类',
    'otherWild': '其他野生菌',
    'shiitakeBag': '香菇菌包',
    'oysterBag': '平菇菌包',
    'enokiBag': '金针菇菌包',
    'woodEarBag': '木耳菌包',
    'kingOysterBag': '杏鲍菇菌包',
    'funBag': '趣味菌包',
    'shiitakeSpawn': '香菇菌种',
    'oysterSpawn': '平菇菌种',
    'enokiSpawn': '金针菇菌种',
    'woodEarSpawn': '木耳菌种',
    'otherSpawn': '其他菌种',
    'springBox': '春季盲盒',
    'summerBox': '夏季盲盒',
    'autumnBox': '秋季盲盒',
    'winterBox': '冬季盲盒',
    'custom': '定制商品',
    'processed': '加工食品',
    'misc': '其他',
    'xianggu': '香菇',
    'jinzhen': '金针菇',
    'xingbao': '杏鲍菇',
    'xiewei': '蟹味菇',
    'niugan': '牛肝菌',
    'songrong': '松茸',
    'zhusun': '竹荪',
    'yangdu': '羊肚菌',
    'driedXianggu': '香菇',
    'driedSongrong': '松茸',
    'driedZhusun': '竹荪',
    'driedYangdu': '羊肚菌'
  },
  level3: {
    'xianggu-premium': '特级',
    'xianggu-organic': '有机',
    'jinzhen-organic': '有机',
    'jinzhen-fresh': '新鲜',
    'xingbao-fresh': '新鲜',
    'xingbao-dried': '干货',
    'xiewei-fresh': '新鲜',
    'niugan-black': '黑牛肝',
    'niugan-yellow': '黄牛肝',
    'songrong-wild': '野生',
    'songrong-fresh': '新鲜',
    'zhusun-premium': '精选',
    'zhusun-dried': '干货',
    'yangdu-premium': '精选',
    'yangdu-wild': '野生',
    'driedXianggu-premium': '特级',
    'driedSongrong-wild': '野生',
    'driedZhusun-premium': '精选',
    'driedYangdu-premium': '精选',
    '干香菇': '干香菇',
    '鲜香菇': '鲜香菇',
    '花菇': '花菇',
    '香菇片': '香菇片',
    '香菇酱': '香菇酱',
    '平菇': '平菇',
    '秀珍菇': '秀珍菇',
    '白平菇': '白平菇',
    '灰平菇': '灰平菇',
    '平菇干货': '平菇干货',
    '金针菇': '金针菇',
    '黄金针菇': '黄金针菇',
    '白金针菇': '白金针菇',
    '金针菇干货': '金针菇干货',
    '黑木耳': '黑木耳',
    '白木耳': '白木耳',
    '毛木耳': '毛木耳',
    '小碗耳': '小碗耳',
    '木耳干货': '木耳干货',
    '杏鲍菇': '杏鲍菇',
    '白灵菇': '白灵菇',
    '杏鲍菇切片': '杏鲍菇切片',
    '杏鲍菇干货': '杏鲍菇干货',
    '蟹味菇': '蟹味菇',
    '白玉菇': '白玉菇',
    '海鲜菇': '海鲜菇',
    '真姬菇': '真姬菇',
    '竹荪': '竹荪',
    '长裙竹荪': '长裙竹荪',
    '短裙竹荪': '短裙竹荪',
    '竹荪干货': '竹荪干货',
    '菌菇拼盘': '菌菇拼盘',
    '火锅菌菇组合': '火锅菌菇组合',
    '煲汤菌菇包': '煲汤菌菇包',
    '菌菇礼盒': '菌菇礼盒',
    '赤灵芝': '赤灵芝',
    '紫灵芝': '紫灵芝',
    '灵芝切片': '灵芝切片',
    '灵芝孢子粉': '灵芝孢子粉',
    '灵芝茶': '灵芝茶',
    '虫草花': '虫草花',
    '虫草粉': '虫草粉',
    '虫草胶囊': '虫草胶囊',
    '鹿茸菇干货': '鹿茸菇干货',
    '鹿茸菇粉': '鹿茸菇粉',
    '茯苓块': '茯苓块',
    '茯苓粉': '茯苓粉',
    '茯苓皮': '茯苓皮',
    '茯神': '茯神',
    '猴头菇': '猴头菇',
    '天麻': '天麻',
    '铁皮石斛': '铁皮石斛',
    '蛹虫草': '蛹虫草',
    '新鲜松茸': '新鲜松茸',
    '冻干松茸': '冻干松茸',
    '松茸干片': '松茸干片',
    '松茸酱': '松茸酱',
    '黄牛肝菌': '黄牛肝菌',
    '黑牛肝菌': '黑牛肝菌',
    '白牛肝菌': '白牛肝菌',
    '牛肝菌干货': '牛肝菌干货',
    '新鲜羊肚菌': '新鲜羊肚菌',
    '干羊肚菌': '干羊肚菌',
    '羊肚菌粉': '羊肚菌粉',
    '鸡油菌': '鸡油菌',
    '鸡油菌干货': '鸡油菌干货',
    '鸡油菌酱': '鸡油菌酱',
    '黑松露': '黑松露',
    '白松露': '白松露',
    '松露酱': '松露酱',
    '松露油': '松露油',
    '虎掌菌': '虎掌菌',
    '老人头菌': '老人头菌',
    '鸡枞菌': '鸡枞菌',
    '竹荪蛋': '竹荪蛋',
    '花菇菌包': '花菇菌包',
    '黑香菇菌包': '黑香菇菌包',
    '秀珍菇菌包': '秀珍菇菌包',
    '姬菇菌包': '姬菇菌包',
    '黄金针菌包': '黄金针菌包',
    '白木耳菌包': '白木耳菌包',
    '白灵菇菌包': '白灵菇菌包',
    '蘑菇乐园组合': '蘑菇乐园组合',
    '儿童种植套装': '儿童种植套装',
    'DIY种植礼盒': 'DIY种植礼盒',
    '香菇母种': '香菇母种',
    '香菇原种': '香菇原种',
    '香菇栽培种': '香菇栽培种',
    '平菇母种': '平菇母种',
    '平菇原种': '平菇原种',
    '平菇栽培种': '平菇栽培种',
    '金针菇母种': '金针菇母种',
    '金针菇原种': '金针菇原种',
    '金针菇栽培种': '金针菇栽培种',
    '黑木耳菌种': '黑木耳菌种',
    '白木耳菌种': '白木耳菌种',
    '杏鲍菇菌种': '杏鲍菇菌种',
    '猴头菇菌种': '猴头菇菌种',
    '灵芝菌种': '灵芝菌种',
    '春季尝鲜盒': '春季尝鲜盒',
    '春笋菌菇组合': '春笋菌菇组合',
    '清明菌菇礼包': '清明菌菇礼包',
    '夏季清凉菌菇盒': '夏季清凉菌菇盒',
    '消暑菌菇组合': '消暑菌菇组合',
    '秋季丰收盒': '秋季丰收盒',
    '野生菌菇盲盒': '野生菌菇盲盒',
    '中秋礼盒': '中秋礼盒',
    '冬季滋补盒': '冬季滋补盒',
    '暖冬菌菇礼包': '暖冬菌菇礼包',
    '年货礼盒': '年货礼盒',
    '企业定制礼盒': '企业定制礼盒',
    '专属定制包装': '专属定制包装',
    '菌菇零食': '菌菇零食',
    '菌菇调味品': '菌菇调味品',
    '菌菇罐头': '菌菇罐头',
    '菌菇工艺品': '菌菇工艺品',
    '菌菇相关周边': '菌菇相关周边'
  }
}

// 根据分类key获取中文标签
const getCategoryLabel = (key, level) => {
  if (!key) return '-'
  
  let levelKey = ''
  if (level === 1) levelKey = 'level1'
  else if (level === 2) levelKey = 'level2'
  else if (level === 3) levelKey = 'level3'
  else return key
  
  // 首先尝试从分类树中查找
  if (level === 1) {
    const item = categoryTree.value.find(item => item.key === key)
    if (item?.label) return item.label
  } else if (level === 2) {
    for (const level1 of categoryTree.value) {
      const item = level1.children?.find(child => child.key === key)
      if (item) return item.label
    }
  } else if (level === 3) {
    for (const level1 of categoryTree.value) {
      for (const level2 of level1.children || []) {
        const item = level2.children?.find(child => child.key === key)
        if (item) return item.label
      }
    }
  }
  
  // 如果分类树中找不到，使用备用映射表
  if (fallbackCategoryMap[levelKey] && fallbackCategoryMap[levelKey][key]) {
    return fallbackCategoryMap[levelKey][key]
  }
  
  // 如果都找不到，直接返回key（可能是已经是中文）
  return key
}

// 获取商品列表
const fetchProducts = async () => {
  loading.value = true
  try {
    // 根据用户角色选择接口
    let response
    const params = {
      page: currentPage.value,
      limit: pageSize.value
    }
    
    // 添加状态筛选条件（只有当状态有值时才传递）
    if (filterForm.value.status) {
      params.status = filterForm.value.status
    }
    
    // 添加分类筛选条件
    if (filterForm.value.level1) {
      params.level1 = filterForm.value.level1
    }
    if (filterForm.value.level2) {
      params.level2 = filterForm.value.level2
    }
    if (filterForm.value.level3) {
      params.level3 = filterForm.value.level3
    }
    
    if (userStore.isAdmin) {
      // 管理员查看所有商品
      response = await productStore.getProducts(params)
    } else {
      // 卖家查看自己的商品
      response = await productStore.getSellerProducts(params)
    }
    products.value = productStore.products
    total.value = productStore.total
  } catch (error) {
    message.error(error.message || '获取商品列表失败')
  } finally {
    loading.value = false
  }
}

// 重置筛选
const resetFilter = () => {
  filterForm.value = {
    level1: '',
    level2: '',
    level3: '',
    status: ''
  }
  level2Options.value = []
  level3Options.value = []
  currentPage.value = 1
  fetchProducts()
}

// 分页大小变化
const handleSizeChange = (size) => {
  pageSize.value = size
  fetchProducts()
}

// 当前页变化
const handleCurrentChange = (current) => {
  currentPage.value = current
  fetchProducts()
}

// 获取状态类型
const getStatusType = (status) => {
  switch (status) {
    case 'approved': return 'success'
    case 'pending': return 'warning'
    case 'rejected': return 'danger'
    default: return 'info'
  }
}

// 获取状态图标类名
const getStatusIconClass = (status) => {
  switch (status) {
    case 'approved': return 'status-approved'
    case 'pending': return 'status-pending'
    case 'rejected': return 'status-rejected'
    default: return ''
  }
}

// 获取状态文本
const getStatusText = (status) => {
  switch (status) {
    case 'approved': return '已审核'
    case 'pending': return '待审核'
    case 'rejected': return '已拒绝'
    default: return status
  }
}

// 获取拒绝类型文本
const getRejectTypeText = (type) => {
  const typeMap = {
    'content': '内容违规',
    'quality': '质量问题',
    'price': '价格异常',
    'category': '分类错误',
    'copyright': '版权问题',
    'other': '其他原因'
  }
  return typeMap[type] || type || '未指定'
}

// 截断文本
const truncateText = (text, maxLength) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// 显示拒绝详情
const showRejectDetail = (product) => {
  currentRejectDetail.value = {
    rejectType: product.rejectType,
    rejectReason: product.rejectReason,
    rejectRule: product.rejectRule,
    rejectedAt: product.rejectedAt
  }
  rejectDetailVisible.value = true
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '无'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

// 短日期格式
const formatDateShort = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 查看商品 - 跳转到管理后台编辑页面
const viewProduct = (id) => {
  router.push(`/admin/product/upload?id=${id}`)
}

// 编辑商品
const editProduct = (id) => {
  router.push(`/admin/product/upload?id=${id}`)
}

// 删除商品
const deleteProduct = async (id) => {
  try {
    await productStore.deleteProduct(id)
    message.success('商品删除成功')
    fetchProducts()
  } catch (error) {
    message.error(error.message || '删除失败')
  }
}

// 审核商品
const approveProduct = (id) => {
  currentProductId.value = id
  approveForm.value = {
    status: 'approved',
    reason: ''
  }
  approveDialogVisible.value = true
}

// 设置热门商品
const setHotProduct = async (id, isHot) => {
  try {
    await productStore.setHotProduct(id, isHot)
    message.success(isHot ? '设置为热门商品成功' : '取消热门商品成功')
    fetchProducts()
  } catch (error) {
    message.error(error.message || (isHot ? '设置热门商品失败' : '取消热门商品失败'))
  }
}

// 提交审核
const submitApprove = async () => {
  if (!approveFormRef.value) return
  
  const valid = await approveFormRef.value.validate().catch(() => false)
  if (!valid) return

  try {
    await productStore.approveProduct(currentProductId.value, {
      status: approveForm.value.status,
      rejectReason: approveForm.value.status === 'rejected' ? approveForm.value.rejectReason : '',
      rejectType: approveForm.value.status === 'rejected' ? approveForm.value.rejectType : '',
      rejectRule: approveForm.value.status === 'rejected' ? approveForm.value.rejectRule : ''
    })
    message.success('商品审核成功')
    approveDialogVisible.value = false
    fetchProducts()
  } catch (error) {
    message.error(error.message || '审核失败')
  }
}

onMounted(async () => {
  await loadCategoryTree()
  fetchProducts()
})
</script>

<style scoped>
.product-manage-container {
  padding: 20px 0;
}

.product-manage-container h2 {
  margin-bottom: 20px;
  color: #333;
}

.operation-bar {
  margin-bottom: 20px;
}

.left-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* 筛选部分 */
.filter-section {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 25px;
  margin-bottom: 20px;
}

.filter-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.filter-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 180px;
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.filter-select {
  width: 100%;
}

.filter-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.filter-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.filter-btn.primary:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.filter-btn.reset:hover {
  border-color: #909399;
  color: #909399;
  transform: translateY(-2px);
}

/* 商品列表 */
.product-list {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

/* 分页 */
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 状态样式 */
.status-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-icon {
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-approved {
  color: #67c23a;
}

.status-pending {
  color: #e6a23c;
}

.status-rejected {
  color: #f56c6c;
}

/* 拒绝原因样式 */
.reject-reason-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.reject-reason-text {
  color: #f56c6c;
  font-weight: 500;
  cursor: pointer;
  font-size: 12px;
}

.view-detail-btn {
  margin: 0;
  padding: 0;
}

/* 拒绝详情弹窗样式 */
.reject-detail-content {
  padding: 10px 0;
}

.reject-detail-content .el-descriptions__label {
  font-weight: 600;
  background-color: #f5f7fa;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-form {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .product-list {
    padding: 15px;
  }
  
  .reject-reason-cell {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}

/* 统计相关样式 */
.statistics-content {
  padding: 10px 0;
}

.loading-statistics {
  padding: 20px;
}

.stat-card {
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  font-size: 40px;
  color: #409EFF;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}

.category-stat-card,
.status-stat-card {
  margin-bottom: 20px;
}

.category-stat-container,
.status-stat-container {
  padding: 10px 0;
}

.category-stat-item,
.status-stat-item {
  margin-bottom: 20px;
}

.category-info,
.status-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.category-name,
.status-name {
  font-size: 15px;
  font-weight: 500;
  color: #303133;
}

.category-count,
.status-count {
  font-size: 14px;
  color: #909399;
  background: #f5f7fa;
  padding: 4px 12px;
  border-radius: 12px;
}

.category-progress,
.status-progress {
  margin-top: 5px;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #909399;
  font-size: 14px;
}

.product-name {
  display: flex;
  align-items: center;
  gap: 10px;
}

.product-image {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
  background-color: #f5f7fa;
}

.product-name-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 160px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
