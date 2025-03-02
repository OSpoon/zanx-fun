import fs from 'fs'
import path from 'path'
import { defineEventHandler, getQuery } from 'h3'
import matter from 'gray-matter'

const contentDir = path.join(process.cwd(), 'content/articles')

// 从文件名生成slug
function generateSlug(filename: string): string {
  return filename.replace(/\.md$/, '')
}

// 获取所有文章的元数据
async function getArticlesMetadata() {
  try {
    const files = await fs.promises.readdir(contentDir)
    const markdownPosts = files.filter(file => file.endsWith('.md'))
    
    const posts = await Promise.all(markdownPosts.map(async (fileName) => {
      const slug = generateSlug(fileName)
      const filePath = path.join(contentDir, fileName)
      
      try {
        const fileContent = await fs.promises.readFile(filePath, 'utf-8')
        const { data } = matter(fileContent)
        
        return {
          slug,
          title: {
            zh: data.title?.zh || data.title || '',
            en: data.title?.en || data.title || ''
          },
          description: {
            zh: data.description?.zh || data.description || '',
            en: data.description?.en || data.description || ''
          },
          date: data.date || '',
          originalUrl: data.originalUrl || ''
        }
      } catch (err) {
        console.error(`Error reading file ${fileName}:`, err)
        return null
      }
    }))
    
    // 过滤掉读取失败的文章并按日期排序
    return posts
      .filter(post => post !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (err) {
    console.error('Error reading articles directory:', err)
    return []
  }
}

// 获取单篇文章的内容
async function getArticleContent(slug: string) {
  try {
    const filePath = path.join(contentDir, `${slug}.md`)
    const fileContent = await fs.promises.readFile(filePath, 'utf-8')
    
    const { data, content } = matter(fileContent)
    
    return {
      slug,
      title: {
        zh: data.title?.zh || data.title || '',
        en: data.title?.en || data.title || ''
      },
      description: {
        zh: data.description?.zh || data.description || '',
        en: data.description?.en || data.description || ''
      },
      date: data.date || '',
      originalUrl: data.originalUrl || '',
      content
    }
  } catch (err) {
    console.error(`Error reading article ${slug}:`, err)
    return null
  }
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const slug = query.slug as string
  
  if (slug) {
    // 获取单篇文章的内容
    return await getArticleContent(slug)
  } else {
    // 获取所有文章的元数据列表
    return await getArticlesMetadata()
  }
}) 