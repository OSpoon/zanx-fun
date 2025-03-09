import { defineEventHandler, getQuery } from 'h3'

// 定义书签接口
interface Bookmark {
  id: string
  title: string
  url: string
  description: string
  category: string
  createdAt: string
  favicon?: string
}

// 示例书签数据
const bookmarksData: Bookmark[] = [
  {
    id: '1',
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org/',
    description: 'Resources for developers, by developers. Documentation for web technologies including HTML, CSS, JavaScript and more.',
    category: 'Documentation',
    createdAt: '2023-01-15T08:00:00.000Z',
    favicon: 'https://developer.mozilla.org/favicon.ico'
  },
  {
    id: '2',
    title: 'Vue.js Documentation',
    url: 'https://vuejs.org/',
    description: 'Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web.',
    category: 'Framework',
    createdAt: '2023-02-20T15:30:00.000Z',
    favicon: 'https://vuejs.org/logo.svg'
  },
  {
    id: '3',
    title: 'Nuxt.js - The Intuitive Vue Framework',
    url: 'https://nuxt.com/',
    description: 'Nuxt is an open source framework making web development simple and powerful.',
    category: 'Framework',
    createdAt: '2023-03-05T10:15:00.000Z',
    favicon: 'https://nuxt.com/favicon.ico'
  },
  {
    id: '4',
    title: 'Tailwind CSS - Rapidly build modern websites',
    url: 'https://tailwindcss.com/',
    description: 'A utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup.',
    category: 'CSS',
    createdAt: '2023-03-10T14:45:00.000Z',
    favicon: 'https://tailwindcss.com/favicon.ico'
  },
  {
    id: '5',
    title: 'GitHub: Let\'s build from here',
    url: 'https://github.com/',
    description: 'GitHub is where over 100 million developers shape the future of software, together.',
    category: 'Development',
    createdAt: '2023-04-08T09:20:00.000Z',
    favicon: 'https://github.com/favicon.ico'
  },
  {
    id: '6',
    title: 'Stack Overflow - Where Developers Learn & Share',
    url: 'https://stackoverflow.com/',
    description: 'Stack Overflow is the largest, most trusted online community for developers to learn and share their programming knowledge.',
    category: 'Community',
    createdAt: '2023-05-12T16:40:00.000Z',
    favicon: 'https://stackoverflow.com/favicon.ico'
  },
  {
    id: '7',
    title: 'TypeScript - JavaScript with syntax for types',
    url: 'https://www.typescriptlang.org/',
    description: 'TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.',
    category: 'Language',
    createdAt: '2023-06-01T11:30:00.000Z',
    favicon: 'https://www.typescriptlang.org/favicon.ico'
  }
]

// 根据查询参数过滤书签
function filterBookmarks(bookmarks: Bookmark[], query: any): Bookmark[] {
  let filteredBookmarks = [...bookmarks]
  
  // 按分类过滤
  if (query.category && query.category !== 'all') {
    filteredBookmarks = filteredBookmarks.filter(
      bookmark => bookmark.category.toLowerCase() === query.category.toLowerCase()
    )
  }
  
  // 按关键字搜索
  if (query.search) {
    const searchTerm = query.search.toLowerCase()
    filteredBookmarks = filteredBookmarks.filter(
      bookmark => 
        bookmark.title.toLowerCase().includes(searchTerm) || 
        bookmark.description.toLowerCase().includes(searchTerm) ||
        bookmark.url.toLowerCase().includes(searchTerm)
    )
  }
  
  return filteredBookmarks
}

export default defineEventHandler((event) => {
  const query = getQuery(event)
  
  // 应用过滤器
  const filteredBookmarks = filterBookmarks(bookmarksData, query)
  
  return filteredBookmarks
})