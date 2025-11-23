# 语法高亮实现

在本章中，我们将学习 CodeMirror 6 的语法高亮系统，包括如何为不同语言添加语法高亮、自定义高亮样式，以及创建自定义语言支持。

## 语法高亮基础

CodeMirror 6 的语法高亮基于 **Lezer** 解析器系统，它提供了增量解析和高效的语法树构建。

### 基本概念

1. **Language** - 语言定义，包含解析器和语言特性
2. **Parser** - 将文本解析为语法树
3. **Syntax Tree** - 抽象语法树（AST）
4. **Tags** - 语法元素的标记（关键字、字符串、注释等）
5. **Highlight Style** - 将标记映射到样式

## 使用内置语言支持

### 安装语言包

```bash
# JavaScript/TypeScript
npm install @codemirror/lang-javascript

# Python
npm install @codemirror/lang-python

# Java
npm install @codemirror/lang-java

# C++
npm install @codemirror/lang-cpp

# Rust
npm install @codemirror/lang-rust

# HTML
npm install @codemirror/lang-html

# CSS
npm install @codemirror/lang-css

# JSON
npm install @codemirror/lang-json

# Markdown
npm install @codemirror/lang-markdown

# SQL
npm install @codemirror/lang-sql

# XML
npm install @codemirror/lang-xml
```

### 基本使用

```typescript
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { javascript } from '@codemirror/lang-javascript'

const state = EditorState.create({
  doc: `
function greet(name) {
  console.log(\`Hello, \${name}!\`)
}

greet("World")
  `,
  extensions: [
    basicSetup,
    javascript()
  ]
})

const view = new EditorView({
  state,
  parent: document.body
})
```

### 常用语言配置

```typescript
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { java } from '@codemirror/lang-java'
import { cpp } from '@codemirror/lang-cpp'
import { rust } from '@codemirror/lang-rust'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { json } from '@codemirror/lang-json'

// JavaScript (支持 JSX)
const jsExtension = javascript({ jsx: true })

// TypeScript (支持 TSX)
const tsExtension = javascript({ typescript: true, jsx: true })

// Python
const pyExtension = python()

// Java
const javaExtension = java()

// C++
const cppExtension = cpp()

// Rust
const rustExtension = rust()

// HTML
const htmlExtension = html()

// CSS
const cssExtension = css()

// JSON
const jsonExtension = json()
```

## 自定义语法高亮样式

### 使用 HighlightStyle

```typescript
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags as t } from '@lezer/highlight'

const myHighlightStyle = HighlightStyle.define([
  // 关键字
  { tag: t.keyword, color: "#0000ff", fontWeight: "bold" },
  
  // 字符串
  { tag: t.string, color: "#a31515" },
  
  // 数字
  { tag: t.number, color: "#098658" },
  
  // 注释
  { tag: t.comment, color: "#008000", fontStyle: "italic" },
  
  // 变量名
  { tag: t.variableName, color: "#001080" },
  
  // 函数名
  { tag: t.function(t.variableName), color: "#795e26" },
  
  // 类名
  { tag: t.className, color: "#267f99" },
  
  // 类型名
  { tag: t.typeName, color: "#267f99" },
  
  // 操作符
  { tag: t.operator, color: "#000000" },
  
  // 布尔值
  { tag: t.bool, color: "#0000ff" },
  
  // null/undefined
  { tag: t.null, color: "#0000ff" },
  
  // 属性名
  { tag: t.propertyName, color: "#001080" },
  
  // 标签名（HTML）
  { tag: t.tagName, color: "#800000" },
  
  // 属性名（HTML）
  { tag: t.attributeName, color: "#ff0000" }
])

// 应用高亮样式
const extensions = [
  javascript(),
  syntaxHighlighting(myHighlightStyle)
]
```

### 常用标签类型

```typescript
import { tags as t } from '@lezer/highlight'

// 基础标签
t.keyword          // 关键字：if, for, function
t.operator         // 操作符：+, -, *, /
t.number           // 数字：123, 3.14
t.string           // 字符串："hello"
t.comment          // 注释：// comment
t.bool             // 布尔值：true, false
t.null             // null/nil/undefined

// 名称标签
t.variableName     // 变量名
t.propertyName     // 属性名
t.className        // 类名
t.typeName         // 类型名
t.namespace        // 命名空间
t.macroName        // 宏名

// 函数相关
t.function(t.variableName)  // 函数名
t.function(t.propertyName)  // 方法名

// 定义
t.definition(t.variableName)  // 变量定义
t.definition(t.function(t.variableName))  // 函数定义

// 特殊
t.regexp           // 正则表达式
t.escape           // 转义字符
t.link             // 链接
t.heading          // 标题
t.emphasis         // 强调
t.strong           // 加粗

// HTML/XML
t.tagName          // 标签名
t.attributeName    // 属性名
t.attributeValue   // 属性值

// 修饰符
t.modifier         // 修饰符：public, private
t.annotation       // 注解：@Override
```

### 组合标签

```typescript
import { tags as t } from '@lezer/highlight'

const myHighlightStyle = HighlightStyle.define([
  // 多个标签使用相同样式
  { 
    tag: [t.keyword, t.operator, t.bool, t.null], 
    color: "#0000ff" 
  },
  
  // 特定组合
  { 
    tag: t.function(t.variableName), 
    color: "#795e26",
    fontWeight: "bold"
  },
  
  // 定义时的特殊样式
  { 
    tag: t.definition(t.variableName), 
    color: "#001080",
    fontWeight: "bold"
  }
])
```

## React 中动态切换语言

```typescript
import React, { useEffect, useRef, useState, useMemo } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState, Compartment } from '@codemirror/state'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { java } from '@codemirror/lang-java'
import { cpp } from '@codemirror/lang-cpp'

type Language = 'javascript' | 'python' | 'java' | 'cpp'

const languages = {
  javascript: javascript(),
  python: python(),
  java: java(),
  cpp: cpp()
}

export const MultiLanguageEditor: React.FC = () => {
  const [language, setLanguage] = useState<Language>('javascript')
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const languageConf = useRef(new Compartment())

  useEffect(() => {
    if (!editorRef.current) return

    const state = EditorState.create({
      doc: 'console.log("Hello, World!")',
      extensions: [
        basicSetup,
        languageConf.current.of(languages.javascript)
      ]
    })

    const view = new EditorView({
      state,
      parent: editorRef.current
    })

    viewRef.current = view

    return () => view.destroy()
  }, [])

  // 切换语言
  useEffect(() => {
    if (!viewRef.current) return

    viewRef.current.dispatch({
      effects: languageConf.current.reconfigure(languages[language])
    })
  }, [language])

  return (
    <div>
      <select 
        value={language} 
        onChange={(e) => setLanguage(e.target.value as Language)}
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="cpp">C++</option>
      </select>
      <div ref={editorRef} />
    </div>
  )
}
```

## 自定义语言支持

### 简单的自定义语言

如果你需要为简单的 DSL 或配置文件添加高亮，可以使用 StreamLanguage：

```typescript
import { StreamLanguage } from '@codemirror/language'
import { simpleMode } from '@codemirror/legacy-modes/mode/simple-mode'

// 定义简单的 INI 文件语言
const iniLanguage = StreamLanguage.define(simpleMode({
  start: [
    // 注释
    { regex: /[;#].*/, token: "comment" },
    
    // 节标题 [section]
    { regex: /\[.*?\]/, token: "keyword" },
    
    // 键值对
    { regex: /\w+(?=\s*=)/, token: "variableName" },
    { regex: /=/, token: "operator" },
    
    // 字符串
    { regex: /"(?:[^\\]|\\.)*?"/, token: "string" },
    
    // 数字
    { regex: /\d+/, token: "number" }
  ]
}))

// 使用
const extensions = [iniLanguage]
```

### 使用 Lezer 创建完整的语言

对于复杂的语言，建议使用 Lezer 语法定义：

```lezer
// my-language.grammar
@top Program { statement* }

statement {
  VariableDeclaration |
  FunctionDeclaration |
  ExpressionStatement
}

VariableDeclaration {
  kw<"let"> Identifier "=" Expression ";"
}

FunctionDeclaration {
  kw<"function"> Identifier "(" params? ")" Block
}

ExpressionStatement {
  Expression ";"
}

Expression {
  Identifier |
  Number |
  String |
  BinaryExpression
}

BinaryExpression {
  Expression !binary Operator Expression
}

Block {
  "{" statement* "}"
}

@tokens {
  Identifier { $[a-zA-Z_]+ }
  Number { $[0-9]+ }
  String { '"' (!["\\] | "\\" _)* '"' }
  Operator { "+" | "-" | "*" | "/" }
  
  @precedence { Number, Identifier }
}

kw<term> { @specialize[@name={term}]<Identifier, term> }
```

然后编译并使用：

```typescript
import { parser } from './my-language.grammar'
import { LRLanguage, LanguageSupport } from '@codemirror/language'
import { styleTags, tags as t } from '@lezer/highlight'

const myLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      styleTags({
        Identifier: t.variableName,
        Number: t.number,
        String: t.string,
        "function let": t.keyword,
        Operator: t.operator,
        "( )": t.paren,
        "{ }": t.brace
      })
    ]
  })
})

export function myLanguageSupport() {
  return new LanguageSupport(myLanguage)
}
```

## 语法高亮主题预设

### VS Code 风格

```typescript
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags as t } from '@lezer/highlight'

const vscodeLight = HighlightStyle.define([
  { tag: t.keyword, color: "#0000ff" },
  { tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName], color: "#001080" },
  { tag: [t.function(t.variableName), t.labelName], color: "#795e26" },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: "#0070c1" },
  { tag: [t.definition(t.name), t.separator], color: "#000000" },
  { tag: [t.typeName, t.className, t.number, t.changed, t.annotation], color: "#267f99" },
  { tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link], color: "#0000ff" },
  { tag: [t.meta, t.comment], color: "#008000", fontStyle: "italic" },
  { tag: t.strong, fontWeight: "bold" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: t.link, color: "#0000ff", textDecoration: "underline" },
  { tag: t.heading, fontWeight: "bold", color: "#0000ff" },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: "#0000ff" },
  { tag: [t.processingInstruction, t.string, t.inserted], color: "#a31515" },
  { tag: t.invalid, color: "#cd3131" }
])

const vscodeDark = HighlightStyle.define([
  { tag: t.keyword, color: "#569cd6" },
  { tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName], color: "#9cdcfe" },
  { tag: [t.function(t.variableName), t.labelName], color: "#dcdcaa" },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: "#4fc1ff" },
  { tag: [t.definition(t.name), t.separator], color: "#d4d4d4" },
  { tag: [t.typeName, t.className, t.number, t.changed, t.annotation], color: "#4ec9b0" },
  { tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link], color: "#d4d4d4" },
  { tag: [t.meta, t.comment], color: "#6a9955", fontStyle: "italic" },
  { tag: t.strong, fontWeight: "bold" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: t.link, color: "#569cd6", textDecoration: "underline" },
  { tag: t.heading, fontWeight: "bold", color: "#569cd6" },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: "#569cd6" },
  { tag: [t.processingInstruction, t.string, t.inserted], color: "#ce9178" },
  { tag: t.invalid, color: "#f44747" }
])

export const vscodeLightTheme = syntaxHighlighting(vscodeLight)
export const vscodeDarkTheme = syntaxHighlighting(vscodeDark)
```

### GitHub 风格

```typescript
const githubLight = HighlightStyle.define([
  { tag: t.keyword, color: "#d73a49" },
  { tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName], color: "#24292e" },
  { tag: [t.function(t.variableName), t.labelName], color: "#6f42c1" },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: "#005cc5" },
  { tag: [t.definition(t.name), t.separator], color: "#24292e" },
  { tag: [t.typeName, t.className, t.number, t.changed, t.annotation], color: "#6f42c1" },
  { tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link], color: "#d73a49" },
  { tag: [t.meta, t.comment], color: "#6a737d", fontStyle: "italic" },
  { tag: t.strong, fontWeight: "bold" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: t.link, color: "#032f62", textDecoration: "underline" },
  { tag: t.heading, fontWeight: "bold", color: "#005cc5" },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: "#005cc5" },
  { tag: [t.processingInstruction, t.string, t.inserted], color: "#032f62" },
  { tag: t.invalid, color: "#cb2431" }
])

export const githubLightTheme = syntaxHighlighting(githubLight)
```

## 实战：代码编辑器组件

```typescript
import React, { useEffect, useRef, useState } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState, Compartment } from '@codemirror/state'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { java } from '@codemirror/lang-java'
import { oneDark } from '@codemirror/theme-one-dark'

interface CodeEditorProps {
  initialCode?: string
  language?: 'javascript' | 'python' | 'java'
  theme?: 'light' | 'dark'
  onChange?: (code: string) => void
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode = '',
  language = 'javascript',
  theme = 'light',
  onChange
}) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const languageConf = useRef(new Compartment())
  const themeConf = useRef(new Compartment())

  const getLanguageExtension = (lang: string) => {
    switch (lang) {
      case 'python': return python()
      case 'java': return java()
      default: return javascript()
    }
  }

  useEffect(() => {
    if (!editorRef.current) return

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged && onChange) {
        onChange(update.state.doc.toString())
      }
    })

    const state = EditorState.create({
      doc: initialCode,
      extensions: [
        basicSetup,
        languageConf.current.of(getLanguageExtension(language)),
        themeConf.current.of(theme === 'dark' ? oneDark : []),
        updateListener
      ]
    })

    const view = new EditorView({
      state,
      parent: editorRef.current
    })

    viewRef.current = view

    return () => view.destroy()
  }, [])

  // 更新语言
  useEffect(() => {
    if (!viewRef.current) return
    viewRef.current.dispatch({
      effects: languageConf.current.reconfigure(getLanguageExtension(language))
    })
  }, [language])

  // 更新主题
  useEffect(() => {
    if (!viewRef.current) return
    viewRef.current.dispatch({
      effects: themeConf.current.reconfigure(theme === 'dark' ? oneDark : [])
    })
  }, [theme])

  return <div ref={editorRef} style={{ height: '100%' }} />
}
```

## 小结

在本章中，我们学习了：

- ✅ CodeMirror 6 语法高亮的基础概念
- ✅ 使用内置语言支持
- ✅ 自定义语法高亮样式
- ✅ 常用标签类型和组合
- ✅ React 中动态切换语言
- ✅ 创建自定义语言支持
- ✅ 常见主题预设
- ✅ 完整的代码编辑器组件

## 下一步

接下来，我们将学习如何实现代码补全功能。

👉 [下一章：代码补全系统](../03-features/01-autocompletion.md)


