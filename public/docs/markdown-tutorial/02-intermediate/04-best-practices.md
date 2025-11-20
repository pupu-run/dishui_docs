# 最佳实践

## 文档结构

### 使用清晰的标题层级

✅ 好的做法：

```markdown
# 主标题（一级）

## 章节标题（二级）

### 小节标题（三级）

#### 子小节（四级）
```

❌ 不好的做法：

```markdown
# 主标题

### 跳过了二级标题

##### 又跳过了四级标题
```

**原则**：
- 不要跳过标题级别
- 一个文档只有一个一级标题
- 保持层级清晰

### 使用目录

对于长文档，在开头添加目录：

```markdown
# 文档标题

## 目录

- [简介](#简介)
- [安装](#安装)
- [使用方法](#使用方法)
- [API 参考](#api-参考)
- [常见问题](#常见问题)

## 简介

...
```

### 合理组织内容

```markdown
# 项目名称

> 简短的项目描述

## 特性

- 特性列表

## 快速开始

- 最简单的使用示例

## 安装

- 详细的安装步骤

## 使用指南

- 详细的使用说明

## API 文档

- 完整的 API 参考

## 示例

- 实际应用示例

## 常见问题

- FAQ

## 贡献指南

- 如何贡献

## 许可证

- 许可信息
```

## 写作风格

### 保持简洁

✅ 好的做法：

```markdown
## 安装
```

```bash
npm install package-name
```

❌ 不好的做法：

## 如何在你的项目中安装这个非常有用的包

首先，你需要打开终端，然后输入下面这个命令来安装...

```bash
npm install package-name
```
安装完成后，你就可以使用了...

### 使用主动语态

✅ 好的做法：

```markdown
运行以下命令安装依赖：
```

❌ 不好的做法：

```markdown
以下命令应该被运行来安装依赖：
```

### 使用具体的例子

✅ 好的做法：

```markdown
## 配置

在 `config.json` 中设置 API 密钥：

```json
{
  "apiKey": "your-api-key-here"
}
```
```

❌ 不好的做法：

```markdown
## 配置

在配置文件中设置必要的参数。
```

## 代码示例

### 提供完整的示例

✅ 好的做法：

````markdown
```javascript
// 导入库
import { createServer } from 'http';

// 创建服务器
const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, World!');
});

// 启动服务器
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
```
````

❌ 不好的做法：

````markdown
```javascript
createServer((req, res) => {
  res.end('Hello, World!');
});
```
````

### 添加注释

````markdown
```javascript
// 创建用户对象
const user = {
  name: 'John',
  age: 30
};

// 验证用户年龄
if (user.age >= 18) {
  console.log('成年人');
}
```
````

### 展示输出结果

````markdown
```javascript
console.log(2 + 2);
// 输出: 4

console.log('Hello'.toUpperCase());
// 输出: HELLO
```
````

## 链接管理

### 使用引用链接

对于多次使用的链接，使用引用式：

```markdown
查看 [官方文档][docs] 了解更多信息。

更多示例请访问 [GitHub 仓库][repo]。

[docs]: https://example.com/docs
[repo]: https://github.com/user/repo
```

### 检查链接有效性

定期检查文档中的链接是否有效，避免死链。

### 使用相对路径

项目内部链接使用相对路径：

```markdown
查看 [安装指南](./installation.md)

返回 [首页](../README.md)
```

## 图片使用

### 提供有意义的替代文字

✅ 好的做法：

```markdown
![应用程序主界面截图](screenshot.png)
```

❌ 不好的做法：

```markdown
![图片](screenshot.png)
![](screenshot.png)
```

### 优化图片大小

- 使用适当的分辨率
- 压缩图片文件
- 考虑使用 WebP 格式

### 组织图片文件

```
project/
├── README.md
├── docs/
│   ├── guide.md
│   └── images/
│       ├── screenshot1.png
│       └── screenshot2.png
```

```markdown
![截图](./images/screenshot1.png)
```

## 表格设计

### 保持表格简洁

✅ 好的做法：

```markdown
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| name | string | 用户名 |
| age | number | 年龄 |
```

❌ 不好的做法（列太多）：

```markdown
| 参数 | 类型 | 必填 | 默认值 | 最小值 | 最大值 | 格式 | 示例 | 说明 |
```

### 使用合适的对齐

```markdown
| 项目 | 数量 | 价格 |
| :--- | :---: | ---: |
| 苹果 | 10 | ¥50 |
| 香蕉 | 20 | ¥40 |
```

- 文本：左对齐
- 数字：右对齐
- 状态图标：居中对齐

## 列表使用

### 选择合适的列表类型

**无序列表**：用于没有顺序的项目

```markdown
- 苹果
- 香蕉
- 橙子
```

**有序列表**：用于有步骤或顺序的项目

```markdown
1. 打开应用
2. 登录账号
3. 选择功能
```

**任务列表**：用于待办事项

```markdown
- [x] 完成设计
- [ ] 开发功能
- [ ] 测试
```

### 保持列表一致

✅ 好的做法：

```markdown
- 所有项目都以小写开头
- 所有项目都不加标点
- 所有项目格式一致
```

❌ 不好的做法：

```markdown
- 第一项以小写开头
- 第二项以大写开头。
- 第三项格式不一致！
```

## 格式化

### 空行使用

在不同部分之间添加空行：

```markdown
# 标题

这是第一段。

这是第二段。

## 子标题

新的部分开始了。
```

### 行长度

建议每行不超过 80-100 个字符，便于阅读和版本控制。

✅ 好的做法：

```markdown
这是一段比较长的文字，为了便于阅读和版本控制，
我们将它分成多行。每行不超过 80 个字符。
```

### 缩进一致

使用一致的缩进（2 或 4 个空格）：

```markdown
- 第一项
  - 子项 1
  - 子项 2
    - 子子项
```

## 版本控制

### 有意义的提交信息

```bash
# 好的提交信息
git commit -m "docs: 添加安装指南"
git commit -m "docs: 更新 API 文档"
git commit -m "docs: 修复链接错误"

# 不好的提交信息
git commit -m "更新"
git commit -m "修改文档"
```

### 使用 .gitignore

```gitignore
# 编辑器文件
.vscode/
.idea/
*.swp

# 系统文件
.DS_Store
Thumbs.db

# 构建输出
dist/
build/
```

## 可访问性

### 使用语义化标记

```markdown
# 主标题（使用 h1）

## 章节标题（使用 h2）

**重要内容**（使用 strong）

*强调内容*（使用 em）
```

### 提供替代文字

为所有图片提供描述性的替代文字：

```markdown
![React 组件生命周期图示](lifecycle.png)
```

### 使用描述性链接文字

✅ 好的做法：

```markdown
查看 [完整的 API 文档](https://example.com/api)
```

❌ 不好的做法：

```markdown
点击 [这里](https://example.com/api) 查看文档
```

## 国际化

### 使用 UTF-8 编码

确保文件使用 UTF-8 编码，支持多语言字符。

### 提供多语言版本

```
docs/
├── README.md          # 默认语言
├── README.zh-CN.md    # 简体中文
├── README.ja.md       # 日语
└── README.es.md       # 西班牙语
```

在主文档中链接其他语言版本：

```markdown
# Project Name

[English](README.md) | [简体中文](README.zh-CN.md) | [日本語](README.ja.md)
```

## 维护性

### 使用变量

对于经常变化的内容，在文档开头定义：

```markdown
<!-- 变量定义 -->
[version]: 1.2.0
[node-version]: 16.0.0

# 项目名称

当前版本：[version]

要求 Node.js [node-version] 或更高版本。
```

### 添加更新日期

```markdown
# 文档标题

> 最后更新：2024-01-15

或

---

*本文档最后更新于 2024 年 1 月 15 日*
```

### 使用模板

为常见文档类型创建模板：

**README 模板：**

```markdown
# 项目名称

> 简短描述

## 特性

## 安装

## 使用

## API

## 贡献

## 许可
```

**API 文档模板：**

```markdown
## 函数名

简短描述。

### 语法

### 参数

### 返回值

### 示例

### 注意事项
```

## 工具和自动化

### Linting

使用 Markdown linter 检查格式：

```bash
# 安装 markdownlint
npm install -g markdownlint-cli

# 检查文件
markdownlint README.md

# 检查目录
markdownlint docs/
```

### 自动格式化

使用 Prettier 格式化 Markdown：

```bash
# 安装 Prettier
npm install -g prettier

# 格式化文件
prettier --write README.md

# 格式化目录
prettier --write "docs/**/*.md"
```

### 链接检查

使用工具检查死链：

```bash
# 安装 markdown-link-check
npm install -g markdown-link-check

# 检查链接
markdown-link-check README.md
```

### 拼写检查

```bash
# 安装 cspell
npm install -g cspell

# 检查拼写
cspell "**/*.md"
```

## 常见错误

### 1. 忘记空行

❌ 错误：

```markdown
# 标题
这是内容
```

✅ 正确：

```markdown
# 标题

这是内容
```

### 2. 列表缩进错误

❌ 错误：

```markdown
- 第一项
 - 子项（只有 1 个空格）
```

✅ 正确：

```markdown
- 第一项
  - 子项（2 个空格）
```

### 3. 代码块未指定语言

❌ 错误：

````markdown
```
function hello() {}
```
````

✅ 正确：

````markdown
```javascript
function hello() {}
```
````

### 4. 表格格式不对齐

虽然不影响渲染，但对齐更易读：

❌ 不易读：

```markdown
| Name | Age |
| --- | --- |
| John | 30 |
| Jane | 25 |
```

✅ 易读：

```markdown
| Name | Age |
| ---- | --- |
| John | 30  |
| Jane | 25  |
```

## 小结

在本章中，你学会了：
- ✅ 组织文档结构的最佳方法
- ✅ 编写清晰简洁的内容
- ✅ 管理代码示例和链接
- ✅ 优化图片和表格
- ✅ 使用工具自动化检查
- ✅ 避免常见错误

遵循这些最佳实践，可以让你的 Markdown 文档更加专业、易读、易维护！

---

💡 **提示**：
- 一致性比完美更重要
- 使用工具自动化检查和格式化
- 定期审查和更新文档
- 向优秀的开源项目学习

📝 **下一章预告**：我们将学习如何将 Markdown 转换为其他格式，以及一些实用工具！

