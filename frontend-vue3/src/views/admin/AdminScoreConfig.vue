<template>
  <div class="admin-score-config">
    <div class="page-header">
      <h1>评分权重配置</h1>
      <p class="page-description">
        调整作品评分的各项指标权重，权重总和必须为1
      </p>
    </div>

    <div class="config-container">
      <el-card class="config-card">
        <template #header>
          <div class="card-header">
            <span>当前评分权重配置</span>
            <div
              v-if="isAdmin"
              class="header-buttons"
            >
              <el-button 
                @click="cancelConfig"
              >
                取消
              </el-button>
              <el-button 
                type="primary" 
                :loading="isSaving"
                @click="saveConfig"
              >
                保存配置
              </el-button>
            </div>
            <div
              v-else
              class="header-buttons"
            >
              <el-button
                type="info"
                disabled
              >
                仅管理员可编辑
              </el-button>
            </div>
          </div>
        </template>

        <div class="config-form">
          <el-form
            :model="scoreConfig"
            label-width="120px"
          >
            <el-form-item
              v-if="isAdmin"
              label="预设模板"
            >
              <el-select
                v-model="selectedTemplate"
                placeholder="选择预设模板"
                @change="applyTemplate"
              >
                <el-option
                  label="均衡评分"
                  value="balanced"
                />
                <el-option
                  label="重视近期评分"
                  value="recency"
                />
                <el-option
                  label="重视作品质量"
                  value="quality"
                />
                <el-option
                  label="重视用户互动"
                  value="interaction"
                />
              </el-select>
              <div class="weight-desc">
                快速应用预设的权重配置模板
              </div>
            </el-form-item>

            <el-form-item label="作品评分权重">
              <el-slider 
                v-model="scoreConfig.ratingWeight" 
                :min="0" 
                :max="1" 
                :step="0.01"
                show-input
                :input-size="'small'"
                :disabled="!isAdmin"
                @change="updateTotalWeight"
              />
              <div class="weight-desc">
                基于作品本身的评分（1-5星），权重越高，作品本身质量对评分影响越大
              </div>
            </el-form-item>

            <el-form-item label="用户互动权重">
              <el-slider 
                v-model="scoreConfig.interactionWeight" 
                :min="0" 
                :max="1" 
                :step="0.01"
                show-input
                :input-size="'small'"
                :disabled="!isAdmin"
                @change="updateTotalWeight"
              />
              <div class="weight-desc">
                基于点赞、评论、收藏等用户互动数据，权重越高，用户互动对评分影响越大
              </div>
            </el-form-item>

            <el-form-item label="作品质量权重">
              <el-slider 
                v-model="scoreConfig.qualityWeight" 
                :min="0" 
                :max="1" 
                :step="0.01"
                show-input
                :input-size="'small'"
                :disabled="!isAdmin"
                @change="updateTotalWeight"
              />
              <div class="weight-desc">
                基于作品描述长度和图片质量，权重越高，作品内容质量对评分影响越大
              </div>
            </el-form-item>

            <el-form-item label="创新性权重">
              <el-slider 
                v-model="scoreConfig.creativityWeight" 
                :min="0" 
                :max="1" 
                :step="0.01"
                show-input
                :input-size="'small'"
                :disabled="!isAdmin"
                @change="updateTotalWeight"
              />
              <div class="weight-desc">
                基于作品的创新性和独特性，权重越高，作品创意对评分影响越大
              </div>
            </el-form-item>

            <el-form-item label="时效性权重">
              <el-slider 
                v-model="scoreConfig.recencyWeight" 
                :min="0" 
                :max="1" 
                :step="0.01"
                show-input
                :input-size="'small'"
                :disabled="!isAdmin"
                @change="updateTotalWeight"
              />
              <div class="weight-desc">
                基于作品发布时间的新鲜度，权重越高，新作品对评分影响越大
              </div>
            </el-form-item>

            <el-form-item label="权重总和">
              <el-input 
                v-model="totalWeight" 
                disabled 
                :class="{ 'weight-error': Math.abs(totalWeight - 1) > 0.01 }"
              />
              <div 
                v-if="Math.abs(totalWeight - 1) > 0.01 && isAdmin" 
                class="weight-warning"
              >
                权重总和必须为1，请调整各项权重
              </div>
            </el-form-item>

            <el-form-item
              v-if="isAdmin"
              label="变更原因"
            >
              <el-input 
                v-model="changeReason" 
                type="textarea" 
                placeholder="请输入配置变更的原因（可选）"
                :rows="3"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-card>

      <div class="config-preview">
        <el-card class="preview-card">
          <template #header>
            <span>权重分布预览</span>
          </template>
          <div
            class="preview-chart"
            style="height: 300px;"
          />
        </el-card>
      </div>

      <div class="config-logs">
        <el-card class="logs-card">
          <template #header>
            <span>配置变更日志</span>
          </template>
          <el-table
            :data="configLogs"
            style="width: 100%"
          >
            <el-table-column
              prop="createdAt"
              label="变更时间"
              width="180"
            />
            <el-table-column
              prop="operatorName"
              label="操作人"
              width="120"
            />
            <el-table-column
              prop="changeReason"
              label="变更原因"
            />
            <el-table-column
              label="操作"
              width="120"
            >
              <template #default="scope">
                <el-button 
                  type="text" 
                  size="small" 
                  @click="showConfigDetails(scope.row)"
                >
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>

    <el-dialog
      v-model="showDetailsDialog"
      title="配置变更详情"
      width="60%"
    >
      <div class="config-details">
        <div class="details-section">
          <h3>变更前配置</h3>
          <el-table
            :data="oldConfigData"
            style="width: 100%"
          >
            <el-table-column
              prop="name"
              label="指标"
              width="150"
            />
            <el-table-column
              prop="weight"
              label="权重"
              width="100"
            />
            <el-table-column
              prop="percentage"
              label="百分比"
            />
          </el-table>
        </div>
        <div class="details-section">
          <h3>变更后配置</h3>
          <el-table
            :data="newConfigData"
            style="width: 100%"
          >
            <el-table-column
              prop="name"
              label="指标"
              width="150"
            />
            <el-table-column
              prop="weight"
              label="权重"
              width="100"
            />
            <el-table-column
              prop="percentage"
              label="百分比"
            />
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { apiClient } from '../../api/index.js'
import * as echarts from 'echarts'

const scoreConfig = ref({
  ratingWeight: 0.3,
  interactionWeight: 0.25,
  qualityWeight: 0.2,
  creativityWeight: 0.15,
  recencyWeight: 0.1
})
const originalScoreConfig = ref({
  ratingWeight: 0.3,
  interactionWeight: 0.25,
  qualityWeight: 0.2,
  creativityWeight: 0.15,
  recencyWeight: 0.1
})
const totalWeight = ref(1)
const changeReason = ref('')
const isSaving = ref(false)
const configLogs = ref([])
const showDetailsDialog = ref(false)
const oldConfigData = ref([])
const newConfigData = ref([])
const previewChart = ref(null)
const currentUser = ref(null)
const isAdmin = ref(false)
const selectedTemplate = ref('')

const templates = {
  balanced: {
    ratingWeight: 0.3,
    interactionWeight: 0.25,
    qualityWeight: 0.2,
    creativityWeight: 0.15,
    recencyWeight: 0.1
  },
  recency: {
    ratingWeight: 0.2,
    interactionWeight: 0.2,
    qualityWeight: 0.15,
    creativityWeight: 0.15,
    recencyWeight: 0.3
  },
  quality: {
    ratingWeight: 0.25,
    interactionWeight: 0.2,
    qualityWeight: 0.3,
    creativityWeight: 0.15,
    recencyWeight: 0.1
  },
  interaction: {
    ratingWeight: 0.2,
    interactionWeight: 0.35,
    qualityWeight: 0.2,
    creativityWeight: 0.15,
    recencyWeight: 0.1
  }
}

const applyTemplate = (templateValue) => {
  if (templateValue && templates[templateValue]) {
    scoreConfig.value = { ...templates[templateValue] }
    updateTotalWeight()
    const templateNames = { balanced: '均衡评分', recency: '重视近期评分', quality: '重视作品质量', interaction: '重视用户互动' }
    ElMessage.success(`已应用"${templateNames[templateValue]}"模板`)
  }
  selectedTemplate.value = ''
}

const updateTotalWeight = () => {
  totalWeight.value = Object.values(scoreConfig.value).reduce((sum, weight) => {
    return sum + parseFloat(weight)
  }, 0)
  totalWeight.value = parseFloat(totalWeight.value.toFixed(2))
  updatePreviewChart()
}

const updatePreviewChart = async () => {
  await nextTick()
  const chartDom = document.querySelector('.preview-chart')
  if (!chartDom) return
  
  if (previewChart.value) {
    previewChart.value.dispose()
  }
  
  previewChart.value = echarts.init(chartDom)
  
  const data = [
    { name: '作品评分', value: scoreConfig.value.ratingWeight * 100 },
    { name: '用户互动', value: scoreConfig.value.interactionWeight * 100 },
    { name: '作品质量', value: scoreConfig.value.qualityWeight * 100 },
    { name: '创新性', value: scoreConfig.value.creativityWeight * 100 },
    { name: '时效性', value: scoreConfig.value.recencyWeight * 100 }
  ]
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}% ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '评分权重',
        type: 'pie',
        radius: '60%',
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  
  previewChart.value.setOption(option)
}

const saveConfig = async () => {
  if (Math.abs(totalWeight.value - 1) > 0.01) {
    ElMessage.error('权重总和必须为1，请调整各项权重')
    return
  }
  
  isSaving.value = true
  try {
    const response = await apiClient.work.updateScoreConfig({
      ...scoreConfig.value,
      changeReason: changeReason.value
    })
    
    ElMessage.success(response.message || '配置保存成功')
    await fetchScoreConfig()
    changeReason.value = ''
  } catch (error) {
    let errorMessage = '保存配置失败，请稍后重试'
    if (error.message.includes('权重总和必须为1')) {
      errorMessage = '权重总和必须为1，请调整各项权重'
    } else if (error.message.includes('权重必须在0-1之间')) {
      errorMessage = '评分权重必须在0-1之间，请调整'
    } else if (error.message.includes('网络')) {
      errorMessage = '网络连接失败，请检查网络设置'
    } else if (error.message.includes('未授权')) {
      errorMessage = '权限不足，无法更新评分配置'
    }
    ElMessage.error(errorMessage)
  } finally {
    isSaving.value = false
  }
}

const cancelConfig = () => {
  scoreConfig.value = { ...originalScoreConfig.value }
  updateTotalWeight()
  updatePreviewChart()
  changeReason.value = ''
  ElMessage.success('已取消修改，恢复到原始配置')
}

const fetchScoreConfig = async () => {
  try {
    const response = await apiClient.work.getScoreConfig()
    if (response.success && response.data) {
      const numericConfig = {
        ratingWeight: parseFloat(response.data.ratingWeight) || 0,
        interactionWeight: parseFloat(response.data.interactionWeight) || 0,
        qualityWeight: parseFloat(response.data.qualityWeight) || 0,
        creativityWeight: parseFloat(response.data.creativityWeight) || 0,
        recencyWeight: parseFloat(response.data.recencyWeight) || 0
      }
      scoreConfig.value = numericConfig
      originalScoreConfig.value = { ...numericConfig }
      updateTotalWeight()
    }
  } catch (error) {
    console.error('获取配置失败:', error)
    ElMessage.error('获取配置失败，请稍后重试')
  }
}

const showConfigDetails = (log) => {
  oldConfigData.value = [
    { name: '作品评分', weight: log.oldConfig.ratingWeight, percentage: `${(log.oldConfig.ratingWeight * 100).toFixed(1)}%` },
    { name: '用户互动', weight: log.oldConfig.interactionWeight, percentage: `${(log.oldConfig.interactionWeight * 100).toFixed(1)}%` },
    { name: '作品质量', weight: log.oldConfig.qualityWeight, percentage: `${(log.oldConfig.qualityWeight * 100).toFixed(1)}%` },
    { name: '创新性', weight: log.oldConfig.creativityWeight, percentage: `${(log.oldConfig.creativityWeight * 100).toFixed(1)}%` },
    { name: '时效性', weight: log.oldConfig.recencyWeight, percentage: `${(log.oldConfig.recencyWeight * 100).toFixed(1)}%` }
  ]
  
  newConfigData.value = [
    { name: '作品评分', weight: log.newConfig.ratingWeight, percentage: `${(log.newConfig.ratingWeight * 100).toFixed(1)}%` },
    { name: '用户互动', weight: log.newConfig.interactionWeight, percentage: `${(log.newConfig.interactionWeight * 100).toFixed(1)}%` },
    { name: '作品质量', weight: log.newConfig.qualityWeight, percentage: `${(log.newConfig.qualityWeight * 100).toFixed(1)}%` },
    { name: '创新性', weight: log.newConfig.creativityWeight, percentage: `${(log.newConfig.creativityWeight * 100).toFixed(1)}%` },
    { name: '时效性', weight: log.newConfig.recencyWeight, percentage: `${(log.newConfig.recencyWeight * 100).toFixed(1)}%` }
  ]
  
  showDetailsDialog.value = true
}

const fetchUserInfo = async () => {
  try {
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      currentUser.value = JSON.parse(userInfo)
      isAdmin.value = currentUser.value.role === 'admin'
    } else {
      const response = await apiClient.user.getInfo()
      currentUser.value = response.data
      isAdmin.value = currentUser.value.role === 'admin'
      localStorage.setItem('userInfo', JSON.stringify(currentUser.value))
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    isAdmin.value = false
  }
}

const fetchConfigLogs = async () => {
  try {
    const response = await apiClient.work.getScoreConfigLogs()
    if (response.success && response.data) {
      configLogs.value = response.data
    }
  } catch (error) {
    console.error('获取配置变更日志失败:', error)
    ElMessage.error('获取配置变更日志失败，请稍后重试')
  }
}

const handleResize = () => {
  if (previewChart.value) {
    previewChart.value.resize()
  }
}

onMounted(async () => {
  await fetchUserInfo()
  await fetchScoreConfig()
  await fetchConfigLogs()
  
  setTimeout(() => {
    updatePreviewChart()
  }, 100)
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (previewChart.value) {
    previewChart.value.dispose()
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.admin-score-config {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.page-description {
  font-size: 1rem;
  color: #7f8c8d;
  margin: 0;
}

.config-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.config-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
}

.config-form {
  padding: 20px 0;
}

.weight-desc {
  margin-top: 8px;
  font-size: 0.9rem;
  color: #7f8c8d;
  line-height: 1.4;
}

.weight-error {
  border-color: #f56c6c !important;
}

.weight-warning {
  margin-top: 8px;
  font-size: 0.85rem;
  color: #f56c6c;
}

.config-preview {
  margin-top: 20px;
}

.preview-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.config-logs {
  margin-top: 20px;
}

.logs-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.config-details {
  display: flex;
  gap: 40px;
}

.details-section {
  flex: 1;
}

.details-section h3 {
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 15px;
}

@media (max-width: 768px) {
  .admin-score-config {
    padding: 20px 15px;
  }

  .page-header h1 {
    font-size: 1.5rem;
  }

  .config-details {
    flex-direction: column;
    gap: 20px;
  }
}
</style>