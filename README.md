# 前端小鑫同学 - 个人网站

这是我的个人网站项目，使用Nuxt 3和Tailwind CSS构建。

## 网站预览

访问 [https://zanx.fun](https://zanx.fun) 查看在线版本。

## 技术栈

- Nuxt 3
- Vue 3
- Tailwind CSS
- i18n 多语言支持
- Vercel 部署

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 生成静态网站（用于GitHub Pages）
pnpm generate
```

## 部署到GitHub Pages

项目配置了GitHub Actions自动部署流程。当代码推送到main分支时，会自动构建并部署到GitHub Pages。

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## 🚀 部署

### Vercel 部署

1. 在Vercel上创建新项目，并关联GitHub仓库
2. 设置以下构建配置：
   - 构建命令: `pnpm run build`
   - 输出目录: `.output`
3. 点击"Deploy"按钮

### 通过GitHub Actions部署到Vercel

1. 在Vercel账户中获取以下信息：
   - VERCEL_TOKEN: 从[Vercel Tokens页面](https://vercel.com/account/tokens)创建
   - VERCEL_ORG_ID: 从项目设置页面获取
   - VERCEL_PROJECT_ID: 从项目设置页面获取

2. 在GitHub仓库添加这些信息为Secrets

3. 推送代码到main分支，GitHub Actions将自动部署到Vercel

## ✉️ 留言功能配置

网站的留言功能使用GitHub Issues来存储访客留言。要启用此功能，请按照以下步骤操作：

1. 创建GitHub Personal Access Token:
   - 访问您的GitHub [Settings -> Developer settings -> Personal access tokens](https://github.com/settings/tokens)
   - 点击"Generate new token (classic)"
   - 勾选"repo"权限（允许管理仓库Issues）
   - 生成并复制您的token

2. 配置环境变量:
   - 在项目根目录创建`.env`文件
   - 添加以下内容（替换为您的token）:
   ```
   GITHUB_TOKEN=your_github_personal_access_token
   ```

3. 更新服务器API配置:
   - 在`server/api/create-github-issue.ts`文件中
   - 将`GITHUB_OWNER`更改为您的GitHub用户名
   - 将`GITHUB_REPO`更改为接收留言的仓库名
   ```typescript
   const GITHUB_OWNER = 'YourUsername'
   const GITHUB_REPO = 'YourRepository'
   ```

访客提交留言后，系统会自动在指定仓库中创建一个带有"网站留言"标签的Issue。
