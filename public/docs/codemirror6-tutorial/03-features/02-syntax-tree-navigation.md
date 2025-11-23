# 语法树与导航

在本章中，我们将学习如何使用 CodeMirror 6 的语法树进行代码分析、导航和高级操作，包括元素树遍历、锚点绑定、点击跳转等功能。

## 语法树基础

CodeMirror 6 使用 Lezer 解析器生成增量式的语法树，这使得我们可以高效地分析和操作代码结构。

### 获取语法树

```typescript
import { syntaxTree } from '@codemirror/language'
import { EditorView } from '@codemirror/view'

function analyzeSyntax(view: EditorView) {
  const tree = syntaxTree(view.state)
  
  console.log('语法树根节点:', tree.topNode)
  console.log('树的长度:', tree.length)
}
```

### 语法树节点

```typescript
import { SyntaxNode } from '@lezer/common'
import { syntaxTree } from '@codemirror/language'

function exploreNode(view: EditorView, pos: number) {
  const tree = syntaxTree(view.state)
  const node = tree.resolveInner(pos, 1)
  
  console.log('节点名称:', node.name)
  console.log('节点类型:', node.type.id)
  console.log('起始位置:', node.from)
  console.log('结束位置:', node.to)
  console.log('节点文本:', view.state.doc.sliceString(node.from, node.to))
  
  // 父节点
  if (node.parent) {
    console.log('父节点:', node.parent.name)
  }
  
  // 子节点
  if (node.firstChild) {
    console.log('第一个子节点:', node.firstChild.name)
  }
  
  // 兄弟节点
  if (node.nextSibling) {
    console.log('下一个兄弟节点:', node.nextSibling.name)
  }
  if (node.prevSibling) {
    console.log('上一个兄弟节点:', node.prevSibling.name)
  }
}
```

## 遍历语法树

### 深度优先遍历

```typescript
import { SyntaxNode } from '@lezer/common'
import { syntaxTree } from '@codemirror/language'
import { EditorView } from '@codemirror/view'

function traverseTree(view: EditorView) {
  const tree = syntaxTree(view.state)
  const nodes: Array<{name: string, from: number, to: number, text: string}> = []
  
  function visit(node: SyntaxNode) {
    nodes.push({
      name: node.name,
      from: node.from,
      to: node.to,
      text: view.state.doc.sliceString(node.from, node.to)
    })
    
    // 遍历子节点
    let child = node.firstChild
    while (child) {
      visit(child)
      child = child.nextSibling
    }
  }
  
  visit(tree.topNode)
  return nodes
}
```

### 查找特定节点

```typescript
import { SyntaxNode } from '@lezer/common'
import { syntaxTree } from '@codemirror/language'

function findNodes(view: EditorView, nodeType: string): SyntaxNode[] {
  const tree = syntaxTree(view.state)
  const found: SyntaxNode[] = []
  
  tree.iterate({
    enter(node) {
      if (node.name === nodeType) {
        found.push(node.node)
      }
    }
  })
  
  return found
}

// 使用示例：查找所有函数定义
const functions = findNodes(view, 'FunctionDeclaration')
functions.forEach(fn => {
  console.log('函数位置:', fn.from, '-', fn.to)
})
```

### 查找特定范围内的节点

```typescript
import { syntaxTree } from '@codemirror/language'

function findNodesInRange(
  view: EditorView, 
  from: number, 
  to: number, 
  nodeType?: string
) {
  const tree = syntaxTree(view.state)
  const found: SyntaxNode[] = []
  
  tree.iterate({
    from,
    to,
    enter(node) {
      if (!nodeType || node.name === nodeType) {
        found.push(node.node)
      }
    }
  })
  
  return found
}
```

## 代码导航功能

### 跳转到定义

```typescript
import { syntaxTree } from '@codemirror/language'
import { EditorView } from '@codemirror/view'
import { EditorSelection } from '@codemirror/state'

function jumpToDefinition(view: EditorView, pos: number) {
  const tree = syntaxTree(view.state)
  const node = tree.resolveInner(pos, 1)
  
  // 如果是变量引用，查找其定义
  if (node.name === 'VariableName') {
    const varName = view.state.doc.sliceString(node.from, node.to)
    const definition = findVariableDefinition(view, varName)
    
    if (definition) {
      // 跳转到定义位置
      view.dispatch({
        selection: EditorSelection.single(definition.from, definition.to),
        effects: EditorView.scrollIntoView(definition.from, { y: 'center' })
      })
      
      view.focus()
      return true
    }
  }
  
  return false
}

function findVariableDefinition(view: EditorView, varName: string) {
  const tree = syntaxTree(view.state)
  let definition: SyntaxNode | null = null
  
  tree.iterate({
    enter(node) {
      // 查找变量声明
      if (node.name === 'VariableDeclaration') {
        const declNode = node.node
        let child = declNode.firstChild
        
        while (child) {
          if (child.name === 'VariableDefinition') {
            const nameNode = child.firstChild
            if (nameNode) {
              const name = view.state.doc.sliceString(nameNode.from, nameNode.to)
              if (name === varName) {
                definition = nameNode
                return false  // 停止遍历
              }
            }
          }
          child = child.nextSibling
        }
      }
    }
  })
  
  return definition
}
```

### 查找所有引用

```typescript
import { syntaxTree } from '@codemirror/language'
import { EditorView } from '@codemirror/view'

interface Reference {
  from: number
  to: number
  line: number
  text: string
}

function findAllReferences(view: EditorView, pos: number): Reference[] {
  const tree = syntaxTree(view.state)
  const node = tree.resolveInner(pos, 1)
  
  if (node.name !== 'VariableName') {
    return []
  }
  
  const targetName = view.state.doc.sliceString(node.from, node.to)
  const references: Reference[] = []
  
  tree.iterate({
    enter(node) {
      if (node.name === 'VariableName') {
        const name = view.state.doc.sliceString(node.from, node.to)
        if (name === targetName) {
          const line = view.state.doc.lineAt(node.from)
          references.push({
            from: node.from,
            to: node.to,
            line: line.number,
            text: line.text
          })
        }
      }
    }
  })
  
  return references
}

// 使用示例
const refs = findAllReferences(view, cursorPos)
console.log(`找到 ${refs.length} 个引用:`)
refs.forEach(ref => {
  console.log(`  第 ${ref.line} 行: ${ref.text}`)
})
```

### 符号大纲（Outline）

```typescript
import { syntaxTree } from '@codemirror/language'
import { EditorView } from '@codemirror/view'

interface Symbol {
  name: string
  kind: 'function' | 'class' | 'variable' | 'method'
  from: number
  to: number
  line: number
  children?: Symbol[]
}

function getDocumentSymbols(view: EditorView): Symbol[] {
  const tree = syntaxTree(view.state)
  const symbols: Symbol[] = []
  
  tree.iterate({
    enter(node) {
      let symbol: Symbol | null = null
      
      // 函数声明
      if (node.name === 'FunctionDeclaration') {
        const nameNode = node.node.getChild('VariableDefinition')
        if (nameNode) {
          const name = view.state.doc.sliceString(nameNode.from, nameNode.to)
          symbol = {
            name,
            kind: 'function',
            from: node.from,
            to: node.to,
            line: view.state.doc.lineAt(node.from).number
          }
        }
      }
      
      // 类声明
      else if (node.name === 'ClassDeclaration') {
        const nameNode = node.node.getChild('VariableDefinition')
        if (nameNode) {
          const name = view.state.doc.sliceString(nameNode.from, nameNode.to)
          symbol = {
            name,
            kind: 'class',
            from: node.from,
            to: node.to,
            line: view.state.doc.lineAt(node.from).number,
            children: []
          }
          
          // 查找类的方法
          const classBody = node.node.getChild('ClassBody')
          if (classBody) {
            let method = classBody.firstChild
            while (method) {
              if (method.name === 'MethodDeclaration') {
                const methodName = method.getChild('PropertyDefinition')
                if (methodName) {
                  const mName = view.state.doc.sliceString(methodName.from, methodName.to)
                  symbol.children!.push({
                    name: mName,
                    kind: 'method',
                    from: method.from,
                    to: method.to,
                    line: view.state.doc.lineAt(method.from).number
                  })
                }
              }
              method = method.nextSibling
            }
          }
        }
      }
      
      // 变量声明
      else if (node.name === 'VariableDeclaration') {
        const nameNode = node.node.getChild('VariableDefinition')
        if (nameNode) {
          const name = view.state.doc.sliceString(nameNode.from, nameNode.to)
          symbol = {
            name,
            kind: 'variable',
            from: node.from,
            to: node.to,
            line: view.state.doc.lineAt(node.from).number
          }
        }
      }
      
      if (symbol) {
        symbols.push(symbol)
      }
    }
  })
  
  return symbols
}
```

## 点击跳转功能

### 实现 Ctrl+Click 跳转

```typescript
import { EditorView } from '@codemirror/view'
import { ViewPlugin, Decoration, DecorationSet } from '@codemirror/view'
import { syntaxTree } from '@codemirror/language'

const clickablePlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet
  
  constructor(view: EditorView) {
    this.decorations = Decoration.none
  }
  
  update(update: ViewUpdate) {
    // 当按下 Ctrl/Cmd 键时，添加可点击样式
  }
}, {
  decorations: v => v.decorations,
  
  eventHandlers: {
    mousedown(event, view) {
      // 检查是否按下 Ctrl/Cmd 键
      if (!event.ctrlKey && !event.metaKey) {
        return false
      }
      
      const pos = view.posAtCoords({ x: event.clientX, y: event.clientY })
      if (pos === null) return false
      
      // 跳转到定义
      const success = jumpToDefinition(view, pos)
      
      if (success) {
        event.preventDefault()
        return true
      }
      
      return false
    },
    
    mousemove(event, view) {
      // 当按下 Ctrl/Cmd 键时，显示下划线
      if (event.ctrlKey || event.metaKey) {
        const pos = view.posAtCoords({ x: event.clientX, y: event.clientY })
        if (pos !== null) {
          const tree = syntaxTree(view.state)
          const node = tree.resolveInner(pos, 1)
          
          if (node.name === 'VariableName') {
            // 添加下划线样式
            view.dom.style.cursor = 'pointer'
          } else {
            view.dom.style.cursor = 'text'
          }
        }
      } else {
        view.dom.style.cursor = 'text'
      }
      
      return false
    }
  }
})

// 样式
const clickableTheme = EditorView.theme({
  ".cm-clickable": {
    textDecoration: "underline",
    cursor: "pointer",
    color: "#0066cc"
  }
})

const extensions = [clickablePlugin, clickableTheme]
```

### 悬停提示（Hover Tooltip）

```typescript
import { EditorView, hoverTooltip } from '@codemirror/view'
import { syntaxTree } from '@codemirror/language'

const hoverPlugin = hoverTooltip((view, pos, side) => {
  const tree = syntaxTree(view.state)
  const node = tree.resolveInner(pos, side)
  
  if (node.name === 'VariableName') {
    const varName = view.state.doc.sliceString(node.from, node.to)
    const definition = findVariableDefinition(view, varName)
    
    if (definition) {
      const defLine = view.state.doc.lineAt(definition.from)
      const defText = defLine.text
      
      return {
        pos: node.from,
        end: node.to,
        above: true,
        create() {
          const dom = document.createElement('div')
          dom.className = 'cm-hover-tooltip'
          dom.innerHTML = `
            <div class="tooltip-header">${varName}</div>
            <div class="tooltip-body">
              <div>定义于第 ${defLine.number} 行</div>
              <pre>${defText}</pre>
            </div>
          `
          return { dom }
        }
      }
    }
  }
  
  return null
})

// 样式
const hoverTheme = EditorView.theme({
  ".cm-hover-tooltip": {
    backgroundColor: "#f8f9fa",
    border: "1px solid #ddd",
    borderRadius: "4px",
    padding: "8px",
    fontSize: "13px",
    maxWidth: "400px"
  },
  ".tooltip-header": {
    fontWeight: "bold",
    marginBottom: "4px",
    color: "#0066cc"
  },
  ".tooltip-body pre": {
    margin: "4px 0 0 0",
    padding: "4px",
    backgroundColor: "#fff",
    borderRadius: "2px",
    fontSize: "12px",
    fontFamily: "monospace"
  }
})

const extensions = [hoverPlugin, hoverTheme]
```

## 锚点绑定

### 实现文档内锚点跳转

```typescript
import { EditorView } from '@codemirror/view'
import { EditorSelection } from '@codemirror/state'

interface Anchor {
  id: string
  name: string
  pos: number
  line: number
}

class AnchorManager {
  private anchors = new Map<string, Anchor>()
  
  // 扫描文档中的锚点（例如：注释中的 @anchor:id）
  scanAnchors(view: EditorView) {
    this.anchors.clear()
    const doc = view.state.doc
    const anchorRegex = /@anchor:(\w+)\s+(.+)/g
    
    for (let i = 1; i <= doc.lines; i++) {
      const line = doc.line(i)
      const matches = line.text.matchAll(anchorRegex)
      
      for (const match of matches) {
        const [, id, name] = match
        this.anchors.set(id, {
          id,
          name,
          pos: line.from,
          line: i
        })
      }
    }
    
    return Array.from(this.anchors.values())
  }
  
  // 跳转到锚点
  jumpToAnchor(view: EditorView, anchorId: string) {
    const anchor = this.anchors.get(anchorId)
    if (!anchor) return false
    
    view.dispatch({
      selection: EditorSelection.cursor(anchor.pos),
      effects: EditorView.scrollIntoView(anchor.pos, { y: 'center' })
    })
    
    view.focus()
    return true
  }
  
  // 获取所有锚点
  getAnchors() {
    return Array.from(this.anchors.values())
  }
}

// 使用示例
const anchorManager = new AnchorManager()

// 扫描锚点
const anchors = anchorManager.scanAnchors(view)
console.log('找到的锚点:', anchors)

// 跳转到锚点
anchorManager.jumpToAnchor(view, 'intro')
```

### React 中的锚点导航组件

```typescript
import React, { useEffect, useState } from 'react'
import { EditorView } from '@codemirror/view'

interface AnchorNavProps {
  view: EditorView | null
}

export const AnchorNav: React.FC<AnchorNavProps> = ({ view }) => {
  const [anchors, setAnchors] = useState<Anchor[]>([])
  const anchorManager = useRef(new AnchorManager())

  useEffect(() => {
    if (!view) return
    
    // 初始扫描
    const found = anchorManager.current.scanAnchors(view)
    setAnchors(found)
    
    // 监听文档变化
    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const found = anchorManager.current.scanAnchors(view)
        setAnchors(found)
      }
    })
    
    view.dispatch({
      effects: StateEffect.appendConfig.of(updateListener)
    })
  }, [view])

  const handleJump = (anchorId: string) => {
    if (view) {
      anchorManager.current.jumpToAnchor(view, anchorId)
    }
  }

  return (
    <div className="anchor-nav">
      <h3>文档导航</h3>
      <ul>
        {anchors.map(anchor => (
          <li key={anchor.id}>
            <button onClick={() => handleJump(anchor.id)}>
              {anchor.name} (第 {anchor.line} 行)
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

## 面包屑导航

```typescript
import { EditorView } from '@codemirror/view'
import { syntaxTree } from '@codemirror/language'

interface BreadcrumbItem {
  name: string
  type: string
  from: number
  to: number
}

function getBreadcrumbs(view: EditorView, pos: number): BreadcrumbItem[] {
  const tree = syntaxTree(view.state)
  const node = tree.resolveInner(pos, 1)
  const breadcrumbs: BreadcrumbItem[] = []
  
  let current: SyntaxNode | null = node
  
  while (current) {
    // 只添加重要的节点类型
    if (['FunctionDeclaration', 'ClassDeclaration', 'MethodDeclaration', 'BlockStatement'].includes(current.name)) {
      let name = current.name
      
      // 尝试获取名称
      const nameNode = current.getChild('VariableDefinition') || current.getChild('PropertyDefinition')
      if (nameNode) {
        name = view.state.doc.sliceString(nameNode.from, nameNode.to)
      }
      
      breadcrumbs.unshift({
        name,
        type: current.name,
        from: current.from,
        to: current.to
      })
    }
    
    current = current.parent
  }
  
  return breadcrumbs
}

// React 组件
export const Breadcrumbs: React.FC<{ view: EditorView | null }> = ({ view }) => {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])

  useEffect(() => {
    if (!view) return
    
    const updateBreadcrumbs = () => {
      const pos = view.state.selection.main.head
      const crumbs = getBreadcrumbs(view, pos)
      setBreadcrumbs(crumbs)
    }
    
    updateBreadcrumbs()
    
    const updateListener = EditorView.updateListener.of((update) => {
      if (update.selectionSet) {
        updateBreadcrumbs()
      }
    })
    
    view.dispatch({
      effects: StateEffect.appendConfig.of(updateListener)
    })
  }, [view])

  const handleClick = (item: BreadcrumbItem) => {
    if (view) {
      view.dispatch({
        selection: EditorSelection.single(item.from, item.to),
        effects: EditorView.scrollIntoView(item.from)
      })
    }
  }

  return (
    <div className="breadcrumbs">
      {breadcrumbs.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="separator"> › </span>}
          <button onClick={() => handleClick(item)}>
            {item.name}
          </button>
        </React.Fragment>
      ))}
    </div>
  )
}
```

## 小结

在本章中，我们学习了：

- ✅ 语法树的基础概念和获取方法
- ✅ 遍历和查询语法树节点
- ✅ 实现跳转到定义功能
- ✅ 查找所有引用
- ✅ 生成文档符号大纲
- ✅ 实现点击跳转和悬停提示
- ✅ 锚点绑定和导航
- ✅ 面包屑导航

## 下一步

接下来，我们将学习如何实现上下文菜单和文本操作功能。

👉 [下一章：上下文菜单与文本操作](./03-context-menu.md)


