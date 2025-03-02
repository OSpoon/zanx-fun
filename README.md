# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

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

按照以下步骤部署您的个人网站：

```bash
# 安装依赖
pnpm install

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm preview
```

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
