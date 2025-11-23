# 样式定制基础

在本章中，我们将学习如何定制 CodeMirror 6 编辑器的样式，包括基础样式、行号、字体、颜色等。

## CodeMirror 6 的样式系统

CodeMirror 6 使用 CSS-in-JS 的方式来管理样式，主要通过以下方式：

1. **EditorView.theme()** - 创建自定义主题
2. **EditorView.baseTheme()** - 创建基础主题（不受明暗模式影响）
3. **CSS 类名** - 直接使用 CSS 覆盖样式
4. **Decoration** - 动态添加样式

## 基础样式定制

### 使用 EditorView.theme()

```typescript
import { EditorView } from '@codemirror/view'

const customTheme = EditorView.theme({
  // 编辑器容器
  "&": {
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    overflow: "hidden"
  },
  
  // 编辑器内容区域
  ".cm-content": {
    fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
    padding: "10px 0",
    minHeight: "300px"
  },
  
  // 滚动容器
  ".cm-scroller": {
    overflow: "auto",
    fontFamily: "inherit"
  },
  
  // 行内容
  ".cm-line": {
    padding: "0 4px",
    lineHeight: "1.6"
  },
  
  // 光标
  ".cm-cursor": {
    borderLeftWidth: "2px",
    borderLeftColor: "#528bff"
  },
  
  // 选中文本
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
    backgroundColor: "#d7d4f0 !important"
  },
  
  // 匹配的括号
  "&.cm-focused .cm-matchingBracket": {
    backgroundColor: "#bad0f0",
    outline: "1px solid #c0d0f0"
  }
}, { dark: false })

// 使用主题
const extensions = [customTheme]
```

### 明暗模式支持

```typescript
import { EditorView } from '@codemirror/view'

// 亮色主题
const lightTheme = EditorView.theme({
  "&": {
    backgroundColor: "#ffffff",
    color: "#000000"
  },
  ".cm-content": {
    caretColor: "#000000"
  },
  ".cm-cursor": {
    borderLeftColor: "#000000"
  },
  ".cm-selectionBackground": {
    backgroundColor: "#d7d4f0"
  }
}, { dark: false })

// 暗色主题
const darkTheme = EditorView.theme({
  "&": {
    backgroundColor: "#1e1e1e",
    color: "#d4d4d4"
  },
  ".cm-content": {
    caretColor: "#ffffff"
  },
  ".cm-cursor": {
    borderLeftColor: "#ffffff"
  },
  ".cm-selectionBackground": {
    backgroundColor: "#264f78"
  },
  ".cm-gutters": {
    backgroundColor: "#1e1e1e",
    color: "#858585",
    border: "none"
  }
}, { dark: true })

// 在 React 中动态切换
function Editor() {
  const [isDark, setIsDark] = useState(false)
  
  const theme = useMemo(
    () => isDark ? darkTheme : lightTheme,
    [isDark]
  )
  
  return (
    <div>
      <button onClick={() => setIsDark(!isDark)}>
        切换主题
      </button>
      <CodeEditor extensions={[theme]} />
    </div>
  )
}
```

## 行号样式

### 基础行号配置

```typescript
import { lineNumbers, highlightActiveLineGutter } from '@codemirror/view'

const extensions = [
  lineNumbers(),                    // 显示行号
  highlightActiveLineGutter()       // 高亮当前行的行号
]
```

### 自定义行号样式

```typescript
import { EditorView } from '@codemirror/view'
import { lineNumbers } from '@codemirror/view'

const lineNumberTheme = EditorView.theme({
  // 行号区域（gutter）
  ".cm-gutters": {
    backgroundColor: "#f5f5f5",
    color: "#999",
    border: "none",
    borderRight: "1px solid #ddd",
    minWidth: "50px"
  },
  
  // 行号文本
  ".cm-lineNumbers": {
    fontFamily: "'Fira Code', monospace",
    fontSize: "13px",
    minWidth: "40px",
    textAlign: "right",
    paddingRight: "8px"
  },
  
  // 行号中的每一行
  ".cm-lineNumbers .cm-gutterElement": {
    padding: "0 8px 0 0",
    minWidth: "40px"
  },
  
  // 当前行的行号
  ".cm-activeLineGutter": {
    backgroundColor: "#e8f4ff",
    color: "#0066cc",
    fontWeight: "bold"
  }
})

const extensions = [
  lineNumbers(),
  highlightActiveLineGutter(),
  lineNumberTheme
]
```

### 相对行号

```typescript
import { lineNumbers, EditorView } from '@codemirror/view'

// 实现相对行号（类似 Vim）
const relativeLineNumbers = lineNumbers({
  formatNumber: (lineNo, state) => {
    const currentLine = state.doc.lineAt(state.selection.main.head).number
    const relative = Math.abs(lineNo - currentLine)
    return relative === 0 ? String(lineNo) : String(relative)
  }
})

const extensions = [relativeLineNumbers]
```

### 自定义行号内容

```typescript
import { lineNumbers } from '@codemirror/view'

// 显示十六进制行号
const hexLineNumbers = lineNumbers({
  formatNumber: (lineNo) => '0x' + lineNo.toString(16).toUpperCase()
})

// 每 5 行显示一次行号
const sparseLineNumbers = lineNumbers({
  formatNumber: (lineNo) => lineNo % 5 === 0 ? String(lineNo) : ''
})

// 添加行号前缀
const prefixedLineNumbers = lineNumbers({
  formatNumber: (lineNo) => `L${lineNo}`
})
```

## 字体配置

### 基础字体设置

```typescript
import { EditorView } from '@codemirror/view'

const fontTheme = EditorView.theme({
  ".cm-content": {
    fontFamily: "'Fira Code', 'JetBrains Mono', 'Consolas', monospace",
    fontSize: "14px",
    fontWeight: "400",
    lineHeight: "1.6"
  },
  
  // 连字支持（ligatures）
  ".cm-content": {
    fontVariantLigatures: "normal"  // 启用连字
  }
})
```

### 可配置的字体大小

```typescript
import React, { useMemo, useState } from 'react'
import { EditorView } from '@codemirror/view'

function Editor() {
  const [fontSize, setFontSize] = useState(14)
  
  const fontTheme = useMemo(() => 
    EditorView.theme({
      ".cm-content": {
        fontSize: `${fontSize}px`
      },
      ".cm-gutters": {
        fontSize: `${fontSize - 1}px`
      }
    }), 
    [fontSize]
  )
  
  return (
    <div>
      <div>
        <label>
          字体大小: {fontSize}px
          <input
            type="range"
            min="10"
            max="24"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
          />
        </label>
      </div>
      <CodeEditor extensions={[fontTheme]} />
    </div>
  )
}
```

### 等宽字体推荐

```typescript
const fontFamilies = {
  firaCode: "'Fira Code', monospace",
  jetBrains: "'JetBrains Mono', monospace",
  cascadia: "'Cascadia Code', monospace",
  sourceCode: "'Source Code Pro', monospace",
  inconsolata: "'Inconsolata', monospace",
  menlo: "'Menlo', 'Monaco', 'Courier New', monospace"
}

const fontTheme = EditorView.theme({
  ".cm-content": {
    fontFamily: fontFamilies.firaCode
  }
})
```

## 当前行高亮

```typescript
import { highlightActiveLine } from '@codemirror/view'
import { EditorView } from '@codemirror/view'

const activeLineTheme = EditorView.theme({
  // 当前行背景
  ".cm-activeLine": {
    backgroundColor: "#f0f9ff"
  },
  
  // 当前行的行号
  ".cm-activeLineGutter": {
    backgroundColor: "#e0f2fe",
    color: "#0369a1"
  }
})

const extensions = [
  highlightActiveLine(),
  activeLineTheme
]
```

## 缩进和空白字符

### 缩进配置

```typescript
import { EditorState } from '@codemirror/state'

const state = EditorState.create({
  extensions: [
    EditorState.tabSize.of(4),           // Tab 大小
    EditorState.lineSeparator.of("\n")   // 行分隔符
  ]
})
```

### 显示空白字符

```typescript
import { highlightWhitespace } from '@codemirror/view'
import { EditorView } from '@codemirror/view'

const whitespaceTheme = EditorView.theme({
  ".cm-whitespace": {
    color: "#d0d0d0"
  }
})

const extensions = [
  highlightWhitespace(),
  whitespaceTheme
]
```

### 显示缩进参考线

```typescript
import { EditorView, ViewPlugin, Decoration, DecorationSet } from '@codemirror/view'
import { RangeSetBuilder } from '@codemirror/state'

const indentGuides = ViewPlugin.fromClass(class {
  decorations: DecorationSet
  
  constructor(view: EditorView) {
    this.decorations = this.buildDecorations(view)
  }
  
  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged) {
      this.decorations = this.buildDecorations(update.view)
    }
  }
  
  buildDecorations(view: EditorView) {
    const builder = new RangeSetBuilder<Decoration>()
    const tabSize = view.state.tabSize
    
    for (let { from, to } of view.visibleRanges) {
      for (let pos = from; pos <= to;) {
        const line = view.state.doc.lineAt(pos)
        const text = line.text
        
        // 计算缩进级别
        let indent = 0
        for (let i = 0; i < text.length; i++) {
          if (text[i] === ' ') indent++
          else if (text[i] === '\t') indent += tabSize
          else break
        }
        
        // 添加缩进参考线装饰
        const levels = Math.floor(indent / tabSize)
        for (let i = 0; i < levels; i++) {
          const indentPos = line.from + i * tabSize
          builder.add(
            indentPos,
            indentPos,
            Decoration.widget({
              widget: new IndentGuideWidget(),
              side: 1
            })
          )
        }
        
        pos = line.to + 1
      }
    }
    
    return builder.finish()
  }
}, {
  decorations: v => v.decorations
})

class IndentGuideWidget extends WidgetType {
  toDOM() {
    const span = document.createElement('span')
    span.className = 'cm-indent-guide'
    return span
  }
}

const indentGuideTheme = EditorView.theme({
  ".cm-indent-guide": {
    display: "inline-block",
    width: "0",
    borderLeft: "1px solid #e0e0e0",
    height: "1em",
    marginLeft: "-1px"
  }
})

const extensions = [indentGuides, indentGuideTheme]
```

## 滚动条样式

```typescript
import { EditorView } from '@codemirror/view'

const scrollbarTheme = EditorView.theme({
  // 滚动容器
  ".cm-scroller": {
    overflow: "auto"
  },
  
  // Webkit 浏览器滚动条
  ".cm-scroller::-webkit-scrollbar": {
    width: "10px",
    height: "10px"
  },
  
  ".cm-scroller::-webkit-scrollbar-track": {
    background: "#f1f1f1",
    borderRadius: "10px"
  },
  
  ".cm-scroller::-webkit-scrollbar-thumb": {
    background: "#888",
    borderRadius: "10px"
  },
  
  ".cm-scroller::-webkit-scrollbar-thumb:hover": {
    background: "#555"
  },
  
  // Firefox 滚动条
  ".cm-scroller": {
    scrollbarWidth: "thin",
    scrollbarColor: "#888 #f1f1f1"
  }
})

const extensions = [scrollbarTheme]
```

## 边距和内边距

```typescript
import { EditorView } from '@codemirror/view'

const spacingTheme = EditorView.theme({
  // 编辑器整体内边距
  "&": {
    padding: "10px"
  },
  
  // 内容区域内边距
  ".cm-content": {
    padding: "10px 0"
  },
  
  // 行内边距
  ".cm-line": {
    padding: "0 10px"
  },
  
  // 行号区域内边距
  ".cm-gutters": {
    padding: "10px 0"
  }
})
```

## 完整样式示例

下面是一个完整的样式配置示例：

```typescript
import { EditorView } from '@codemirror/view'
import { 
  lineNumbers, 
  highlightActiveLineGutter,
  highlightActiveLine,
  highlightWhitespace
} from '@codemirror/view'

// 自定义主题
const myTheme = EditorView.theme({
  // 编辑器容器
  "&": {
    fontSize: "14px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "#ffffff"
  },
  
  // 焦点状态
  "&.cm-focused": {
    outline: "2px solid #0066cc",
    outlineOffset: "-1px"
  },
  
  // 内容区域
  ".cm-content": {
    fontFamily: "'Fira Code', 'Consolas', monospace",
    padding: "10px 0",
    minHeight: "300px",
    caretColor: "#0066cc"
  },
  
  // 滚动容器
  ".cm-scroller": {
    overflow: "auto",
    lineHeight: "1.6"
  },
  
  // 行
  ".cm-line": {
    padding: "0 8px"
  },
  
  // 当前行
  ".cm-activeLine": {
    backgroundColor: "#f0f9ff"
  },
  
  // 光标
  ".cm-cursor": {
    borderLeftWidth: "2px",
    borderLeftColor: "#0066cc"
  },
  
  // 选中文本
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
    backgroundColor: "#d7d4f0 !important"
  },
  
  // 行号区域
  ".cm-gutters": {
    backgroundColor: "#f8f9fa",
    color: "#6c757d",
    border: "none",
    borderRight: "1px solid #e0e0e0",
    minWidth: "50px"
  },
  
  // 行号
  ".cm-lineNumbers .cm-gutterElement": {
    padding: "0 12px 0 8px",
    minWidth: "40px",
    textAlign: "right",
    fontFamily: "'Fira Code', monospace",
    fontSize: "13px"
  },
  
  // 当前行行号
  ".cm-activeLineGutter": {
    backgroundColor: "#e3f2fd",
    color: "#1976d2",
    fontWeight: "600"
  },
  
  // 匹配的括号
  "&.cm-focused .cm-matchingBracket": {
    backgroundColor: "#bad0f0",
    outline: "1px solid #c0d0f0"
  },
  
  // 不匹配的括号
  "&.cm-focused .cm-nonmatchingBracket": {
    backgroundColor: "#ffc0c0",
    outline: "1px solid #ff8080"
  },
  
  // 空白字符
  ".cm-whitespace": {
    color: "#d0d0d0"
  },
  
  // 滚动条
  ".cm-scroller::-webkit-scrollbar": {
    width: "10px",
    height: "10px"
  },
  ".cm-scroller::-webkit-scrollbar-track": {
    background: "#f1f1f1"
  },
  ".cm-scroller::-webkit-scrollbar-thumb": {
    background: "#c1c1c1",
    borderRadius: "5px"
  },
  ".cm-scroller::-webkit-scrollbar-thumb:hover": {
    background: "#a8a8a8"
  }
}, { dark: false })

// 扩展配置
const extensions = [
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightActiveLine(),
  highlightWhitespace(),
  myTheme
]
```

## React 组件封装

```typescript
import React, { useMemo } from 'react'
import { EditorView } from '@codemirror/view'

interface StyleConfig {
  fontSize?: number
  fontFamily?: string
  lineHeight?: number
  theme?: 'light' | 'dark'
}

interface StyledEditorProps {
  styleConfig?: StyleConfig
}

export const StyledEditor: React.FC<StyledEditorProps> = ({
  styleConfig = {}
}) => {
  const {
    fontSize = 14,
    fontFamily = "'Fira Code', monospace",
    lineHeight = 1.6,
    theme = 'light'
  } = styleConfig
  
  const customTheme = useMemo(() => {
    const isDark = theme === 'dark'
    
    return EditorView.theme({
      "&": {
        fontSize: `${fontSize}px`,
        backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
        color: isDark ? "#d4d4d4" : "#000000"
      },
      ".cm-content": {
        fontFamily,
        lineHeight: String(lineHeight)
      },
      ".cm-gutters": {
        backgroundColor: isDark ? "#1e1e1e" : "#f8f9fa",
        color: isDark ? "#858585" : "#6c757d"
      }
    }, { dark: isDark })
  }, [fontSize, fontFamily, lineHeight, theme])
  
  return <CodeEditor extensions={[customTheme]} />
}
```

## 小结

在本章中，我们学习了：

- ✅ CodeMirror 6 的样式系统
- ✅ 使用 EditorView.theme() 创建主题
- ✅ 行号样式定制
- ✅ 字体配置和大小调整
- ✅ 当前行高亮
- ✅ 缩进和空白字符显示
- ✅ 滚动条样式
- ✅ 完整的样式配置示例

## 下一步

接下来，我们将学习更高级的主题系统，包括如何创建完整的主题包。

👉 [下一章：主题系统详解](./02-theme-system.md)


