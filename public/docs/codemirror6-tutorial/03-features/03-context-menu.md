# 上下文菜单与文本操作

在本章中，我们将学习如何在 CodeMirror 6 中实现上下文菜单、文本选择操作、以及各种文本编辑功能。

## 上下文菜单基础

CodeMirror 6 没有内置的上下文菜单，但我们可以通过监听 DOM 事件来实现自定义的上下文菜单。

### 基础上下文菜单实现

```typescript
import { EditorView } from '@codemirror/view'
import { EditorSelection } from '@codemirror/state'

const contextMenuPlugin = EditorView.domEventHandlers({
  contextmenu(event, view) {
    event.preventDefault()
    
    // 获取点击位置
    const pos = view.posAtCoords({ x: event.clientX, y: event.clientY })
    if (pos === null) return false
    
    // 如果点击位置不在选区内，移动光标到点击位置
    const selection = view.state.selection.main
    if (pos < selection.from || pos > selection.to) {
      view.dispatch({
        selection: EditorSelection.cursor(pos)
      })
    }
    
    // 显示上下文菜单
    showContextMenu(event.clientX, event.clientY, view)
    
    return true
  }
})

function showContextMenu(x: number, y: number, view: EditorView) {
  // 创建菜单元素
  const menu = document.createElement('div')
  menu.className = 'cm-context-menu'
  menu.style.position = 'fixed'
  menu.style.left = `${x}px`
  menu.style.top = `${y}px`
  
  // 获取选中的文本
  const selection = view.state.selection.main
  const selectedText = view.state.doc.sliceString(selection.from, selection.to)
  const hasSelection = !selection.empty
  
  // 添加菜单项
  const items = [
    { label: '剪切', action: () => cutText(view), disabled: !hasSelection },
    { label: '复制', action: () => copyText(view), disabled: !hasSelection },
    { label: '粘贴', action: () => pasteText(view) },
    { label: '---' },  // 分隔符
    { label: '全选', action: () => selectAll(view) },
    { label: '---' },
    { label: '查找', action: () => openSearch(view) },
    { label: '替换', action: () => openReplace(view) }
  ]
  
  items.forEach(item => {
    if (item.label === '---') {
      const separator = document.createElement('div')
      separator.className = 'menu-separator'
      menu.appendChild(separator)
    } else {
      const menuItem = document.createElement('div')
      menuItem.className = 'menu-item'
      if (item.disabled) {
        menuItem.classList.add('disabled')
      }
      menuItem.textContent = item.label
      
      if (!item.disabled) {
        menuItem.onclick = () => {
          item.action()
          closeMenu()
        }
      }
      
      menu.appendChild(menuItem)
    }
  })
  
  document.body.appendChild(menu)
  
  // 点击其他地方关闭菜单
  const closeMenu = () => {
    menu.remove()
    document.removeEventListener('click', closeMenu)
  }
  
  setTimeout(() => {
    document.addEventListener('click', closeMenu)
  }, 0)
}

// 样式
const contextMenuTheme = EditorView.theme({
  ".cm-context-menu": {
    backgroundColor: "#ffffff",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    padding: "4px 0",
    minWidth: "150px",
    zIndex: "1000"
  },
  ".menu-item": {
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: "14px"
  },
  ".menu-item:hover": {
    backgroundColor: "#f0f0f0"
  },
  ".menu-item.disabled": {
    color: "#999",
    cursor: "not-allowed"
  },
  ".menu-item.disabled:hover": {
    backgroundColor: "transparent"
  },
  ".menu-separator": {
    height: "1px",
    backgroundColor: "#e0e0e0",
    margin: "4px 0"
  }
})

const extensions = [contextMenuPlugin, contextMenuTheme]
```

### 文本操作函数

```typescript
import { EditorView } from '@codemirror/view'
import { EditorSelection } from '@codemirror/state'

// 剪切
function cutText(view: EditorView) {
  const selection = view.state.selection.main
  if (selection.empty) return
  
  const text = view.state.doc.sliceString(selection.from, selection.to)
  
  // 复制到剪贴板
  navigator.clipboard.writeText(text)
  
  // 删除选中的文本
  view.dispatch({
    changes: { from: selection.from, to: selection.to },
    selection: EditorSelection.cursor(selection.from)
  })
}

// 复制
function copyText(view: EditorView) {
  const selection = view.state.selection.main
  if (selection.empty) return
  
  const text = view.state.doc.sliceString(selection.from, selection.to)
  navigator.clipboard.writeText(text)
}

// 粘贴
async function pasteText(view: EditorView) {
  try {
    const text = await navigator.clipboard.readText()
    const selection = view.state.selection.main
    
    view.dispatch({
      changes: { from: selection.from, to: selection.to, insert: text },
      selection: EditorSelection.cursor(selection.from + text.length)
    })
  } catch (err) {
    console.error('粘贴失败:', err)
  }
}

// 全选
function selectAll(view: EditorView) {
  view.dispatch({
    selection: EditorSelection.single(0, view.state.doc.length)
  })
  view.focus()
}
```

## React 中的上下文菜单

### 使用 React 组件实现上下文菜单

```typescript
import React, { useState, useEffect, useRef } from 'react'
import { EditorView } from '@codemirror/view'

interface ContextMenuProps {
  x: number
  y: number
  items: MenuItem[]
  onClose: () => void
}

interface MenuItem {
  label: string
  action?: () => void
  disabled?: boolean
  separator?: boolean
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    setTimeout(() => {
      document.addEventListener('click', handleClick)
    }, 0)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [onClose])

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        padding: '4px 0',
        minWidth: '150px',
        zIndex: 1000
      }}
    >
      {items.map((item, index) => (
        item.separator ? (
          <div
            key={index}
            style={{
              height: '1px',
              backgroundColor: '#e0e0e0',
              margin: '4px 0'
            }}
          />
        ) : (
          <div
            key={index}
            className={`menu-item ${item.disabled ? 'disabled' : ''}`}
            onClick={() => {
              if (!item.disabled && item.action) {
                item.action()
                onClose()
              }
            }}
            style={{
              padding: '6px 12px',
              cursor: item.disabled ? 'not-allowed' : 'pointer',
              color: item.disabled ? '#999' : '#000',
              fontSize: '14px'
            }}
            onMouseEnter={(e) => {
              if (!item.disabled) {
                e.currentTarget.style.backgroundColor = '#f0f0f0'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            {item.label}
          </div>
        )
      ))}
    </div>
  )
}

// 使用上下文菜单的编辑器组件
export const EditorWithContextMenu: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    items: MenuItem[]
  } | null>(null)

  useEffect(() => {
    if (!editorRef.current) return

    const contextMenuHandler = EditorView.domEventHandlers({
      contextmenu(event, view) {
        event.preventDefault()

        const pos = view.posAtCoords({ x: event.clientX, y: event.clientY })
        if (pos === null) return false

        const selection = view.state.selection.main
        const hasSelection = !selection.empty

        const items: MenuItem[] = [
          {
            label: '剪切',
            action: () => cutText(view),
            disabled: !hasSelection
          },
          {
            label: '复制',
            action: () => copyText(view),
            disabled: !hasSelection
          },
          {
            label: '粘贴',
            action: () => pasteText(view)
          },
          { separator: true },
          {
            label: '全选',
            action: () => selectAll(view)
          },
          { separator: true },
          {
            label: '注释/取消注释',
            action: () => toggleComment(view),
            disabled: !hasSelection
          },
          {
            label: '格式化代码',
            action: () => formatCode(view)
          }
        ]

        setContextMenu({
          x: event.clientX,
          y: event.clientY,
          items
        })

        return true
      }
    })

    const state = EditorState.create({
      extensions: [basicSetup, javascript(), contextMenuHandler]
    })

    const view = new EditorView({
      state,
      parent: editorRef.current
    })

    viewRef.current = view

    return () => view.destroy()
  }, [])

  return (
    <div>
      <div ref={editorRef} />
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  )
}
```

## 文本选择操作

### 扩展选择

```typescript
import { EditorView } from '@codemirror/view'
import { EditorSelection } from '@codemirror/state'
import { syntaxTree } from '@codemirror/language'

// 扩展选择到单词
function selectWord(view: EditorView) {
  const pos = view.state.selection.main.head
  const line = view.state.doc.lineAt(pos)
  const text = line.text
  const offset = pos - line.from
  
  // 查找单词边界
  let start = offset
  let end = offset
  
  while (start > 0 && /\w/.test(text[start - 1])) {
    start--
  }
  
  while (end < text.length && /\w/.test(text[end])) {
    end++
  }
  
  view.dispatch({
    selection: EditorSelection.single(line.from + start, line.from + end)
  })
}

// 扩展选择到行
function selectLine(view: EditorView) {
  const pos = view.state.selection.main.head
  const line = view.state.doc.lineAt(pos)
  
  view.dispatch({
    selection: EditorSelection.single(line.from, line.to)
  })
}

// 扩展选择到语法节点
function selectSyntaxNode(view: EditorView) {
  const pos = view.state.selection.main.head
  const tree = syntaxTree(view.state)
  const node = tree.resolveInner(pos, 1)
  
  view.dispatch({
    selection: EditorSelection.single(node.from, node.to)
  })
}

// 智能扩展选择（逐层扩大）
function expandSelection(view: EditorView) {
  const selection = view.state.selection.main
  const tree = syntaxTree(view.state)
  
  // 查找包含当前选区的最小父节点
  let node = tree.resolveInner(selection.from, 1)
  
  while (node) {
    if (node.from < selection.from || node.to > selection.to) {
      view.dispatch({
        selection: EditorSelection.single(node.from, node.to)
      })
      return
    }
    node = node.parent!
  }
}
```

### 多光标操作

```typescript
import { EditorView } from '@codemirror/view'
import { EditorSelection } from '@codemirror/state'

// 在选中的每一行添加光标
function addCursorsToLines(view: EditorView) {
  const selection = view.state.selection.main
  if (selection.empty) return
  
  const from = view.state.doc.lineAt(selection.from)
  const to = view.state.doc.lineAt(selection.to)
  
  const ranges = []
  for (let i = from.number; i <= to.number; i++) {
    const line = view.state.doc.line(i)
    ranges.push(EditorSelection.cursor(line.from))
  }
  
  view.dispatch({
    selection: EditorSelection.create(ranges)
  })
}

// 选中所有匹配的文本
function selectAllOccurrences(view: EditorView) {
  const selection = view.state.selection.main
  if (selection.empty) return
  
  const searchText = view.state.doc.sliceString(selection.from, selection.to)
  const doc = view.state.doc.toString()
  
  const ranges = []
  let index = 0
  
  while ((index = doc.indexOf(searchText, index)) !== -1) {
    ranges.push(EditorSelection.range(index, index + searchText.length))
    index += searchText.length
  }
  
  if (ranges.length > 0) {
    view.dispatch({
      selection: EditorSelection.create(ranges)
    })
  }
}

// 添加下一个匹配项到选区
function selectNextOccurrence(view: EditorView) {
  const mainSelection = view.state.selection.main
  if (mainSelection.empty) return
  
  const searchText = view.state.doc.sliceString(mainSelection.from, mainSelection.to)
  const doc = view.state.doc.toString()
  
  // 从当前选区后开始查找
  const nextIndex = doc.indexOf(searchText, mainSelection.to)
  
  if (nextIndex !== -1) {
    const ranges = [
      ...view.state.selection.ranges,
      EditorSelection.range(nextIndex, nextIndex + searchText.length)
    ]
    
    view.dispatch({
      selection: EditorSelection.create(ranges)
    })
  }
}
```

## 文本转换操作

### 大小写转换

```typescript
import { EditorView } from '@codemirror/view'

// 转换为大写
function toUpperCase(view: EditorView) {
  const selection = view.state.selection.main
  if (selection.empty) return
  
  const text = view.state.doc.sliceString(selection.from, selection.to)
  const upper = text.toUpperCase()
  
  view.dispatch({
    changes: { from: selection.from, to: selection.to, insert: upper }
  })
}

// 转换为小写
function toLowerCase(view: EditorView) {
  const selection = view.state.selection.main
  if (selection.empty) return
  
  const text = view.state.doc.sliceString(selection.from, selection.to)
  const lower = text.toLowerCase()
  
  view.dispatch({
    changes: { from: selection.from, to: selection.to, insert: lower }
  })
}

// 切换大小写
function toggleCase(view: EditorView) {
  const selection = view.state.selection.main
  if (selection.empty) return
  
  const text = view.state.doc.sliceString(selection.from, selection.to)
  const toggled = text.split('').map(char => {
    return char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
  }).join('')
  
  view.dispatch({
    changes: { from: selection.from, to: selection.to, insert: toggled }
  })
}

// 首字母大写
function capitalize(view: EditorView) {
  const selection = view.state.selection.main
  if (selection.empty) return
  
  const text = view.state.doc.sliceString(selection.from, selection.to)
  const capitalized = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
  
  view.dispatch({
    changes: { from: selection.from, to: selection.to, insert: capitalized }
  })
}
```

### 注释/取消注释

```typescript
import { EditorView } from '@codemirror/view'

// 切换行注释
function toggleComment(view: EditorView) {
  const selection = view.state.selection.main
  const from = view.state.doc.lineAt(selection.from)
  const to = view.state.doc.lineAt(selection.to)
  
  const changes = []
  let allCommented = true
  
  // 检查是否所有行都已注释
  for (let i = from.number; i <= to.number; i++) {
    const line = view.state.doc.line(i)
    if (!line.text.trim().startsWith('//')) {
      allCommented = false
      break
    }
  }
  
  // 添加或删除注释
  for (let i = from.number; i <= to.number; i++) {
    const line = view.state.doc.line(i)
    
    if (allCommented) {
      // 删除注释
      const match = line.text.match(/^(\s*)\/\/\s?/)
      if (match) {
        changes.push({
          from: line.from,
          to: line.from + match[0].length,
          insert: match[1]
        })
      }
    } else {
      // 添加注释
      const indent = line.text.match(/^\s*/)?.[0] || ''
      changes.push({
        from: line.from,
        to: line.from + indent.length,
        insert: indent + '// '
      })
    }
  }
  
  view.dispatch({ changes })
}

// 块注释
function toggleBlockComment(view: EditorView) {
  const selection = view.state.selection.main
  if (selection.empty) return
  
  const text = view.state.doc.sliceString(selection.from, selection.to)
  
  if (text.startsWith('/*') && text.endsWith('*/')) {
    // 删除块注释
    const uncommented = text.slice(2, -2)
    view.dispatch({
      changes: { from: selection.from, to: selection.to, insert: uncommented }
    })
  } else {
    // 添加块注释
    const commented = `/* ${text} */`
    view.dispatch({
      changes: { from: selection.from, to: selection.to, insert: commented }
    })
  }
}
```

### 缩进操作

```typescript
import { EditorView } from '@codemirror/view'
import { indentMore, indentLess } from '@codemirror/commands'

// 增加缩进
function indent(view: EditorView) {
  indentMore(view)
}

// 减少缩进
function outdent(view: EditorView) {
  indentLess(view)
}

// 自动格式化缩进
function autoIndent(view: EditorView) {
  const selection = view.state.selection.main
  const from = view.state.doc.lineAt(selection.from)
  const to = view.state.doc.lineAt(selection.to)
  
  const changes = []
  
  for (let i = from.number; i <= to.number; i++) {
    const line = view.state.doc.line(i)
    const text = line.text
    
    // 简单的缩进逻辑（实际应该使用语言的缩进规则）
    const prevLine = i > 1 ? view.state.doc.line(i - 1) : null
    
    if (prevLine) {
      const prevIndent = prevLine.text.match(/^\s*/)?.[0] || ''
      let newIndent = prevIndent
      
      // 如果上一行以 { 结尾，增加缩进
      if (prevLine.text.trim().endsWith('{')) {
        newIndent += '  '
      }
      
      // 如果当前行以 } 开始，减少缩进
      if (text.trim().startsWith('}')) {
        newIndent = newIndent.slice(0, -2)
      }
      
      const currentIndent = text.match(/^\s*/)?.[0] || ''
      if (currentIndent !== newIndent) {
        changes.push({
          from: line.from,
          to: line.from + currentIndent.length,
          insert: newIndent
        })
      }
    }
  }
  
  if (changes.length > 0) {
    view.dispatch({ changes })
  }
}
```

## 排序操作

```typescript
import { EditorView } from '@codemirror/view'

// 排序选中的行
function sortLines(view: EditorView, ascending: boolean = true) {
  const selection = view.state.selection.main
  const from = view.state.doc.lineAt(selection.from)
  const to = view.state.doc.lineAt(selection.to)
  
  const lines = []
  for (let i = from.number; i <= to.number; i++) {
    lines.push(view.state.doc.line(i).text)
  }
  
  lines.sort((a, b) => {
    const result = a.localeCompare(b)
    return ascending ? result : -result
  })
  
  const sorted = lines.join('\n')
  
  view.dispatch({
    changes: { from: from.from, to: to.to, insert: sorted }
  })
}

// 删除重复行
function removeDuplicateLines(view: EditorView) {
  const selection = view.state.selection.main
  const from = view.state.doc.lineAt(selection.from)
  const to = view.state.doc.lineAt(selection.to)
  
  const seen = new Set<string>()
  const uniqueLines = []
  
  for (let i = from.number; i <= to.number; i++) {
    const line = view.state.doc.line(i).text
    if (!seen.has(line)) {
      seen.add(line)
      uniqueLines.push(line)
    }
  }
  
  const result = uniqueLines.join('\n')
  
  view.dispatch({
    changes: { from: from.from, to: to.to, insert: result }
  })
}
```

## 小结

在本章中，我们学习了：

- ✅ 实现自定义上下文菜单
- ✅ React 中的上下文菜单组件
- ✅ 文本选择操作（扩展选择、多光标）
- ✅ 文本转换（大小写、注释、缩进）
- ✅ 排序和去重操作

## 下一步

接下来，我们将学习如何实现代码片段和高级编辑功能。

👉 [下一章：代码片段与高级编辑](./04-snippets-advanced.md)


