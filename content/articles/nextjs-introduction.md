---
title:
  zh: "Next.js 入门指南：构建现代 Web 应用"
  en: "Next.js Beginner's Guide: Building Modern Web Applications"
description:
  zh: "详细介绍 Next.js 框架的核心概念和基础知识，带你快速掌握开发全栈 React 应用的技能。"
  en: "A comprehensive introduction to the core concepts and fundamentals of Next.js, helping you quickly master the skills for developing full-stack React applications."
date: 2024-04-28
originalUrl: https://juejin.cn/user/3702810894152983/posts
---

# Next.js 入门指南：构建现代 Web 应用

## 引言

Next.js 是一个基于 React 的全栈框架，专为生产环境构建而设计。它提供了一系列强大的功能，如服务器端渲染、静态站点生成、API 路由、文件系统路由等，使得开发现代 Web 应用变得更加简单高效。本文将介绍 Next.js 的核心概念和基础知识，帮助你快速上手这个强大的框架。

## Next.js 的核心特性

### 1. 混合渲染模式

Next.js 支持多种渲染模式，可以根据页面需求灵活选择：

- **服务器端渲染 (SSR)**：每次请求时在服务器上渲染页面
- **静态站点生成 (SSG)**：在构建时预渲染页面
- **增量静态再生 (ISR)**：结合 SSG 的性能与 SSR 的实时性
- **客户端渲染 (CSR)**：在浏览器中渲染页面

### 2. 文件系统路由

Next.js 使用基于文件系统的路由，简化了页面路由的配置：

```
pages/
  index.js         // 对应 /
  about.js         // 对应 /about
  products/
    index.js       // 对应 /products
    [id].js        // 对应 /products/1, /products/2, 等
```

在 Next.js 13 的 App Router 中，路由结构位于 `app` 目录下：

```
app/
  page.js          // 对应 /
  about/
    page.js        // 对应 /about
  products/
    page.js        // 对应 /products
    [id]/
      page.js      // 对应 /products/1, /products/2, 等
```

### 3. API 路由

Next.js 允许开发者在 `pages/api` 目录（或 App Router 中的 `app/api` 目录）下创建 API 端点：

```javascript
// pages/api/hello.js
export default function handler(req, res) {
  res.status(200).json({ message: '你好，世界！' });
}
```

在 App Router 中的 Route Handlers：

```javascript
// app/api/hello/route.js
export async function GET() {
  return Response.json({ message: '你好，世界！' });
}
```

### 4. 自动图像优化

Next.js 提供了内置的图像组件，自动处理图像优化：

```jsx
import Image from 'next/image';

function MyComponent() {
  return (
    <Image
      src="/profile.jpg"
      alt="个人头像"
      width={500}
      height={500}
      priority
    />
  );
}
```

### 5. 自动代码分割

Next.js 会自动进行代码分割，仅加载当前页面所需的 JavaScript：

```jsx
// 动态导入组件
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('../components/hello'));

function MyPage() {
  return (
    <div>
      <h1>我的页面</h1>
      <DynamicComponent />
    </div>
  );
}
```

## 快速开始一个 Next.js 项目

### 创建新项目

使用 `create-next-app` 可以快速创建一个新的 Next.js 项目：

```bash
npx create-next-app@latest my-next-app
# 或使用 yarn
yarn create next-app my-next-app
# 或使用 pnpm
pnpm create next-app my-next-app
```

跟随提示选择你想要的配置，比如是否使用 TypeScript、ESLint、Tailwind CSS 等。

### 项目结构

一个典型的 Next.js 应用结构如下：

```
my-next-app/
  ├── app/                  # App Router (Next.js 13+)
  │   ├── layout.js         # 根布局
  │   ├── page.js           # 首页
  │   └── about/
  │       └── page.js       # 关于页面
  ├── pages/                # Pages Router (传统)
  │   ├── _app.js           # 自定义应用组件
  │   ├── _document.js      # 自定义文档
  │   ├── index.js          # 首页
  │   └── api/              # API 路由
  ├── public/               # 静态资源
  ├── components/           # React 组件
  ├── styles/               # CSS 样式
  ├── next.config.js        # Next.js 配置
  └── package.json          # 项目依赖
```

### 开发和构建

运行开发服务器：

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

构建生产版本：

```bash
npm run build
# 然后
npm start
```

## 核心概念详解

### 1. 页面和布局

在 App Router 中，页面和布局是使用特定命名的文件定义的：

```jsx
// app/page.js - 页面组件
export default function Page() {
  return <h1>欢迎来到我的网站</h1>;
}

// app/layout.js - 布局组件
export default function Layout({ children }) {
  return (
    <html lang="zh">
      <body>
        <header>我的网站</header>
        <main>{children}</main>
        <footer>© 2024</footer>
      </body>
    </html>
  );
}
```

### 2. 数据获取

Next.js 提供了多种数据获取方法：

#### 服务器组件中的数据获取

```jsx
// app/products/page.js
export default async function ProductsPage() {
  const products = await fetch('https://api.example.com/products').then(res => res.json());
  
  return (
    <div>
      <h1>产品列表</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

#### 静态生成与动态路由

```jsx
// app/products/[id]/page.js
export async function generateStaticParams() {
  const products = await fetch('https://api.example.com/products').then(res => res.json());
  
  return products.map(product => ({
    id: product.id.toString(),
  }));
}

export default async function ProductPage({ params }) {
  const { id } = params;
  const product = await fetch(`https://api.example.com/products/${id}`).then(res => res.json());
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>价格: ¥{product.price}</p>
    </div>
  );
}
```

### 3. 客户端交互

对于需要客户端交互的组件，我们使用 "use client" 指令：

```jsx
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  );
}
```

### 4. 导航和路由

Next.js 提供了 `next/link` 组件用于客户端导航：

```jsx
import Link from 'next/link';

export default function Navigation() {
  return (
    <nav>
      <ul>
        <li><Link href="/">首页</Link></li>
        <li><Link href="/about">关于</Link></li>
        <li><Link href="/products">产品</Link></li>
      </ul>
    </nav>
  );
}
```

也可以使用 `useRouter` 进行编程式导航：

```jsx
'use client';

import { useRouter } from 'next/navigation';

export default function NavigateButton() {
  const router = useRouter();
  
  return (
    <button onClick={() => router.push('/products')}>
      查看产品
    </button>
  );
}
```

### 5. 样式解决方案

Next.js 支持多种样式解决方案：

#### CSS 模块

```jsx
// Button.module.css
.button {
  background-color: blue;
  color: white;
  padding: 10px 15px;
  border-radius: 4px;
}

// components/Button.js
import styles from './Button.module.css';

export default function Button({ children }) {
  return <button className={styles.button}>{children}</button>;
}
```

#### Tailwind CSS

```jsx
export default function Button({ children }) {
  return (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      {children}
    </button>
  );
}
```

#### CSS-in-JS (Styled Components, Emotion 等)

```jsx
'use client';

import styled from 'styled-components';

const StyledButton = styled.button`
  background-color: blue;
  color: white;
  padding: 10px 15px;
  border-radius: 4px;
`;

export default function Button({ children }) {
  return <StyledButton>{children}</StyledButton>;
}
```

## 高级特性

### 1. 中间件

中间件允许在请求到达页面或 API 路由之前运行代码：

```javascript
// middleware.js
export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // 检查用户是否已登录
  const isAuthenticated = request.cookies.get('auth');
  
  // 重定向未登录用户
  if (!isAuthenticated && pathname.startsWith('/dashboard')) {
    return Response.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
```

### 2. 国际化 (i18n)

Next.js 支持内置的国际化路由：

```javascript
// next.config.js
module.exports = {
  i18n: {
    locales: ['en', 'zh', 'fr'],
    defaultLocale: 'zh',
  },
};
```

在 App Router 中，可以使用子路径或域名方式实现：

```
app/
  [lang]/
    page.js
    about/
      page.js
```

### 3. 环境变量

Next.js 内置了环境变量支持：

```
// .env.local
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
NEXT_PUBLIC_API_URL=https://api.example.com
```

在代码中使用：

```javascript
// 服务器端可访问的环境变量
const dbUrl = process.env.DATABASE_URL;

// 客户端也可访问的环境变量 (NEXT_PUBLIC_ 前缀)
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

## 部署 Next.js 应用

### Vercel (Next.js 开发团队所在公司)

使用 Vercel 部署 Next.js 应用非常简单：

1. 将代码推送到 GitHub 仓库
2. 在 Vercel 连接该仓库
3. 自动构建和部署

### 自托管

你也可以将 Next.js 应用部署到自己的服务器：

```bash
# 构建应用
npm run build

# 启动生产服务器
npm start
```

也可以使用 Docker 部署：

```
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

CMD ["npm", "start"]
```

## 示例：创建一个博客应用

下面是一个简单的博客应用示例，展示如何利用 Next.js 的核心功能：

### 1. 博客首页

```jsx
// app/page.js
import Link from 'next/link';

async function getPosts() {
  // 这里可以从 CMS、数据库或文件系统获取数据
  const res = await fetch('https://api.example.com/posts', { next: { revalidate: 3600 } });
  return res.json();
}

export default async function HomePage() {
  const posts = await getPosts();
  
  return (
    <div>
      <h1>我的博客</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map(post => (
          <div key={post.id} className="border p-4 rounded-md">
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="text-gray-600">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="text-blue-500 hover:underline">
              阅读更多
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 2. 博客文章页面

```jsx
// app/blog/[slug]/page.js
import { notFound } from 'next/navigation';

async function getPost(slug) {
  try {
    const res = await fetch(`https://api.example.com/posts/${slug}`, { next: { revalidate: 3600 } });
    
    if (!res.ok) {
      throw new Error('Failed to fetch post');
    }
    
    return res.json();
  } catch (error) {
    return null;
  }
}

export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(res => res.json());
  
  return posts.map(post => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }) {
  const post = await getPost(params.slug);
  
  if (!post) {
    notFound();
  }
  
  return (
    <article>
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div className="text-gray-600 mb-4">发布于: {new Date(post.date).toLocaleDateString()}</div>
      <div className="prose lg:prose-xl" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

### 3. 全局布局

```jsx
// app/layout.js
import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: '我的 Next.js 博客',
  description: '使用 Next.js 构建的博客网站',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body>
        <header className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-6">
            <nav className="flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold">我的博客</Link>
              <ul className="flex space-x-4">
                <li><Link href="/" className="hover:underline">首页</Link></li>
                <li><Link href="/about" className="hover:underline">关于</Link></li>
                <li><Link href="/contact" className="hover:underline">联系</Link></li>
              </ul>
            </nav>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        
        <footer className="bg-gray-100">
          <div className="container mx-auto px-4 py-6 text-center text-gray-600">
            © {new Date().getFullYear()} 我的博客. 保留所有权利.
          </div>
        </footer>
      </body>
    </html>
  );
}
```

## 结论

Next.js 是一个功能丰富、易于上手的 React 框架，适合构建从简单的静态网站到复杂的全栈应用程序。它的服务器组件、混合渲染策略和内置功能可以帮助开发者构建高性能、SEO 友好的现代 Web 应用。

通过本入门指南，你应该对 Next.js 的核心概念和基础知识有了基本了解。随着深入学习和实践，你会发现 Next.js 还有更多强大的功能等待探索，例如 Edge 运行时、流式渲染、Parallel Routes、Server Actions 等。

最好的学习方式是动手实践，所以建议你创建一个小项目，并尝试使用本文介绍的各种功能，逐步掌握 Next.js 开发技能。 