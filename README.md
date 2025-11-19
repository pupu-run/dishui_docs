# Learn DiShuI - 文档系统

一个基于 Vite + React + DiShuI 的自动化文档生成系统。

## ✨ 特性

- 🚀 **自动生成**: 扫描 `public/docs/` 目录，自动生成路由和菜单
- 📝 **Markdown 支持**: 完整的 Markdown 渲染支持
- 🎨 **Markmap 思维导图**: 支持将 Markdown 渲染为思维导图
- 🔍 **搜索功能**: 自动生成搜索配置，支持实时搜索文档
- 📱 **响应式设计**: 完美的移动端适配
- 🎯 **层级菜单**: 支持多级目录结构，自动生成嵌套菜单
- ⚡ **实时预览**: 修改文档后重新生成即可查看效果

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 创建文档

1. 在 `public/docs/` 目录下创建 `.md` 文件
2. 第一行使用 `# 标题` 格式作为文档标题
3. 运行生成命令

```bash
pnpm run gen:app
```

### 启动开发服务器

```bash
pnpm run dev
```

### 构建生产版本

```bash
pnpm run build
```

## 📁 文档结构

```
public/docs/
├── index.md                    # 首页 (路径: /)
├── components.md               # 组件文档 (路径: /components)
├── guide/                      # 指南目录 → 生成父菜单 "使用指南"
│   ├── index.md                # 指南首页 (路径: /guide)
│   └── getting-started.md      # 快速开始 (路径: /guide/getting-started)
└── api/                        # API 目录 → 生成父菜单 "API 文档"
    ├── index.md                # API 首页 (路径: /api)
    ├── components.md           # 组件 API (路径: /api/components)
    └── utils.md                # 工具函数 (路径: /api/utils)
```

### 路径映射规则

- `index.md` → `/` (首页，根目录的 index.md)
- `components.md` → `/components`
- `guide/index.md` → `/guide` (目录首页，作为父菜单)
- `guide/getting-started.md` → `/guide/getting-started` (作为子菜单)
- `api/index.md` → `/api` (目录首页，作为父菜单)
- `api/components.md` → `/api/components` (作为子菜单)

### 层级菜单生成规则

1. **根目录文件** → 生成顶级菜单项
2. **子目录 + index.md** → 生成父菜单项（使用 index.md 的标题）
3. **子目录中的其他 .md 文件** → 生成该父菜单的 `children`
4. **支持无限嵌套** → 可以有 `docs/guide/advanced/concepts.md` 等

## 📝 创建文档示例

创建 `public/docs/example.md`:

```markdown
# 我的示例文档

这是文档的内容。

## 章节 1

内容...

## 章节 2

更多内容...
```

然后运行：

```bash
pnpm run gen:app
```

生成后的效果：
- **菜单**: 自动添加 "我的示例文档" 菜单项
- **路由**: 访问 `/example` 显示文档内容
- **搜索**: 自动索引到搜索配置中

## 🛠️ 可用命令

| 命令 | 说明 |
|------|------|
| `pnpm run dev` | 启动开发服务器 |
| `pnpm run build` | 构建生产版本 |
| `pnpm run preview` | 预览生产构建 |
| `pnpm run gen:app` | 🎯 生成 App.tsx (扫描 docs 目录) |

## 🎯 自动生成的内容

运行 `pnpm run gen:app` 后，脚本会：

1. ✅ 扫描 `public/docs/` 目录下所有 `.md` 文件（支持嵌套目录）
2. ✅ 读取每个文件的第一行 `#` 标题作为菜单名称
3. ✅ 生成对应的 React Router 路由
4. ✅ 生成层级菜单配置 (`menuItems`)，带 `children` 嵌套
5. ✅ 生成搜索配置 (`searchConfig`)，包含搜索函数
6. ✅ 自动覆盖 `src/App.tsx`

### 生成示例

**输入**:
```
public/docs/
├── index.md           # 首页
├── guide.md           # 指南
└── api/
    ├── index.md       # API 文档首页
    └── reference.md   # API参考
```

**输出**: `src/App.tsx` 包含:
- **4 个路由**: `/`, `/guide`, `/api`, `/api/reference`
- **3 个菜单项**: 
  - "首页" (顶级)
  - "指南" (顶级)
  - "API 文档" (顶级，包含 children: ["API参考"])
- **搜索配置**: 
  - 包含所有 4 个文档的搜索数据
  - 支持按标题和 ID 搜索
  - 快捷键 `⌘K` (Mac) / `Ctrl+K` (Windows/Linux)

## 🎨 文档功能

### Markdown 特性

支持标准 Markdown 语法：
- 标题 (`#` - `######`)
- 列表（有序/无序）
- 代码块（带语法高亮）
- 表格
- 引用
- 链接和图片
- 等等...

### Markmap 思维导图

文档会自动启用 Markmap，可以将 Markdown 结构渲染为交互式思维导图。

### MDX 支持

支持在 Markdown 中使用 React 组件（需要 `enableMdx={true}`）。

## 📖 最佳实践

### 1. 使用 index.md 作为首页

始终创建 `public/docs/index.md` 作为首页，它会自动映射到 `/` 路径。

### 2. 有意义的标题

确保每个文档的第一行是清晰的标题：

```markdown
# 清晰的文档标题

文档内容...
```

### 3. 目录组织

使用子目录组织相关文档：

```
docs/
├── index.md
├── guide/
│   ├── getting-started.md
│   ├── installation.md
│   └── configuration.md
└── api/
    ├── components.md
    └── hooks.md
```

### 4. 每次修改后重新生成

添加、删除或修改文档文件名后，记得运行：

```bash
pnpm run gen:app
```

## 🔧 技术栈

- **框架**: React 19
- **构建工具**: Vite 6
- **路由**: TanStack Router
- **UI 组件**: DiShuI
- **样式**: Tailwind CSS + DaisyUI
- **Markdown**: react-markdown (via DiShuI)

## 📦 目录结构

```
dishui_docs/
├── public/
│   └── docs/              # 📁 文档目录
│       ├── index.md       # 首页
│       └── ...
├── scripts/
│   └── generate-app.js    # 🔧 自动生成脚本
├── src/
│   ├── App.tsx           # ⚙️ 自动生成的主应用
│   ├── main.tsx          # 入口文件
│   └── index.css         # 样式
├── package.json
└── vite.config.ts
```

## 🤝 工作流程

```bash
# 1. 创建或修改文档
echo "# 新文档" > public/docs/new-doc.md

# 2. 运行生成脚本
pnpm run gen:app

# 3. 启动开发服务器 (如果还没运行)
pnpm run dev

# 4. 在浏览器中查看 http://localhost:5173
```

## 💡 提示

- 生成的 `App.tsx` 会被完全覆盖，不要手动编辑
- 如果需要自定义，修改 `scripts/generate-app.js`
- 文档文件名会影响 URL 路径
- 支持多级嵌套目录

## 📄 许可证

ISC

