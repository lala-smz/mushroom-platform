# 蘑菇网平台部署指南

## 一、部署到 Railway

### 1.1 准备工作

1. **创建 Railway 账户**
   - 访问 https://railway.app/ 注册账户
   - 登录后进入控制台

2. **安装 Railway CLI（可选）**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

### 1.2 从 GitHub 部署

1. **将代码推送到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/mushroom-platform.git
   git push -u origin main
   ```

2. **在 Railway 中创建新项目**
   - 打开 Railway 控制台
   - 点击 "New Project" -> "Deploy from GitHub repo"
   - 选择你的 GitHub 仓库

3. **配置环境变量**

   在 Railway 项目的 "Variables" 页面添加以下变量：

   | 变量名 | 值 | 说明 |
   |--------|-----|------|
   | PORT | 3303 | 服务端口 |
   | NODE_ENV | production | 运行环境 |
   | JWT_SECRET | your-secret-key | JWT密钥 |
   | MYSQLHOST | 从MySQL插件获取 | 数据库主机 |
   | MYSQLPORT | 3306 | 数据库端口 |
   | MYSQLUSER | 从MySQL插件获取 | 数据库用户名 |
   | MYSQLPASSWORD | 从MySQL插件获取 | 数据库密码 |
   | MYSQLDATABASE | 从MySQL插件获取 | 数据库名 |

4. **添加 MySQL 数据库**
   - 在 Railway 项目中点击 "Add Service"
   - 选择 "MySQL"
   - 等待数据库创建完成
   - 数据库连接信息会自动添加到环境变量

5. **添加 Redis（可选）**
   - 在 Railway 项目中点击 "Add Service"
   - 选择 "Redis"
   - REDIS_URL 会自动添加到环境变量

6. **配置域名**
   - 在 Railway 项目的 "Settings" -> "Domains"
   - 添加自定义域名或使用 Railway 提供的域名

### 1.3 手动部署（使用 CLI）

```bash
# 登录 Railway
railway login

# 链接到项目
railway link

# 设置环境变量
railway variables set PORT 3303
railway variables set NODE_ENV production
railway variables set JWT_SECRET your-secret-key

# 部署
railway up
```

## 二、部署到 GitHub Pages（仅前端）

### 2.1 配置 GitHub Pages

1. **修改 vite.config.js**
   - 确保 `base` 配置正确：
   ```javascript
   base: '/mushroom-platform/'
   ```

2. **构建前端**
   ```bash
   cd frontend-vue3
   npm run build
   ```

3. **部署到 GitHub Pages**
   ```bash
   npm run deploy
   ```

4. **配置 GitHub Pages**
   - 打开 GitHub 仓库 -> Settings -> Pages
   - 设置 Source 为 `gh-pages` 分支
   - 设置目录为 `/`（根目录）

### 2.2 配置后端 API 地址

在 `frontend-vue3/src/config/upload.js` 中设置生产环境 API 地址：

```javascript
const env = import.meta.env;

export const apiConfig = {
  baseURL: env.VITE_API_URL || 'https://your-railway-app.up.railway.app/api',
  // ...
}
```

## 三、本地开发环境

### 3.1 启动后端服务

```bash
cd backend-node
npm install
npm run dev
```

### 3.2 启动前端服务

```bash
cd frontend-vue3
npm install
npm run dev
```

### 3.3 配置本地数据库

确保本地 MySQL 服务运行，并创建数据库：

```sql
CREATE DATABASE mushroom_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 四、部署检查清单

### 4.1 环境变量检查

- [ ] PORT 设置正确
- [ ] NODE_ENV 设置为 production
- [ ] JWT_SECRET 设置安全的密钥
- [ ] 数据库连接信息正确
- [ ] Redis 连接信息（可选）

### 4.2 构建检查

- [ ] 前端构建成功（`npm run build`）
- [ ] 后端依赖安装完成（`npm install`）
- [ ] 静态文件目录存在

### 4.3 功能检查

- [ ] 服务启动正常（访问 `/health` 返回成功）
- [ ] API 接口正常工作
- [ ] 前端页面正常加载
- [ ] 用户登录功能正常
- [ ] 商品管理功能正常

## 五、故障排除

### 5.1 常见问题

1. **数据库连接失败**
   - 检查数据库环境变量是否正确
   - 确保 MySQL 服务正在运行
   - 检查数据库权限设置

2. **前端页面空白**
   - 检查前端构建是否成功
   - 检查后端静态文件服务配置
   - 查看浏览器控制台错误信息

3. **CORS 错误**
   - 检查 CORS 配置
   - 确保前端域名在允许列表中

4. **端口占用**
   - 检查端口是否被其他服务占用
   - 修改 PORT 环境变量

### 5.2 日志查看

在 Railway 中查看日志：
```bash
railway logs
```

## 六、性能优化建议

1. **启用 Gzip 压缩**（已配置）
2. **设置合理的缓存策略**（已配置）
3. **使用 Redis 缓存**（可选）
4. **配置 CDN**（推荐）
5. **定期清理日志和临时文件**

## 七、安全建议

1. **使用强 JWT_SECRET**
2. **定期轮换数据库密码**
3. **启用 HTTPS**（Railway 自动提供）
4. **限制 API 访问频率**（已配置）
5. **定期更新依赖**

---

## 项目结构

```
mushroom-platform/
├── backend-node/          # 后端服务
│   ├── app.js            # 入口文件
│   ├── config/           # 配置文件
│   ├── controllers/      # 控制器
│   ├── models/           # 数据模型
│   ├── routes/           # 路由定义
│   ├── services/         # 业务服务
│   ├── utils/            # 工具函数
│   └── public/           # 前端静态文件（构建后）
├── frontend-vue3/        # 前端应用
│   ├── src/              # 源代码
│   ├── public/           # 静态资源
│   └── vite.config.js    # Vite配置
├── .gitignore            # Git忽略配置
├── railway.toml          # Railway配置
├── Procfile              # 进程管理配置
└── package.json          # 项目脚本
```