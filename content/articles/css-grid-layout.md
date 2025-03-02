---
title:
  zh: "CSS Grid 布局完全指南"
  en: "Complete Guide to CSS Grid Layout"
description:
  zh: "深入学习CSS Grid布局系统，掌握创建复杂响应式网格布局的关键技术和常用模式。"
  en: "Deep dive into the CSS Grid layout system, master key techniques and common patterns for creating complex responsive grid layouts."
date: 2023-09-18
originalUrl: https://juejin.cn/user/3702810894152983/posts
---

# CSS Grid 布局完全指南

## 什么是CSS Grid？

CSS Grid布局是一个二维布局系统，专为解决网页布局问题而设计。它允许开发者将网页内容组织成行和列，轻松创建复杂且灵活的布局结构。与之前的布局方法（如浮动、定位和Flexbox）相比，Grid布局提供了更强大的控制能力。

## 基础概念

在深入探讨Grid布局之前，我们需要了解一些基本概念：

### 网格容器和网格项

```css
.container {
  display: grid; /* 或 display: inline-grid */
}
```

当一个元素设置为`display: grid`时，它成为**网格容器**。它的所有直接子元素自动成为**网格项**。

### 网格线和网格单元

- **网格线**：构成网格结构的水平和垂直线
- **网格单元**：两条相邻行线和两条相邻列线之间的空间
- **网格轨道**：两条相邻网格线之间的空间（行或列）
- **网格区域**：由四条网格线包围的矩形区域

## 创建网格

### 定义行和列

```css
.container {
  display: grid;
  grid-template-columns: 100px 200px 100px;
  grid-template-rows: 50px 100px;
}
```

这将创建一个有3列2行的网格。

### 使用fr单位

`fr`单位表示剩余空间的一部分（fraction）：

```css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
}
```

这将创建3列，中间列占用两倍于两侧列的空间。

### 使用repeat()函数

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);  /* 相当于 1fr 1fr 1fr */
  grid-template-rows: repeat(2, 100px);   /* 相当于 100px 100px */
}
```

### 使用minmax()函数

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, minmax(100px, 1fr));
}
```

这确保每列至少为100px宽，但如果有更多空间可用，则会平均分配。

## 网格间距

控制网格单元之间的间距：

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 20px;    /* 列间距 */
  row-gap: 10px;       /* 行间距 */
  gap: 10px 20px;      /* 简写：行间距 列间距 */
}
```

## 自动布局

### 自动填充和适应

```css
.container {
  display: grid;
  /* 尽可能多地创建最小宽度为100px的列 */
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  
  /* 或者根据内容拉伸列 */
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
}
```

### 隐式网格和自动行/列

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* 定义隐式创建的行的大小 */
  grid-auto-rows: 100px;
  /* 或使用minmax()确保最小高度 */
  grid-auto-rows: minmax(100px, auto);
}
```

## 项目放置

### 使用网格线编号

```css
.item {
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 2;
  grid-row-end: 4;
  
  /* 简写 */
  grid-column: 1 / 3;
  grid-row: 2 / 4;
  
  /* 更简短的简写 */
  grid-area: 2 / 1 / 4 / 3;  /* 行开始/列开始/行结束/列结束 */
}
```

### 使用span关键字

```css
.item {
  grid-column: 1 / span 2;  /* 从第1条列线开始，跨越2列 */
  grid-row: 2 / span 2;     /* 从第2条行线开始，跨越2行 */
}
```

### 命名网格线和区域

```css
.container {
  display: grid;
  grid-template-columns: [sidebar-start] 200px [sidebar-end content-start] 1fr [content-end];
  grid-template-rows: [header-start] 100px [header-end main-start] auto [main-end footer-start] 50px [footer-end];
}

.header {
  grid-column: sidebar-start / content-end;
  grid-row: header-start / header-end;
}
```

或者使用命名区域：

```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 100px auto 50px;
  grid-template-areas: 
    "header header"
    "sidebar content"
    "footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.footer { grid-area: footer; }
```

## 对齐和分布

### 网格项对齐

```css
.item {
  justify-self: start | end | center | stretch;  /* 水平对齐 */
  align-self: start | end | center | stretch;    /* 垂直对齐 */
}
```

### 网格容器对齐

```css
.container {
  /* 所有网格项在其单元格内的对齐 */
  justify-items: start | end | center | stretch;  /* 水平对齐 */
  align-items: start | end | center | stretch;    /* 垂直对齐 */
  
  /* 整个网格在容器内的对齐（当网格小于容器时） */
  justify-content: start | end | center | stretch | space-around | space-between | space-evenly;
  align-content: start | end | center | stretch | space-around | space-between | space-evenly;
}
```

## 响应式网格设计

### 使用媒体查询

```css
.container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
}

.item {
  grid-column: span 12;  /* 小屏幕上占满宽度 */
}

@media (min-width: 768px) {
  .item {
    grid-column: span 6;  /* 中屏幕上占一半宽度 */
  }
}

@media (min-width: 1024px) {
  .item {
    grid-column: span 4;  /* 大屏幕上占三分之一宽度 */
  }
}
```

### 使用auto-fill/auto-fit和minmax

```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
```

这会创建一个自适应的网格，根据可用空间自动调整列数，确保每列至少250px宽。

## 浏览器兼容性

CSS Grid在所有现代浏览器中都得到了很好的支持，包括Edge、Firefox、Chrome、Safari和Opera。但如果需要支持IE11，则需要使用备选方案，因为IE11仅支持旧版规范的一部分。

## 实际应用示例

### 经典报纸布局

```css
.newspaper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto auto 1fr auto;
  grid-template-areas:
    "header header header header"
    "sidebar main main main"
    "sidebar main main main"
    "footer footer footer footer";
  gap: 10px;
  height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }

@media (max-width: 768px) {
  .newspaper {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "sidebar"
      "main"
      "footer";
  }
}
```

## 结论

CSS Grid是一个强大的布局工具，可以帮助开发者创建复杂且响应式的网页布局。通过掌握Grid的基本概念和常用技术，你可以大大提高前端开发效率，减少对复杂CSS hack的依赖，创建更加灵活和可维护的网页设计。

尽管Grid看起来有很多属性和概念需要学习，但实际上其核心概念相对简单。随着你的实践和经验积累，你会发现Grid布局能够轻松解决以前需要复杂解决方案的布局问题。 