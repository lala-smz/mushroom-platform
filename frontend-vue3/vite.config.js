import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import compression from 'vite-plugin-compression'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  
  return {
    root: path.resolve(__dirname, '.'),
    base: isProduction ? '/' : '/mushroom-platform/',
    
    plugins: [
      vue(),
      visualizer({
        open: false,
        filename: 'dist/stats.html'
      }),
      compression({
        algorithm: 'gzip',
        threshold: 10240,
        minRatio: 0.8
      })
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      },
      extensions: ['.vue', '.js', '.jsx', '.json']
    },

    server: {
      port: parseInt(process.env.VITE_PORT) || 5174,
      host: '0.0.0.0',
      hmr: {
        overlay: true,
        timeout: 30000
      },
      fs: {
        strict: false
      },
      proxy: {
        '/api': {
          target: process.env.VITE_API_URL || 'http://localhost:3303',
          changeOrigin: true,
          timeout: 60000,
          headers: {
            'Connection': 'keep-alive'
          },
          rewrite: (path) => path.replace(/^\/api/, '/api')
        },
        '/uploads': {
          target: process.env.VITE_API_URL || 'http://localhost:3303',
          changeOrigin: true
        },
        '/mushrooms': {
          target: process.env.VITE_API_URL || 'http://localhost:3303',
          changeOrigin: true
        }
      }
    },

    optimizeDeps: {
      include: [
        'vue', 
        'vue-router', 
        'pinia', 
        'element-plus', 
        'axios', 
        'echarts',
        'dayjs',
        'mitt',
        'socket.io-client'
      ],
      exclude: [],
      esbuildOptions: {
        target: 'es2020'
      }
    },

    build: {
      outDir: '../backend-node/public',
      assetsDir: 'assets',
      minify: 'terser',
      sourcemap: false,
      emptyOutDir: true,
      
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            'element-plus': ['element-plus', '@element-plus/icons-vue'],
            'charts': ['echarts'],
            'utils': ['axios', 'dayjs', 'mitt', 'socket.io-client']
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          compact: true
        }
      },

      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.debug', 'console.warn']
        },
        mangle: {
          toplevel: true
        }
      },

      chunkSizeWarningLimit: 1000,
      
      cssCodeSplit: true,
      
      reportCompressedSize: true,
      
      assetsInlineLimit: 4096
    },

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`
        }
      }
    }
  }
})