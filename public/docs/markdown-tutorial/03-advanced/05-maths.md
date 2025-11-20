# 数学公式

在技术文档、学术论文和科学笔记中，数学公式是必不可少的。Markdown 支持使用 LaTeX 语法来编写美观的数学公式。

## 基础知识

### 什么是 LaTeX？

LaTeX 是一个专业的排版系统，特别擅长处理数学公式。Markdown 通过集成 MathJax 或 KaTeX 等渲染引擎来支持 LaTeX 数学公式。

### 两种公式模式

**行内公式（Inline Math）**：公式嵌入在文本中，使用单个 `$` 包围。

**块级公式（Display Math）**：公式独立成行，居中显示，使用双 `$$` 包围。

## 行内公式

### 基本语法

使用单个美元符号 `$` 包围公式。

```markdown
这是一个行内公式 $E = mc^2$，爱因斯坦的质能方程。
```

效果：

这是一个行内公式 $E = mc^2$，爱因斯坦的质能方程。

### 更多示例

```markdown
圆的面积公式是 $A = \pi r^2$。
勾股定理：$a^2 + b^2 = c^2$。
二次方程的解：$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$。
```

效果：

圆的面积公式是 $A = \pi r^2$。  
勾股定理：$a^2 + b^2 = c^2$。  
二次方程的解：$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$。

## 块级公式

### 基本语法

使用双美元符号 `$$` 包围公式，公式会独立成行并居中显示。

```markdown
$$
E = mc^2
$$
```

效果：

$$
E = mc^2
$$

### 多行公式

```markdown
$$
\begin{aligned}
f(x) &= x^2 + 2x + 1 \\
&= (x + 1)^2
\end{aligned}
$$
```

效果：

$$
\begin{aligned}
f(x) &= x^2 + 2x + 1 \\
&= (x + 1)^2
\end{aligned}
$$

## 基础数学符号

### 上标和下标

```markdown
上标：$x^2$, $x^{10}$, $e^{i\pi}$
下标：$x_1$, $x_{ij}$, $a_n$
组合：$x_1^2$, $x_{i}^{n+1}$
```

效果：

上标：$x^2$, $x^{10}$, $e^{i\pi}$  
下标：$x_1$, $x_{ij}$, $a_n$  
组合：$x_1^2$, $x_{i}^{n+1}$

### 分数

```markdown
$$
\frac{1}{2}, \quad \frac{a}{b}, \quad \frac{x^2 + y^2}{x + y}
$$
```

效果：

$$
\frac{1}{2}, \quad \frac{a}{b}, \quad \frac{x^2 + y^2}{x + y}
$$

### 根号

```markdown
$$
\sqrt{2}, \quad \sqrt{x^2 + y^2}, \quad \sqrt[3]{8}, \quad \sqrt[n]{x}
$$
```

效果：

$$
\sqrt{2}, \quad \sqrt{x^2 + y^2}, \quad \sqrt[3]{8}, \quad \sqrt[n]{x}
$$

### 求和与积分

```markdown
$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

$$
\int_{0}^{\infty} e^{-x} dx = 1
$$

$$
\prod_{i=1}^{n} x_i
$$
```

效果：

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

$$
\int_{0}^{\infty} e^{-x} dx = 1
$$

$$
\prod_{i=1}^{n} x_i
$$

## 希腊字母

### 小写希腊字母

```markdown
$$
\alpha, \beta, \gamma, \delta, \epsilon, \zeta, \eta, \theta
$$

$$
\iota, \kappa, \lambda, \mu, \nu, \xi, \pi, \rho
$$

$$
\sigma, \tau, \upsilon, \phi, \chi, \psi, \omega
$$
```

效果：

$$
\alpha, \beta, \gamma, \delta, \epsilon, \zeta, \eta, \theta
$$

$$
\iota, \kappa, \lambda, \mu, \nu, \xi, \pi, \rho
$$

$$
\sigma, \tau, \upsilon, \phi, \chi, \psi, \omega
$$

### 大写希腊字母

```markdown
$$
\Gamma, \Delta, \Theta, \Lambda, \Xi, \Pi, \Sigma, \Phi, \Psi, \Omega
$$
```

效果：

$$
\Gamma, \Delta, \Theta, \Lambda, \Xi, \Pi, \Sigma, \Phi, \Psi, \Omega
$$

## 运算符和关系符号

### 基本运算符

```markdown
$$
+, -, \times, \div, \pm, \mp, \cdot
$$
```

效果：

$$
+, -, \times, \div, \pm, \mp, \cdot
$$

### 关系符号

```markdown
$$
=, \neq, <, >, \leq, \geq, \ll, \gg, \approx, \equiv
$$
```

效果：

$$
=, \neq, <, >, \leq, \geq, \ll, \gg, \approx, \equiv
$$

### 集合符号

```markdown
$$
\in, \notin, \subset, \subseteq, \supset, \supseteq, \cup, \cap, \emptyset
$$
```

效果：

$$
\in, \notin, \subset, \subseteq, \supset, \supseteq, \cup, \cap, \emptyset
$$

### 逻辑符号

```markdown
$$
\land, \lor, \neg, \implies, \iff, \forall, \exists
$$
```

效果：

$$
\land, \lor, \neg, \implies, \iff, \forall, \exists
$$

## 矩阵和数组

### 基本矩阵

```markdown
$$
\begin{matrix}
a & b \\
c & d
\end{matrix}
$$
```

效果：

$$
\begin{matrix}
a & b \\
c & d
\end{matrix}
$$

### 带括号的矩阵

```markdown
圆括号：
$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
$$

方括号：
$$
\begin{bmatrix}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 9
\end{bmatrix}
$$

花括号：
$$
\begin{Bmatrix}
a & b \\
c & d
\end{Bmatrix}
$$

行列式：
$$
\begin{vmatrix}
a & b \\
c & d
\end{vmatrix}
$$
```

效果：

圆括号：
$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
$$

方括号：
$$
\begin{bmatrix}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 9
\end{bmatrix}
$$

花括号：
$$
\begin{Bmatrix}
a & b \\
c & d
\end{Bmatrix}
$$

行列式：
$$
\begin{vmatrix}
a & b \\
c & d
\end{vmatrix}
$$

### 增广矩阵

```markdown
$$
\left[
\begin{array}{cc|c}
1 & 2 & 3 \\
4 & 5 & 6
\end{array}
\right]
$$
```

效果：

$$
\left[
\begin{array}{cc|c}
1 & 2 & 3 \\
4 & 5 & 6
\end{array}
\right]
$$

## 方程组

### 使用 cases 环境

```markdown
$$
f(x) = \begin{cases}
x^2 & \text{if } x \geq 0 \\
-x^2 & \text{if } x < 0
\end{cases}
$$
```

效果：

$$
f(x) = \begin{cases}
x^2 & \text{if } x \geq 0 \\
-x^2 & \text{if } x < 0
\end{cases}
$$

### 多行方程组

```markdown
$$
\begin{cases}
x + y = 5 \\
2x - y = 1
\end{cases}
$$
```

效果：

$$
\begin{cases}
x + y = 5 \\
2x - y = 1
\end{cases}
$$

## 高级功能

### 括号自适应大小

使用 `\left` 和 `\right` 让括号自动调整大小。

```markdown
$$
\left( \frac{a}{b} \right), \quad \left[ \sum_{i=1}^{n} x_i \right], \quad \left\{ \frac{x^2}{2} \right\}
$$
```

效果：

$$
\left( \frac{a}{b} \right), \quad \left[ \sum_{i=1}^{n} x_i \right], \quad \left\{ \frac{x^2}{2} \right\}
$$

### 上下标记

```markdown
$$
\overbrace{a + b + c}^{\text{总和}}, \quad \underbrace{x + y + z}_{\text{三项}}
$$

$$
\overline{x + y}, \quad \underline{a + b}
$$

$$
\vec{v}, \quad \overrightarrow{AB}, \quad \hat{x}
$$
```

效果：

$$
\overbrace{a + b + c}^{\text{总和}}, \quad \underbrace{x + y + z}_{\text{三项}}
$$

$$
\overline{x + y}, \quad \underline{a + b}
$$

$$
\vec{v}, \quad \overrightarrow{AB}, \quad \hat{x}
$$

### 空格控制

LaTeX 会自动处理空格，但有时需要手动调整。

```markdown
$$
a \quad b \qquad c \, d \: e \; f \! g
$$
```

效果：

$$
a \quad b \qquad c \, d \: e \; f \! g
$$

**空格大小**：
- `\!` 负空格（缩小间距）
- `\,` 小空格
- `\:` 中等空格
- `\;` 大空格
- `\quad` 1em 空格
- `\qquad` 2em 空格

### 多行对齐

```markdown
$$
\begin{aligned}
x &= a + b + c \\
&= d + e \\
&= f
\end{aligned}
$$
```

效果：

$$
\begin{aligned}
x &= a + b + c \\
&= d + e \\
&= f
\end{aligned}
$$

## 常用数学公式示例

### 微积分

```markdown
**导数定义**：
$$
f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}
$$

**积分基本定理**：
$$
\int_a^b f(x)dx = F(b) - F(a)
$$

**偏导数**：
$$
\frac{\partial f}{\partial x}, \quad \frac{\partial^2 f}{\partial x \partial y}
$$
```

效果：

**导数定义**：
$$
f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}
$$

**积分基本定理**：
$$
\int_a^b f(x)dx = F(b) - F(a)
$$

**偏导数**：
$$
\frac{\partial f}{\partial x}, \quad \frac{\partial^2 f}{\partial y \partial x}
$$

### 线性代数

```markdown
**向量点积**：
$$
\vec{a} \cdot \vec{b} = \sum_{i=1}^{n} a_i b_i
$$

**矩阵乘法**：
$$
(AB)_{ij} = \sum_{k=1}^{n} A_{ik} B_{kj}
$$

**特征值方程**：
$$
A\vec{v} = \lambda\vec{v}
$$
```

效果：

**向量点积**：
$$
\vec{a} \cdot \vec{b} = \sum_{i=1}^{n} a_i b_i
$$

**矩阵乘法**：
$$
(AB)_{ij} = \sum_{k=1}^{n} A_{ik} B_{kj}
$$

**特征值方程**：
$$
A\vec{v} = \lambda\vec{v}
$$

### 概率统计

```markdown
**期望**：
$$
E[X] = \sum_{i=1}^{n} x_i p_i
$$

**方差**：
$$
\text{Var}(X) = E[(X - E[X])^2]
$$

**正态分布**：
$$
f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}
$$

**贝叶斯定理**：
$$
P(A|B) = \frac{P(B|A)P(A)}{P(B)}
$$
```

效果：

**期望**：
$$
E[X] = \sum_{i=1}^{n} x_i p_i
$$

**方差**：
$$
\text{Var}(X) = E[(X - E[X])^2]
$$

**正态分布**：
$$
f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}
$$

**贝叶斯定理**：
$$
P(A|B) = \frac{P(B|A)P(A)}{P(B)}
$$

### 数论

```markdown
**欧拉公式**：
$$
e^{i\theta} = \cos\theta + i\sin\theta
$$

**费马小定理**：
$$
a^{p-1} \equiv 1 \pmod{p}
$$

**二项式定理**：
$$
(x + y)^n = \sum_{k=0}^{n} \binom{n}{k} x^{n-k} y^k
$$
```

效果：

**欧拉公式**：
$$
e^{i\theta} = \cos\theta + i\sin\theta
$$

**费马小定理**：
$$
a^{p-1} \equiv 1 \pmod{p}
$$

**二项式定理**：
$$
(x + y)^n = \sum_{k=0}^{n} \binom{n}{k} x^{n-k} y^k
$$

## 常用函数

### 三角函数

```markdown
$$
\sin x, \cos x, \tan x, \cot x, \sec x, \csc x
$$

$$
\arcsin x, \arccos x, \arctan x
$$
```

效果：

$$
\sin x, \cos x, \tan x, \cot x, \sec x, \csc x
$$

$$
\arcsin x, \arccos x, \arctan x
$$

### 对数和指数

```markdown
$$
\log x, \ln x, \lg x, \exp x, e^x
$$
```

效果：

$$
\log x, \ln x, \lg x, \exp x, e^x
$$

### 极限

```markdown
$$
\lim_{x \to \infty} f(x), \quad \lim_{x \to 0^+} f(x), \quad \lim_{n \to \infty} a_n
$$
```

效果：

$$
\lim_{x \to \infty} f(x), \quad \lim_{x \to 0^+} f(x), \quad \lim_{n \to \infty} a_n
$$

## 实用技巧

### 1. 公式编号

虽然标准 Markdown 不直接支持公式编号，但可以手动添加：

```markdown
$$
E = mc^2 \tag{1}
$$

$$
F = ma \tag{2}
$$
```

效果：

$$
E = mc^2 \tag{1}
$$

$$
F = ma \tag{2}
$$

### 2. 文字说明

在公式中添加文字说明：

```markdown
$$
\text{面积} = \pi r^2 \quad \text{其中 } r \text{ 是半径}
$$
```

效果：

$$
\text{面积} = \pi r^2 \quad \text{其中 } r \text{ 是半径}
$$

### 3. 颜色（部分渲染器支持）

```markdown
$$
\color{red}{x} + \color{blue}{y} = \color{green}{z}
$$
```

效果（取决于渲染器）：

$$
\color{red}{x} + \color{blue}{y} = \color{green}{z}
$$

### 4. 复杂公式的分解

对于复杂公式，分步展示更清晰：

```markdown
首先定义函数：

$$
f(x) = x^2 + 2x + 1
$$

然后求导：

$$
f'(x) = 2x + 2
$$

最后求极值点：

$$
f'(x) = 0 \implies x = -1
$$
```

## 常见符号速查表

### 数学符号

| 符号 | LaTeX | 符号 | LaTeX |
|:---:|:---:|:---:|:---:|
| $\infty$ | `\infty` | $\partial$ | `\partial` |
| $\nabla$ | `\nabla` | $\angle$ | `\angle` |
| $\degree$ | `\degree` | $\%$ | `\%` |
| $\cdots$ | `\cdots` | $\ldots$ | `\ldots` |
| $\vdots$ | `\vdots` | $\ddots$ | `\ddots` |

### 箭头符号

| 符号 | LaTeX | 符号 | LaTeX |
|:---:|:---:|:---:|:---:|
| $\leftarrow$ | `\leftarrow` | $\rightarrow$ | `\rightarrow` |
| $\Leftarrow$ | `\Leftarrow` | $\Rightarrow$ | `\Rightarrow` |
| $\leftrightarrow$ | `\leftrightarrow` | $\Leftrightarrow$ | `\Leftrightarrow` |
| $\uparrow$ | `\uparrow` | $\downarrow$ | `\downarrow` |

## 最佳实践

### 1. 选择合适的公式类型

- **行内公式**：用于简短的公式，不打断文本流
- **块级公式**：用于重要的、复杂的公式

### 2. 保持公式简洁

✅ 好的做法：
```markdown
$$
f(x) = x^2 + 2x + 1
$$
```

❌ 不好的做法（过于复杂）：
```markdown
$$
f(x) = x^2 + 2x + 1 + 0 \times y + 0 \times z + \cdots
$$
```

### 3. 添加说明文字

在公式前后添加说明，帮助读者理解：

```markdown
根据勾股定理，直角三角形的三边关系为：

$$
a^2 + b^2 = c^2
$$

其中 $c$ 是斜边，$a$ 和 $b$ 是直角边。
```

### 4. 使用对齐环境

对于多行公式，使用对齐环境提高可读性：

```markdown
$$
\begin{aligned}
(a + b)^2 &= (a + b)(a + b) \\
&= a^2 + ab + ba + b^2 \\
&= a^2 + 2ab + b^2
\end{aligned}
$$
```

### 5. 测试渲染效果

不同的 Markdown 渲染器可能支持不同的 LaTeX 功能，建议：
- 使用常见的、广泛支持的语法
- 在目标平台上测试公式显示效果
- 准备备用方案（如截图）

## 在线工具推荐

### 公式编辑器

- [LaTeX Live Editor](https://latexeditor.lagrida.com/) - 实时预览
- [Mathpix](https://mathpix.com/) - 手写公式识别
- [Codecogs Equation Editor](https://www.codecogs.com/latex/eqneditor.php) - 在线编辑器

### 符号查询

- [Detexify](http://detexify.kirelabs.org/classify.html) - 手写识别符号
- [LaTeX Symbols](https://www.latex-project.org/help/documentation/) - 符号大全

### 学习资源

- [Overleaf Documentation](https://www.overleaf.com/learn) - 完整的 LaTeX 教程
- [KaTeX Supported Functions](https://katex.org/docs/supported.html) - KaTeX 支持的函数

## 实践练习

尝试编写以下公式：

### 练习 1：二次公式

编写求解二次方程 $ax^2 + bx + c = 0$ 的公式。

<details>
<summary>查看答案</summary>

```markdown
$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$
```

</details>

### 练习 2：泰勒级数

编写函数 $f(x)$ 在 $x = a$ 处的泰勒展开式。

<details>
<summary>查看答案</summary>

```markdown
$$
f(x) = \sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n!}(x-a)^n
$$
```

</details>

### 练习 3：矩阵方程

编写一个 3×3 矩阵与向量的乘法。

<details>
<summary>查看答案</summary>

```markdown
$$
\begin{bmatrix}
a_{11} & a_{12} & a_{13} \\
a_{21} & a_{22} & a_{23} \\
a_{31} & a_{32} & a_{33}
\end{bmatrix}
\begin{bmatrix}
x_1 \\ x_2 \\ x_3
\end{bmatrix}
=
\begin{bmatrix}
y_1 \\ y_2 \\ y_3
\end{bmatrix}
$$
```

</details>

## 小结

在本章中，你学会了：
- ✅ 使用行内公式和块级公式
- ✅ 编写基础数学符号（上下标、分数、根号等）
- ✅ 使用希腊字母和特殊符号
- ✅ 创建矩阵和方程组
- ✅ 编写常见的数学公式
- ✅ 数学公式的最佳实践
- ✅ 使用在线工具辅助编写

数学公式是技术文档的重要组成部分，掌握 LaTeX 语法可以让你的文档更加专业和美观！

---

💡 **提示**：
- 从简单的公式开始练习，逐步掌握复杂语法
- 使用在线编辑器实时预览效果
- 收藏常用符号和公式模板
- 注意不同平台的渲染差异

📝 **下一章预告**：我们将学习 Markdown 的更多高级特性，包括图表、流程图等！

