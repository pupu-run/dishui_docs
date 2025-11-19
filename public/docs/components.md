# 组件文档

这里展示系统支持的各种 Markdown 特性和组件。

## 基础语法

### 标题

使用 `#` 创建标题，支持 1-6 级标题。

### 列表

无序列表：
- 项目 1
- 项目 2
  - 子项目 2.1
  - 子项目 2.2
- 项目 3

有序列表：
1. 第一步
2. 第二步
3. 第三步

### 代码

行内代码：`const hello = "world";`

代码块：

```typescript
interface User {
    id: number;
    name: string;
    email: string;
}

function greetUser(user: User) {
    console.log(`Hello, ${user.name}!`);
}
```

### 引用

> 这是一段引用文本。
> 可以多行显示。

### 表格

| 功能 | 支持 | 备注 |
|------|------|------|
| Markdown | ✅ | 完整支持 |
| Markmap | ✅ | 思维导图 |
| MDX | ✅ | React 组件 |

## 特殊功能

### Markmap 思维导图

支持将 Markdown 渲染为思维导图（需要启用 `enableMarkmap`）。

### MDX 组件

支持在 Markdown 中使用 React 组件（需要启用 `enableMdx`）。

## 链接

- [外部链接](https://github.com)
- [文档首页](/)
- [快速开始](/guide/getting-started)

