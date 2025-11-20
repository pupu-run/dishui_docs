# 链接和图片

## 链接（Links）

Markdown 支持多种链接格式。

### 内联链接（Inline Links）

最常用的链接格式。

```markdown
[链接文字](URL "可选的标题")
```

示例：

```markdown
[Google](https://www.google.com)
[GitHub](https://github.com "全球最大的代码托管平台")
```

效果：

[Google](https://www.google.com)  
[GitHub](https://github.com "全球最大的代码托管平台")

### 引用链接（Reference Links）

适合多次使用同一链接的情况。

```markdown
这是 [Google][1] 和 [GitHub][2] 的链接。

[1]: https://www.google.com
[2]: https://github.com "GitHub"
```

效果：

这是 [Google][1] 和 [GitHub][2] 的链接。

[1]: https://www.google.com
[2]: https://github.com "GitHub"

### 自动链接

直接使用尖括号包围 URL。

```markdown
<https://www.google.com>
<email@example.com>
```

效果：

<https://www.google.com>  
<email@example.com>

### 锚点链接（页面内跳转）

链接到同一页面的标题。

```markdown
[跳转到小结](#小结)
```

效果：[跳转到小结](#小结)

**注意**：
- 标题会自动生成 ID
- 中文标题也可以作为锚点
- 多级标题用 `-` 连接
- 空格用 `-` 替换

### 相对路径链接

链接到项目中的其他文件。

```markdown
[查看第一章](./01-introduction.md)
[返回首页](../index.md)
```

## 图片（Images）

图片语法与链接类似，只是前面多了一个 `!`。

### 内联图片

```markdown
![替代文字](图片URL "可选的标题")
```

示例：

```markdown
![Markdown Logo](https://markdown-here.com/img/icon256.png "Markdown")
```

![Python Logo](https://www.python.org/static/img/python-logo.png "Python")

### 引用图片

```markdown
![Markdown Logo][logo]

[logo]: https://markdown-here.com/img/icon256.png "Markdown Logo"
```

### 本地图片

```markdown
![本地图片](./images/screenshot.png)
![相对路径](../assets/logo.png)
```

### 图片链接

将图片包装在链接中。

```markdown
[![Markdown Logo](https://markdown-here.com/img/icon256.png)](https://markdown-here.com)
```

点击图片可以跳转到链接。

### 调整图片大小

标准 Markdown 不支持调整图片大小，但可以使用 HTML：

```html
<img src="image.png" alt="描述" width="200">
<img src="image.png" alt="描述" style="width: 50%;">
```

<img src="https://www.python.org/static/img/python-logo.png" alt="描述" width="200">
<img src="https://www.python.org/static/img/python-logo.png" alt="描述" style="width: 50%;">


## 高级用法

### 链接中的强调

```markdown
**[粗体链接](https://example.com)**
*[斜体链接](https://example.com)*
***[粗斜体链接](https://example.com)***
```

效果：

**[粗体链接](https://example.com)**  
*[斜体链接](https://example.com)*  
***[粗斜体链接](https://example.com)***

### 代码中的链接

```markdown
访问 [`GitHub`](https://github.com) 查看代码。
```

效果：

访问 [`GitHub`](https://github.com) 查看代码。

### 脚注链接

```markdown
这是一段文字[^1]，这是另一段文字[^2]。

[^1]: 这是第一个脚注的内容。
[^2]: 这是第二个脚注的内容，可以包含[链接](https://example.com)。
```

效果：

这是一段文字[^1]，这是另一段文字[^2]。

[^1]: 这是第一个脚注的内容。
[^2]: 这是第二个脚注的内容，可以包含[链接](https://example.com)。

## 实用技巧

### 1. 组织引用链接

将所有引用链接放在文档末尾，便于管理：

```markdown
# 文档标题

正文内容，包含 [链接1][link1] 和 [链接2][link2]。

更多内容...

<!-- 链接定义 -->
[link1]: https://example.com/page1
[link2]: https://example.com/page2
```

### 2. 使用有意义的链接文字

❌ 不好的例子：
```markdown
点击[这里](https://example.com)查看更多。
```

✅ 好的例子：
```markdown
查看[完整文档](https://example.com)了解更多信息。
```

### 3. 图片的替代文字

替代文字很重要，用于：
- 图片加载失败时显示
- 屏幕阅读器（无障碍访问）
- SEO 优化

```markdown
![一只可爱的猫咪坐在窗台上](cat.jpg)
```

### 4. 创建图片画廊

使用表格或 HTML 创建图片画廊：

```markdown
| 图片1 | 图片2 | 图片3 |
|:---:|:---:|:---:|
| ![](img1.jpg) | ![](img2.jpg) | ![](img3.jpg) |
| 描述1 | 描述2 | 描述3 |
```

## 实践练习

创建一个资源导航页面：

```markdown
# 学习资源导航

## 官方文档

- [Markdown 官方](https://daringfireball.net/projects/markdown/)
- [CommonMark 规范](https://commonmark.org/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)

## 在线工具

### 编辑器
- [StackEdit](https://stackedit.io/) - 强大的在线编辑器
- [Dillinger](https://dillinger.io/) - 简洁的在线编辑器

### 转换工具
- [Pandoc](https://pandoc.org/) - 文档格式转换
- [Markdown to PDF](https://www.markdowntopdf.com/)

## 教程资源

![Markdown Guide](https://www.markdownguide.org/assets/images/markdown-guide-og.jpg)

查看 [Markdown Guide][guide] 获取更多信息。

[guide]: https://www.markdownguide.org/ "Markdown Guide"

## 相关章节

- [第一章：Markdown 简介](./01-introduction.md)
- [第二章：基础语法](./02-basic-syntax.md)
- [第三章：列表和引用](./03-lists-and-quotes.md)

---

💡 **提示**：收藏这个页面，随时查阅有用的资源！
```

## 常见问题

### Q: 如何在新标签页打开链接？

A: 标准 Markdown 不支持，需要使用 HTML：

```html
<a href="https://example.com" target="_blank">在新标签页打开</a>
```

### Q: 图片路径应该用相对路径还是绝对路径？

A: 建议：
- 项目内图片：使用相对路径
- 外部图片：使用完整 URL
- 需要在不同环境使用：考虑使用 CDN

### Q: 如何居中图片？

A: 使用 HTML：

```html
<div align="center">
  <img src="image.png" alt="描述">
</div>
```

或使用 CSS：

```html
<img src="image.png" alt="描述" style="display: block; margin: 0 auto;">
```

## 小结

在本章中，你学会了：
- ✅ 创建各种类型的链接（内联、引用、自动、锚点）
- ✅ 插入图片和创建图片链接
- ✅ 使用相对路径和绝对路径
- ✅ 链接和图片的最佳实践
- ✅ 使用 HTML 扩展功能

链接和图片是 Markdown 文档的重要组成部分，掌握它们可以让你的文档更加丰富和实用！

---

💡 **提示**：
- 始终为图片提供有意义的替代文字
- 使用引用链接可以让文档更易维护
- 检查链接是否有效，避免死链

📝 **下一章预告**：我们将学习如何在 Markdown 中优雅地展示代码！

