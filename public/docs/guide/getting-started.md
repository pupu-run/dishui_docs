# 快速开始

本指南将帮助你快速了解如何使用这个文档系统。

## 安装

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev
```

## 创建文档

1. 在 `public/docs/` 目录下创建 `.md` 文件
2. 第一行使用 `# 标题` 作为文档标题
3. 运行 `pnpm run gen:app` 重新生成 App.tsx

## 示例

创建一个新文档 `public/docs/example.md`:

```markdown
# 我的示例文档

这是一个示例文档的内容。

## 章节 1

内容...

## 章节 2

更多内容...
```

然后运行：

```bash
pnpm run gen:app
```

重新启动开发服务器，你的新文档就会出现在菜单中！

