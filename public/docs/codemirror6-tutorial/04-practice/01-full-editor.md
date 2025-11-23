# 构建完整的代码编辑器

在本章中，我们将综合运用前面学到的知识，构建一个功能完整的代码编辑器。

## 项目规划

我们将构建一个具有以下功能的代码编辑器：

- ✅ 多语言支持（JavaScript、Python、Java 等）
- ✅ 主题切换（亮色/暗色）
- ✅ 代码补全
- ✅ 语法高亮
- ✅ 行号和代码折叠
- ✅ 搜索和替换
- ✅ 代码片段
- ✅ 文件管理
- ✅ 设置面板
- ✅ 工具栏

## 项目结构

```
src/
├── components/
│   ├── Editor/
│   │   ├── index.tsx          # 主编辑器组件
│   │   ├── Toolbar.tsx        # 工具栏
│   │   ├── StatusBar.tsx      # 状态栏
│   │   ├── Sidebar.tsx        # 侧边栏
│   │   └── SettingsPanel.tsx  # 设置面板
│   ├── FileTree/
│   │   └── index.tsx          # 文件树
│   └── ContextMenu/
│       └── index.tsx          # 上下文菜单
├── hooks/
│   ├── useEditor.ts           # 编辑器 Hook
│   ├── useTheme.ts            # 主题 Hook
│   └── useSettings.ts         # 设置 Hook
├── utils/
│   ├── snippets.ts            # 代码片段管理
│   ├── languages.ts           # 语言配置
│   └── themes.ts              # 主题配置
└── types/
    └── index.ts               # 类型定义
```

## 类型定义

```typescript
// src/types/index.ts
export type Language = 'javascript' | 'typescript' | 'python' | 'java' | 'cpp' | 'rust' | 'go'

export type Theme = 'light' | 'dark' | 'github-light' | 'github-dark' | 'vscode-dark' | 'one-dark'

export interface EditorSettings {
  fontSize: number
  fontFamily: string
  tabSize: number
  lineNumbers: boolean
  lineWrapping: boolean
  highlightActiveLine: boolean
  bracketMatching: boolean
  autoCloseBrackets: boolean
  autocompletion: boolean
  theme: Theme
}

export interface FileItem {
  id: string
  name: string
  path: string
  content: string
  language: Language
  isModified: boolean
}

export interface EditorState {
  activeFile: FileItem | null
  files: FileItem[]
  settings: EditorSettings
}
```

## 编辑器核心组件

```typescript
// src/components/Editor/index.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState, Compartment } from '@codemirror/state'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { java } from '@codemirror/lang-java'
import { cpp } from '@codemirror/lang-cpp'
import { rust } from '@codemirror/lang-rust'
import { go } from '@codemirror/lang-go'
import { oneDark } from '@codemirror/theme-one-dark'
import { autocompletion } from '@codemirror/autocomplete'
import { search, searchKeymap } from '@codemirror/search'
import { foldGutter } from '@codemirror/language'
import { lineNumbers, highlightActiveLineGutter } from '@codemirror/view'
import { FileItem, Language, EditorSettings } from '../../types'
import { getSnippetCompletions } from '../../utils/snippets'
import { getTheme } from '../../utils/themes'
import Toolbar from './Toolbar'
import StatusBar from './StatusBar'
import './Editor.css'

interface EditorProps {
  file: FileItem | null
  settings: EditorSettings
  onContentChange?: (content: string) => void
  onSave?: () => void
}

export const Editor: React.FC<EditorProps> = ({
  file,
  settings,
  onContentChange,
  onSave
}) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const languageConf = useRef(new Compartment())
  const themeConf = useRef(new Compartment())
  const [cursorPosition, setCursorPosition] = useState({ line: 1, col: 1 })
  const [selectedText, setSelectedText] = useState('')

  // 获取语言扩展
  const getLanguageExtension = useCallback((language: Language) => {
    switch (language) {
      case 'javascript':
      case 'typescript':
        return javascript({ typescript: language === 'typescript' })
      case 'python':
        return python()
      case 'java':
        return java()
      case 'cpp':
        return cpp()
      case 'rust':
        return rust()
      case 'go':
        return go()
      default:
        return javascript()
    }
  }, [])

  // 创建编辑器
  useEffect(() => {
    if (!editorRef.current) return

    const updateListener = EditorView.updateListener.of((update) => {
      // 文档变化
      if (update.docChanged && onContentChange) {
        onContentChange(update.state.doc.toString())
      }

      // 选区变化
      if (update.selectionSet) {
        const selection = update.state.selection.main
        const line = update.state.doc.lineAt(selection.head)
        setCursorPosition({
          line: line.number,
          col: selection.head - line.from + 1
        })

        if (!selection.empty) {
          const text = update.state.doc.sliceString(selection.from, selection.to)
          setSelectedText(text)
        } else {
          setSelectedText('')
        }
      }
    })

    // 快捷键
    const keymap = EditorView.domEventHandlers({
      keydown(event, view) {
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
          event.preventDefault()
          onSave?.()
          return true
        }
        return false
      }
    })

    const extensions = [
      basicSetup,
      languageConf.current.of(getLanguageExtension(file?.language || 'javascript')),
      themeConf.current.of(getTheme(settings.theme)),
      updateListener,
      keymap,
      search(),
      foldGutter(),
      lineNumbers(),
      highlightActiveLineGutter(),
      autocompletion({
        override: [getSnippetCompletions(file?.language || 'javascript')]
      }),
      EditorView.theme({
        ".cm-content": {
          fontSize: `${settings.fontSize}px`,
          fontFamily: settings.fontFamily
        }
      }),
      EditorState.tabSize.of(settings.tabSize)
    ]

    const state = EditorState.create({
      doc: file?.content || '',
      extensions
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

  // 更新文件内容
  useEffect(() => {
    if (!viewRef.current || !file) return

    const currentContent = viewRef.current.state.doc.toString()
    if (currentContent !== file.content) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: currentContent.length,
          insert: file.content
        }
      })
    }
  }, [file?.id])

  // 更新语言
  useEffect(() => {
    if (!viewRef.current || !file) return

    viewRef.current.dispatch({
      effects: languageConf.current.reconfigure(
        getLanguageExtension(file.language)
      )
    })
  }, [file?.language, getLanguageExtension])

  // 更新主题
  useEffect(() => {
    if (!viewRef.current) return

    viewRef.current.dispatch({
      effects: themeConf.current.reconfigure(getTheme(settings.theme))
    })
  }, [settings.theme])

  // 更新字体设置
  useEffect(() => {
    if (!viewRef.current) return

    viewRef.current.dispatch({
      effects: StateEffect.appendConfig.of(
        EditorView.theme({
          ".cm-content": {
            fontSize: `${settings.fontSize}px`,
            fontFamily: settings.fontFamily
          }
        })
      )
    })
  }, [settings.fontSize, settings.fontFamily])

  return (
    <div className="editor-container">
      <Toolbar view={viewRef.current} file={file} onSave={onSave} />
      <div ref={editorRef} className="editor-content" />
      <StatusBar
        line={cursorPosition.line}
        column={cursorPosition.col}
        language={file?.language || 'javascript'}
        selectedLength={selectedText.length}
      />
    </div>
  )
}
```

## 工具栏组件

```typescript
// src/components/Editor/Toolbar.tsx
import React from 'react'
import { EditorView } from '@codemirror/view'
import { undo, redo } from '@codemirror/commands'
import { FileItem } from '../../types'
import './Toolbar.css'

interface ToolbarProps {
  view: EditorView | null
  file: FileItem | null
  onSave?: () => void
}

const Toolbar: React.FC<ToolbarProps> = ({ view, file, onSave }) => {
  const handleUndo = () => {
    if (view) undo(view)
  }

  const handleRedo = () => {
    if (view) redo(view)
  }

  const handleFormat = () => {
    // 实现代码格式化
    console.log('格式化代码')
  }

  const handleSearch = () => {
    // 打开搜索面板
    if (view) {
      const searchPanel = view.dom.querySelector('.cm-search')
      if (searchPanel) {
        (searchPanel as HTMLElement).focus()
      }
    }
  }

  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <button onClick={handleUndo} title="撤销 (Ctrl+Z)">
          ↶ 撤销
        </button>
        <button onClick={handleRedo} title="重做 (Ctrl+Y)">
          ↷ 重做
        </button>
      </div>

      <div className="toolbar-group">
        <button onClick={onSave} title="保存 (Ctrl+S)">
          💾 保存
        </button>
        <button onClick={handleFormat} title="格式化代码">
          ✨ 格式化
        </button>
      </div>

      <div className="toolbar-group">
        <button onClick={handleSearch} title="搜索 (Ctrl+F)">
          🔍 搜索
        </button>
      </div>

      <div className="toolbar-file-info">
        {file && (
          <>
            <span className="file-name">{file.name}</span>
            {file.isModified && <span className="modified-indicator">●</span>}
          </>
        )}
      </div>
    </div>
  )
}

export default Toolbar
```

## 状态栏组件

```typescript
// src/components/Editor/StatusBar.tsx
import React from 'react'
import { Language } from '../../types'
import './StatusBar.css'

interface StatusBarProps {
  line: number
  column: number
  language: Language
  selectedLength: number
}

const StatusBar: React.FC<StatusBarProps> = ({
  line,
  column,
  language,
  selectedLength
}) => {
  return (
    <div className="status-bar">
      <div className="status-item">
        行 {line}, 列 {column}
      </div>
      
      {selectedLength > 0 && (
        <div className="status-item">
          已选择 {selectedLength} 个字符
        </div>
      )}
      
      <div className="status-item language">
        {language.toUpperCase()}
      </div>
    </div>
  )
}

export default StatusBar
```

## 主应用组件

```typescript
// src/App.tsx
import React, { useState, useCallback } from 'react'
import { Editor } from './components/Editor'
import { Sidebar } from './components/Sidebar'
import { SettingsPanel } from './components/SettingsPanel'
import { FileItem, EditorSettings } from './types'
import './App.css'

const defaultSettings: EditorSettings = {
  fontSize: 14,
  fontFamily: "'Fira Code', 'Consolas', monospace",
  tabSize: 2,
  lineNumbers: true,
  lineWrapping: false,
  highlightActiveLine: true,
  bracketMatching: true,
  autoCloseBrackets: true,
  autocompletion: true,
  theme: 'light'
}

function App() {
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: '1',
      name: 'example.js',
      path: '/example.js',
      content: 'console.log("Hello, World!")',
      language: 'javascript',
      isModified: false
    }
  ])
  const [activeFileId, setActiveFileId] = useState<string>('1')
  const [settings, setSettings] = useState<EditorSettings>(defaultSettings)
  const [showSettings, setShowSettings] = useState(false)

  const activeFile = files.find(f => f.id === activeFileId) || null

  const handleContentChange = useCallback((content: string) => {
    setFiles(prev => prev.map(f =>
      f.id === activeFileId
        ? { ...f, content, isModified: true }
        : f
    ))
  }, [activeFileId])

  const handleSave = useCallback(() => {
    setFiles(prev => prev.map(f =>
      f.id === activeFileId
        ? { ...f, isModified: false }
        : f
    ))
    console.log('文件已保存')
  }, [activeFileId])

  const handleFileSelect = useCallback((fileId: string) => {
    setActiveFileId(fileId)
  }, [])

  const handleNewFile = useCallback(() => {
    const newFile: FileItem = {
      id: Date.now().toString(),
      name: 'untitled.js',
      path: '/untitled.js',
      content: '',
      language: 'javascript',
      isModified: false
    }
    setFiles(prev => [...prev, newFile])
    setActiveFileId(newFile.id)
  }, [])

  const handleCloseFile = useCallback((fileId: string) => {
    setFiles(prev => {
      const newFiles = prev.filter(f => f.id !== fileId)
      if (activeFileId === fileId && newFiles.length > 0) {
        setActiveFileId(newFiles[0].id)
      }
      return newFiles
    })
  }, [activeFileId])

  return (
    <div className="app">
      <Sidebar
        files={files}
        activeFileId={activeFileId}
        onFileSelect={handleFileSelect}
        onNewFile={handleNewFile}
        onCloseFile={handleCloseFile}
        onOpenSettings={() => setShowSettings(true)}
      />

      <div className="main-content">
        <Editor
          file={activeFile}
          settings={settings}
          onContentChange={handleContentChange}
          onSave={handleSave}
        />
      </div>

      {showSettings && (
        <SettingsPanel
          settings={settings}
          onSettingsChange={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}

export default App
```

## 样式文件

```css
/* src/App.css */
.app {
  display: flex;
  height: 100vh;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* src/components/Editor/Editor.css */
.editor-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
}

.editor-content {
  flex: 1;
  overflow: auto;
}

.editor-content .cm-editor {
  height: 100%;
}

/* src/components/Editor/Toolbar.css */
.toolbar {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
  gap: 8px;
}

.toolbar-group {
  display: flex;
  gap: 4px;
}

.toolbar button {
  padding: 6px 12px;
  border: 1px solid #ccc;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.toolbar button:hover {
  background: #f0f0f0;
}

.toolbar-file-info {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-name {
  font-weight: 500;
}

.modified-indicator {
  color: #ff6b6b;
  font-size: 18px;
}

/* src/components/Editor/StatusBar.css */
.status-bar {
  display: flex;
  align-items: center;
  padding: 4px 12px;
  background: #f5f5f5;
  border-top: 1px solid #ddd;
  font-size: 12px;
  gap: 16px;
}

.status-item {
  color: #666;
}

.status-item.language {
  margin-left: auto;
  font-weight: 600;
  color: #0066cc;
}
```

## 小结

在本章中，我们构建了一个功能完整的代码编辑器，包括：

- ✅ 完整的编辑器组件架构
- ✅ 工具栏和状态栏
- ✅ 文件管理系统
- ✅ 设置面板
- ✅ 多语言支持
- ✅ 主题切换
- ✅ 快捷键支持

## 下一步

在下一章中，我们将学习如何优化编辑器性能和实现最佳实践。

👉 [下一章：性能优化与最佳实践](./02-optimization.md)


