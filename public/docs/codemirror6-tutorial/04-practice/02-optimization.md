# 性能优化与最佳实践

在本章中，我们将学习如何优化 CodeMirror 6 编辑器的性能，以及在实际项目中的最佳实践。

## 性能优化策略

### 1. 延迟加载语言包

语言包通常比较大，可以按需加载：

```typescript
import React, { useState, useEffect } from 'react'
import { Extension } from '@codemirror/state'

const languageLoaders = {
  javascript: () => import('@codemirror/lang-javascript').then(m => m.javascript()),
  python: () => import('@codemirror/lang-python').then(m => m.python()),
  java: () => import('@codemirror/lang-java').then(m => m.java()),
  cpp: () => import('@codemirror/lang-cpp').then(m => m.cpp()),
  rust: () => import('@codemirror/lang-rust').then(m => m.rust())
}

export function useLazyLanguage(language: string) {
  const [extension, setExtension] = useState<Extension | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    
    const loader = languageLoaders[language as keyof typeof languageLoaders]
    if (loader) {
      loader().then(ext => {
        setExtension(ext)
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [language])

  return { extension, loading }
}

// 使用
function Editor({ language }: { language: string }) {
  const { extension, loading } = useLazyLanguage(language)

  if (loading) {
    return <div>加载语言支持中...</div>
  }

  return <CodeEditor extensions={extension ? [extension] : []} />
}
```

### 2. 虚拟化大型文档

对于超大文件，使用虚拟滚动：

```typescript
import { EditorView } from '@codemirror/view'

// CodeMirror 6 默认已经实现了虚拟滚动
// 但可以通过配置优化大文件性能

const largeFileOptimizations = EditorView.theme({
  ".cm-scroller": {
    // 优化滚动性能
    willChange: "transform"
  }
})

// 对于超大文件，可以考虑分块加载
function useLargeFileLoader(filePath: string) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 分块读取大文件
    async function loadFile() {
      const response = await fetch(filePath)
      const reader = response.body?.getReader()
      
      if (!reader) return

      let chunks: string[] = []
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        chunks.push(decoder.decode(value, { stream: true }))
        
        // 每读取 1MB 更新一次界面
        if (chunks.join('').length > 1024 * 1024) {
          setContent(chunks.join(''))
          chunks = []
        }
      }

      setContent(prev => prev + chunks.join(''))
      setLoading(false)
    }

    loadFile()
  }, [filePath])

  return { content, loading }
}
```

### 3. 防抖和节流

对于频繁触发的操作，使用防抖或节流：

```typescript
import { useCallback, useRef } from 'react'

// 防抖 Hook
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) {
  const timeoutRef = useRef<NodeJS.Timeout>()

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args)
    }, delay)
  }, [callback, delay])
}

// 节流 Hook
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) {
  const lastRunRef = useRef(0)

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now()
    
    if (now - lastRunRef.current >= delay) {
      callback(...args)
      lastRunRef.current = now
    }
  }, [callback, delay])
}

// 使用示例
function Editor() {
  const handleChange = useDebounce((content: string) => {
    // 保存到服务器
    saveToServer(content)
  }, 1000)

  const handleScroll = useThrottle(() => {
    // 更新滚动位置
    updateScrollPosition()
  }, 100)

  return <CodeEditor onChange={handleChange} onScroll={handleScroll} />
}
```

### 4. 优化扩展配置

避免不必要的扩展和重复配置：

```typescript
import { useMemo } from 'react'
import { Extension } from '@codemirror/state'

function useOptimizedExtensions(
  language: Extension,
  theme: Extension,
  settings: EditorSettings
) {
  // 使用 useMemo 缓存扩展配置
  return useMemo(() => {
    const extensions: Extension[] = [
      basicSetup,
      language,
      theme
    ]

    // 只添加启用的扩展
    if (settings.autocompletion) {
      extensions.push(autocompletion())
    }

    if (settings.lineNumbers) {
      extensions.push(lineNumbers())
    }

    if (settings.foldGutter) {
      extensions.push(foldGutter())
    }

    return extensions
  }, [language, theme, settings])
}
```

### 5. 减少重新渲染

使用 React.memo 和 useCallback 优化组件：

```typescript
import React, { memo, useCallback } from 'react'

interface EditorProps {
  content: string
  onChange: (content: string) => void
}

export const Editor = memo<EditorProps>(({ content, onChange }) => {
  // 使用 useCallback 避免函数重新创建
  const handleChange = useCallback((newContent: string) => {
    if (newContent !== content) {
      onChange(newContent)
    }
  }, [content, onChange])

  return <CodeMirror value={content} onChange={handleChange} />
}, (prevProps, nextProps) => {
  // 自定义比较函数
  return prevProps.content === nextProps.content
})
```

## 内存管理

### 1. 正确清理编辑器实例

```typescript
import { useEffect, useRef } from 'react'
import { EditorView } from '@codemirror/view'

function useEditor() {
  const viewRef = useRef<EditorView | null>(null)

  useEffect(() => {
    // 创建编辑器
    const view = new EditorView({
      // ... 配置
    })
    
    viewRef.current = view

    // 清理函数
    return () => {
      if (viewRef.current) {
        viewRef.current.destroy()
        viewRef.current = null
      }
    }
  }, [])

  return viewRef
}
```

### 2. 避免内存泄漏

```typescript
import { useEffect, useRef } from 'react'

function useEventListener(
  view: EditorView | null,
  eventName: string,
  handler: (event: Event) => void
) {
  const savedHandler = useRef(handler)

  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    if (!view) return

    const eventListener = (event: Event) => savedHandler.current(event)
    
    view.dom.addEventListener(eventName, eventListener)

    return () => {
      view.dom.removeEventListener(eventName, eventListener)
    }
  }, [view, eventName])
}
```

### 3. 清理定时器和订阅

```typescript
function useAutoSave(view: EditorView | null, onSave: (content: string) => void) {
  const timerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (!view) return

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        // 清除之前的定时器
        if (timerRef.current) {
          clearTimeout(timerRef.current)
        }

        // 设置新的定时器
        timerRef.current = setTimeout(() => {
          onSave(update.state.doc.toString())
        }, 2000)
      }
    })

    view.dispatch({
      effects: StateEffect.appendConfig.of(updateListener)
    })

    // 清理
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [view, onSave])
}
```

## 最佳实践

### 1. 状态管理

使用集中式状态管理：

```typescript
import { create } from 'zustand'
import { EditorView } from '@codemirror/view'

interface EditorStore {
  view: EditorView | null
  content: string
  language: string
  theme: string
  
  setView: (view: EditorView | null) => void
  setContent: (content: string) => void
  setLanguage: (language: string) => void
  setTheme: (theme: string) => void
}

export const useEditorStore = create<EditorStore>((set) => ({
  view: null,
  content: '',
  language: 'javascript',
  theme: 'light',
  
  setView: (view) => set({ view }),
  setContent: (content) => set({ content }),
  setLanguage: (language) => set({ language }),
  setTheme: (theme) => set({ theme })
}))
```

### 2. 错误处理

实现完善的错误处理：

```typescript
import { useEffect, useState } from 'react'

function useEditorWithErrorHandling() {
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    try {
      // 创建编辑器
      const view = new EditorView({
        // ... 配置
      })

      return () => {
        try {
          view.destroy()
        } catch (err) {
          console.error('清理编辑器时出错:', err)
        }
      }
    } catch (err) {
      setError(err as Error)
      console.error('创建编辑器时出错:', err)
    }
  }, [])

  return { error }
}

// 错误边界组件
class EditorErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('编辑器错误:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>编辑器加载失败</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            重新加载
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
```

### 3. 测试

编写单元测试和集成测试：

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Editor } from './Editor'

describe('Editor', () => {
  it('应该渲染编辑器', () => {
    render(<Editor />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('应该处理内容变化', () => {
    const handleChange = jest.fn()
    render(<Editor onChange={handleChange} />)
    
    const editor = screen.getByRole('textbox')
    fireEvent.change(editor, { target: { value: 'new content' } })
    
    expect(handleChange).toHaveBeenCalledWith('new content')
  })

  it('应该支持快捷键', () => {
    const handleSave = jest.fn()
    render(<Editor onSave={handleSave} />)
    
    const editor = screen.getByRole('textbox')
    fireEvent.keyDown(editor, { key: 's', ctrlKey: true })
    
    expect(handleSave).toHaveBeenCalled()
  })
})
```

### 4. 可访问性

确保编辑器对所有用户友好：

```typescript
import { EditorView } from '@codemirror/view'

const accessibilityExtensions = [
  // 添加 ARIA 标签
  EditorView.contentAttributes.of({
    'aria-label': '代码编辑器',
    'role': 'textbox',
    'aria-multiline': 'true'
  }),
  
  // 键盘导航支持
  EditorView.domEventHandlers({
    keydown(event, view) {
      // 确保屏幕阅读器用户可以导航
      if (event.key === 'Tab' && !event.shiftKey) {
        // 处理 Tab 键
      }
      return false
    }
  })
]
```

### 5. 国际化

支持多语言界面：

```typescript
import { useTranslation } from 'react-i18next'

const translations = {
  zh: {
    editor: {
      save: '保存',
      undo: '撤销',
      redo: '重做',
      search: '搜索',
      replace: '替换'
    }
  },
  en: {
    editor: {
      save: 'Save',
      undo: 'Undo',
      redo: 'Redo',
      search: 'Search',
      replace: 'Replace'
    }
  }
}

function Toolbar() {
  const { t } = useTranslation()

  return (
    <div className="toolbar">
      <button>{t('editor.save')}</button>
      <button>{t('editor.undo')}</button>
      <button>{t('editor.redo')}</button>
    </div>
  )
}
```

### 6. 配置管理

使用配置文件管理编辑器设置：

```typescript
// config/editor.config.ts
export const editorConfig = {
  // 默认设置
  defaults: {
    fontSize: 14,
    fontFamily: "'Fira Code', monospace",
    tabSize: 2,
    theme: 'light'
  },
  
  // 语言配置
  languages: {
    javascript: {
      extensions: ['.js', '.jsx'],
      snippets: true,
      linting: true
    },
    typescript: {
      extensions: ['.ts', '.tsx'],
      snippets: true,
      linting: true
    }
  },
  
  // 主题配置
  themes: {
    light: {
      name: '亮色',
      colors: {
        background: '#ffffff',
        foreground: '#000000'
      }
    },
    dark: {
      name: '暗色',
      colors: {
        background: '#1e1e1e',
        foreground: '#d4d4d4'
      }
    }
  },
  
  // 快捷键配置
  keymap: {
    save: 'Ctrl-S',
    search: 'Ctrl-F',
    replace: 'Ctrl-H',
    format: 'Shift-Alt-F'
  }
}
```

### 7. 日志和监控

实现日志系统：

```typescript
class EditorLogger {
  private logs: Array<{
    timestamp: Date
    level: 'info' | 'warn' | 'error'
    message: string
    data?: any
  }> = []

  info(message: string, data?: any) {
    this.log('info', message, data)
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data)
  }

  error(message: string, data?: any) {
    this.log('error', message, data)
  }

  private log(level: 'info' | 'warn' | 'error', message: string, data?: any) {
    const entry = {
      timestamp: new Date(),
      level,
      message,
      data
    }
    
    this.logs.push(entry)
    
    // 发送到监控服务
    if (level === 'error') {
      this.sendToMonitoring(entry)
    }
    
    // 控制台输出
    console[level](message, data)
  }

  private sendToMonitoring(entry: any) {
    // 发送到监控服务（如 Sentry）
    if (window.Sentry) {
      window.Sentry.captureMessage(entry.message, {
        level: entry.level,
        extra: entry.data
      })
    }
  }

  getLogs() {
    return this.logs
  }

  clearLogs() {
    this.logs = []
  }
}

export const logger = new EditorLogger()
```

## 性能监控

### 监控编辑器性能

```typescript
import { useEffect } from 'react'

function usePerformanceMonitoring(view: EditorView | null) {
  useEffect(() => {
    if (!view) return

    let updateCount = 0
    let totalUpdateTime = 0

    const updateListener = EditorView.updateListener.of((update) => {
      const startTime = performance.now()
      
      // 监控更新
      updateCount++
      
      const endTime = performance.now()
      const updateTime = endTime - startTime
      totalUpdateTime += updateTime

      if (updateTime > 16) {
        console.warn(`慢速更新检测: ${updateTime.toFixed(2)}ms`)
      }

      // 每 100 次更新报告一次
      if (updateCount % 100 === 0) {
        const avgTime = totalUpdateTime / updateCount
        console.log(`平均更新时间: ${avgTime.toFixed(2)}ms`)
        
        // 重置计数器
        updateCount = 0
        totalUpdateTime = 0
      }
    })

    view.dispatch({
      effects: StateEffect.appendConfig.of(updateListener)
    })
  }, [view])
}
```

## 小结

在本章中，我们学习了：

- ✅ 性能优化策略（延迟加载、虚拟化、防抖节流）
- ✅ 内存管理和清理
- ✅ 错误处理和边界
- ✅ 测试策略
- ✅ 可访问性支持
- ✅ 国际化
- ✅ 配置管理
- ✅ 日志和监控
- ✅ 性能监控

## 总结

通过本教程，你已经掌握了：

1. **基础知识**
   - CodeMirror 6 架构和核心概念
   - React 集成方法
   - 状态管理和事件系统

2. **样式定制**
   - 主题系统
   - 语法高亮
   - 自定义样式

3. **高级功能**
   - 代码补全
   - 语法树和导航
   - 上下文菜单
   - 代码片段

4. **实战项目**
   - 完整编辑器构建
   - 性能优化
   - 最佳实践

现在你已经具备了构建专业级代码编辑器的能力！

## 推荐资源

- [CodeMirror 6 官方文档](https://codemirror.net/docs/)
- [CodeMirror 6 GitHub](https://github.com/codemirror/dev)
- [Lezer 解析器](https://lezer.codemirror.net/)
- [CodeMirror 社区](https://discuss.codemirror.net/)

祝你在 CodeMirror 6 的开发之旅中取得成功！🎉


