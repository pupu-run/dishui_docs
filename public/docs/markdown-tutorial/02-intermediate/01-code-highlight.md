# 代码和代码块

代码展示是技术文档的核心功能。本章将介绍如何在 Markdown 中使用行内代码、代码块、语法高亮，以及各种高级代码展示功能。

## 行内代码（Inline Code）

使用单个反引号 `` ` `` 包围代码。

### 基本语法

```markdown
使用 `console.log()` 打印信息。
在 Python 中使用 `print()` 函数。
```

效果：

使用 `console.log()` 打印信息。  
在 Python 中使用 `print()` 函数。

### 在行内代码中使用反引号

如果代码本身包含反引号，使用双反引号包围：

```markdown
``使用 `反引号` 来标记代码``
```

效果：

``使用 `反引号` 来标记代码``

## 代码块（Code Blocks）

### 缩进式代码块

使用 4 个空格或 1 个制表符缩进。

```markdown
    function hello() {
        console.log("Hello, World!");
    }
```

效果：

    function hello() {
        console.log("Hello, World!");
    }

### 围栏式代码块（推荐）

使用三个反引号 ``` 包围代码。

````markdown
```
function hello() {
    console.log("Hello, World!");
}
```
````

效果：

```
function hello() {
    console.log("Hello, World!");
}
```

## 基础语法高亮

在代码块开始处指定语言，启用语法高亮。

### JavaScript

````markdown
```javascript
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
```
````

效果：

```javascript
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
```

### Python

````markdown
```python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

print(quick_sort([3, 6, 8, 10, 1, 2, 1]))
```
````

效果：

```python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

print(quick_sort([3, 6, 8, 10, 1, 2, 1]))
```

### HTML

````markdown
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>示例页面</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>这是一个示例页面。</p>
</body>
</html>
```
````

效果：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>示例页面</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>这是一个示例页面。</p>
</body>
</html>
```

### CSS

````markdown
```css
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card {
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background: white;
}
```
````

效果：

```css
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card {
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background: white;
}
```


## 常用编程语言标识

| 语言 | 标识符 | 别名 |
|------|--------|------|
| JavaScript | `javascript` | `js` |
| TypeScript | `typescript` | `ts` |
| Python | `python` | `py` |
| Java | `java` | |
| C | `c` | |
| C++ | `cpp`, `c++` | |
| C# | `csharp`, `cs` | |
| Go | `go` | |
| Rust | `rust` | |
| Ruby | `ruby` | |
| PHP | `php` | |
| Swift | `swift` | |
| Kotlin | `kotlin` | |
| Shell | `bash`, `shell` | `sh` |
| SQL | `sql` | |
| JSON | `json` | |
| XML | `xml` | |
| YAML | `yaml`, `yml` | |
| Markdown | `markdown` | `md` |

## 实际应用示例

### 配置文件

````markdown
```json
{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```
````

效果：

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

### 命令行操作

````markdown
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```
````

效果：

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 数据库查询

````markdown
```sql
-- 创建用户表
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入数据
INSERT INTO users (username, email) 
VALUES ('john_doe', 'john@example.com');

-- 查询数据
SELECT * FROM users 
WHERE created_at > '2024-01-01'
ORDER BY created_at DESC;
```
````

效果：

```sql
-- 创建用户表
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入数据
INSERT INTO users (username, email) 
VALUES ('john_doe', 'john@example.com');

-- 查询数据
SELECT * FROM users 
WHERE created_at > '2024-01-01'
ORDER BY created_at DESC;
```

## 代码与文字混排

### 解释代码

使用 `useState` Hook 来管理组件状态：

```javascript
const [count, setCount] = useState(0);
```

然后通过 `setCount` 函数更新状态：

```javascript
setCount(count + 1);
```

### 对比代码

❌ 不推荐的写法：

```javascript
var x = 10;
var y = 20;
```

✅ 推荐的写法：

```javascript
const x = 10;
const y = 20;
```

## 代码差异对比

使用 `diff` 语言标识符可以展示代码的修改：

````markdown
```diff
  function calculateTotal(items) {
-   let total = 0;
-   for (let i = 0; i < items.length; i++) {
-     total += items[i].price;
-   }
-   return total;
+   return items.reduce((sum, item) => sum + item.price, 0);
  }
```
````

**效果展示：**

```diff
  function calculateTotal(items) {
-   let total = 0;
-   for (let i = 0; i < items.length; i++) {
-     total += items[i].price;
-   }
-   return total;
+   return items.reduce((sum, item) => sum + item.price, 0);
  }
```

## 最佳实践

### 1. 始终指定语言

✅ 好的做法：
````markdown
```python
print("Hello")
```
````

❌ 不好的做法：
````markdown
```
print("Hello")
```
````

### 2. 保持代码简洁

- 只展示关键代码
- 使用注释说明重点
- 必要时省略无关代码

### 3. 添加上下文说明

在代码块前后添加说明文字，帮助读者理解。

### 4. 格式化代码

确保代码格式良好，缩进正确。

### 5. 使用有意义的示例

使用实际场景中的代码示例，而不是 `foo`、`bar` 这样的占位符。

### 6. 合理使用高亮功能

- 使用行号帮助读者定位代码
- 高亮重要的代码行
- 添加文件名提供上下文

## 小结

在本章中，你学会了：
- ✅ 使用行内代码标记
- ✅ 创建代码块
- ✅ 为代码块添加语法高亮
- ✅ 显示行号和指定起始行号
- ✅ 高亮特定代码行
- ✅ 添加代码块标题
- ✅ 常用编程语言的标识符
- ✅ 代码展示的最佳实践

代码展示是技术文档的核心，掌握这些技巧可以让你的文档更加专业！

---

💡 **提示**：
- 使用围栏式代码块而不是缩进式
- 始终指定编程语言以获得语法高亮
- 在代码前后添加说明文字
- 使用行号和高亮功能突出重点

📝 **下一章预告**：我们将学习如何创建漂亮的表格！
