import axios from 'axios'

const env = import.meta.env

const api = axios.create({
  baseURL: env.VITE_API_URL ? `${env.VITE_API_URL}/api` : 'http://localhost:3303/api',
  timeout: parseInt(env.VITE_API_TIMEOUT) || 60000,
  headers: {
    'Content-Type': 'application/json'
  },
  retry: parseInt(env.VITE_API_RETRY_COUNT) || 3,
  retryDelay: (retryCount) => Math.min(2000 * 2 ** retryCount, 20000),
  requestState: {
    isRateLimited: false,
    rateLimitResetTime: 0
  }
})

api.interceptors.request.use(
  config => {
    const now = Date.now()
    if (api.defaults.requestState.isRateLimited && now < api.defaults.requestState.rateLimitResetTime) {
      const waitTime = Math.ceil((api.defaults.requestState.rateLimitResetTime - now) / 1000)
      console.warn(`[Rate Limit] 请求被暂时阻止，需要等待 ${waitTime} 秒`)
      return Promise.reject(new Error(`请求过于频繁，请等待 ${waitTime} 秒后重试`))
    }

    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    config.requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    if (config.url && config.url.includes('/boxes') && 
        (config.method === 'post' || config.method === 'put') && 
        config.data) {
      console.log(`[${config.requestId}] === 发送给后端的完整数据 ===`)
      console.log(`[${config.requestId}] URL:`, config.url)
      console.log(`[${config.requestId}] 方法:`, config.method)
      console.log(`[${config.requestId}] 数据类型:`, typeof config.data)
      console.log(`[${config.requestId}] 完整数据:`, JSON.parse(JSON.stringify(config.data)))
      console.log(`[${config.requestId}] items长度:`, config.data.items?.length || 0)
      if (Array.isArray(config.data.items)) {
        config.data.items.forEach((item, idx) => {
          console.log(`[${config.requestId}]   items[${idx}]:`, item)
        })
      }
      console.log(`[${config.requestId}] ==============================`)
    }
    
    return config
  },
  error => {
    console.error('请求配置错误:', error)
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  response => {
    const config = response.config
    console.log(`[${config.requestId}] 收到响应: ${config.method.toUpperCase()} ${config.url} - ${response.status}`)
    
    if (response.data && typeof response.data === 'object') {
      if ('success' in response.data) {
        if (response.data.success) {
          return response.data
        } else {
          return Promise.reject(new Error(response.data.error || '请求失败'))
        }
      } else {
        return response.data
      }
    } else {
      return response.data
    }
  },
  error => {
    const config = error.config
    const requestId = config?.requestId || 'unknown'
    
    console.error(`[${requestId}] 请求失败:`, error)
    
    let errorMessage = '请求失败，请稍后重试'
    
    if (error.response) {
      const { status, data } = error.response
      console.error(`[${requestId}] 服务器响应错误:`, {
        status,
        data: data.error || data.message || data,
        url: config?.url
      })
      
      switch (status) {
        case 401:
          errorMessage = '登录已过期，请重新登录'
          const userConfirmed = window.confirm('登录已过期，请重新登录。点击确定跳转到登录页，点击取消可以继续保存当前数据（但可能失败）')
          if (userConfirmed) {
            try {
              localStorage.removeItem('token')
              localStorage.removeItem('userInfo')
              localStorage.removeItem('permissions')
            } catch (error) {
              console.error('清除本地存储失败:', error)
            }
            if (window.location.pathname !== '/login') {
              window.location.href = '/login'
            }
          }
          break
        case 403:
          errorMessage = '权限不足，无法执行此操作'
          break
        case 404:
          errorMessage = '请求的资源不存在'
          break
        case 500:
          errorMessage = data.error || '服务器内部错误，请稍后重试'
          break
        case 502:
          errorMessage = '网关错误，请稍后重试'
          break
        case 503:
          errorMessage = '服务暂时不可用，请稍后重试'
          break
        case 504:
          errorMessage = '网关超时，请稍后重试'
          break
        case 429:
          errorMessage = '请求过于频繁，请稍后重试'
          api.defaults.requestState.isRateLimited = true
          api.defaults.requestState.rateLimitResetTime = Date.now() + 30000
          console.warn(`[Rate Limit] 触发429错误，将在30秒后恢复请求`)
          break
        default:
          errorMessage = data.error || '请求失败'
      }
    } else if (error.message.includes('timeout')) {
      errorMessage = '请求超时，请检查网络连接后重试'
    } else if (error.message.includes('Network Error') || error.message.includes('ERR_CONNECTION_REFUSED')) {
      errorMessage = '网络错误，请检查网络连接或稍后重试'
    } else {
      errorMessage = error.message
    }
    
    if (window.ElMessage && !config?.skipErrorDisplay) {
      window.ElMessage.error({
        message: errorMessage,
        duration: 5000,
        showClose: true
      })
    }
    
    if (config && config.retry > 0) {
      if (!error.response || error.response.status === 429 || error.message.includes('Network Error')) {
        config.retry--
        const retryDelay = config.retryDelay(config.retry)
        const finalDelay = error.response?.status === 429 ? retryDelay * 2 : retryDelay
        
        console.log(`[${requestId}] 重试请求 (${config.retry + 1}/${config.retry + config.retry + 1})，延迟 ${finalDelay}ms`)
        
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(api(config))
          }, finalDelay)
        })
      }
    }
    
    const errorWithResponse = new Error(errorMessage)
      errorWithResponse.response = error.response
      return Promise.reject(errorWithResponse)
  }
)

export const apiClient = {
  user: {
    register: (data) => api.post('/users/register', data),
    login: (data) => api.post('/users/login', data),
    getInfo: () => api.get('/users/info'),
    updateInfo: (data) => api.put('/users/info', data),
    changePassword: (data) => api.put('/users/password', data),
    follow: (data) => api.post('/users/follow', data),
    unfollow: (data) => api.post('/users/unfollow', data),
    getFollowStatus: (followingId) => api.get('/users/follow/status', { params: { followingId } }),
    getUserById: (userId) => api.get(`/users/${userId}`)
  },
  
  product: {
    getList: (params) => api.get('/products/list', { params }),
    getSellerProducts: (params) => api.get('/products/seller/list', { params }),
    getDetail: (id) => api.get(`/products/detail/${id}`),
    getHot: (params) => api.get('/products/hot', { params }),
    create: (data) => api.post('/products/create', data),
    update: (id, data) => api.put(`/products/update/${id}`, data),
    delete: (id) => api.delete(`/products/delete/${id}`),
    approve: (id, data) => api.put(`/products/approve/${id}`, data),
    setHot: (id, isHot) => api.put(`/products/set-hot/${id}`, { isHot }),
    getStats: () => api.get('/products/stats'),
    getCategories: () => api.get('/products/categories'),
    getCategoryTree: () => api.get('/products/categories/tree'),
    getLevel2Categories: (level1) => api.get('/products/categories/level2', { params: { level1 } }),
    getLevel3Categories: (level2) => api.get('/products/categories/level3', { params: { level2 } })
  },
  
  cart: {
    getList: () => api.get('/carts/list'),
    add: (data) => api.post('/carts/add', data),
    update: (id, data) => api.put(`/carts/update/${id}`, data),
    delete: (id) => api.delete(`/carts/delete/${id}`),
    clear: () => api.delete('/carts/clear'),
    updateStatus: (id, data) => api.put(`/carts/status/${id}`, data)
  },
  
  order: {
    create: (data) => api.post('/order/create', data),
    getList: (params) => api.get('/order/list', { params }),
    getDetail: (id) => api.get(`/order/detail/${id}`),
    updateStatus: (id, data) => api.put(`/order/update/${id}`, data),
    cancel: (id) => api.put(`/order/cancel/${id}`),
    queryPayStatus: (id) => api.get(`/order/pay/status/${id}`),
    retryPay: (id) => api.post(`/order/pay/retry/${id}`),
    payNotify: (data) => api.post('/order/pay/notify', data),
    payOrder: (id, paymentMethod) => api.post(`/order/pay/${id}`, { paymentMethod }),
    pollPayStatus: (id) => api.get(`/order/pay/poll/${id}`)
  },
  
  address: {
    getList: () => api.get('/address/list'),
    add: (data) => api.post('/address/add', data),
    update: (id, data) => api.put(`/address/update/${id}`, data),
    delete: (id) => api.delete(`/address/delete/${id}`),
    setDefault: (id) => api.put(`/address/setDefault/${id}`)
  },
  
  message: {
    getConversations: () => api.get('/messages/conversations'),
    getConversationDetail: (id) => api.get(`/messages/conversations/${id}`),
    createConversation: (receiverId, receiverRole) => api.post('/messages/conversations', { receiverId, receiverRole }),
    sendMessage: (data) => api.post('/messages', data),
    getMessages: (conversationId) => api.get(`/messages/conversations/${conversationId}/messages`),
    updateMessageStatus: (messageId, status) => api.put(`/messages/messages/${messageId}/status`, { status }),
    getUnreadCount: () => api.get('/messages/unread-count'),
    markConversationAsRead: (conversationId) => api.put(`/messages/conversations/${conversationId}/read`),
    search: (keyword) => api.get('/messages/search', { params: { keyword } })
  },
  
  admin: {
    getUsers: (params) => api.get('/admin/users', { params }),
    getProducts: (params) => api.get('/admin/products', { params }),
    getOrders: (params) => api.get('/admin/orders', { params }),
    getOrderDetail: (id) => api.get(`/admin/orders/${id}`),
    updateOrderStatus: (id, data) => api.put(`/admin/orders/${id}/status`, data),
    getStats: () => api.get('/admin/stats'),
    updateUserStatus: (id, data) => api.put(`/admin/users/${id}/status`, data),
    updateUserRole: (id, data) => api.put(`/admin/users/${id}/role`, data),
    updateUserInfo: (id, data) => api.put(`/admin/users/${id}/info`, data),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    getBusinessPermissions: (params) => api.get('/business-categories/admin/permissions', { params }),
    getBusinessApplications: (params) => api.get('/business-categories/admin/applications', { params }),
    reviewBusinessApplication: (data) => api.post('/business-categories/admin/applications/review', data),
    setBusinessPermission: (data) => api.post('/business-categories/admin/permissions/set', data),
    batchSetBusinessPermissions: (data) => api.post('/business-categories/admin/permissions/batch', data),
    getSellers: () => api.get('/admin/users/sellers'),
    getAllBusinessPermissions: () => api.get('/business-categories/admin/permissions/all'),
    getPendingApplications: () => api.get('/business-categories/admin/applications/pending'),
    reviewApplication: (id, data) => api.put(`/business-categories/admin/applications/${id}/review`, data),
    batchGrantPermissions: (data) => api.put('/business-categories/admin/permissions/batch', data),
    updateBusinessPermissions: (data) => api.put('/business-categories/admin/permissions/update', data),
    getBusinessList: () => api.get('/admin/users/sellers')
  },
  
  seller: {
    getOrders: (params) => api.get('/order/seller/list', { params }),
    getOrderDetail: (id) => api.get(`/order/detail/${id}`),
    updateOrderStatus: (id, data) => api.put(`/order/seller/update/${id}`, data),
    getStats: () => api.get('/order/seller/stats'),
    getPermissions: () => api.get('/business-categories/permissions'),
    getApplications: () => api.get('/business-categories/applications'),
    applyCategory: (data) => api.post('/business-categories/applications', data),
    cancelApplication: (id) => api.delete(`/business-categories/applications/${id}`),
    getAvailableCategories: () => api.get('/business-categories/public/available-categories'),
    checkCategoryPermission: (categoryKey) => api.get('/business-categories/check-permission', { params: { categoryKey } }),
    getPermissionKeys: () => api.get('/business-categories/permission-keys'),
    applyCategories: (data) => api.post('/business-categories/applications/batch', data)
  },
  
  upload: (formData) => api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    timeout: 90000
  }),
  
  work: {
    upload: (formData, config = {}) => api.post('/works/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 90000,
      ...config
    }),
    update: (id, formData) => {
      const config = {
        timeout: 90000
      }
      
      if (formData instanceof FormData) {
        config.headers = {
          'Content-Type': 'multipart/form-data'
        }
      }
      
      return api.put(`/works/${id}`, formData, config)
    },
    delete: (id, data) => {
      return api.delete(`/works/${id}`, {
        params: data
      })
    },
    like: (data) => api.post('/works/like', data, { skipErrorDisplay: true }),
    unlike: (data) => api.post('/works/unlike', data, { skipErrorDisplay: true }),
    favorite: (data) => api.post('/works/favorite', data),
    unfavorite: (data) => api.post('/works/unfavorite', data),
    checkFavorite: (data) => api.get('/works/check-favorite', { params: data }),
    checkLike: (data) => api.get('/works/check-like', { params: data }),
    getDetail: (id) => api.get(`/works/${id}`),
    getRecommended: (params) => api.get('/works/recommended', { params }),
    getLatest: (params) => api.get('/works/latest', { params }),
    getFollowing: (params) => api.get('/works/following', { params }),
    getUserWorks: (userId, params) => api.get(`/works/user/${userId}`, { params }),
    getUserFavorites: (userId, params) => api.get(`/works/user/${userId}/favorites`, { params }),
    getAllWorks: (params) => api.get('/works/admin/all', { params }),
    getRanking: (params) => api.get('/works/ranking', { params }),
    getScoreConfig: () => api.get('/works/score/config'),
    updateScoreConfig: (data) => api.put('/works/score/config', data),
    updateAllScores: () => api.post('/works/score/update-all'),
    getScoreConfigLogs: () => api.get('/works/score/config/logs'),
    addComment: (data) => api.post('/works/comment', data),
    deleteComment: (id, data) => api.delete(`/works/comment/${id}`, { data }),
    getComments: (workId, params) => api.get(`/works/${workId}/comments`, { params }),
    addRating: (data) => api.post('/ratings', data),
    getWorkRatings: (workId) => api.get(`/ratings/work/${workId}`),
    updateRating: (id, data) => api.put(`/ratings/${id}`, data),
    deleteRating: (id, data) => api.delete(`/ratings/${id}`, { data })
  },
  
  cookingVideo: {
    recommendByUser: (params) => api.get('/cooking-videos/recommend', { params }),
    getForRecipe: (recipeId, params) => api.get(`/cooking-videos/recipe/${recipeId}`, { params }),
    recommendByMushroom: (mushroomName, params) => api.get(`/cooking-videos/mushroom/${mushroomName}`, { params }),
    search: (params) => api.get('/cooking-videos/search', { params }),
    getByMushroomBoxId: (mushroomBoxId, params) => api.get(`/cooking-videos/mushroom-box/${mushroomBoxId}`, { params }),
    incrementViews: (videoId) => api.post(`/cooking-videos/${videoId}/view`)
  },
  
  contentManagement: {
    uploadVideo: (formData) => api.post('/content-management/videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 90000
    }),
    deleteVideo: (id) => api.delete(`/content-management/videos/${id}`),
    filterVideos: (params) => api.get('/content-management/videos/filter', { params })
  }
}

const createCancelToken = () => {
  const source = axios.CancelToken.source()
  return {
    token: source.token,
    cancel: source.cancel
  }
}

export { createCancelToken }

export default api