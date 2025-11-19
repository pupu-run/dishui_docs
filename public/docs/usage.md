# 系统使用说明

本文档介绍如何使用这个自动化文档生成系统。

## 📋 基本流程

```bash
# 1. 创建或修改文档
echo "# 新文档" > public/docs/new-doc.md

# 2. 运行生成命令
pnpm run gen:app

# 3. 查看效果（开发环境）
pnpm run dev
```

## 📁 文档组织

### 单文件文档

直接在 `public/docs/` 创建 `.md` 文件：

```
public/docs/
├── index.md        → 首页 (/)
└── about.md        → 关于 (/about)
```

### 嵌套文档（推荐）

使用目录组织相关文档：

```
public/docs/
├── index.md
└── guide/
    ├── index.md           → 指南首页，作为父菜单标题
    ├── installation.md    → 子菜单项
    └── configuration.md   → 子菜单项
```

**效果**：
- 菜单显示 "使用指南"（来自 guide/index.md 的标题）
- 包含 2 个子菜单：安装、配置

### 多级嵌套

支持任意深度嵌套：

```
public/docs/
└── api/
    ├── index.md
    ├── components/
    │   ├── index.md
    │   ├── button.md
    │   └── input.md
    └── utils/
        ├── index.md
        └── helpers.md
```

## ✍️ 编写文档

### 文件标题

每个文档的**第一行**必须是 `#` 标题，这会成为菜单项的名称：

```markdown
# 我的文档标题

这是内容...
```

### 支持的 Markdown

- ✅ 标题 (H1-H6)
- ✅ 列表（有序/无序）
- ✅ 代码块（带语法高亮）
- ✅ 表格
- ✅ 引用
- ✅ 链接
- ✅ 图片
- ✅ 思维导图（Markmap）
- ✅ Mermaid 图表

### 文档间链接

使用生成的路径进行链接：

```markdown
查看 [快速开始](/guide/getting-started) 了解更多。
```

## 🔄 更新流程

### 添加新文档

```bash
# 1. 创建文档
mkdir -p public/docs/tutorials
echo "# 第一个教程" > public/docs/tutorials/first.md

# 2. 重新生成
pnpm run gen:app

# 3. 刷新浏览器查看新菜单项
```

### 修改文档内容

**无需重新生成**，直接编辑文档内容，刷新浏览器即可看到更新。

### 修改文档结构

如果重命名文件、移动文件位置、或修改第一行标题，需要：

```bash
pnpm run gen:app
```

### 删除文档

```bash
# 1. 删除文件
rm public/docs/old-doc.md

# 2. 重新生成
pnpm run gen:app
```

## 🔍 搜索功能

系统自动生成搜索配置，用户可以：

- 点击导航栏的搜索按钮
- 使用快捷键 `⌘K` (Mac) 或 `Ctrl+K` (Windows/Linux)
- 输入关键词搜索所有文档

搜索支持：
- 按标题搜索
- 按文档 ID 搜索
- 结果按相关性排序

## 🎯 最佳实践

### 1. 使用有意义的文件名

❌ 不好：
```
public/docs/doc1.md
public/docs/doc2.md
```

✅ 好：
```
public/docs/installation.md
public/docs/configuration.md
```

### 2. 合理组织目录结构

根据内容类型分类：

```
public/docs/
├── index.md            # 首页
├── guide/              # 指南类
│   └── ...
├── api/                # API 文档
│   └── ...
├── tutorials/          # 教程类
│   └── ...
└── faq.md              # 常见问题
```

### 3. 为每个目录创建 index.md

这样可以：
- 提供该章节的概览
- 自定义父菜单的标题
- 提供导航链接

### 4. 统一文档风格

每个文档保持相似的结构：

```markdown
# 文档标题

简短描述...

## 概述

主要内容...

## 示例

代码示例...

## 注意事项

提示和警告...
```

## 🚀 高级用法

### 修改生成脚本

如果需要自定义生成逻辑，编辑：

```
scripts/generate-app.js
```

例如：
- 修改图标
- 调整菜单顺序
- 自定义搜索算法
- 添加文档分类标签

### 自定义样式

编辑 `src/index.css` 添加自定义样式。

### 集成 CI/CD

在 CI/CD 流程中自动生成：

```yaml
# .github/workflows/deploy.yml
- name: Generate App
  run: pnpm run gen:app

- name: Build
  run: pnpm run build
```

## 🐛 常见问题

### 菜单没有更新？

确保运行了 `pnpm run gen:app` 并刷新浏览器。

### 文档显示 404？

检查文件路径和生成的路由是否匹配。

### 搜索找不到文档？

重新运行 `pnpm run gen:app` 更新搜索索引。

### 中文标题显示问题？

确保文件使用 UTF-8 编码保存。

## 📚 相关文档

- [快速开始](/guide/getting-started)
- [API 文档](/api)
- [组件文档](/components)

