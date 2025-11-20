# Another Doc Site？

欢迎使用文档系统！

这是一个自动生成的文档浏览系统，所有文档都基于 `public/docs/` 目录下的 markdown 文件自动生成。

## 特性

- 🚀 自动扫描文档目录
- 📝 支持 Markdown 渲染
- 🎨 支持 Markmap 思维导图
- 🔍 自动生成搜索配置
- 📱 响应式设计

## 使用方法

0. 执行`pnpm install`安装依赖包
1. 在 `public/docs/` 目录下添加 `.md` 文件
2. 运行 `pnpm run gen:app` 生成新的 App.tsx
3. 启动开发服务器查看效果， 运行`pnpm run dev`

## 文档结构

支持嵌套目录，如：
- `/docs/index.md` → 首页

