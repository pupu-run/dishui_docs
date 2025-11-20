
# 代码高亮高级扩展

## 高级代码块功能

### 显示行号

在代码块中添加 `showLineNumbers` 属性即可显示行号：

````markdown
```javascript showLineNumbers
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(10);
console.log(result); // 55
```
````

**效果展示：**

```javascript showLineNumbers
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(10);
console.log(result); // 55
```

### 指定起始行号

使用 `startLineNumber` 指定行号从特定数字开始：

````markdown
```python showLineNumbers startLineNumber=10
def calculate_total(items):
    total = 0
    for item in items:
        total += item.price
    return total

result = calculate_total(shopping_cart)
```
````

**效果展示：**

```python showLineNumbers startLineNumber=10
def calculate_total(items):
    total = 0
    for item in items:
        total += item.price
    return total

result = calculate_total(shopping_cart)
```

### 高亮特定行

使用 `{行号}` 语法高亮重要的代码行：

````markdown
```javascript showLineNumbers {3,5-7}
function processUser(user) {
    // 验证用户数据
    if (!user.email) {  // 这行会被高亮
        throw new Error('Email is required');
    }
    // 这些行会被高亮
    const normalized = {
        name: user.name.trim(),
        email: user.email.toLowerCase(),
    };
    
    return normalized;
}
```
````

**效果展示：**

```javascript showLineNumbers {3,5-7}
function processUser(user) {
    // 验证用户数据
    if (!user.email) {  // 这行会被高亮
        throw new Error('Email is required');
    }
    // 这些行会被高亮
    const normalized = {
        name: user.name.trim(),
        email: user.email.toLowerCase(),
    };
    
    return normalized;
}
```

### 添加代码块标题

使用 `title` 属性为代码块添加文件名或标题：

````markdown
```typescript title="src/types/user.ts" showLineNumbers
interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
}

export type { User };
```
````

**效果展示：**

```typescript title="src/types/user.ts" showLineNumbers
interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
}

export type { User };
```

### 组合使用多个功能

你可以同时使用多个功能：

````markdown
```typescript title="src/services/api.ts" showLineNumbers {5-8}
async function fetchUserData(userId: number): Promise<User> {
    const url = `/api/users/${userId}`;
    
    try {
        // 发送请求并获取数据
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw error;
    }
}
```
````

**效果展示：**

```typescript title="src/services/api.ts" showLineNumbers {5-8}
async function fetchUserData(userId: number): Promise<User> {
    const url = `/api/users/${userId}`;
    
    try {
        // 发送请求并获取数据
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw error;
    }
}
```