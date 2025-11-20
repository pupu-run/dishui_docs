# GitHub Flavored Markdown (GFM)

GitHub Flavored Markdown（GFM）是 GitHub 使用的 Markdown 变体，在标准 Markdown 基础上增加了许多实用功能。

## 自动链接

GFM 会自动将 URL 转换为链接，无需使用 `<>` 包围。

### 标准 Markdown

```markdown
<https://github.com>
```

### GFM

```markdown
https://github.com
www.github.com
```

效果：

https://github.com  
www.github.com

## 删除线

使用双波浪线 `~~` 创建删除线。

```markdown
~~这段文字被删除了~~

价格：~~¥100~~ ¥80（打八折！）
```

效果：

~~这段文字被删除了~~

价格：~~¥100~~ ¥80（打八折！）

## 任务列表

在列表项前添加 `[ ]` 或 `[x]` 创建任务列表。

```markdown
- [x] 完成需求分析
- [x] 完成 UI 设计
- [ ] 完成前端开发
- [ ] 完成后端开发
- [ ] 完成测试
```

效果：

- [x] 完成需求分析
- [x] 完成 UI 设计
- [ ] 完成前端开发
- [ ] 完成后端开发
- [ ] 完成测试

### 嵌套任务列表

```markdown
- [x] 前端开发
  - [x] 组件开发
    - [x] Button 组件
    - [x] Input 组件
  - [ ] 页面开发
    - [x] 首页
    - [ ] 详情页
- [ ] 后端开发
  - [ ] API 开发
  - [ ] 数据库设计
```

效果：

- [x] 前端开发
  - [x] 组件开发
    - [x] Button 组件
    - [x] Input 组件
  - [ ] 页面开发
    - [x] 首页
    - [ ] 详情页
- [ ] 后端开发
  - [ ] API 开发
  - [ ] 数据库设计

## 表格

GFM 支持创建表格（前面章节已详细介绍）。

```markdown
| 功能 | 支持 |
| --- | :---: |
| 表格 | ✅ |
| 任务列表 | ✅ |
| 删除线 | ✅ |
```

效果：

| 功能 | 支持 |
| --- | :---: |
| 表格 | ✅ |
| 任务列表 | ✅ |
| 删除线 | ✅ |

## 代码块语法高亮

GFM 支持大量编程语言的语法高亮。

### Diff 高亮

显示代码的增删改：

````markdown
```diff
function add(a, b) {
-  return a + b;
+  return a + b + 1;
}
```
````

效果：

```diff
function add(a, b) {
-  return a + b;
+  return a + b + 1;
}
```

### 带行号和高亮

某些平台支持高亮特定行：

````markdown
```javascript
function fibonacci(n) {
  if (n <= 1) return n;  // 基础情况
  return fibonacci(n - 1) + fibonacci(n - 2);  // 递归调用
}
```
````

## 引用 Issue 和 PR

在 GitHub 上，可以直接引用 Issue 和 Pull Request。

```markdown
修复了 #123 中的 bug

参考 #456 和 #789

关闭 #100
```

效果（在 GitHub 上）：
- `#123` 会自动链接到对应的 Issue
- 可以使用 `user/repo#123` 引用其他仓库的 Issue

## 引用用户和团队

使用 `@` 提及用户或团队。

```markdown
@username 请审查这个 PR

@org/team 请注意这个问题
```

效果（在 GitHub 上）：
- 被提及的用户会收到通知
- 会自动创建链接到用户主页

## 引用提交

可以引用 Git 提交的 SHA 值。

```markdown
查看提交 a5c3785ed8d6a35868bc169f07e40e889087fd2e

简写形式：a5c3785
```

效果（在 GitHub 上）：
- SHA 值会自动链接到对应的提交

## Emoji 表情

GFM 支持使用 `:emoji_name:` 语法插入表情。

### 常用 Emoji

```markdown
:smile: :heart: :thumbsup: :fire: :rocket:
:star: :sparkles: :tada: :100: :white_check_mark:
:warning: :x: :heavy_check_mark: :bulb: :zap:
:book: :pencil: :memo: :computer: :wrench:
```

效果：

:smile: :heart: :thumbsup: :fire: :rocket:  
:star: :sparkles: :tada: :100: :white_check_mark:  
:warning: :x: :heavy_check_mark: :bulb: :zap:  
:book: :pencil: :memo: :computer: :wrench:

### 实际应用

```markdown
## 项目状态

- :white_check_mark: 已完成
- :construction: 进行中
- :x: 未开始

## 更新日志

### v2.0.0 :tada:

- :sparkles: 新增深色模式
- :bug: 修复登录问题
- :zap: 性能优化
- :memo: 更新文档
```

效果：

## 项目状态

- :white_check_mark: 已完成
- :construction: 进行中
- :x: 未开始

## 更新日志

### v2.0.0 :tada:

- :sparkles: 新增深色模式
- :bug: 修复登录问题
- :zap: 性能优化
- :memo: 更新文档

### Emoji 速查

| 类别 | Emoji | 代码 |
| --- | :---: | --- |
| 状态 | ✅ | `:white_check_mark:` |
| 状态 | ❌ | `:x:` |
| 状态 | ⚠️ | `:warning:` |
| 动作 | 🚀 | `:rocket:` |
| 动作 | ⚡ | `:zap:` |
| 动作 | 🔥 | `:fire:` |
| 情感 | 😀 | `:smile:` |
| 情感 | ❤️ | `:heart:` |
| 情感 | 👍 | `:thumbsup:` |
| 对象 | 📝 | `:memo:` |
| 对象 | 💡 | `:bulb:` |
| 对象 | 🔧 | `:wrench:` |

完整列表：[Emoji Cheat Sheet](https://github.com/ikatyang/emoji-cheat-sheet)

## 折叠内容

使用 `<details>` 和 `<summary>` 标签。

```html
<details>
<summary>点击查看详情</summary>

### 这是隐藏的内容

可以包含任何 Markdown 内容：

- 列表
- **格式化文本**
- 代码块

```python
print("Hello, World!")
```

</details>
```

效果：

<details>
<summary>点击查看详情</summary>

### 这是隐藏的内容

可以包含任何 Markdown 内容：

- 列表
- **格式化文本**
- 代码块

```python
print("Hello, World!")
```

</details>

## 脚注

GFM 支持脚注（某些平台）。

```markdown
这是一段文字[^1]。

这是另一段文字[^note]。

[^1]: 这是第一个脚注。
[^note]: 这是一个命名脚注。
```

## 目录（TOC）

某些平台会自动生成目录，或者可以手动创建：

```markdown
## 目录

- [简介](#简介)
- [安装](#安装)
- [使用方法](#使用方法)
- [API 文档](#api-文档)
```

## 提示框（Alerts）

GitHub 最近新增的功能：

```markdown
> [!NOTE]
> 提示信息

> [!TIP]
> 小技巧

> [!IMPORTANT]
> 重要信息

> [!WARNING]
> 警告信息

> [!CAUTION]
> 注意事项
```

效果：

> [!NOTE]
> 提示信息

> [!TIP]
> 小技巧

> [!IMPORTANT]
> 重要信息

> [!WARNING]
> 警告信息

> [!CAUTION]
> 注意事项

## 实践：创建一个完整的 README

````markdown
# 项目名称 :rocket:

![GitHub stars](https://img.shields.io/github/stars/user/repo?style=social)
![GitHub forks](https://img.shields.io/github/forks/user/repo?style=social)
![License](https://img.shields.io/badge/license-MIT-blue)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)

> 一个简短的项目描述

## :sparkles: 特性

- :white_check_mark: 功能一
- :white_check_mark: 功能二
- :construction: 功能三（开发中）

## :book: 目录

- [安装](#安装)
- [快速开始](#快速开始)
- [API 文档](#api-文档)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

## :package: 安装

```bash
npm install package-name
```

或使用 yarn：

```bash
yarn add package-name
```

## :rocket: 快速开始

```javascript
import { hello } from 'package-name';

hello('World');
```

<details>
<summary>查看更多示例</summary>

### 示例 1：基础用法

```javascript
const result = hello('Alice');
console.log(result); // "Hello, Alice!"
```

### 示例 2：高级用法

```javascript
const result = hello('Bob', { greeting: 'Hi' });
console.log(result); // "Hi, Bob!"
```

</details>

## :wrench: API 文档

### `hello(name, options)`

向某人打招呼。

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | :---: | --- | --- |
| `name` | string | ✅ | - | 姓名 |
| `options` | object | ❌ | `{}` | 配置选项 |
| `options.greeting` | string | ❌ | `'Hello'` | 问候语 |

**返回值：** `string`

**示例：**

```javascript
hello('World'); // "Hello, World!"
hello('World', { greeting: 'Hi' }); // "Hi, World!"
```

## :handshake: 贡献指南

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 开发任务

- [x] 完成核心功能
- [x] 编写单元测试
- [ ] 完善文档
- [ ] 添加示例项目

## :bug: 问题反馈

如果发现 bug，请[创建 Issue](https://github.com/user/repo/issues/new)。

## :memo: 更新日志

### v1.2.0 (2024-01-15)

- :sparkles: 新增功能 X
- :bug: 修复 #123
- :zap: 性能优化

### v1.1.0 (2024-01-01)

- :sparkles: 新增功能 Y
- :memo: 更新文档

查看[完整更新日志](CHANGELOG.md)

## :page_facing_up: 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## :star: Star History

如果这个项目对你有帮助，请给它一个 ⭐️！

---

由 :heart: 制作 | [@username](https://github.com/username)
````

## GFM 与标准 Markdown 的区别

| 特性 | 标准 Markdown | GFM |
| :--- | :---: | :---: |
| 表格 | ❌ | ✅ |
| 任务列表 | ❌ | ✅ |
| 删除线 | ❌ | ✅ |
| 自动链接 | 部分 | ✅ |
| Emoji | ❌ | ✅ |
| 语法高亮 | 基础 | 增强 |
| 提及用户 | ❌ | ✅ |
| 引用 Issue | ❌ | ✅ |

## 小结

在本章中，你学会了：
- ✅ GFM 的特殊语法
- ✅ 使用 Emoji 表情
- ✅ 引用 Issue、PR 和用户
- ✅ 创建任务列表
- ✅ 使用提示框
- ✅ 创建专业的 README 文件

GFM 是 GitHub 上最常用的 Markdown 变体，掌握它对于开源项目非常重要！

---

💡 **提示**：
- GFM 的某些特性只在 GitHub 上有效
- 其他平台可能有自己的 Markdown 扩展
- 编写跨平台文档时，尽量使用标准语法

📝 **下一章预告**：我们将学习 Markdown 的最佳实践和常见问题解决方案！

