# 状态管理与事件系统

在本章中，我们将深入学习 CodeMirror 6 的状态管理机制和事件处理系统。理解这些核心概念对于构建复杂的编辑器功能至关重要。

## EditorState 详解

### 状态的组成

`EditorState` 是不可变的，包含以下主要部分：

```typescript
import { EditorState } from '@codemirror/state'

const state = EditorState.create({
  doc: "Hello, World!",        // 文档内容
  selection: { anchor: 0 },     // 选区
  extensions: []                // 扩展配置
})

// 访问状态信息
console.log(state.doc.toString())           // 文档内容
console.log(state.selection.main.from)      // 选区起始位置
console.log(state.selection.main.to)        // 选区结束位置
console.log(state.doc.length)               // 文档长度
console.log(state.doc.lines)                // 行数
```

### 文档模型（Document）

CodeMirror 6 的文档是一个高效的不可变数据结构：

```typescript
import { Text } from '@codemirror/state'

// 创建文档
const doc = Text.of(["第一行", "第二行", "第三行"])

// 访问文档内容
console.log(doc.toString())                 // 完整内容
console.log(doc.line(1).text)               // 第一行内容（从 1 开始）
console.log(doc.lineAt(10).text)            // 位置 10 所在行的内容

// 文档统计
console.log(doc.length)                     // 总字符数
console.log(doc.lines)                      // 总行数

// 位置转换
const line = doc.line(2)
console.log(line.from)                      // 该行起始位置
console.log(line.to)                        // 该行结束位置
console.log(line.number)                    // 行号
```

### 选区（Selection）

选区表示光标位置和选中的文本：

```typescript
import { EditorSelection } from '@codemirror/state'

// 创建单个光标
const cursor = EditorSelection.cursor(10)

// 创建选区（从位置 5 到 15）
const range = EditorSelection.range(5, 15)

// 创建多光标选区
const multiSelection = EditorSelection.create([
  EditorSelection.range(0, 5),
  EditorSelection.range(10, 15),
  EditorSelection.range(20, 25)
])

// 访问选区信息
const selection = state.selection
console.log(selection.main.from)            // 主选区起始
console.log(selection.main.to)              // 主选区结束
console.log(selection.main.empty)           // 是否为空（光标）
console.log(selection.ranges.length)        // 选区数量

// 获取选中的文本
const selectedText = state.sliceDoc(
  selection.main.from, 
  selection.main.to
)
```

## Transaction 详解

Transaction 描述了状态的变化，是修改编辑器的唯一方式。

### 创建 Transaction

```typescript
// 方式一：使用 state.update()
const transaction = state.update({
  changes: { from: 0, to: 5, insert: "Hi" },
  selection: { anchor: 2 }
})

// 方式二：使用 view.dispatch()
view.dispatch({
  changes: { from: 0, to: 5, insert: "Hi" },
  selection: { anchor: 2 }
})

// 应用 transaction 得到新状态
const newState = transaction.state
```

### Changes（变更）

Changes 描述了文档的修改：

```typescript
// 插入文本
view.dispatch({
  changes: { from: 10, insert: "new text" }
})

// 删除文本
view.dispatch({
  changes: { from: 5, to: 15 }
})

// 替换文本
view.dispatch({
  changes: { from: 5, to: 15, insert: "replacement" }
})

// 多个变更
view.dispatch({
  changes: [
    { from: 0, insert: "// " },
    { from: 20, insert: "// " },
    { from: 40, insert: "// " }
  ]
})
```

### ChangeSet 和位置映射

当文档发生变化时，位置会改变。CodeMirror 提供了位置映射功能：

```typescript
import { ChangeSet } from '@codemirror/state'

// 创建一个变更集
const changes = ChangeSet.of([
  { from: 0, insert: "Hello " }  // 在开头插入 "Hello "
], state.doc.length)

// 映射位置
const oldPos = 10
const newPos = changes.mapPos(oldPos)  // 计算变更后的新位置
console.log(`位置 ${oldPos} 变更后为 ${newPos}`)

// 在 transaction 中使用
view.dispatch({
  changes: { from: 0, insert: "Hello " },
  selection: EditorSelection.cursor(
    // 保持光标在相对位置
    state.selection.main.from + 6
  )
})
```

### Effects（效果）

Effects 用于触发状态字段的更新或其他副作用：

```typescript
import { StateEffect } from '@codemirror/state'

// 定义一个 effect
const addHighlight = StateEffect.define<{from: number, to: number}>()

// 分发 effect
view.dispatch({
  effects: addHighlight.of({ from: 10, to: 20 })
})

// 在 StateField 中处理 effect
const highlightField = StateField.define({
  create() {
    return []
  },
  update(highlights, tr) {
    for (let effect of tr.effects) {
      if (effect.is(addHighlight)) {
        highlights = [...highlights, effect.value]
      }
    }
    return highlights
  }
})
```

### Annotations（注解）

Annotations 为 transaction 添加元数据：

```typescript
import { Annotation } from '@codemirror/state'

// 定义注解
const userEvent = Annotation.define<string>()

// 添加注解
view.dispatch({
  changes: { from: 0, insert: "text" },
  annotations: userEvent.of("input.type")
})

// 在 update listener 中读取注解
EditorView.updateListener.of((update) => {
  const event = update.transactions[0]?.annotation(userEvent)
  if (event === "input.type") {
    console.log("用户输入")
  }
})
```

## StateField（状态字段）

StateField 允许你在编辑器状态中存储自定义数据。

### 创建 StateField

```typescript
import { StateField } from '@codemirror/state'

// 示例：记录编辑次数
const editCountField = StateField.define<number>({
  // 初始值
  create() {
    return 0
  },
  
  // 更新逻辑
  update(value, transaction) {
    if (transaction.docChanged) {
      return value + 1
    }
    return value
  }
})

// 在编辑器中使用
const state = EditorState.create({
  extensions: [editCountField]
})

// 读取字段值
const editCount = state.field(editCountField)
console.log(`编辑次数: ${editCount}`)
```

### 实战示例：撤销历史

```typescript
import { StateField, StateEffect } from '@codemirror/state'

// 定义 effects
const addToHistory = StateEffect.define<string>()
const clearHistory = StateEffect.define()

// 历史记录字段
const historyField = StateField.define<string[]>({
  create() {
    return []
  },
  
  update(history, tr) {
    // 处理清空历史
    for (let effect of tr.effects) {
      if (effect.is(clearHistory)) {
        return []
      }
      if (effect.is(addToHistory)) {
        return [...history, effect.value]
      }
    }
    
    // 文档变化时自动添加到历史
    if (tr.docChanged) {
      const newContent = tr.newDoc.toString()
      return [...history, newContent].slice(-10) // 只保留最近 10 条
    }
    
    return history
  }
})

// 使用
const extensions = [historyField]

// 读取历史
const history = view.state.field(historyField)
console.log('历史记录:', history)

// 清空历史
view.dispatch({
  effects: clearHistory.of(null)
})
```

### 实战示例：错误标记

```typescript
import { StateField, StateEffect } from '@codemirror/state'
import { Decoration, DecorationSet, EditorView } from '@codemirror/view'

// 定义错误类型
interface ErrorMark {
  from: number
  to: number
  message: string
}

// Effect 用于设置错误
const setErrors = StateEffect.define<ErrorMark[]>()

// 错误装饰
const errorMark = Decoration.mark({
  class: "cm-error",
  attributes: { title: "错误" }
})

// 错误字段
const errorField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none
  },
  
  update(errors, tr) {
    // 映射现有错误到新位置
    errors = errors.map(tr.changes)
    
    // 处理新的错误
    for (let effect of tr.effects) {
      if (effect.is(setErrors)) {
        const decorations = effect.value.map(err => 
          errorMark.range(err.from, err.to)
        )
        errors = Decoration.set(decorations)
      }
    }
    
    return errors
  },
  
  provide: f => EditorView.decorations.from(f)
})

// 使用
const extensions = [errorField]

// 设置错误
view.dispatch({
  effects: setErrors.of([
    { from: 10, to: 15, message: "未定义的变量" },
    { from: 30, to: 35, message: "语法错误" }
  ])
})
```

## 事件监听

### UpdateListener

UpdateListener 是监听编辑器变化的主要方式：

```typescript
import { EditorView } from '@codemirror/view'

const updateListener = EditorView.updateListener.of((update) => {
  // 文档是否改变
  if (update.docChanged) {
    console.log("文档已修改")
    console.log("新内容:", update.state.doc.toString())
  }
  
  // 选区是否改变
  if (update.selectionSet) {
    console.log("选区已改变")
    const { from, to } = update.state.selection.main
    console.log(`选区: ${from} - ${to}`)
  }
  
  // 视图是否改变（滚动、焦点等）
  if (update.viewportChanged) {
    console.log("视口已改变")
  }
  
  // 焦点是否改变
  if (update.focusChanged) {
    console.log("焦点状态:", update.view.hasFocus)
  }
  
  // 访问 transactions
  for (let tr of update.transactions) {
    console.log("Transaction:", tr)
  }
})

const extensions = [updateListener]
```

### ViewUpdate 对象

```typescript
EditorView.updateListener.of((update) => {
  // 基本信息
  update.state          // 新状态
  update.view           // EditorView 实例
  update.transactions   // 导致此更新的所有 transactions
  
  // 变化标志
  update.docChanged         // 文档是否改变
  update.selectionSet       // 选区是否设置
  update.viewportChanged    // 视口是否改变
  update.focusChanged       // 焦点是否改变
  update.heightChanged      // 高度是否改变
  
  // 变更信息
  update.changes        // 所有变更的合并
  update.startState     // 更新前的状态
  
  // 几何信息
  update.geometryChanged    // 编辑器几何是否改变
})
```

### DOM 事件监听

```typescript
import { EditorView } from '@codemirror/view'

const domEventHandlers = EditorView.domEventHandlers({
  // 鼠标事件
  click(event, view) {
    const pos = view.posAtCoords({ x: event.clientX, y: event.clientY })
    console.log("点击位置:", pos)
    return false // 返回 true 阻止默认行为
  },
  
  dblclick(event, view) {
    console.log("双击")
    return false
  },
  
  mousedown(event, view) {
    console.log("鼠标按下")
    return false
  },
  
  // 键盘事件
  keydown(event, view) {
    console.log("按键:", event.key)
    
    // 自定义快捷键
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault()
      console.log("保存")
      return true
    }
    
    return false
  },
  
  // 焦点事件
  focus(event, view) {
    console.log("获得焦点")
    return false
  },
  
  blur(event, view) {
    console.log("失去焦点")
    return false
  },
  
  // 粘贴事件
  paste(event, view) {
    const text = event.clipboardData?.getData('text/plain')
    console.log("粘贴内容:", text)
    return false
  },
  
  // 拖放事件
  drop(event, view) {
    console.log("拖放")
    return false
  }
})

const extensions = [domEventHandlers]
```

## React 集成中的事件处理

### 方式一：通过 props 传递回调

```typescript
import React, { useEffect, useRef } from 'react'
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'

interface CodeEditorProps {
  onChange?: (value: string) => void
  onSelectionChange?: (from: number, to: number) => void
  onFocus?: () => void
  onBlur?: () => void
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  onChange,
  onSelectionChange,
  onFocus,
  onBlur
}) => {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!editorRef.current) return

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged && onChange) {
        onChange(update.state.doc.toString())
      }
      
      if (update.selectionSet && onSelectionChange) {
        const { from, to } = update.state.selection.main
        onSelectionChange(from, to)
      }
      
      if (update.focusChanged) {
        if (update.view.hasFocus && onFocus) {
          onFocus()
        } else if (!update.view.hasFocus && onBlur) {
          onBlur()
        }
      }
    })

    const state = EditorState.create({
      extensions: [updateListener]
    })

    const view = new EditorView({
      state,
      parent: editorRef.current
    })

    return () => view.destroy()
  }, [onChange, onSelectionChange, onFocus, onBlur])

  return <div ref={editorRef} />
}
```

### 方式二：使用自定义 Hook

```typescript
import { useEffect, useRef } from 'react'
import { EditorView } from '@codemirror/view'

interface UseEditorEventsOptions {
  view: EditorView | null
  onDocChange?: (doc: string) => void
  onSelection?: (from: number, to: number) => void
}

export function useEditorEvents({
  view,
  onDocChange,
  onSelection
}: UseEditorEventsOptions) {
  const callbacksRef = useRef({ onDocChange, onSelection })
  
  // 更新回调引用
  useEffect(() => {
    callbacksRef.current = { onDocChange, onSelection }
  })
  
  useEffect(() => {
    if (!view) return
    
    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged && callbacksRef.current.onDocChange) {
        callbacksRef.current.onDocChange(update.state.doc.toString())
      }
      
      if (update.selectionSet && callbacksRef.current.onSelection) {
        const { from, to } = update.state.selection.main
        callbacksRef.current.onSelection(from, to)
      }
    })
    
    view.dispatch({
      effects: StateEffect.appendConfig.of(updateListener)
    })
  }, [view])
}

// 使用
function MyEditor() {
  const viewRef = useRef<EditorView | null>(null)
  
  useEditorEvents({
    view: viewRef.current,
    onDocChange: (doc) => console.log('文档变化:', doc),
    onSelection: (from, to) => console.log('选区:', from, to)
  })
  
  // ... 创建编辑器
}
```

## 实战：实现自动保存

```typescript
import React, { useEffect, useRef, useCallback } from 'react'
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'

interface AutoSaveEditorProps {
  initialValue: string
  onSave: (content: string) => Promise<void>
  saveDelay?: number
}

export const AutoSaveEditor: React.FC<AutoSaveEditorProps> = ({
  initialValue,
  onSave,
  saveDelay = 2000
}) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const saveTimerRef = useRef<NodeJS.Timeout>()
  const lastSavedRef = useRef(initialValue)

  const handleSave = useCallback(async (content: string) => {
    if (content === lastSavedRef.current) return
    
    try {
      await onSave(content)
      lastSavedRef.current = content
      console.log('已保存')
    } catch (error) {
      console.error('保存失败:', error)
    }
  }, [onSave])

  useEffect(() => {
    if (!editorRef.current) return

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        // 清除之前的定时器
        if (saveTimerRef.current) {
          clearTimeout(saveTimerRef.current)
        }
        
        // 设置新的定时器
        const content = update.state.doc.toString()
        saveTimerRef.current = setTimeout(() => {
          handleSave(content)
        }, saveDelay)
      }
    })

    const state = EditorState.create({
      doc: initialValue,
      extensions: [updateListener]
    })

    const view = new EditorView({
      state,
      parent: editorRef.current
    })

    viewRef.current = view

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }
      view.destroy()
    }
  }, [])

  return <div ref={editorRef} />
}
```

## 小结

在本章中，我们学习了：

- ✅ EditorState 的组成和使用
- ✅ 文档模型和选区操作
- ✅ Transaction 的创建和应用
- ✅ StateField 的定义和使用
- ✅ 事件监听和处理
- ✅ 在 React 中集成事件系统
- ✅ 实战案例：自动保存功能

## 下一步

掌握了状态管理和事件系统后，我们将学习如何定制编辑器的样式。

👉 [下一章：样式定制基础](../02-styling/01-styling-basics.md)


