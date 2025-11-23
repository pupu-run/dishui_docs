# 代码补全系统

在本章中，我们将学习如何在 CodeMirror 6 中实现代码补全功能，包括基础补全、自定义补全源、异步补全以及高级补全特性。

## 代码补全基础

CodeMirror 6 的代码补全系统非常灵活，支持多种补全源和自定义补全行为。

### 安装补全包

```bash
npm install @codemirror/autocomplete
```

### 基础补全设置

```typescript
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { autocompletion } from '@codemirror/autocomplete'
import { javascript } from '@codemirror/lang-javascript'

const state = EditorState.create({
  doc: 'console.',
  extensions: [
    basicSetup,
    javascript(),
    autocompletion()  // 启用自动补全
  ]
})

const view = new EditorView({
  state,
  parent: document.body
})
```

### 补全配置选项

```typescript
import { autocompletion } from '@codemirror/autocomplete'

const completionConfig = autocompletion({
  // 是否在输入时自动激活补全
  activateOnTyping: true,
  
  // 覆盖默认的补全快捷键
  override: null,
  
  // 最大显示的补全项数量
  maxRenderedOptions: 100,
  
  // 默认选中第一个选项
  defaultKeymap: true,
  
  // 补全图标
  icons: true,
  
  // 补全详情面板位置
  optionClass: () => "",
  
  // 是否允许模糊匹配
  closeOnBlur: true
})
```

## 自定义补全源

### 简单的补全源

```typescript
import { CompletionContext, CompletionResult } from '@codemirror/autocomplete'
import { autocompletion } from '@codemirror/autocomplete'

// 定义补全源
function myCompletions(context: CompletionContext): CompletionResult | null {
  // 获取光标前的单词
  const word = context.matchBefore(/\w*/)
  
  // 如果没有输入或输入太短，不显示补全
  if (!word || (word.from === word.to && !context.explicit)) {
    return null
  }
  
  return {
    from: word.from,
    options: [
      { label: "console", type: "variable" },
      { label: "const", type: "keyword" },
      { label: "function", type: "keyword" },
      { label: "return", type: "keyword" },
      { label: "if", type: "keyword" },
      { label: "else", type: "keyword" },
      { label: "for", type: "keyword" },
      { label: "while", type: "keyword" }
    ]
  }
}

// 使用补全源
const extensions = [
  autocompletion({
    override: [myCompletions]
  })
]
```

### 补全项属性

```typescript
import { Completion } from '@codemirror/autocomplete'

const completionItem: Completion = {
  // 必需：显示的标签
  label: "myFunction",
  
  // 补全的类型（影响图标）
  type: "function",  // keyword, variable, function, class, interface, property, method, etc.
  
  // 应用补全时插入的文本（默认为 label）
  apply: "myFunction()",
  
  // 详细信息
  detail: "void myFunction()",
  
  // 更详细的文档
  info: "这是一个示例函数，用于演示补全功能",
  
  // 补全项的优先级（数字越大越靠前）
  boost: 1,
  
  // 补全项的章节（用于分组）
  section: "Functions"
}
```

### 带详细信息的补全

```typescript
import { CompletionContext } from '@codemirror/autocomplete'

function jsCompletions(context: CompletionContext) {
  const word = context.matchBefore(/\w*/)
  if (!word || (word.from === word.to && !context.explicit)) {
    return null
  }
  
  return {
    from: word.from,
    options: [
      {
        label: "console.log",
        type: "function",
        apply: "console.log(${})",
        detail: "(method) console.log(...data: any[]): void",
        info: "在控制台输出信息"
      },
      {
        label: "Array.map",
        type: "method",
        apply: "Array.map()",
        detail: "(method) Array<T>.map<U>(callbackfn: (value: T) => U): U[]",
        info: "对数组的每个元素调用回调函数，并返回结果数组"
      },
      {
        label: "Promise",
        type: "class",
        detail: "class Promise<T>",
        info: "表示异步操作的最终完成或失败"
      }
    ]
  }
}
```

## 上下文感知补全

### 基于光标位置的补全

```typescript
import { CompletionContext } from '@codemirror/autocomplete'
import { syntaxTree } from '@codemirror/language'

function contextAwareCompletions(context: CompletionContext) {
  // 获取光标位置的语法节点
  const nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1)
  
  // 在字符串内部不提供补全
  if (nodeBefore.name === "String") {
    return null
  }
  
  // 在注释内部不提供补全
  if (nodeBefore.name === "Comment") {
    return null
  }
  
  // 在对象属性后提供方法补全
  if (nodeBefore.name === "PropertyName") {
    return {
      from: context.pos,
      options: [
        { label: "toString", type: "method" },
        { label: "valueOf", type: "method" },
        { label: "hasOwnProperty", type: "method" }
      ]
    }
  }
  
  // 默认补全
  const word = context.matchBefore(/\w*/)
  if (!word) return null
  
  return {
    from: word.from,
    options: [
      { label: "const", type: "keyword" },
      { label: "let", type: "keyword" },
      { label: "var", type: "keyword" }
    ]
  }
}
```

### 基于作用域的补全

```typescript
import { CompletionContext } from '@codemirror/autocomplete'

// 模拟作用域变量
const scopeVariables = new Map<string, string[]>()

function scopeAwareCompletions(context: CompletionContext) {
  const word = context.matchBefore(/\w*/)
  if (!word) return null
  
  // 获取当前文档的变量
  const doc = context.state.doc.toString()
  const variables = extractVariables(doc)
  
  return {
    from: word.from,
    options: variables.map(v => ({
      label: v.name,
      type: v.type,
      detail: v.detail
    }))
  }
}

function extractVariables(code: string) {
  const variables: Array<{name: string, type: string, detail: string}> = []
  
  // 提取 const/let/var 声明
  const varRegex = /(?:const|let|var)\s+(\w+)/g
  let match
  while ((match = varRegex.exec(code)) !== null) {
    variables.push({
      name: match[1],
      type: "variable",
      detail: "local variable"
    })
  }
  
  // 提取函数声明
  const funcRegex = /function\s+(\w+)/g
  while ((match = funcRegex.exec(code)) !== null) {
    variables.push({
      name: match[1],
      type: "function",
      detail: "function"
    })
  }
  
  return variables
}
```

## 异步补全

### 基础异步补全

```typescript
import { CompletionContext, CompletionResult } from '@codemirror/autocomplete'

async function asyncCompletions(context: CompletionContext): Promise<CompletionResult | null> {
  const word = context.matchBefore(/\w*/)
  if (!word) return null
  
  // 模拟 API 调用
  const results = await fetchCompletions(word.text)
  
  return {
    from: word.from,
    options: results.map(r => ({
      label: r.name,
      type: r.type,
      detail: r.signature,
      info: r.documentation
    }))
  }
}

async function fetchCompletions(query: string) {
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return [
    { name: "asyncFunction", type: "function", signature: "async () => Promise<void>", documentation: "异步函数" },
    { name: "awaitKeyword", type: "keyword", signature: "await", documentation: "等待 Promise 完成" }
  ]
}

// 使用
const extensions = [
  autocompletion({
    override: [asyncCompletions]
  })
]
```

### 带缓存的异步补全

```typescript
import { CompletionContext, CompletionResult } from '@codemirror/autocomplete'

class CompletionCache {
  private cache = new Map<string, CompletionResult>()
  private pending = new Map<string, Promise<CompletionResult | null>>()
  
  async get(
    key: string,
    fetcher: () => Promise<CompletionResult | null>
  ): Promise<CompletionResult | null> {
    // 检查缓存
    if (this.cache.has(key)) {
      return this.cache.get(key)!
    }
    
    // 检查是否正在请求
    if (this.pending.has(key)) {
      return this.pending.get(key)!
    }
    
    // 发起新请求
    const promise = fetcher()
    this.pending.set(key, promise)
    
    try {
      const result = await promise
      if (result) {
        this.cache.set(key, result)
      }
      return result
    } finally {
      this.pending.delete(key)
    }
  }
  
  clear() {
    this.cache.clear()
    this.pending.clear()
  }
}

const cache = new CompletionCache()

async function cachedCompletions(context: CompletionContext): Promise<CompletionResult | null> {
  const word = context.matchBefore(/\w*/)
  if (!word) return null
  
  return cache.get(word.text, async () => {
    const results = await fetchCompletions(word.text)
    return {
      from: word.from,
      options: results
    }
  })
}
```

## 高级补全特性

### 模板补全（带光标位置）

```typescript
import { Completion } from '@codemirror/autocomplete'
import { EditorView } from '@codemirror/view'

// 使用 ${} 标记光标位置
const templateCompletions: Completion[] = [
  {
    label: "if",
    type: "keyword",
    apply: (view: EditorView, completion: Completion, from: number, to: number) => {
      const template = "if (${condition}) {\n  ${}\n}"
      const insert = template.replace(/\$\{.*?\}/g, "")
      
      view.dispatch({
        changes: { from, to, insert },
        selection: { anchor: from + 4 }  // 光标移到条件位置
      })
    },
    detail: "if statement"
  },
  {
    label: "for",
    type: "keyword",
    apply: (view: EditorView, completion: Completion, from: number, to: number) => {
      const insert = "for (let i = 0; i < ; i++) {\n  \n}"
      view.dispatch({
        changes: { from, to, insert },
        selection: { anchor: from + 20 }  // 光标移到条件位置
      })
    },
    detail: "for loop"
  },
  {
    label: "function",
    type: "keyword",
    apply: (view: EditorView, completion: Completion, from: number, to: number) => {
      const insert = "function name() {\n  \n}"
      view.dispatch({
        changes: { from, to, insert },
        selection: { anchor: from + 9, head: from + 13 }  // 选中函数名
      })
    },
    detail: "function declaration"
  }
]
```

### 多光标补全（Snippet）

```typescript
import { snippet } from '@codemirror/autocomplete'

const snippetCompletions = [
  {
    label: "class",
    type: "keyword",
    apply: snippet("class ${ClassName} {\n  constructor(${params}) {\n    ${}\n  }\n}"),
    detail: "class declaration"
  },
  {
    label: "try",
    type: "keyword",
    apply: snippet("try {\n  ${}\n} catch (${error}) {\n  ${}\n}"),
    detail: "try-catch block"
  },
  {
    label: "arrow",
    type: "function",
    apply: snippet("(${params}) => ${{\n  ${}\n}}"),
    detail: "arrow function"
  }
]
```

### 补全过滤和排序

```typescript
import { CompletionContext } from '@codemirror/autocomplete'

function filteredCompletions(context: CompletionContext) {
  const word = context.matchBefore(/\w*/)
  if (!word) return null
  
  const allOptions = [
    { label: "console", type: "variable", boost: 10 },
    { label: "const", type: "keyword", boost: 5 },
    { label: "constructor", type: "method", boost: 3 },
    { label: "continue", type: "keyword", boost: 2 }
  ]
  
  // 过滤匹配的选项
  const query = word.text.toLowerCase()
  const filtered = allOptions.filter(opt => 
    opt.label.toLowerCase().startsWith(query)
  )
  
  // 按 boost 值排序
  filtered.sort((a, b) => (b.boost || 0) - (a.boost || 0))
  
  return {
    from: word.from,
    options: filtered
  }
}
```

### 分组补全

```typescript
import { CompletionContext } from '@codemirror/autocomplete'

function groupedCompletions(context: CompletionContext) {
  const word = context.matchBefore(/\w*/)
  if (!word) return null
  
  return {
    from: word.from,
    options: [
      // 关键字组
      { label: "const", type: "keyword", section: "Keywords" },
      { label: "let", type: "keyword", section: "Keywords" },
      { label: "var", type: "keyword", section: "Keywords" },
      
      // 函数组
      { label: "console.log", type: "function", section: "Functions" },
      { label: "setTimeout", type: "function", section: "Functions" },
      { label: "setInterval", type: "function", section: "Functions" },
      
      // 类组
      { label: "Array", type: "class", section: "Classes" },
      { label: "Object", type: "class", section: "Classes" },
      { label: "Promise", type: "class", section: "Classes" }
    ]
  }
}
```

## React 集成

### 基础补全组件

```typescript
import React, { useEffect, useRef } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { autocompletion, CompletionContext } from '@codemirror/autocomplete'
import { javascript } from '@codemirror/lang-javascript'

interface CompletionEditorProps {
  completions?: (context: CompletionContext) => any
}

export const CompletionEditor: React.FC<CompletionEditorProps> = ({
  completions
}) => {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!editorRef.current) return

    const state = EditorState.create({
      extensions: [
        basicSetup,
        javascript(),
        autocompletion({
          override: completions ? [completions] : undefined
        })
      ]
    })

    const view = new EditorView({
      state,
      parent: editorRef.current
    })

    return () => view.destroy()
  }, [completions])

  return <div ref={editorRef} />
}
```

### 自定义补全数据

```typescript
import React, { useState, useCallback } from 'react'
import { CompletionContext } from '@codemirror/autocomplete'

interface CompletionItem {
  label: string
  type: string
  detail?: string
}

export const CustomCompletionEditor: React.FC = () => {
  const [completionData, setCompletionData] = useState<CompletionItem[]>([
    { label: "myVar", type: "variable", detail: "string" },
    { label: "myFunc", type: "function", detail: "() => void" }
  ])

  const completions = useCallback((context: CompletionContext) => {
    const word = context.matchBefore(/\w*/)
    if (!word) return null
    
    return {
      from: word.from,
      options: completionData
    }
  }, [completionData])

  const addCompletion = () => {
    const newItem = {
      label: `item${completionData.length + 1}`,
      type: "variable",
      detail: "any"
    }
    setCompletionData([...completionData, newItem])
  }

  return (
    <div>
      <button onClick={addCompletion}>添加补全项</button>
      <CompletionEditor completions={completions} />
    </div>
  )
}
```

## 实战：智能代码补全

```typescript
import { CompletionContext, CompletionResult } from '@codemirror/autocomplete'
import { syntaxTree } from '@codemirror/language'

class SmartCompletionProvider {
  private builtins = [
    { label: "console", type: "variable" },
    { label: "window", type: "variable" },
    { label: "document", type: "variable" },
    { label: "Array", type: "class" },
    { label: "Object", type: "class" },
    { label: "String", type: "class" },
    { label: "Number", type: "class" }
  ]
  
  private keywords = [
    "const", "let", "var", "function", "class", "if", "else",
    "for", "while", "return", "import", "export", "async", "await"
  ].map(k => ({ label: k, type: "keyword" }))
  
  async getCompletions(context: CompletionContext): Promise<CompletionResult | null> {
    const word = context.matchBefore(/\w*/)
    if (!word || (word.from === word.to && !context.explicit)) {
      return null
    }
    
    // 获取上下文
    const nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1)
    
    // 在成员访问后提供属性/方法补全
    if (nodeBefore.name === "PropertyName" || nodeBefore.prevSibling?.name === ".") {
      return this.getMemberCompletions(context, word)
    }
    
    // 默认补全：关键字 + 内置对象 + 文档中的变量
    const documentVars = this.extractDocumentVariables(context.state.doc.toString())
    
    return {
      from: word.from,
      options: [
        ...this.keywords,
        ...this.builtins,
        ...documentVars
      ]
    }
  }
  
  private getMemberCompletions(context: CompletionContext, word: any): CompletionResult {
    // 简化版：返回常见的对象方法
    return {
      from: word.from,
      options: [
        { label: "toString", type: "method", detail: "() => string" },
        { label: "valueOf", type: "method", detail: "() => any" },
        { label: "hasOwnProperty", type: "method", detail: "(prop: string) => boolean" },
        { label: "length", type: "property", detail: "number" }
      ]
    }
  }
  
  private extractDocumentVariables(code: string) {
    const vars = new Set<string>()
    const varRegex = /(?:const|let|var)\s+(\w+)/g
    let match
    
    while ((match = varRegex.exec(code)) !== null) {
      vars.add(match[1])
    }
    
    return Array.from(vars).map(v => ({
      label: v,
      type: "variable",
      detail: "local variable"
    }))
  }
}

// 使用
const provider = new SmartCompletionProvider()

const extensions = [
  autocompletion({
    override: [(context) => provider.getCompletions(context)]
  })
]
```

## 小结

在本章中，我们学习了：

- ✅ CodeMirror 6 代码补全的基础概念
- ✅ 配置和启用补全功能
- ✅ 创建自定义补全源
- ✅ 实现上下文感知补全
- ✅ 异步补全和缓存策略
- ✅ 高级特性：模板、snippet、分组
- ✅ React 集成
- ✅ 智能代码补全实战

## 下一步

接下来，我们将学习如何使用语法树进行导航和高级操作。

👉 [下一章：语法树与导航](./02-syntax-tree-navigation.md)


