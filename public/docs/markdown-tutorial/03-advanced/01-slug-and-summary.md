# Markdown Slugs 与折叠内容

本章将介绍两个重要的 Markdown 高级特性：标题锚点（Slugs）用于页面内导航，以及可折叠内容（Summary/Details）用于优化长文档的阅读体验。

## 1. Markdown Slugs（标题锚点）

### 1.1 什么是 Slug？

Slug 是从标题自动生成的唯一标识符，用于创建页面内的锚点链接。当你创建一个标题时，Markdown 解析器会自动为其生成一个 slug，使你能够直接链接到文档的特定部分。

### 1.2 Slug 生成规则

标题会按照以下规则转换为 slug：

1. **转换为小写**：所有字母转为小写
2. **替换空格**：空格替换为连字符 `-`
3. **移除特殊字符**：保留字母、数字、连字符和下划线
4. **中文支持**：中文字符通常会被保留或转换为拼音（取决于解析器）

**转换示例：**

| 标题 | 生成的 Slug |
|------|------------|
| `# Hello World` | `#hello-world` |
| `## Getting Started` | `#getting-started` |
| `### API Reference 2.0` | `#api-reference-20` |
| `#### What's New?` | `#whats-new` |

### 1.3 创建锚点链接

#### 基本语法

```markdown
[链接文本](#slug-id)
```

#### 实践示例

**示例 1：基础页面内导航**

```markdown
# 文档目录

- [快速开始](#快速开始)
- [安装指南](#安装指南)
- [配置说明](#配置说明)
- [常见问题](#常见问题)

## 快速开始

这里是快速开始的内容...

## 安装指南

这里是安装指南的内容...

## 配置说明

这里是配置说明的内容...

## 常见问题

这里是常见问题的内容...
```

**示例 2：多级标题导航**

```markdown
# API 文档

## 目录
- [用户管理](#用户管理)
  - [创建用户](#创建用户)
  - [更新用户](#更新用户)
  - [删除用户](#删除用户)
- [权限系统](#权限系统)
  - [角色管理](#角色管理)
  - [权限分配](#权限分配)

## 用户管理

### 创建用户

POST `/api/users`

### 更新用户

PUT `/api/users/:id`

### 删除用户

DELETE `/api/users/:id`

## 权限系统

### 角色管理

管理系统角色...

### 权限分配

分配权限给角色...
```

**示例 3：跨文档链接**

```markdown
<!-- 在 guide.md 中 -->
详细的 API 说明请参考 [API 文档的认证部分](./api.md#认证)

<!-- 在 api.md 中 -->
## 认证

使用 JWT 进行认证...
```

### 1.4 自定义 Slug ID

某些 Markdown 解析器支持自定义 slug ID：

```markdown
## 我的标题 {#custom-id}

[跳转到自定义标题](#custom-id)
```

### 1.5 实用技巧

#### 返回顶部链接

```markdown
# 文档标题 {#top}

## 第一部分

内容...

[返回顶部](#top)

## 第二部分

内容...

[返回顶部](#top)
```

#### 创建侧边栏导航

```markdown
# 完整教程指南

## 📚 快速导航

### 基础篇
- [Markdown 简介](#markdown-简介)
- [基本语法](#基本语法)
- [段落与换行](#段落与换行)

### 进阶篇
- [表格进阶](#表格进阶)
- [代码高亮](#代码高亮)
- [数学公式](#数学公式)

### 高级篇
- [自定义样式](#自定义样式)
- [插件扩展](#插件扩展)

---

## Markdown 简介

Markdown 是一种轻量级标记语言...

## 基本语法

基本语法包括...

## 段落与换行

段落的处理方式...

<!-- 更多章节... -->
```

## 2. Summary 与 Details（可折叠内容）

### 2.1 什么是 Summary/Details？

`<details>` 和 `<summary>` 是 HTML5 元素，用于创建可折叠的内容区域。在 Markdown 中可以直接使用这些 HTML 标签，非常适合：

- 隐藏长代码示例
- 创建 FAQ 问答
- 折叠详细说明
- 优化页面可读性

### 2.2 基本语法

```html
<details>
<summary>点击展开/折叠</summary>

这里是折叠的内容

</details>
```

**渲染效果：**

<details>
<summary>点击展开/折叠</summary>

这里是折叠的内容

</details>

### 2.3 实践示例

#### 示例 1：FAQ 常见问题

```markdown
## 常见问题

<details>
<summary>如何安装这个工具？</summary>

你可以通过以下方式安装：

```bash
npm install my-tool
# 或
yarn add my-tool
```

</details>

<details>
<summary>支持哪些浏览器？</summary>

我们支持以下浏览器：
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

</details>

<details>
<summary>如何配置环境变量？</summary>

创建 `.env` 文件：

```env
API_KEY=your_api_key
DATABASE_URL=postgresql://localhost/mydb
```

</details>
```

**实际效果：**

## 常见问题

<details>
<summary>如何安装这个工具？</summary>

你可以通过以下方式安装：

```bash
npm install my-tool
# 或
yarn add my-tool
```

</details>

<details>
<summary>支持哪些浏览器？</summary>

我们支持以下浏览器：
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

</details>

<details>
<summary>如何配置环境变量？</summary>

创建 `.env` 文件：

```env
API_KEY=your_api_key
DATABASE_URL=postgresql://localhost/mydb
```

</details>

#### 示例 2：代码示例折叠

```markdown
## API 使用示例

<details>
<summary>查看完整代码示例（JavaScript）</summary>

```javascript
// 初始化客户端
const client = new APIClient({
  apiKey: process.env.API_KEY,
  baseURL: 'https://api.example.com'
});

// 获取用户列表
async function getUsers() {
  try {
    const response = await client.get('/users');
    return response.data;
  } catch (error) {
    console.error('获取用户失败:', error);
    throw error;
  }
}

// 创建新用户
async function createUser(userData) {
  try {
    const response = await client.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('创建用户失败:', error);
    throw error;
  }
}

// 使用示例
(async () => {
  const users = await getUsers();
  console.log('用户列表:', users);
  
  const newUser = await createUser({
    name: 'John Doe',
    email: 'john@example.com'
  });
  console.log('新用户:', newUser);
})();
```

</details>

<details>
<summary>查看完整代码示例（Python）</summary>

```python
import os
from api_client import APIClient

# 初始化客户端
client = APIClient(
    api_key=os.getenv('API_KEY'),
    base_url='https://api.example.com'
)

def get_users():
    """获取用户列表"""
    try:
        response = client.get('/users')
        return response.json()
    except Exception as e:
        print(f'获取用户失败: {e}')
        raise

def create_user(user_data):
    """创建新用户"""
    try:
        response = client.post('/users', json=user_data)
        return response.json()
    except Exception as e:
        print(f'创建用户失败: {e}')
        raise

# 使用示例
if __name__ == '__main__':
    users = get_users()
    print('用户列表:', users)
    
    new_user = create_user({
        'name': 'John Doe',
        'email': 'john@example.com'
    })
    print('新用户:', new_user)
```
</details>


#### 示例 3：嵌套折叠内容

```markdown
<details>
<summary>📦 项目结构说明</summary>

## 目录结构

project/
├── src/
│   ├── components/
│   ├── utils/
│   └── main.js
├── tests/
└── package.json

<details>
<summary>src/ 目录详情</summary>

- `components/`: React 组件
- `utils/`: 工具函数
- `main.js`: 应用入口

</details>

<details>
<summary>tests/ 目录详情</summary>

- `unit/`: 单元测试
- `integration/`: 集成测试
- `e2e/`: 端到端测试

</details>

```

**实际效果：**

<details>
<summary>📦 项目结构说明</summary>

## 目录结构

```
project/
├── src/
│   ├── components/
│   ├── utils/
│   └── main.js
├── tests/
└── package.json
```

<details>
<summary>src/ 目录详情</summary>

- `components/`: React 组件
- `utils/`: 工具函数
- `main.js`: 应用入口

</details>

<details>
<summary>tests/ 目录详情</summary>

- `unit/`: 单元测试
- `integration/`: 集成测试
- `e2e/`: 端到端测试

</details>

</details>

#### 示例 4：默认展开状态

使用 `open` 属性使内容默认展开：

```markdown
<details open>
<summary>⚠️ 重要提示（默认展开）</summary>

这是一个重要的警告信息，默认显示给用户。

</details>
```

**实际效果：**

<details open>
<summary>⚠️ 重要提示（默认展开）</summary>

这是一个重要的警告信息，默认显示给用户。

</details>

#### 示例 5：样式化的折叠内容

```markdown
<details>
<summary><strong>🎨 高级配置选项</strong></summary>

### 性能优化

- 启用缓存：`cache: true`
- 压缩输出：`compress: true`
- 懒加载：`lazyLoad: true`

### 安全设置

- CORS 配置：`cors: { origin: '*' }`
- 速率限制：`rateLimit: 100`
- 认证方式：`auth: 'jwt'`

### 日志配置

```json
{
  "level": "info",
  "format": "json",
  "output": "logs/app.log"
}
```

</details>
```

**实际效果：**

<details>
<summary><strong>🎨 高级配置选项</strong></summary>

### 性能优化

- 启用缓存：`cache: true`
- 压缩输出：`compress: true`
- 懒加载：`lazyLoad: true`

### 安全设置

- CORS 配置：`cors: { origin: '*' }`
- 速率限制：`rateLimit: 100`
- 认证方式：`auth: 'jwt'`

### 日志配置

```json
{
  "level": "info",
  "format": "json",
  "output": "logs/app.log"
}
```

</details>

### 2.4 组合使用：Slugs + Details

将锚点链接与折叠内容结合使用：

```markdown
# 完整教程

## 快速导航
- [安装指南](#安装指南)
- [配置说明](#配置说明)
- [API 参考](#api-参考)

---

## 安装指南

<details>
<summary>npm 安装方式</summary>

```bash
npm install my-package
```

</details>

<details>
<summary>yarn 安装方式</summary>

```bash
yarn add my-package
```

</details>

<details>
<summary>pnpm 安装方式</summary>

```bash
pnpm add my-package
```

</details>

## 配置说明

<details>
<summary>基础配置</summary>

```javascript
module.exports = {
  port: 3000,
  host: 'localhost'
};
```

</details>

<details>
<summary>高级配置</summary>

```javascript
module.exports = {
  port: 3000,
  host: 'localhost',
  database: {
    host: 'localhost',
    port: 5432,
    name: 'mydb'
  },
  cache: {
    enabled: true,
    ttl: 3600
  }
};
```

</details>

## API 参考

<details>
<summary>用户 API</summary>

### GET /api/users

获取用户列表

### POST /api/users

创建新用户

</details>

<details>
<summary>产品 API</summary>

### GET /api/products

获取产品列表

### POST /api/products

创建新产品

</details>
```

## 3. 最佳实践

### 3.1 Slugs 使用建议

1. **保持标题简洁**：简短的标题生成更易读的 slug
2. **避免特殊字符**：使用字母、数字和空格
3. **使用描述性标题**：让 slug 本身就能说明内容
4. **测试链接**：确保锚点链接在不同平台都能正常工作

### 3.2 Details/Summary 使用建议

1. **合理使用**：不要过度折叠，重要内容应该直接展示
2. **清晰的标题**：summary 应该准确描述折叠的内容
3. **考虑移动端**：确保在小屏幕上也易于操作
4. **默认状态**：重要内容考虑使用 `open` 属性默认展开
5. **嵌套层级**：避免过深的嵌套（建议不超过 3 层）

### 3.3 实用场景

| 场景 | 推荐方案 |
|------|---------|
| 长文档导航 | 使用 Slugs 创建目录 |
| API 文档 | 使用 Details 折叠代码示例 |
| FAQ 页面 | 使用 Details 折叠答案 |
| 教程文档 | 组合使用 Slugs 和 Details |
| 配置说明 | 使用 Details 折叠详细配置 |
| 错误处理 | 使用 Details 折叠详细错误信息 |

## 4. 浏览器兼容性

### Details/Summary 支持情况

- ✅ Chrome 12+
- ✅ Firefox 49+
- ✅ Safari 6+
- ✅ Edge 79+
- ✅ Opera 15+

所有现代浏览器都完全支持 `<details>` 和 `<summary>` 元素。

## 5. 总结

- **Markdown Slugs** 提供了强大的页面内导航能力，适合创建目录和快速跳转
- **Details/Summary** 元素帮助优化长文档的可读性，让用户按需查看详细内容
- 两者结合使用可以创建结构清晰、易于导航的高质量文档
- 遵循最佳实践，确保文档在各种平台和设备上都有良好的用户体验

## 6. 练习示例

尝试创建一个包含以下内容的文档：

1. 使用 slugs 创建一个多级目录
2. 使用 details 折叠至少 3 个不同类型的内容
3. 组合使用两者创建一个完整的 FAQ 页面
4. 添加"返回顶部"链接

<details>
<summary>查看参考答案</summary>

```markdown
# 我的项目文档 {#top}

## 📑 目录
- [快速开始](#快速开始)
- [安装](#安装)
- [常见问题](#常见问题)

---

## 快速开始

欢迎使用我的项目！

[返回顶部](#top)

## 安装

<details>
<summary>npm 安装</summary>

```bash
npm install my-project
```

</details>

<details>
<summary>yarn 安装</summary>

```bash
yarn add my-project
```

</details>

[返回顶部](#top)

## 常见问题

<details>
<summary>如何开始？</summary>

运行 `npm start` 即可启动项目。

</details>

<details>
<summary>遇到错误怎么办？</summary>

请查看[错误处理指南](#错误处理)。

</details>

[返回顶部](#top)
```

</details>

---

**下一章：** [Markmap 思维导图](./02-markmap.md)

