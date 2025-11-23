# 基础设置与 React 集成

在本章中，我们将学习如何在 React 应用中集成 CodeMirror 6，并创建一个可复用的 React 组件。

## 安装依赖

首先，安装必要的 CodeMirror 6 包：

```bash
npm install @codemirror/state @codemirror/view codemirror
# 或使用 yarn
yarn add @codemirror/state @codemirror/view codemirror
# 或使用 pnpm
pnpm add @codemirror/state @codemirror/view codemirror
```

`codemirror` 包是一个方便的包，它重新导出了常用的功能和扩展。

## 基础 React 组件

### 方法一：使用 useEffect 创建编辑器

最直接的方法是使用 `useEffect` 来创建和管理 EditorView：

```typescript
import React, { useEffect, useRef } from 'react'
import { EditorState } from '@codemirror/state'
import { EditorView, basicSetup } from 'codemirror'

interface CodeEditorProps {
  initialValue?: string
  onChange?: (value: string) => void
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ 
  initialValue = '',
  onChange 
}) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)

  useEffect(() => {
    if (!editorRef.current) return

    // 创建编辑器状态
    const state = EditorState.create({
      doc: initialValue,
      extensions: [
        basicSetup,
        EditorView.updateListener.of((update) => {
          if (update.docChanged && onChange) {
            const newValue = update.state.doc.toString()
            onChange(newValue)
          }
        })
      ]
    })

    // 创建编辑器视图
    const view = new EditorView({
      state,
      parent: editorRef.current
    })

    viewRef.current = view

    // 清理函数
    return () => {
      view.destroy()
    }
  }, []) // 空依赖数组，只在挂载时创建

  return <div ref={editorRef} />
}
```

**使用示例：**

```typescript
function App() {
  const [code, setCode] = React.useState('console.log("Hello")')

  return (
    <div>
      <h1>我的代码编辑器</h1>
      <CodeEditor 
        initialValue={code}
        onChange={setCode}
      />
      <div>
        <h2>当前代码：</h2>
        <pre>{code}</pre>
      </div>
    </div>
  )
}
```

### 方法二：使用 useRef 和命令式更新

如果需要更细粒度的控制，可以使用 ref 来暴露编辑器实例：

```typescript
import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { EditorState } from '@codemirror/state'
import { EditorView, basicSetup } from 'codemirror'

interface CodeEditorProps {
  initialValue?: string
  onChange?: (value: string) => void
  extensions?: any[]
}

export interface CodeEditorRef {
  view: EditorView | null
  getValue: () => string
  setValue: (value: string) => void
  focus: () => void
}

export const CodeEditor = forwardRef<CodeEditorRef, CodeEditorProps>(
  ({ initialValue = '', onChange, extensions = [] }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null)
    const viewRef = useRef<EditorView | null>(null)

    useImperativeHandle(ref, () => ({
      view: viewRef.current,
      getValue: () => {
        return viewRef.current?.state.doc.toString() || ''
      },
      setValue: (value: string) => {
        if (!viewRef.current) return
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: viewRef.current.state.doc.length,
            insert: value
          }
        })
      },
      focus: () => {
        viewRef.current?.focus()
      }
    }))

    useEffect(() => {
      if (!editorRef.current) return

      const state = EditorState.create({
        doc: initialValue,
        extensions: [
          basicSetup,
          ...extensions,
          EditorView.updateListener.of((update) => {
            if (update.docChanged && onChange) {
              onChange(update.state.doc.toString())
            }
          })
        ]
      })

      const view = new EditorView({
        state,
        parent: editorRef.current
      })

      viewRef.current = view

      return () => {
        view.destroy()
      }
    }, [])

    return <div ref={editorRef} />
  }
)

CodeEditor.displayName = 'CodeEditor'
```

**使用示例：**

```typescript
function App() {
  const editorRef = useRef<CodeEditorRef>(null)

  const handleClear = () => {
    editorRef.current?.setValue('')
  }

  const handleGetValue = () => {
    const value = editorRef.current?.getValue()
    alert(value)
  }

  return (
    <div>
      <CodeEditor ref={editorRef} initialValue="// 开始编码" />
      <button onClick={handleClear}>清空</button>
      <button onClick={handleGetValue}>获取内容</button>
    </div>
  )
}
```

## 处理动态扩展

如果需要动态更新扩展（比如切换主题或语言），需要使用 `reconfigure`：

```typescript
import React, { useEffect, useRef, useState } from 'react'
import { EditorState, Compartment } from '@codemirror/state'
import { EditorView, basicSetup } from 'codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'

export const CodeEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const languageConf = useRef(new Compartment())
  const [language, setLanguage] = useState<'javascript' | 'python'>('javascript')

  useEffect(() => {
    if (!editorRef.current) return

    const state = EditorState.create({
      doc: 'console.log("Hello")',
      extensions: [
        basicSetup,
        languageConf.current.of(javascript())
      ]
    })

    const view = new EditorView({
      state,
      parent: editorRef.current
    })

    viewRef.current = view

    return () => {
      view.destroy()
    }
  }, [])

  // 当语言改变时，重新配置编辑器
  useEffect(() => {
    if (!viewRef.current) return

    const newLanguage = language === 'javascript' 
      ? javascript() 
      : python()

    viewRef.current.dispatch({
      effects: languageConf.current.reconfigure(newLanguage)
    })
  }, [language])

  return (
    <div>
      <select value={language} onChange={(e) => setLanguage(e.target.value as any)}>
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
      </select>
      <div ref={editorRef} />
    </div>
  )
}
```

## 完整的可配置组件

下面是一个功能更完整的组件示例：

```typescript
import React, { useEffect, useRef, useCallback } from 'react'
import { EditorState, Extension } from '@codemirror/state'
import { EditorView, basicSetup } from 'codemirror'

export interface CodeEditorProps {
  /** 初始文档内容 */
  value?: string
  /** 内容变化回调 */
  onChange?: (value: string) => void
  /** 编辑器高度 */
  height?: string
  /** 最小高度 */
  minHeight?: string
  /** 最大高度 */
  maxHeight?: string
  /** 是否只读 */
  readOnly?: boolean
  /** 是否可编辑 */
  editable?: boolean
  /** 自定义扩展 */
  extensions?: Extension[]
  /** 类名 */
  className?: string
  /** 样式 */
  style?: React.CSSProperties
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value = '',
  onChange,
  height,
  minHeight,
  maxHeight,
  readOnly = false,
  editable = true,
  extensions = [],
  className = '',
  style = {}
}) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)

  // 创建编辑器
  useEffect(() => {
    if (!editorRef.current) return

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged && onChange) {
        const newValue = update.state.doc.toString()
        onChange(newValue)
      }
    })

    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        updateListener,
        EditorView.editable.of(editable && !readOnly),
        EditorState.readOnly.of(readOnly),
        ...extensions
      ]
    })

    const view = new EditorView({
      state,
      parent: editorRef.current
    })

    viewRef.current = view

    return () => {
      view.destroy()
      viewRef.current = null
    }
  }, []) // 只在挂载时创建

  // 外部 value 变化时更新编辑器内容
  useEffect(() => {
    if (!viewRef.current) return
    
    const currentValue = viewRef.current.state.doc.toString()
    if (value !== currentValue) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: currentValue.length,
          insert: value
        }
      })
    }
  }, [value])

  // 动态更新 editable 和 readOnly
  useEffect(() => {
    if (!viewRef.current) return

    viewRef.current.dispatch({
      effects: [
        EditorView.editable.reconfigure(EditorView.editable.of(editable && !readOnly)),
        EditorState.readOnly.reconfigure(EditorState.readOnly.of(readOnly))
      ]
    })
  }, [editable, readOnly])

  const containerStyle: React.CSSProperties = {
    ...style,
    height,
    minHeight,
    maxHeight
  }

  return (
    <div 
      ref={editorRef} 
      className={className}
      style={containerStyle}
    />
  )
}
```

**使用示例：**

```typescript
function App() {
  const [code, setCode] = useState('console.log("Hello")')
  const [readOnly, setReadOnly] = useState(false)

  return (
    <div>
      <div>
        <label>
          <input 
            type="checkbox" 
            checked={readOnly}
            onChange={(e) => setReadOnly(e.target.checked)}
          />
          只读模式
        </label>
      </div>
      
      <CodeEditor
        value={code}
        onChange={setCode}
        height="400px"
        readOnly={readOnly}
        className="my-editor"
      />
    </div>
  )
}
```

## 样式处理

CodeMirror 6 的样式可以通过多种方式定制：

### 1. 基础容器样式

```css
/* 为编辑器容器添加边框和圆角 */
.my-editor {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

/* CodeMirror 的根元素 */
.my-editor .cm-editor {
  height: 100%;
}

/* 滚动容器 */
.my-editor .cm-scroller {
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
}
```

### 2. 使用 EditorView.theme

```typescript
import { EditorView } from '@codemirror/view'

const customTheme = EditorView.theme({
  "&": {
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "4px"
  },
  ".cm-content": {
    fontFamily: "'Fira Code', monospace",
    minHeight: "200px"
  },
  ".cm-gutters": {
    backgroundColor: "#f5f5f5",
    borderRight: "1px solid #ddd"
  },
  ".cm-activeLineGutter": {
    backgroundColor: "#e8f4ff"
  }
}, { dark: false })

// 在组件中使用
<CodeEditor extensions={[customTheme]} />
```

## 常见问题

### 1. 编辑器不显示或高度为 0

确保给编辑器容器设置高度：

```typescript
<CodeEditor 
  height="400px" 
  // 或使用 minHeight
  minHeight="200px"
/>
```

或使用 CSS：

```css
.editor-container {
  height: 400px;
}
```

### 2. onChange 触发过于频繁

可以使用防抖来优化：

```typescript
import { useCallback } from 'react'
import { debounce } from 'lodash-es'

function App() {
  const [code, setCode] = useState('')

  const handleChange = useCallback(
    debounce((value: string) => {
      setCode(value)
      // 保存到服务器等操作
    }, 500),
    []
  )

  return <CodeEditor onChange={handleChange} />
}
```

### 3. 受控 vs 非受控

**非受控模式**（推荐）：

```typescript
// 只设置初始值，不监听变化
<CodeEditor initialValue={code} />
```

**受控模式**：

```typescript
// 双向绑定，需要处理好更新逻辑
<CodeEditor value={code} onChange={setCode} />
```

受控模式需要小心处理，避免不必要的重新渲染和光标位置丢失。

## 性能优化

### 1. 避免不必要的重新创建

```typescript
// ❌ 错误：每次渲染都创建新的扩展数组
<CodeEditor extensions={[basicSetup, javascript()]} />

// ✅ 正确：使用 useMemo 缓存
const extensions = useMemo(() => [basicSetup, javascript()], [])
<CodeEditor extensions={extensions} />
```

### 2. 使用 Compartment 动态配置

```typescript
// 使用 Compartment 可以动态更新配置，而不需要重新创建编辑器
const languageConf = useRef(new Compartment())

// 初始化时
extensions: [languageConf.current.of(javascript())]

// 更新时
view.dispatch({
  effects: languageConf.current.reconfigure(python())
})
```

### 3. 延迟加载语言包

```typescript
const [languageExt, setLanguageExt] = useState<Extension | null>(null)

useEffect(() => {
  // 异步加载语言包
  import('@codemirror/lang-javascript').then(mod => {
    setLanguageExt(mod.javascript())
  })
}, [])

// 在 extensions 中使用
extensions={languageExt ? [languageExt] : []}
```

## 小结

在本章中，我们学习了：

- ✅ 如何安装 CodeMirror 6 依赖
- ✅ 创建基础的 React 组件
- ✅ 使用 ref 暴露编辑器实例
- ✅ 处理动态扩展和配置
- ✅ 样式定制方法
- ✅ 常见问题和性能优化

## 下一步

现在你已经可以在 React 中使用 CodeMirror 6 了，接下来我们将深入学习状态管理和事件系统。

👉 [下一章：状态管理与事件系统](./03-state-and-events.md)


