# CodeMirror 6 简介与架构

## 什么是 CodeMirror 6？

CodeMirror 6 是一个用于 Web 的代码编辑器组件库，它提供了构建强大代码编辑器所需的所有功能。相比于 CodeMirror 5，它采用了全新的架构设计，具有更好的性能、更强的可扩展性和更现代的 API。

### 为什么选择 CodeMirror 6？

- **高性能**：采用增量更新和虚拟滚动技术，可以流畅处理大型文档
- **模块化**：核心功能和扩展功能分离，按需加载
- **类型安全**：使用 TypeScript 编写，提供完整的类型定义
- **可扩展**：通过扩展系统可以轻松添加新功能
- **移动端友好**：支持触摸操作和移动设备

## 核心架构

CodeMirror 6 的架构基于几个核心概念：

### 1. State（状态）

编辑器的状态是**不可变**的，包含了文档内容、选区、配置等所有信息。每次修改都会产生一个新的状态对象。

```typescript
import { EditorState } from "@codemirror/state"

// 创建一个简单的状态
const state = EditorState.create({
  doc: "Hello, CodeMirror 6!",
  extensions: []
})
```

**State 包含的内容：**
- 文档内容（Document）
- 选区（Selection）
- 扩展配置（Extensions）
- 各种状态字段（State Fields）

### 2. Transaction（事务）

Transaction 描述了状态的变化。所有对编辑器的修改都通过事务来完成。

```typescript
import { Transaction } from "@codemirror/state"

// 创建一个插入文本的事务
const transaction = state.update({
  changes: { from: 0, insert: "New text: " }
})

// 应用事务，得到新状态
const newState = transaction.state
```

**Transaction 的特点：**
- 描述性的：描述"做什么"而不是"怎么做"
- 原子性的：要么全部应用，要么全部不应用
- 可追踪的：可以用于实现撤销/重做功能

### 3. View（视图）

View 负责将状态渲染到 DOM，并处理用户交互。

```typescript
import { EditorView } from "@codemirror/view"

const view = new EditorView({
  state: state,
  parent: document.body
})
```

**View 的职责：**
- 将状态渲染为 DOM
- 处理用户输入事件
- 管理 DOM 更新
- 协调各种视图插件

### 4. Extension（扩展）

扩展是 CodeMirror 6 的核心概念，几乎所有功能都通过扩展来实现。

```typescript
import { EditorState } from "@codemirror/state"
import { lineNumbers, highlightActiveLineGutter } from "@codemirror/view"

const state = EditorState.create({
  doc: "Hello, World!",
  extensions: [
    lineNumbers(),
    highlightActiveLineGutter()
  ]
})
```

**扩展的类型：**
- **State Fields**：添加额外的状态信息
- **View Plugins**：添加 DOM 交互和渲染逻辑
- **Facets**：配置点，允许多个扩展共同影响某个行为
- **Transaction Filters**：过滤或修改事务
- **Transaction Extenders**：为事务添加额外信息

## 架构图解

```
┌─────────────────────────────────────────┐
│           EditorView (视图层)            │
│  ┌─────────────────────────────────┐   │
│  │      DOM Rendering              │   │
│  │      Event Handling             │   │
│  └─────────────────────────────────┘   │
└──────────────┬──────────────────────────┘
               │ dispatch(transaction)
               ▼
┌─────────────────────────────────────────┐
│         EditorState (状态层)             │
│  ┌─────────────────────────────────┐   │
│  │  Document                       │   │
│  │  Selection                      │   │
│  │  Extensions                     │   │
│  │  State Fields                   │   │
│  └─────────────────────────────────┘   │
└──────────────┬──────────────────────────┘
               │ update()
               ▼
┌─────────────────────────────────────────┐
│       Transaction (事务层)               │
│  ┌─────────────────────────────────┐   │
│  │  Changes                        │   │
│  │  Effects                        │   │
│  │  Annotations                    │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│        Extensions (扩展层)               │
│  ┌─────────────────────────────────┐   │
│  │  Language Support               │   │
│  │  Autocompletion                 │   │
│  │  Linting                        │   │
│  │  Themes                         │   │
│  │  Custom Features                │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## 数据流

CodeMirror 6 采用**单向数据流**：

1. **用户交互** → View 捕获事件
2. **创建 Transaction** → 描述状态变化
3. **应用 Transaction** → 生成新的 State
4. **更新 View** → 渲染新状态到 DOM

```
User Input → View → Transaction → New State → Updated View
     ▲                                              │
     └──────────────────────────────────────────────┘
```

## 核心包介绍

CodeMirror 6 被拆分成多个包：

### @codemirror/state
核心状态管理包，提供：
- `EditorState`：编辑器状态
- `Transaction`：状态变更
- `StateField`：自定义状态字段
- `Facet`：配置系统

### @codemirror/view
视图层包，提供：
- `EditorView`：编辑器视图
- `Decoration`：装饰器（用于样式和小部件）
- `ViewPlugin`：视图插件
- 各种视图相关的扩展

### @codemirror/commands
编辑命令包，提供：
- 基本编辑命令（复制、粘贴、撤销等）
- 键盘快捷键绑定
- 常用编辑操作

### @codemirror/language
语言支持包，提供：
- 语法解析
- 语法树访问
- 代码折叠
- 缩进处理

### @codemirror/autocomplete
自动补全包，提供：
- 补全系统
- 补全 UI
- 补全源管理

### @codemirror/lint
代码检查包，提供：
- Linting 系统
- 错误/警告显示
- 快速修复

### @codemirror/search
搜索功能包，提供：
- 搜索和替换
- 正则表达式搜索
- 搜索 UI

## 设计理念

### 1. 不可变性（Immutability）

状态是不可变的，每次修改都创建新对象。这带来了：
- **可预测性**：状态变化清晰可追踪
- **时间旅行**：容易实现撤销/重做
- **性能优化**：可以使用引用比较

### 2. 组合性（Composability）

功能通过扩展组合，而不是继承：
- 扩展可以独立开发和测试
- 扩展可以自由组合
- 避免了继承的复杂性

### 3. 性能优先（Performance First）

- 增量更新：只更新变化的部分
- 虚拟滚动：只渲染可见区域
- 延迟计算：按需计算昂贵的操作

### 4. 可访问性（Accessibility）

- 支持屏幕阅读器
- 完整的键盘导航
- ARIA 属性支持

## 与 CodeMirror 5 的对比

| 特性 | CodeMirror 5 | CodeMirror 6 |
|------|-------------|-------------|
| 架构 | 面向对象 | 函数式 + 不可变 |
| 状态管理 | 可变状态 | 不可变状态 |
| 扩展系统 | 选项 + 插件 | 统一的扩展系统 |
| 性能 | 较好 | 优秀 |
| 类型支持 | 无 | TypeScript |
| 移动端 | 基础支持 | 完整支持 |
| 包大小 | 单一包 | 模块化包 |

## 最小示例

让我们看一个最简单的 CodeMirror 6 编辑器：

```typescript
import { EditorState } from "@codemirror/state"
import { EditorView, basicSetup } from "codemirror"

const state = EditorState.create({
  doc: "console.log('Hello, CodeMirror 6!')",
  extensions: [basicSetup]
})

const view = new EditorView({
  state,
  parent: document.getElementById("editor")!
})
```

这个简单的示例创建了一个功能完整的编辑器，包含：
- 行号
- 语法高亮
- 括号匹配
- 撤销/重做
- 搜索功能
- 等等...

## 小结

在本章中，我们学习了：

- ✅ CodeMirror 6 的核心概念：State、Transaction、View、Extension
- ✅ CodeMirror 6 的架构设计和数据流
- ✅ 核心包的功能划分
- ✅ 设计理念和优势
- ✅ 与 CodeMirror 5 的区别

## 下一步

现在你已经理解了 CodeMirror 6 的架构，接下来我们将学习如何在 React 应用中集成 CodeMirror 6。

👉 [下一章：基础设置与 React 集成](./02-react-integration.md)


