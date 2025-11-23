# 代码片段与高级编辑

在本章中，我们将学习如何在 CodeMirror 6 中实现代码片段（Snippets）系统，以及其他高级编辑功能。

## 代码片段基础

代码片段是预定义的代码模板，可以快速插入常用的代码结构。CodeMirror 6 提供了强大的 snippet 系统。

### 基础 Snippet 使用

```typescript
import { snippet, snippetCompletion } from '@codemirror/autocomplete'
import { autocompletion } from '@codemirror/autocomplete'

// 定义简单的 snippet
const simpleSnippets = [
  snippetCompletion("console.log(${text})", {
    label: "log",
    detail: "console.log",
    type: "keyword"
  }),
  
  snippetCompletion("if (${condition}) {\n\t${}\n}", {
    label: "if",
    detail: "if statement",
    type: "keyword"
  }),
  
  snippetCompletion("for (let ${i} = 0; ${i} < ${array}.length; ${i}++) {\n\t${}\n}", {
    label: "for",
    detail: "for loop",
    type: "keyword"
  })
]

// 创建补全源
function snippetCompletions(context: CompletionContext) {
  const word = context.matchBefore(/\w*/)
  if (!word || (word.from === word.to && !context.explicit)) {
    return null
  }
  
  return {
    from: word.from,
    options: simpleSnippets
  }
}

// 使用
const extensions = [
  autocompletion({
    override: [snippetCompletions]
  })
]
```

### Snippet 语法

CodeMirror 6 的 snippet 使用特殊语法定义占位符：

```typescript
// ${} - 简单占位符（光标停留点）
"function ${name}() {\n\t${}\n}"

// ${name} - 命名占位符
"const ${varName} = ${value}"

// ${name:default} - 带默认值的占位符
"function ${name:myFunction}(${params:}) {\n\t${}\n}"

// ${1}, ${2}, ${3} - 数字占位符（按顺序跳转）
"function ${1:name}(${2:params}) {\n\t${3}\n}"

// 相同名称的占位符会同步编辑
"const ${name} = '${name}'"
```

### 完整的 Snippet 示例

```typescript
import { snippet, snippetCompletion } from '@codemirror/autocomplete'

const jsSnippets = [
  // 函数声明
  snippetCompletion(snippet("function ${1:name}(${2:params}) {\n\t${3}\n}"), {
    label: "function",
    detail: "function declaration",
    type: "keyword"
  }),
  
  // 箭头函数
  snippetCompletion(snippet("const ${1:name} = (${2:params}) => {\n\t${3}\n}"), {
    label: "arrow",
    detail: "arrow function",
    type: "keyword"
  }),
  
  // 类定义
  snippetCompletion(snippet(
    "class ${1:ClassName} {\n\tconstructor(${2:params}) {\n\t\t${3}\n\t}\n\n\t${4}\n}"
  ), {
    label: "class",
    detail: "class declaration",
    type: "keyword"
  }),
  
  // Try-Catch
  snippetCompletion(snippet(
    "try {\n\t${1}\n} catch (${2:error}) {\n\t${3:console.error(error)}\n}"
  ), {
    label: "try",
    detail: "try-catch block",
    type: "keyword"
  }),
  
  // Promise
  snippetCompletion(snippet(
    "new Promise((${1:resolve}, ${2:reject}) => {\n\t${3}\n})"
  ), {
    label: "promise",
    detail: "new Promise",
    type: "keyword"
  }),
  
  // Async Function
  snippetCompletion(snippet(
    "async function ${1:name}(${2:params}) {\n\t${3}\n}"
  ), {
    label: "async",
    detail: "async function",
    type: "keyword"
  }),
  
  // Import
  snippetCompletion(snippet("import ${1:name} from '${2:module}'"), {
    label: "import",
    detail: "import statement",
    type: "keyword"
  }),
  
  // Export
  snippetCompletion(snippet("export ${1:const} ${2:name} = ${3:value}"), {
    label: "export",
    detail: "export statement",
    type: "keyword"
  }),
  
  // Console methods
  snippetCompletion(snippet("console.log(${1:value})"), {
    label: "log",
    detail: "console.log",
    type: "function"
  }),
  
  snippetCompletion(snippet("console.error(${1:error})"), {
    label: "error",
    detail: "console.error",
    type: "function"
  }),
  
  snippetCompletion(snippet("console.warn(${1:warning})"), {
    label: "warn",
    detail: "console.warn",
    type: "function"
  }),
  
  // Array methods
  snippetCompletion(snippet("${1:array}.map(${2:item} => ${3:item})"), {
    label: "map",
    detail: "array.map",
    type: "method"
  }),
  
  snippetCompletion(snippet("${1:array}.filter(${2:item} => ${3:condition})"), {
    label: "filter",
    detail: "array.filter",
    type: "method"
  }),
  
  snippetCompletion(snippet("${1:array}.reduce((${2:acc}, ${3:item}) => ${4:acc}, ${5:initial})"), {
    label: "reduce",
    detail: "array.reduce",
    type: "method"
  }),
  
  // React snippets
  snippetCompletion(snippet(
    "import React from 'react'\n\nfunction ${1:ComponentName}() {\n\treturn (\n\t\t<div>\n\t\t\t${2}\n\t\t</div>\n\t)\n}\n\nexport default ${1:ComponentName}"
  ), {
    label: "rfc",
    detail: "React Function Component",
    type: "keyword"
  }),
  
  snippetCompletion(snippet("const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState(${2:initial})"), {
    label: "useState",
    detail: "React useState hook",
    type: "function"
  }),
  
  snippetCompletion(snippet(
    "useEffect(() => {\n\t${1}\n}, [${2:dependencies}])"
  ), {
    label: "useEffect",
    detail: "React useEffect hook",
    type: "function"
  })
]
```

## 自定义 Snippet 系统

### Snippet 管理器

```typescript
import { snippet, snippetCompletion, Completion } from '@codemirror/autocomplete'

interface SnippetDefinition {
  prefix: string
  body: string
  description: string
  scope?: string[]  // 适用的语言
}

class SnippetManager {
  private snippets: Map<string, SnippetDefinition[]> = new Map()
  
  // 添加 snippet
  addSnippet(snippet: SnippetDefinition) {
    const scopes = snippet.scope || ['*']
    
    scopes.forEach(scope => {
      if (!this.snippets.has(scope)) {
        this.snippets.set(scope, [])
      }
      this.snippets.get(scope)!.push(snippet)
    })
  }
  
  // 批量添加 snippets
  addSnippets(snippets: SnippetDefinition[]) {
    snippets.forEach(s => this.addSnippet(s))
  }
  
  // 获取指定语言的 snippets
  getSnippets(language: string): Completion[] {
    const languageSnippets = this.snippets.get(language) || []
    const globalSnippets = this.snippets.get('*') || []
    
    const allSnippets = [...languageSnippets, ...globalSnippets]
    
    return allSnippets.map(s => 
      snippetCompletion(snippet(s.body), {
        label: s.prefix,
        detail: s.description,
        type: "snippet"
      })
    )
  }
  
  // 从 JSON 加载 snippets
  loadFromJSON(json: string) {
    const data = JSON.parse(json)
    
    Object.entries(data).forEach(([key, value]: [string, any]) => {
      this.addSnippet({
        prefix: value.prefix,
        body: Array.isArray(value.body) ? value.body.join('\n') : value.body,
        description: value.description || key,
        scope: value.scope
      })
    })
  }
  
  // 导出为 JSON
  exportToJSON(): string {
    const result: any = {}
    
    this.snippets.forEach((snippets, scope) => {
      snippets.forEach(s => {
        const key = `${scope}:${s.prefix}`
        result[key] = {
          prefix: s.prefix,
          body: s.body.split('\n'),
          description: s.description,
          scope: s.scope
        }
      })
    })
    
    return JSON.stringify(result, null, 2)
  }
}

// 使用示例
const snippetManager = new SnippetManager()

snippetManager.addSnippets([
  {
    prefix: "log",
    body: "console.log(${1:value})",
    description: "Console log",
    scope: ["javascript", "typescript"]
  },
  {
    prefix: "def",
    body: "def ${1:name}(${2:params}):\n\t${3:pass}",
    description: "Function definition",
    scope: ["python"]
  }
])

// 创建补全源
function createSnippetCompletions(language: string) {
  return (context: CompletionContext) => {
    const word = context.matchBefore(/\w*/)
    if (!word) return null
    
    return {
      from: word.from,
      options: snippetManager.getSnippets(language)
    }
  }
}
```

### React 中的 Snippet 管理

```typescript
import React, { useState, useEffect, useMemo } from 'react'
import { EditorView } from '@codemirror/view'

interface SnippetEditorProps {
  language: string
  initialSnippets?: SnippetDefinition[]
}

export const SnippetEditor: React.FC<SnippetEditorProps> = ({
  language,
  initialSnippets = []
}) => {
  const [snippets, setSnippets] = useState<SnippetDefinition[]>(initialSnippets)
  const snippetManager = useMemo(() => new SnippetManager(), [])

  useEffect(() => {
    snippetManager.addSnippets(snippets)
  }, [snippets, snippetManager])

  const addSnippet = (snippet: SnippetDefinition) => {
    setSnippets([...snippets, snippet])
  }

  const removeSnippet = (index: number) => {
    setSnippets(snippets.filter((_, i) => i !== index))
  }

  const snippetCompletions = useMemo(
    () => createSnippetCompletions(language),
    [language]
  )

  return (
    <div>
      <div className="snippet-list">
        <h3>代码片段</h3>
        {snippets.map((s, i) => (
          <div key={i} className="snippet-item">
            <strong>{s.prefix}</strong>: {s.description}
            <button onClick={() => removeSnippet(i)}>删除</button>
          </div>
        ))}
      </div>
      
      <CodeEditor
        extensions={[
          autocompletion({
            override: [snippetCompletions]
          })
        ]}
      />
    </div>
  )
}
```

## 高级编辑功能

### 列编辑模式

```typescript
import { EditorView } from '@codemirror/view'
import { EditorSelection, SelectionRange } from '@codemirror/state'

// 创建列选择
function createColumnSelection(
  view: EditorView,
  fromLine: number,
  toLine: number,
  column: number
) {
  const ranges: SelectionRange[] = []
  
  for (let i = fromLine; i <= toLine; i++) {
    const line = view.state.doc.line(i)
    const pos = Math.min(line.from + column, line.to)
    ranges.push(EditorSelection.cursor(pos))
  }
  
  view.dispatch({
    selection: EditorSelection.create(ranges)
  })
}

// 列编辑插件
const columnEditPlugin = EditorView.domEventHandlers({
  mousedown(event, view) {
    // Alt + 拖动鼠标创建列选择
    if (!event.altKey) return false
    
    const startPos = view.posAtCoords({ x: event.clientX, y: event.clientY })
    if (startPos === null) return false
    
    const startLine = view.state.doc.lineAt(startPos)
    const startColumn = startPos - startLine.from
    
    let currentLine = startLine.number
    
    const handleMouseMove = (e: MouseEvent) => {
      const pos = view.posAtCoords({ x: e.clientX, y: e.clientY })
      if (pos === null) return
      
      const line = view.state.doc.lineAt(pos)
      createColumnSelection(view, startLine.number, line.number, startColumn)
    }
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    
    event.preventDefault()
    return true
  }
})
```

### 智能括号匹配

```typescript
import { EditorView } from '@codemirror/view'
import { syntaxTree } from '@codemirror/language'

// 跳转到匹配的括号
function jumpToMatchingBracket(view: EditorView) {
  const pos = view.state.selection.main.head
  const tree = syntaxTree(view.state)
  const node = tree.resolveInner(pos, 1)
  
  // 查找括号节点
  const brackets = ['(', ')', '[', ']', '{', '}']
  const char = view.state.doc.sliceString(pos, pos + 1)
  
  if (brackets.includes(char)) {
    // 查找匹配的括号
    const matchPos = findMatchingBracket(view, pos, char)
    
    if (matchPos !== null) {
      view.dispatch({
        selection: EditorSelection.cursor(matchPos),
        effects: EditorView.scrollIntoView(matchPos)
      })
    }
  }
}

function findMatchingBracket(view: EditorView, pos: number, bracket: string): number | null {
  const doc = view.state.doc.toString()
  const pairs: Record<string, string> = {
    '(': ')', ')': '(',
    '[': ']', ']': '[',
    '{': '}', '}': '{'
  }
  
  const matching = pairs[bracket]
  const isOpening = ['(', '[', '{'].includes(bracket)
  const direction = isOpening ? 1 : -1
  
  let depth = 0
  let i = pos + direction
  
  while (i >= 0 && i < doc.length) {
    const char = doc[i]
    
    if (char === bracket) {
      depth++
    } else if (char === matching) {
      if (depth === 0) {
        return i
      }
      depth--
    }
    
    i += direction
  }
  
  return null
}

// 选择括号内的内容
function selectInsideBrackets(view: EditorView) {
  const pos = view.state.selection.main.head
  const doc = view.state.doc.toString()
  
  // 查找最近的左括号
  let leftPos = pos
  let leftBracket = ''
  
  while (leftPos >= 0) {
    const char = doc[leftPos]
    if (['(', '[', '{'].includes(char)) {
      leftBracket = char
      break
    }
    leftPos--
  }
  
  if (!leftBracket) return
  
  // 查找匹配的右括号
  const rightPos = findMatchingBracket(view, leftPos, leftBracket)
  
  if (rightPos !== null) {
    view.dispatch({
      selection: EditorSelection.single(leftPos + 1, rightPos)
    })
  }
}
```

### 代码折叠

```typescript
import { foldCode, unfoldCode, foldAll, unfoldAll } from '@codemirror/language'
import { EditorView } from '@codemirror/view'

// 折叠当前代码块
function foldCurrentBlock(view: EditorView) {
  foldCode(view)
}

// 展开当前代码块
function unfoldCurrentBlock(view: EditorView) {
  unfoldCode(view)
}

// 折叠所有代码块
function foldAllBlocks(view: EditorView) {
  foldAll(view)
}

// 展开所有代码块
function unfoldAllBlocks(view: EditorView) {
  unfoldAll(view)
}

// 切换折叠状态
function toggleFold(view: EditorView) {
  const pos = view.state.selection.main.head
  const line = view.state.doc.lineAt(pos)
  
  // 检查当前行是否已折叠
  const folded = view.state.field(foldState, false)
  
  if (folded) {
    unfoldCode(view)
  } else {
    foldCode(view)
  }
}
```

### 多行编辑

```typescript
import { EditorView } from '@codemirror/view'
import { EditorSelection } from '@codemirror/state'

// 在每行末尾添加文本
function appendToLines(view: EditorView, text: string) {
  const selection = view.state.selection.main
  const from = view.state.doc.lineAt(selection.from)
  const to = view.state.doc.lineAt(selection.to)
  
  const changes = []
  
  for (let i = from.number; i <= to.number; i++) {
    const line = view.state.doc.line(i)
    changes.push({
      from: line.to,
      insert: text
    })
  }
  
  view.dispatch({ changes })
}

// 在每行开头添加文本
function prependToLines(view: EditorView, text: string) {
  const selection = view.state.selection.main
  const from = view.state.doc.lineAt(selection.from)
  const to = view.state.doc.lineAt(selection.to)
  
  const changes = []
  
  for (let i = from.number; i <= to.number; i++) {
    const line = view.state.doc.line(i)
    changes.push({
      from: line.from,
      insert: text
    })
  }
  
  view.dispatch({ changes })
}

// 包围选中文本
function surroundSelection(view: EditorView, before: string, after: string) {
  const ranges = view.state.selection.ranges
  const changes = []
  
  ranges.forEach(range => {
    changes.push(
      { from: range.from, insert: before },
      { from: range.to, insert: after }
    )
  })
  
  view.dispatch({ changes })
}

// 使用示例
// surroundSelection(view, '(', ')')  // 用括号包围
// surroundSelection(view, '"', '"')  // 用引号包围
// surroundSelection(view, '/* ', ' */')  // 用注释包围
```

### 文本对齐

```typescript
import { EditorView } from '@codemirror/view'

// 按分隔符对齐
function alignByDelimiter(view: EditorView, delimiter: string) {
  const selection = view.state.selection.main
  const from = view.state.doc.lineAt(selection.from)
  const to = view.state.doc.lineAt(selection.to)
  
  const lines = []
  let maxPos = 0
  
  // 找到分隔符的最大位置
  for (let i = from.number; i <= to.number; i++) {
    const line = view.state.doc.line(i)
    const pos = line.text.indexOf(delimiter)
    
    if (pos !== -1) {
      maxPos = Math.max(maxPos, pos)
      lines.push({ line, delimiterPos: pos })
    } else {
      lines.push({ line, delimiterPos: -1 })
    }
  }
  
  // 对齐
  const changes = []
  
  lines.forEach(({ line, delimiterPos }) => {
    if (delimiterPos !== -1) {
      const spaces = ' '.repeat(maxPos - delimiterPos)
      changes.push({
        from: line.from + delimiterPos,
        insert: spaces
      })
    }
  })
  
  view.dispatch({ changes })
}

// 使用示例
// alignByDelimiter(view, '=')   // 按等号对齐
// alignByDelimiter(view, ':')   // 按冒号对齐
```

## 小结

在本章中，我们学习了：

- ✅ CodeMirror 6 的代码片段系统
- ✅ Snippet 语法和使用方法
- ✅ 创建自定义 Snippet 管理器
- ✅ React 中的 Snippet 集成
- ✅ 高级编辑功能：列编辑、括号匹配、代码折叠
- ✅ 多行编辑和文本对齐

## 总结

恭喜！你已经完成了 CodeMirror 6 完整教程的学习。现在你应该能够：

- 理解 CodeMirror 6 的核心架构
- 在 React 应用中集成 CodeMirror 6
- 定制编辑器的样式和主题
- 实现语法高亮和代码补全
- 使用语法树进行代码分析和导航
- 实现上下文菜单和文本操作
- 创建代码片段系统
- 实现各种高级编辑功能

## 进一步学习

- [CodeMirror 6 官方文档](https://codemirror.net/docs/)
- [Lezer 解析器文档](https://lezer.codemirror.net/)
- [CodeMirror 6 示例](https://codemirror.net/examples/)
- [CodeMirror 6 GitHub](https://github.com/codemirror/dev)

祝你在使用 CodeMirror 6 构建出色的代码编辑器！🎉


