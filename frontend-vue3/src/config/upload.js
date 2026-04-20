const env = import.meta.env;

export const uploadConfig = {
  uploadUrl: env.VITE_API_URL 
    ? `${env.VITE_API_URL}/api/works/upload` 
    : 'http://localhost:3303/api/works/upload',
  
  imageUrl: env.VITE_API_URL 
    ? `${env.VITE_API_URL}/uploads/` 
    : 'http://localhost:3303/uploads/',
  
  mushroomUrl: env.VITE_API_URL 
    ? `${env.VITE_API_URL}/mushrooms/` 
    : 'http://localhost:3303/mushrooms/',
  
  maxFileSize: parseInt(env.VITE_MAX_FILE_SIZE) || 10 * 1024 * 1024,
  
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
}

export const apiConfig = {
  baseURL: env.VITE_API_URL || 'http://localhost:3303/api',
  
  timeout: parseInt(env.VITE_API_TIMEOUT) || 60000,
  
  retry: {
    count: parseInt(env.VITE_API_RETRY_COUNT) || 3,
    delay: parseInt(env.VITE_API_RETRY_DELAY) || 1000
  }
}