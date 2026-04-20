<template>
  <div class="product-upload-container">
    <div class="page-header">
      <h2>{{ isEdit ? '编辑商品' : '上传商品' }}</h2>
      <el-badge v-if="!userStore.isAdmin" type="info" :value="`已授权 ${permissionKeys.size} 个分类`" />
    </div>
    
    <div v-loading="productStore.loading" class="upload-form">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <!-- 商品基本信息 -->
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商品名称" size="large" />
        </el-form-item>
        
        <!-- 分类选择区域 -->
        <div class="category-section">
          <div class="section-header">
            <span class="section-title">商品分类</span>
            <el-tooltip content="选择商品所属分类层级，您只能上传已授权分类下的商品" placement="top">
              <el-button type="text" size="small" class="help-btn">
                <el-icon :size="18"><HelpFilled /></el-icon>
              </el-button>
            </el-tooltip>
          </div>
          
          <el-form-item label="一级分类" prop="category">
            <el-select
              v-model="form.category"
              placeholder="请选择一级分类"
              size="large"
              @change="handleCategoryChange"
              :disabled="isEdit && !userStore.isAdmin"
            >
              <el-option
                v-for="category in level1Categories"
                :key="category.key"
                :value="category.key"
                :label="getCategoryLabel(category)"
              />
            </el-select>
            <div v-if="level1Categories.length > 0 && !userStore.isAdmin" class="permission-hint">
              <el-tag type="info" size="small">您只能上传已授权分类下的商品</el-tag>
              <el-button
                type="text"
                size="small"
                @click="goToCategoryPermission"
                class="permission-link"
              >
                查看/申请权限 →
              </el-button>
            </div>
          </el-form-item>
          
          <el-form-item label="二级分类" prop="subCategory">
            <el-select
              v-model="form.subCategory"
              placeholder="请选择二级分类"
              size="large"
              :disabled="!form.category"
              @change="handleSubCategoryChange"
            >
              <template #empty>
                <span v-if="!form.category">请先选择一级分类</span>
                <span v-else-if="level2Categories.length === 0 && !userStore.isAdmin">
                  您暂无该分类下的二级分类权限，请先申请权限
                </span>
                <span v-else>暂无二级分类数据</span>
              </template>
              <el-option
                v-for="category in level2Categories"
                :key="category.key"
                :value="category.key"
                :label="getCategoryLabel(category)"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="三级分类" prop="subSubCategory">
            <el-select
              v-model="form.subSubCategory"
              placeholder="请选择三级分类（可选）"
              size="large"
              :disabled="!form.subCategory"
            >
              <template #empty>
                <span v-if="!form.subCategory">请先选择二级分类</span>
                <span v-else>暂无三级分类数据</span>
              </template>
              <el-option
                v-for="category in level3Categories"
                :key="category.key"
                :value="category.key"
                :label="getCategoryLabel(category)"
              />
            </el-select>
          </el-form-item>
        </div>
        
        <el-form-item label="商品价格" prop="price">
          <el-input-number v-model="form.price" :min="0.01" :step="0.01" :precision="2" size="large" />
        </el-form-item>
        
        <el-form-item label="库存数量" prop="stock">
          <el-input-number v-model="form.stock" :min="0" size="large" />
        </el-form-item>
        
        <!-- 商品描述 -->
        <el-form-item label="商品描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="5" placeholder="请输入商品描述" size="large" />
        </el-form-item>
        
        <!-- 商品图片 -->
        <el-form-item label="商品图片" prop="images">
          <div class="upload-tip">
            <el-icon :size="16"><PictureFilled /></el-icon>
            <span>支持 JPG、PNG、WebP 格式，单张图片不超过 5MB，最多上传 5 张</span>
          </div>
          <el-upload
            v-model:file-list="fileList"
            :action="uploadUrl"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :before-upload="beforeUpload"
            multiple
            :limit="5"
            :on-exceed="handleExceed"
            list-type="picture-card"
            :on-remove="handleRemove"
            name="files"
          >
            <template #default="{ file }">
              <img
                :src="getImageUrl(file?.url ?? file?.url)"
                class="upload-image"
                @error="(e) => handleImageError(e, DEFAULT_PLACEHOLDER_URL)"
              >
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePreview(file)">
                  <el-icon :size="18"><ZoomIn /></el-icon>
                </span>
                <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                  <el-icon :size="18"><Delete /></el-icon>
                </span>
              </span>
            </template>
            <template #trigger>
              <el-icon :size="24" class="upload-icon"><Plus /></el-icon>
              <div class="upload-text">上传图片</div>
            </template>
          </el-upload>
        </el-form-item>
        
        <!-- 表单按钮 -->
        <el-form-item class="form-actions">
          <el-button type="primary" @click="submitForm" :loading="submitting">
            {{ isEdit ? '保存修改' : '上传商品' }}
          </el-button>
          <el-button @click="goBack">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 图片预览弹窗 -->
    <el-dialog v-model="previewDialogVisible" title="图片预览" width="80%">
      <img :src="previewImageUrl" class="preview-image" />
    </el-dialog>
  </div>
</template>

<script setup>import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { HelpFilled, PictureFilled, ZoomIn, Delete, Plus } from '@element-plus/icons-vue';
import { useProductStore } from '../../stores/useProductStore';
import { useUserStore } from '../../stores/useUserStore';
import { apiClient } from '../../api';
const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const userStore = useUserStore();
const isEdit = computed(() => !!route.query.id);
const form = ref({
 name: '',
 category: '',
 subCategory: '',
 subSubCategory: '',
 price: 0,
 stock: 0,
 description: '',
 images: []
});
const fileList = ref([]);
const formRef = ref(null);
const submitting = ref(false);
const level1Categories = ref([]);
const level2Categories = ref([]);
const level3Categories = ref([]);
const allCategories = ref([]);
const userPermissions = ref([]);
const permissionKeys = ref(new Set());
const previewDialogVisible = ref(false);
const previewImageUrl = ref('');
const uploadUrl = 'http://localhost:3303/api/upload';
const DEFAULT_PLACEHOLDER_URL = 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=mushroom%20product%20placeholder%20image&image_size=square_hd';
const loadLevel1Categories = async () => {
 try {
 const [categoriesRes, allCatRes] = await Promise.all([
 apiClient.product.getCategories(),
 apiClient.seller.getAvailableCategories()
 ]);

 if (allCatRes.success && allCatRes.data) {
 allCategories.value = flattenCategories(allCatRes.data);
 }

 if (categoriesRes.success && categoriesRes.data) {
 let categories = categoriesRes.data;
 if (!userStore.isAdmin) {
 await loadUserPermissions();
 if (permissionKeys.value.size > 0 && allCategories.value.length > 0) {
 const validLevel1Keys = new Set();
 permissionKeys.value.forEach(key => {
 const category = allCategories.value.find(c => c.key === key);
 if (category) {
 if (category.level === 1) {
 validLevel1Keys.add(key);
 } else if (category.parentKey) {
 const parentCategory = allCategories.value.find(c => c.key === category.parentKey);
 if (parentCategory && parentCategory.level === 1) {
 validLevel1Keys.add(parentCategory.key);
 }
 }
 }
 });
 if (validLevel1Keys.size > 0) {
 categories = categories.filter(cat => validLevel1Keys.has(cat.key));
 }
 }
 }
 level1Categories.value = categories;
 }
 }
 catch (error) {
 console.error('加载一级分类失败:', error);
 }
};
const flattenCategories = (categories) => {
 if (!categories || !Array.isArray(categories)) {
 return [];
 }
 const result = [];
 const traverse = (node) => {
 result.push({
 key: node.key,
 label: node.label,
 level: node.level,
 parentKey: node.parentKey
 });
 if (node.children && Array.isArray(node.children)) {
 node.children.forEach(traverse);
 }
 };
 categories.forEach(traverse);
 return result;
};
const loadUserPermissions = async () => {
 try {
 const response = await apiClient.seller.getPermissionKeys();
 if (response.success && response.data) {
 userPermissions.value = response.data;
 if (response.data.allKeys && Array.isArray(response.data.allKeys)) {
 permissionKeys.value = new Set(response.data.allKeys);
 } else if (response.data.keys && Array.isArray(response.data.keys)) {
 permissionKeys.value = new Set(response.data.keys);
 } else if (Array.isArray(response.data)) {
 permissionKeys.value = new Set(response.data);
 }
 }
 }
 catch (error) {
 console.error('加载用户权限失败:', error);
 }
};
const getCategoryLabel = (category) => {
 if (userStore.isAdmin) {
 return category.label;
 }
 if (permissionKeys.value.has(category.key)) {
 return category.label;
 }
 const hasChildPermission = allCategories.value.some(c => c.parentKey === category.key && permissionKeys.value.has(c.key));
 if (hasChildPermission) {
 return category.label;
 }
 return category.label + ' (无权限)';
};
const loadLevel2Categories = async (level1Key) => {
 level2Categories.value = [];
 level3Categories.value = [];
 form.value.subCategory = '';
 form.value.subSubCategory = '';
 if (!level1Key)
 return;
 try {
 const response = await apiClient.product.getLevel2Categories(level1Key);
 if (response.success && response.data) {
 let categories = response.data;
 if (!userStore.isAdmin) {
 categories = categories.filter(cat => 
 permissionKeys.value.has(cat.key) || 
 allCategories.value.some(c => c.parentKey === cat.key && permissionKeys.value.has(c.key))
 );
 }
 level2Categories.value = categories;
 }
 }
 catch (error) {
 console.error('加载二级分类失败:', error);
 }
};
const loadLevel3Categories = async (level2Key) => {
 level3Categories.value = [];
 form.value.subSubCategory = '';
 if (!level2Key)
 return;
 try {
 const response = await apiClient.product.getLevel3Categories(level2Key);
 if (response.success && response.data) {
 let categories = response.data;
 if (!userStore.isAdmin) {
 categories = categories.filter(cat => permissionKeys.value.has(cat.key));
 }
 level3Categories.value = categories;
 }
 }
 catch (error) {
 console.error('加载三级分类失败:', error);
 }
};
const handleCategoryChange = async (value) => {
 await loadLevel2Categories(value);
};
const handleSubCategoryChange = async (value) => {
 await loadLevel3Categories(value);
};
const goToCategoryPermission = () => {
 router.push('/seller/category-permission');
};
const goBack = () => {
 router.back();
};
const rules = {
 name: [
 { required: true, message: '请输入商品名称', trigger: 'blur' },
 { min: 2, max: 100, message: '商品名称长度在2-100个字符之间', trigger: 'blur' }
 ],
 category: [
 { required: true, message: '请选择一级分类', trigger: 'change' }
 ],
 subCategory: [
 { required: true, message: '请选择二级分类', trigger: 'change' }
 ],
 price: [
 { required: true, message: '请输入商品价格', trigger: 'blur' },
 { type: 'number', min: 0.01, message: '商品价格必须大于0', trigger: 'blur' }
 ],
 stock: [
 { required: true, message: '请输入库存数量', trigger: 'blur' },
 { type: 'number', min: 0, message: '库存数量必须大于等于0', trigger: 'blur' }
 ],
 description: [
 { required: true, message: '请输入商品描述', trigger: 'blur' },
 { min: 10, message: '商品描述至少10个字符', trigger: 'blur' }
 ],
 images: [
 { required: true, message: '请上传至少一张商品图片', trigger: 'change' }
 ]
};
watch(fileList, (newList) => {
 form.value.images = newList.map(file => file?.url ?? '').filter(url => url);
}, { deep: true });
const beforeUpload = (file) => {
 const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
 const isAllowed = allowedTypes.includes(file.type);
 if (!isAllowed) {
 ElMessage.error('只能上传JPG、PNG或WebP图片');
 return false;
 }
 const isLt5M = file.size / 1024 / 1024 < 5;
 if (!isLt5M) {
 ElMessage.error('图片大小不能超过5MB');
 return false;
 }
 return true;
};
const handleUploadSuccess = (response, file) => {
 try {
 if (response.success && response.data && Array.isArray(response.data) && response.data.length > 0) {
 const filePath = response.data[0].path || response.data[0].url;
 if (filePath) {
 file.url = filePath;
 ElMessage.success('图片上传成功');
 }
 else {
 file.url = '';
 ElMessage.error('图片上传失败：返回数据格式不正确');
 }
 }
 else {
 file.url = '';
 ElMessage.error('图片上传失败：返回数据格式不正确');
 }
 }
 catch (error) {
 file.url = '';
 ElMessage.error('图片上传失败：处理响应数据时出错');
 }
};
const handleUploadError = (error, file) => {
 file.url = '';
 let errorMessage = '图片上传失败';
 if (error && error.response) {
 const { status, data } = error.response;
 if (data && data.error) {
 errorMessage = data.error;
 }
 else if (status === 400) {
 errorMessage = '请求参数错误';
 }
 else if (status === 500) {
 errorMessage = '服务器内部错误';
 }
 else if (status === 413) {
 errorMessage = '文件大小超过限制';
 }
 }
 else if (error && error.message) {
 if (error.message.includes('Network Error')) {
 errorMessage = '网络错误';
 }
 }
 ElMessage.error(errorMessage);
};
const handleExceed = () => {
 ElMessage.error('最多只能上传5张图片');
};
const handlePreview = (file) => {
 if (file?.url) {
 previewImageUrl.value = file.url;
 previewDialogVisible.value = true;
 }
};
const handleRemove = () => {
 form.value.images = fileList.value.map(file => file?.url ?? '').filter(url => url);
};
const getImageUrl = (url) => {
 if (!url)
 return DEFAULT_PLACEHOLDER_URL;
 return url.startsWith('http') ? url : `http://localhost:3303${url}`;
};
const handleImageError = (e, fallbackUrl) => {
 e.target.src = fallbackUrl;
};
const submitForm = async () => {
 if (!formRef.value)
 return;
 const valid = await formRef.value.validate().catch(() => false);
 if (!valid)
 return;
 if (!userStore.isAdmin) {
 const hasCategoryPermission = permissionKeys.value.has(form.value.category) || 
 allCategories.value.some(c => c.parentKey === form.value.category && permissionKeys.value.has(c.key));
 const hasSubCategoryPermission = !form.value.subCategory || permissionKeys.value.has(form.value.subCategory) ||
 (form.value.subCategory && allCategories.value.some(c => c.parentKey === form.value.subCategory && permissionKeys.value.has(c.key)));
 const hasSubSubCategoryPermission = !form.value.subSubCategory || permissionKeys.value.has(form.value.subSubCategory);
 if (!hasCategoryPermission) {
 ElMessage.error('您没有该一级分类的上传权限，请先申请权限');
 return;
 }
 if (!hasSubCategoryPermission) {
 ElMessage.error('您没有该二级分类的上传权限，请先申请权限');
 return;
 }
 if (!hasSubSubCategoryPermission) {
 ElMessage.error('您没有该三级分类的上传权限，请先申请权限');
 return;
 }
 }
 submitting.value = true;
 try {
 if (isEdit.value) {
 await productStore.updateProduct(route.query.id, form.value);
 ElMessage.success('商品修改成功');
 ElMessageBox.confirm('商品修改成功，是否前往商品管理页面？', '提示', {
 confirmButtonText: '前往管理',
 cancelButtonText: '继续编辑',
 type: 'success'
 }).then(() => {
 router.push('/admin/products');
 }).catch(() => {
 });
 }
else {
const result = await productStore.createProduct(form.value);
const statusText = result?.data?.status === 'pending' ? '待审核' : '已审核';
const statusColor = result?.data?.status === 'pending' ? '#E6A23C' : '#67C23A';
ElMessage.success({
message: `商品上传成功！当前状态：<span style="color: ${statusColor}; font-weight: bold;">${statusText}</span>`,
dangerouslyUseHTMLString: true
});
ElMessageBox.confirm('商品上传成功，是否继续上传？', '提示', {
 confirmButtonText: '继续上传',
 cancelButtonText: '返回列表',
 type: 'success'
 }).then(() => {
 form.value = {
 name: '',
 category: '',
 subCategory: '',
 subSubCategory: '',
 price: 0,
 stock: 0,
 description: '',
 images: []
 };
 fileList.value = [];
 }).catch(() => {
 router.push('/admin/products');
 });
 }
 }
 catch (error) {
 console.error('提交失败:', error);
 ElMessage.error(error.message || '提交失败，请稍后重试');
 }
 finally {
 submitting.value = false;
 }
};
onMounted(async () => {
 if (!userStore.isAdmin) {
 await loadUserPermissions();
 }
 await loadLevel1Categories();
 if (isEdit.value && route.query.id) {
 try {
 const response = await apiClient.product.getDetail(route.query.id);
 if (response.success && response.data) {
 const product = response.data;
 form.value = {
 name: product.name || '',
 category: product.category || '',
 subCategory: product.subCategory || '',
 subSubCategory: product.subSubCategory || '',
 price: product.price || 0,
 stock: product.stock || 0,
 description: product.description || '',
 images: product.images || []
 };
 fileList.value = (product.images || []).map(url => ({ url }));
 if (product.category) {
 await loadLevel2Categories(product.category);
 if (product.subCategory) {
 await loadLevel3Categories(product.subCategory);
 }
 }
 }
 }
 catch (error) {
 console.error('加载商品详情失败:', error);
 }
 }
});
</script>

<style scoped>
.product-upload-container {
  padding: 20px 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  color: #333;
}

.upload-form {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.category-section {
  background: #fafafa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.section-title {
  font-weight: 600;
  color: #303133;
}

.help-btn {
  padding: 0;
  color: #606266;
}

.upload-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-icon {
  color: #67c23a;
}

.upload-text {
  font-size: 14px;
  color: #999;
  margin-top: 8px;
}

.upload-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 13px;
  color: #999;
}

.permission-hint {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
}

.permission-link {
  color: #409eff;
  padding: 0;
  font-size: 13px;
}

.form-actions {
  display: flex;
  gap: 12px;
  padding-top: 20px;
}

.preview-image {
  width: 100%;
  max-height: 600px;
  object-fit: contain;
}

@media (max-width: 768px) {
  .upload-form {
    padding: 20px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .category-section {
    padding: 15px;
  }
}
</style>