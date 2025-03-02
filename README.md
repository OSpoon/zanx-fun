# 前端小鑫同学 - 个人网站

这是我的个人网站项目，使用Nuxt 3和Tailwind CSS构建。

## 网站预览

访问 [https://zanx.fun](https://zanx.fun) 查看在线版本。

## 技术栈

- Nuxt 3
- Vue 3
- Tailwind CSS
- i18n 多语言支持

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产版本
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

访客提交留言后，系统会自动在指定仓库中创建一个带有"网站留言"标签的Issue。
