# 主题系统详解

在本章中，我们将深入学习 CodeMirror 6 的主题系统，包括如何创建完整的主题包、使用现有主题，以及实现主题切换功能。

## 主题系统概述

CodeMirror 6 的主题系统基于两个核心概念：

1. **Editor Theme** - 编辑器的视觉样式（背景、边框、字体等）
2. **Syntax Highlighting** - 代码的语法高亮（将在下一章详细介绍）

## 使用官方主题

CodeMirror 6 提供了几个官方主题包：

### 安装主题包

```bash
npm install @codemirror/theme-one-dark
# 或
npm install thememirror
```

### 使用 One Dark 主题

```typescript
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'

const state = EditorState.create({
  doc: "console.log('Hello, World!')",
  extensions: [
    basicSetup,
    oneDark
  ]
})

const view = new EditorView({
  state,
  parent: document.body
})
```

### 常用主题包

```typescript
// One Dark (Atom 风格)
import { oneDark } from '@codemirror/theme-one-dark'

// GitHub 风格主题
import { githubLight, githubDark } from '@uiw/codemirror-theme-github'

// VS Code 风格主题
import { vscodeDark } from '@uiw/codemirror-theme-vscode'

// Dracula 主题
import { dracula } from '@uiw/codemirror-theme-dracula'

// Monokai 主题
import { monokai } from '@uiw/codemirror-theme-monokai'

// Solarized 主题
import { solarizedLight, solarizedDark } from '@uiw/codemirror-theme-solarized'
```

## 创建自定义主题

### 基础主题结构

```typescript
import { EditorView } from '@codemirror/view'
import { Extension } from '@codemirror/state'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags as t } from '@lezer/highlight'

// 1. 定义编辑器主题
const myEditorTheme = EditorView.theme({
  // 编辑器根元素
  "&": {
    color: "#333333",
    backgroundColor: "#ffffff"
  },
  
  // 内容区域
  ".cm-content": {
    caretColor: "#0066cc",
    fontFamily: "'Fira Code', monospace"
  },
  
  // 光标和选区
  "&.cm-focused .cm-cursor": {
    borderLeftColor: "#0066cc"
  },
  
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
    backgroundColor: "#d7d4f0"
  },
  
  // 行号区域
  ".cm-gutters": {
    backgroundColor: "#f5f5f5",
    color: "#999999",
    border: "none"
  },
  
  // 当前行
  ".cm-activeLine": {
    backgroundColor: "#f0f9ff"
  },
  
  ".cm-activeLineGutter": {
    backgroundColor: "#e3f2fd"
  }
}, { dark: false })

// 2. 定义语法高亮样式
const myHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: "#0066cc", fontWeight: "bold" },
  { tag: t.string, color: "#22863a" },
  { tag: t.number, color: "#005cc5" },
  { tag: t.comment, color: "#6a737d", fontStyle: "italic" },
  { tag: t.variableName, color: "#24292e" },
  { tag: t.function(t.variableName), color: "#6f42c1" },
  { tag: t.className, color: "#6f42c1" },
  { tag: t.operator, color: "#d73a49" },
  { tag: t.bool, color: "#005cc5" },
  { tag: t.null, color: "#005cc5" }
])

// 3. 组合成完整主题
export const myTheme: Extension = [
  myEditorTheme,
  syntaxHighlighting(myHighlightStyle)
]
```

### 完整的亮色主题示例

```typescript
import { EditorView } from '@codemirror/view'
import { Extension } from '@codemirror/state'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags as t } from '@lezer/highlight'

// 定义颜色常量
const colors = {
  // 背景色
  background: '#ffffff',
  foreground: '#24292e',
  
  // UI 元素
  selection: '#d7d4f0',
  lineHighlight: '#f6f8fa',
  cursor: '#044289',
  
  // 行号
  gutterBackground: '#fafbfc',
  gutterForeground: '#6a737d',
  gutterActiveForeground: '#24292e',
  
  // 语法高亮
  keyword: '#d73a49',
  string: '#032f62',
  number: '#005cc5',
  comment: '#6a737d',
  variable: '#24292e',
  function: '#6f42c1',
  class: '#6f42c1',
  operator: '#d73a49',
  tag: '#22863a',
  attribute: '#6f42c1',
  property: '#005cc5'
}

const lightEditorTheme = EditorView.theme({
  "&": {
    color: colors.foreground,
    backgroundColor: colors.background
  },
  
  ".cm-content": {
    caretColor: colors.cursor
  },
  
  ".cm-cursor, .cm-dropCursor": {
    borderLeftColor: colors.cursor
  },
  
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
    backgroundColor: colors.selection
  },
  
  ".cm-activeLine": {
    backgroundColor: colors.lineHighlight
  },
  
  ".cm-gutters": {
    backgroundColor: colors.gutterBackground,
    color: colors.gutterForeground,
    border: "none"
  },
  
  ".cm-activeLineGutter": {
    backgroundColor: colors.lineHighlight,
    color: colors.gutterActiveForeground
  },
  
  ".cm-lineNumbers .cm-gutterElement": {
    padding: "0 12px 0 8px"
  },
  
  "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
    backgroundColor: "#bad0f0",
    outline: "1px solid #c0d0f0"
  },
  
  ".cm-searchMatch": {
    backgroundColor: "#ffd33d44",
    outline: "1px solid #ffd33d"
  },
  
  ".cm-searchMatch.cm-searchMatch-selected": {
    backgroundColor: "#ffd33d"
  }
}, { dark: false })

const lightHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: colors.keyword },
  { tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName], color: colors.variable },
  { tag: [t.function(t.variableName), t.labelName], color: colors.function },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: colors.property },
  { tag: [t.definition(t.name), t.separator], color: colors.foreground },
  { tag: [t.typeName, t.className, t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace], color: colors.class },
  { tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)], color: colors.operator },
  { tag: [t.meta, t.comment], color: colors.comment, fontStyle: "italic" },
  { tag: t.strong, fontWeight: "bold" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: t.strikethrough, textDecoration: "line-through" },
  { tag: t.link, color: colors.function, textDecoration: "underline" },
  { tag: t.heading, fontWeight: "bold", color: colors.function },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: colors.property },
  { tag: [t.processingInstruction, t.string, t.inserted], color: colors.string },
  { tag: t.invalid, color: "#cb2431" }
])

export const lightTheme: Extension = [
  lightEditorTheme,
  syntaxHighlighting(lightHighlightStyle)
]
```

### 完整的暗色主题示例

```typescript
import { EditorView } from '@codemirror/view'
import { Extension } from '@codemirror/state'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags as t } from '@lezer/highlight'

const darkColors = {
  background: '#1e1e1e',
  foreground: '#d4d4d4',
  
  selection: '#264f78',
  lineHighlight: '#2a2a2a',
  cursor: '#ffffff',
  
  gutterBackground: '#1e1e1e',
  gutterForeground: '#858585',
  gutterActiveForeground: '#ffffff',
  
  keyword: '#569cd6',
  string: '#ce9178',
  number: '#b5cea8',
  comment: '#6a9955',
  variable: '#9cdcfe',
  function: '#dcdcaa',
  class: '#4ec9b0',
  operator: '#d4d4d4',
  tag: '#569cd6',
  attribute: '#9cdcfe',
  property: '#9cdcfe'
}

const darkEditorTheme = EditorView.theme({
  "&": {
    color: darkColors.foreground,
    backgroundColor: darkColors.background
  },
  
  ".cm-content": {
    caretColor: darkColors.cursor
  },
  
  ".cm-cursor, .cm-dropCursor": {
    borderLeftColor: darkColors.cursor
  },
  
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
    backgroundColor: darkColors.selection
  },
  
  ".cm-activeLine": {
    backgroundColor: darkColors.lineHighlight
  },
  
  ".cm-gutters": {
    backgroundColor: darkColors.gutterBackground,
    color: darkColors.gutterForeground,
    border: "none"
  },
  
  ".cm-activeLineGutter": {
    backgroundColor: darkColors.lineHighlight,
    color: darkColors.gutterActiveForeground
  },
  
  "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
    backgroundColor: "#3a3a3a",
    outline: "1px solid #515151"
  },
  
  ".cm-searchMatch": {
    backgroundColor: "#515c6a",
    outline: "1px solid #457dff"
  },
  
  ".cm-searchMatch.cm-searchMatch-selected": {
    backgroundColor: "#6199ff"
  }
}, { dark: true })

const darkHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: darkColors.keyword },
  { tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName], color: darkColors.variable },
  { tag: [t.function(t.variableName), t.labelName], color: darkColors.function },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: darkColors.property },
  { tag: [t.definition(t.name), t.separator], color: darkColors.foreground },
  { tag: [t.typeName, t.className, t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace], color: darkColors.class },
  { tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)], color: darkColors.operator },
  { tag: [t.meta, t.comment], color: darkColors.comment, fontStyle: "italic" },
  { tag: t.strong, fontWeight: "bold" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: t.strikethrough, textDecoration: "line-through" },
  { tag: t.link, color: darkColors.function, textDecoration: "underline" },
  { tag: t.heading, fontWeight: "bold", color: darkColors.function },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: darkColors.property },
  { tag: [t.processingInstruction, t.string, t.inserted], color: darkColors.string },
  { tag: t.invalid, color: "#f44747" }
])

export const darkTheme: Extension = [
  darkEditorTheme,
  syntaxHighlighting(darkHighlightStyle)
]
```

## 主题切换

### React 中实现主题切换

```typescript
import React, { useState, useMemo } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState, Compartment } from '@codemirror/state'
import { lightTheme, darkTheme } from './themes'

export const ThemeableEditor: React.FC = () => {
  const [isDark, setIsDark] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const themeConf = useRef(new Compartment())

  useEffect(() => {
    if (!editorRef.current) return

    const state = EditorState.create({
      doc: "console.log('Hello, World!')",
      extensions: [
        basicSetup,
        themeConf.current.of(lightTheme)
      ]
    })

    const view = new EditorView({
      state,
      parent: editorRef.current
    })

    viewRef.current = view

    return () => view.destroy()
  }, [])

  // 切换主题
  useEffect(() => {
    if (!viewRef.current) return

    viewRef.current.dispatch({
      effects: themeConf.current.reconfigure(isDark ? darkTheme : lightTheme)
    })
  }, [isDark])

  return (
    <div>
      <button onClick={() => setIsDark(!isDark)}>
        切换到{isDark ? '亮色' : '暗色'}主题
      </button>
      <div ref={editorRef} />
    </div>
  )
}
```

### 跟随系统主题

```typescript
import React, { useState, useEffect } from 'react'

export const SystemThemeEditor: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  const theme = useMemo(
    () => isDark ? darkTheme : lightTheme,
    [isDark]
  )

  return <CodeEditor extensions={[theme]} />
}
```

### 多主题选择器

```typescript
import React, { useState, useMemo } from 'react'
import { Extension } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import { githubLight, githubDark } from '@uiw/codemirror-theme-github'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'

type ThemeName = 'light' | 'dark' | 'github-light' | 'github-dark' | 'vscode-dark' | 'one-dark'

const themes: Record<ThemeName, Extension> = {
  'light': lightTheme,
  'dark': darkTheme,
  'github-light': githubLight,
  'github-dark': githubDark,
  'vscode-dark': vscodeDark,
  'one-dark': oneDark
}

export const MultiThemeEditor: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>('light')

  const theme = useMemo(
    () => themes[selectedTheme],
    [selectedTheme]
  )

  return (
    <div>
      <select 
        value={selectedTheme} 
        onChange={(e) => setSelectedTheme(e.target.value as ThemeName)}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="github-light">GitHub Light</option>
        <option value="github-dark">GitHub Dark</option>
        <option value="vscode-dark">VS Code Dark</option>
        <option value="one-dark">One Dark</option>
      </select>
      <CodeEditor extensions={[theme]} />
    </div>
  )
}
```

## 主题定制技巧

### 1. 使用 CSS 变量

```typescript
import { EditorView } from '@codemirror/view'

const cssVariableTheme = EditorView.theme({
  "&": {
    "--editor-bg": "#ffffff",
    "--editor-fg": "#000000",
    "--editor-selection": "#d7d4f0",
    backgroundColor: "var(--editor-bg)",
    color: "var(--editor-fg)"
  },
  
  ".cm-selectionBackground": {
    backgroundColor: "var(--editor-selection)"
  }
})

// 在运行时修改
document.documentElement.style.setProperty('--editor-bg', '#1e1e1e')
```

### 2. 继承和扩展主题

```typescript
import { EditorView } from '@codemirror/view'
import { oneDark } from '@codemirror/theme-one-dark'

// 在 One Dark 基础上自定义
const customOneDark = [
  oneDark,
  EditorView.theme({
    ".cm-content": {
      fontSize: "16px",
      fontFamily: "'JetBrains Mono', monospace"
    },
    ".cm-gutters": {
      minWidth: "60px"
    }
  }, { dark: true })
]
```

### 3. 条件样式

```typescript
import { EditorView } from '@codemirror/view'

const conditionalTheme = (options: { showLineNumbers: boolean }) => 
  EditorView.theme({
    ".cm-gutters": {
      display: options.showLineNumbers ? "block" : "none"
    }
  })

// 使用
const theme = conditionalTheme({ showLineNumbers: true })
```

## 主题导出和分享

### 创建主题包

```typescript
// themes/my-theme/index.ts
import { EditorView } from '@codemirror/view'
import { Extension } from '@codemirror/state'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags as t } from '@lezer/highlight'

export const myTheme: Extension = [
  EditorView.theme({
    // ... 编辑器样式
  }, { dark: false }),
  
  syntaxHighlighting(HighlightStyle.define([
    // ... 语法高亮样式
  ]))
]

export const myThemeDark: Extension = [
  EditorView.theme({
    // ... 暗色编辑器样式
  }, { dark: true }),
  
  syntaxHighlighting(HighlightStyle.define([
    // ... 暗色语法高亮样式
  ]))
]

// 导出配置函数
export function createMyTheme(options: {
  dark?: boolean
  fontSize?: number
}) {
  const { dark = false, fontSize = 14 } = options
  
  return [
    dark ? myThemeDark : myTheme,
    EditorView.theme({
      ".cm-content": {
        fontSize: `${fontSize}px`
      }
    }, { dark })
  ]
}
```

### package.json 配置

```json
{
  "name": "@myorg/codemirror-theme-mytheme",
  "version": "1.0.0",
  "description": "My custom CodeMirror 6 theme",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "keywords": ["codemirror", "theme", "codemirror6"],
  "peerDependencies": {
    "@codemirror/language": "^6.0.0",
    "@codemirror/state": "^6.0.0",
    "@codemirror/view": "^6.0.0",
    "@lezer/highlight": "^1.0.0"
  }
}
```

## 调试主题

### 查看应用的样式

```typescript
import { EditorView } from '@codemirror/view'

// 添加调试类名
const debugTheme = EditorView.theme({
  "&": {
    border: "2px solid red" // 调试边框
  },
  ".cm-content": {
    outline: "1px dashed blue" // 调试轮廓
  }
})

// 在浏览器控制台查看
const view = new EditorView({ /* ... */ })
console.log(view.dom) // 查看 DOM 结构
console.log(getComputedStyle(view.dom)) // 查看计算后的样式
```

### 使用浏览器开发工具

1. 打开浏览器开发者工具
2. 选择 Elements/元素 标签
3. 找到 `.cm-editor` 元素
4. 查看应用的 CSS 类和样式
5. 实时修改样式进行测试

## 小结

在本章中，我们学习了：

- ✅ CodeMirror 6 主题系统的结构
- ✅ 使用官方和第三方主题
- ✅ 创建自定义亮色和暗色主题
- ✅ 实现主题切换功能
- ✅ 主题定制技巧
- ✅ 主题导出和分享
- ✅ 调试主题的方法

## 下一步

接下来，我们将深入学习语法高亮系统，了解如何为不同语言实现高亮效果。

👉 [下一章：语法高亮实现](./03-syntax-highlighting.md)


