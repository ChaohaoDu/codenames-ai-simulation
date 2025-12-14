# Vercel 部署指南

## 🚀 部署步骤

### 1. 创建 Vercel Postgres 数据库

1. 访问你的 Vercel 项目控制台
2. 进入 **Storage** 标签
3. 点击 **Create Database**
4. 选择 **Postgres**
5. 选择区域(建议选离你用户最近的)
6. 点击 **Create**

### 2. 连接数据库到项目

数据库创建后,Vercel 会自动添加环境变量到你的项目:

- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

这些环境变量会自动在部署时注入,无需手动配置。

### 3. 部署应用

```bash
# 方式 1: 使用 Vercel CLI
vercel

# 方式 2: 或者推送到连接的 Git 仓库 (自动部署)
git add .
git commit -m "Migrate to Postgres"
git push
```

### 4. 初始化数据库表

部署完成后,访问以下 URL 初始化数据库表:

```
https://your-app.vercel.app/api/init-db
```

你应该看到: `{"success": true, "message": "Database initialized successfully"}`

**重要**: 初始化成功后,为了安全考虑,建议删除 `app/api/init-db/route.ts` 文件,或添加认证保护。

### 5. 本地开发设置 (可选)

如果需要在本地开发环境连接到 Vercel Postgres:

1. 在 Vercel 项目设置中找到数据库连接字符串
2. 创建 `.env.local` 文件:

```bash
cp .env.example .env.local
```

3. 从 Vercel 项目设置复制环境变量到 `.env.local`
4. 运行本地开发服务器:

```bash
npm run dev
```

## 📊 迁移现有数据 (可选)

如果你想保留 `data/matches.json` 中的现有数据:

1. 确保已经完成上述步骤 1-4
2. 在 `.env.local` 中配置数据库连接
3. 编辑 `lib/migrate-data.ts`,取消注释迁移代码
4. 运行迁移脚本:

```bash
npx tsx lib/migrate-data.ts
```

## ✅ 验证部署

访问你的应用,检查:

1. 游戏可以正常运行
2. 比赛结果可以保存
3. 排行榜可以正确显示

## 🔍 数据库管理

### 方式 1: Vercel Dashboard

- 在 Vercel 项目的 Storage 标签中可以直接查看和查询数据

### 方式 2: psql 命令行

```bash
# 使用 Vercel CLI
vercel env pull .env.local
psql $POSTGRES_URL
```

### 方式 3: GUI 工具

使用任何 Postgres GUI 工具,如:

- TablePlus
- Postico
- pgAdmin

使用 `POSTGRES_URL` 环境变量中的连接字符串连接。

## 🎯 与 JSON 文件存储的区别

| 特性        | JSON 文件         | Vercel Postgres |
| ----------- | ----------------- | --------------- |
| 持久化      | ❌ 仅本地         | ✅ 云端持久化   |
| 多实例      | ❌ 不支持         | ✅ 支持         |
| 性能        | 🐌 随数据增长变慢 | 🚀 高性能索引   |
| 并发        | ❌ 容易数据冲突   | ✅ 事务支持     |
| 可扩展性    | ❌ 受限           | ✅ 无限扩展     |
| Vercel 兼容 | ❌ 不兼容         | ✅ 完美兼容     |

## 🆘 常见问题

### 数据库连接失败

- 检查环境变量是否正确设置
- 确保数据库已在 Vercel Storage 中创建
- 尝试重新部署项目

### 本地开发连接数据库

- 确保 `.env.local` 包含所有必需的环境变量
- 使用 `vercel env pull` 自动拉取环境变量

### 数据没有保存

- 检查 `/api/stats` 端点是否返回错误
- 查看 Vercel 函数日志(在 Vercel Dashboard)
- 确保已运行 `/api/init-db` 初始化数据库

## 📝 清理工作

部署成功并验证后,可以安全删除以下文件:

- `data/matches.json` (旧数据已迁移)
- `lib/storage.ts` (已被 `lib/db.ts` 替代)
- `app/api/init-db/route.ts` (数据库初始化后不再需要)
- `lib/migrate-data.ts` (迁移完成后不再需要)
