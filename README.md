# 🚀 Next.js Full-Stack Dashboard

一个基于 Next.js 15、tRPC、NextAuth.js 和 Drizzle ORM 构建的现代化全栈应用模板，提供完整的类型安全和最佳实践。

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![tRPC](https://img.shields.io/badge/tRPC-11.4.2-2596be?style=flat-square&logo=trpc)](https://trpc.io/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.81.2-ff4154?style=flat-square)](https://tanstack.com/query)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.44.2-C5F74F?style=flat-square)](https://orm.drizzle.team/)

## ✨ 核心特性

- ⚡ **Next.js 15** - 使用 App Router 和 Turbopack 实现极速开发体验
- 🔐 **NextAuth.js** - 完整的身份认证解决方案（支持 GitHub OAuth）
- 🎯 **tRPC** - 端到端类型安全的 API 层
- 🗄️ **Drizzle ORM** - 轻量级 TypeScript ORM，配合 PostgreSQL
- 🎨 **Tailwind CSS v4** - 现代化 UI 样式系统
- 📦 **TanStack Query** - 强大的数据获取和缓存管理
- 🔄 **React 19** - 最新的 React 特性
- 📤 **Uppy** - 文件上传组件（支持 AWS S3）
- 🎭 **Radix UI** - 无障碍的 UI 组件库
- 🛡️ **Zod** - TypeScript 优先的模式验证
- 💅 **shadcn/ui** - 可定制的高质量组件

## 📋 前置要求

在开始之前，请确保你的开发环境满足以下要求：

- **Node.js**: ≥ 18.0.0
- **npm**: ≥ 8.0.0
- **PostgreSQL**: 最新稳定版

检查版本：

```bash
node --version
npm --version
psql --version
```

如果使用 nvm，可以使用项目中的 `.nvmrc` 文件：

```bash
nvm use
```

> 🚨 **遇到安装问题？** 查看 [SETUP_ISSUES.md](./SETUP_ISSUES.md) 获取常见问题解决方案。

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd proj_cloud_source_dashboard
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制环境变量示例文件并根据你的配置修改：

```bash
cp .env.example .env.development
```

编辑 `.env.development` 文件：

```env
# 数据库配置
DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"

# NextAuth.js 配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-nextauth-secret-here"

# GitHub OAuth 配置（可选）
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

> 💡 **提示**: 使用 `openssl rand -base64 32` 生成安全的 `NEXTAUTH_SECRET`

### 4. 设置数据库

```bash
# 生成数据库迁移文件
npm run db:generate

# 应用迁移到数据库
npm run db:migrate

# （可选）启动 Drizzle Studio 可视化管理数据库
npm run db:studio
```

### 5. 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📚 项目结构

```
proj_cloud_source_dashboard/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/
│   │   │   ├── auth/            # NextAuth.js API 路由
│   │   │   └── trpc/            # tRPC API 路由
│   │   ├── layout.tsx           # 根布局
│   │   └── page.tsx             # 首页
│   │
│   ├── components/              # React 组件
│   │   ├── business/            # 业务组件
│   │   │   ├── ClientGreeting.tsx
│   │   │   ├── ServerComponentExample.tsx
│   │   │   ├── TanStackQueryExample.tsx
│   │   │   ├── UserSession.tsx
│   │   │   └── FIleUpload/     # 文件上传组件
│   │   └── ui/                  # UI 基础组件
│   │       ├── button.tsx
│   │       └── input.tsx
│   │
│   ├── server/                  # 服务器端代码
│   │   ├── auth/               # 认证配置
│   │   │   ├── constants/      # NextAuth 配置
│   │   │   └── helpers/        # 认证辅助函数
│   │   ├── db/                 # 数据库配置
│   │   │   ├── db.ts          # Drizzle 实例
│   │   │   └── schema.ts      # 数据库模式
│   │   └── trpc/              # tRPC 配置
│   │       ├── init.ts        # tRPC 初始化
│   │       ├── root.ts        # 根路由器
│   │       ├── serverCaller.ts # 服务器端调用工具
│   │       └── routers/       # API 路由
│   │           ├── general.ts
│   │           └── user.ts
│   │
│   ├── utils/                  # 工具函数
│   │   └── trpc/              # tRPC 客户端配置
│   │       ├── provider.tsx   # React Provider
│   │       ├── client.tsx     # 客户端工具
│   │       ├── server.tsx     # 服务器端工具
│   │       └── hooks.ts       # React Hooks
│   │
│   ├── constants/             # 常量定义
│   └── lib/                   # 通用库函数
│
├── drizzle/                   # Drizzle 迁移文件
├── public/                    # 静态资源
├── docs/                      # 项目文档
│   └── TRPC_COMPLETE_GUIDE.md # tRPC 完整指南
├── scripts/                   # 实用脚本
│   ├── check-db.js           # 数据库检查
│   └── fix-db.js             # 数据库修复
└── package.json
```

## 🎯 核心技术栈

### 前端

- **Next.js 15** - React 框架，支持 SSR、SSG 和 ISR
- **React 19** - UI 库
- **TypeScript** - 类型安全
- **Tailwind CSS v4** - 原子化 CSS 框架
- **TanStack Query** - 数据获取和状态管理
- **Radix UI** - 无障碍组件基础库
- **Lucide React** - 图标库

### 后端

- **tRPC** - 类型安全的 API 层
- **NextAuth.js** - 身份认证
- **Drizzle ORM** - TypeScript ORM
- **PostgreSQL** - 关系型数据库
- **Zod** - 模式验证

### 开发工具

- **ESLint** - 代码检查
- **Commitizen** - 规范化提交信息
- **Drizzle Kit** - 数据库迁移工具
- **Turbopack** - 快速打包工具

## 🔧 可用脚本

```bash
# 开发
npm run dev          # 启动开发服务器（使用 Turbopack）

# 构建
npm run build        # 构建生产版本
npm run start        # 启动生产服务器

# 代码质量
npm run lint         # 运行 ESLint 检查
npm run cz           # 使用 Commitizen 提交代码（emoji 风格）

# 数据库
npm run db:generate  # 根据 schema 生成迁移文件
npm run db:migrate   # 应用数据库迁移
npm run db:studio    # 启动 Drizzle Studio (http://localhost:4983)
```

## 📖 使用指南

### tRPC 使用

本项目实现了完整的 tRPC 架构，支持客户端和服务器端调用。详细文档请查看：

- 📘 [tRPC 完整使用指南](./docs/TRPC_COMPLETE_GUIDE.md) - 全面的使用教程
- 📗 [客户端使用指南](./src/utils/trpc/docs/USAGE.md) - Client Components 使用
- 📙 [服务器端使用指南](./src/server/trpc/docs/SERVER_USAGE.md) - Server Components 使用
- 📕 [架构文档](./src/server/trpc/docs/ARCHITECTURE.md) - 架构设计说明

#### 快速示例

**在 Client Component 中使用：**

```tsx
"use client";
import { trpc } from "@/utils/trpc";

export default function UserProfile() {
  const { data, isLoading } = trpc.user.getProfile.useQuery();

  if (isLoading) return <div>Loading...</div>;
  return <div>Hello, {data?.name}!</div>;
}
```

**在 Server Component 中使用：**

```tsx
import { createCaller } from "@/server/trpc";

export default async function ServerProfile() {
  const caller = await createCaller();
  const user = await caller.user.getProfile();

  return <div>Hello, {user.name}!</div>;
}
```

### 数据库管理

#### Drizzle Studio

Drizzle Studio 提供了一个强大的可视化界面来管理数据库：

```bash
npm run db:studio
```

访问 [http://localhost:4983](http://localhost:4983) 可以：

- 📊 查看和编辑表数据
- 🔍 浏览数据库模式
- 💾 执行 SQL 查询
- 🔗 监控表关系

#### 数据库迁移工作流

```bash
# 1. 修改 src/server/db/schema.ts
# 2. 生成迁移文件
npm run db:generate

# 3. 检查生成的迁移文件（在 drizzle/ 目录）
# 4. 应用迁移
npm run db:migrate
```

### 身份认证

项目使用 NextAuth.js 实现身份认证，支持：

- 🔑 GitHub OAuth
- 📧 Email/Password（可扩展）
- 🔐 Session 管理
- 🛡️ 路由保护

**获取用户会话：**

```tsx
import { getServerSession } from "@/server/auth";

export default async function ProtectedPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return <div>Welcome, {session.user.name}!</div>;
}
```

## 🎨 UI 组件

项目使用 shadcn/ui 组件系统，所有组件都是：

- ✅ 完全可定制
- ✅ 支持无障碍访问
- ✅ 基于 Radix UI
- ✅ 使用 Tailwind CSS 样式

添加新组件：

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add dialog
```

## 🔐 环境变量

| 变量名                 | 说明                   | 必需 |
| ---------------------- | ---------------------- | ---- |
| `DATABASE_URL`         | PostgreSQL 连接字符串  | ✅   |
| `NEXTAUTH_URL`         | 应用 URL               | ✅   |
| `NEXTAUTH_SECRET`      | NextAuth 加密密钥      | ✅   |
| `GITHUB_CLIENT_ID`     | GitHub OAuth Client ID | ⚠️   |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth Secret    | ⚠️   |

⚠️ = 使用 GitHub 登录时必需

## 📦 部署

### Vercel（推荐）

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量
4. 部署！

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/proj_cloud_source_dashboard)

### 其他平台

项目支持任何支持 Node.js 的平台：

- Railway
- Render
- AWS
- Google Cloud
- Azure

确保：

1. 设置所有环境变量
2. 运行数据库迁移
3. 构建项目：`npm run build`
4. 启动服务器：`npm start`

## 🧪 示例组件

项目包含多个示例组件展示最佳实践：

- `ClientGreeting` - 客户端 tRPC 调用
- `ServerComponentExample` - 服务器端 tRPC 调用
- `TanStackQueryExample` - TanStack Query 集成
- `UserSession` - 用户认证状态
- `FileUpload` - 文件上传到 S3

查看 `src/components/business/` 目录了解更多。

## 📚 学习资源

### 项目文档

- 📘 [tRPC 完整指南](./docs/TRPC_COMPLETE_GUIDE.md)
- 📗 [安装问题解决](./SETUP_ISSUES.md)
- 📙 [项目结构说明](./src/utils/trpc/docs/STRUCTURE.md)

### 外部资源

- [Next.js 文档](https://nextjs.org/docs)
- [tRPC 文档](https://trpc.io/docs)
- [Drizzle ORM 文档](https://orm.drizzle.team/docs/overview)
- [NextAuth.js 文档](https://next-auth.js.org/)
- [TanStack Query 文档](https://tanstack.com/query/latest)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

### 在线教程

📚 **[Next.js 全栈项目指南](https://www.notion.so/Nextjs-20c867a3b6fb80e8b667f77484883dda)**

这个综合指南涵盖：

- 项目设置和架构
- Next.js 15 App Router 详解
- Drizzle ORM 集成
- NextAuth.js 认证流程
- tRPC 实现细节
- 数据库设计模式

## 🤝 贡献

欢迎贡献！请遵循以下步骤：

1. Fork 项目
2. 创建特性分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`npm run cz`（使用 Commitizen）
4. 推送到分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

### 提交规范

项目使用 Commitizen 和 emoji 风格的提交信息：

```bash
npm run cz
```

这将引导你创建规范的提交信息。

## 🐛 故障排除

### 常见问题

**问题：数据库连接失败**

```bash
# 检查 PostgreSQL 是否运行
pg_isready

# 验证连接字符串
node scripts/check-db.js
```

**问题：端口已被占用**

```bash
# 修改端口（在 package.json 或环境变量中）
PORT=3001 npm run dev
```

**问题：类型错误**

```bash
# 重新生成类型
rm -rf .next
npm run build
```

更多问题请查看 [SETUP_ISSUES.md](./SETUP_ISSUES.md)

## 📄 许可证

本项目采用 MIT 许可证。

## 🙏 致谢

本项目基于以下优秀的开源项目：

- [Next.js](https://nextjs.org/)
- [tRPC](https://trpc.io/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [NextAuth.js](https://next-auth.js.org/)
- [TanStack Query](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 [Issue](https://github.com/yourusername/proj_cloud_source_dashboard/issues)
- 发起 [Discussion](https://github.com/yourusername/proj_cloud_source_dashboard/discussions)

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给它一个 Star！⭐**

Made with ❤️ using Next.js

</div>
