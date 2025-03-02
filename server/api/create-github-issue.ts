import { defineEventHandler, readBody, createError } from 'h3'

// GitHub仓库信息
const GITHUB_OWNER = 'OSpoon' // 替换为您的GitHub用户名
const GITHUB_REPO = 'zanx-fun' // 替换为您希望接收留言的仓库名
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`

export default defineEventHandler(async (event) => {
  try {
    // 获取请求体数据
    const body = await readBody(event)
    const { title, body: issueBody } = body

    // 验证数据
    if (!title || !issueBody) {
      throw createError({
        statusCode: 400,
        statusMessage: '标题和正文不能为空'
      })
    }

    // 从环境变量获取GitHub访问令牌
    const githubToken = process.env.GITHUB_TOKEN
    if (!githubToken) {
      throw createError({
        statusCode: 500,
        statusMessage: 'GitHub访问令牌未配置'
      })
    }

    // 调用GitHub API创建issue
    const response = await fetch(GITHUB_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${githubToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        body: issueBody,
        labels: ['网站留言']
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: data.message || '创建GitHub Issue失败'
      })
    }

    // 返回成功响应
    return {
      success: true,
      issueUrl: data.html_url,
      message: '留言已成功提交'
    }
  } catch (error: any) {
    console.error('创建GitHub Issue出错:', error)
    
    // 返回格式化的错误响应
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || '服务器内部错误'
    })
  }
}) 