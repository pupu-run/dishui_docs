import { AppShell, Markdown, type RouteConfig, createRouterFromConfig, AppLayoutWrapper, type ContextMenuItem, type ArticleAction } from 'dishui';
import 'dishui/dist/dishui.css';
import { menuItems } from './autogen/menu';
import React, { useEffect, useState, useRef } from 'react';
import type { MenuItem } from 'dishui';
import { useNavigate } from '@tanstack/react-router';

// 获取第一个子项的路径
const getFirstChildPath = (item: MenuItem): string | null => {
    if (!item.children || item.children.length === 0) {
        return null;
    }

    // 找到第一个有 path 的子项
    for (const child of item.children) {
        if (child.path) {
            return child.path;
        }
        // 如果子项也是目录，递归查找
        const childPath = getFirstChildPath(child);
        if (childPath) {
            return childPath;
        }
    }

    return null;
};

// 重定向组件
const RedirectComponent: React.FC<{ to: string }> = ({ to }) => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate({ to });
    }, [navigate, to]);

    return null;
};

// 高亮信息接口
interface HighlightInfo {
    id: string;
    text: string;
    range: Range; // 保存原始 Range 对象
}

// 全局高亮状态管理
class HighlightManager {
    private static highlights: HighlightInfo[] = [];
    private static listeners: Set<(highlights: HighlightInfo[]) => void> = new Set();

    static addHighlight(highlight: HighlightInfo) {
        this.highlights.push(highlight);
        this.notifyListeners();
    }

    static clearHighlights() {
        this.highlights = [];
        this.notifyListeners();
    }

    static getHighlights() {
        return [...this.highlights];
    }

    static subscribe(listener: (highlights: HighlightInfo[]) => void) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private static notifyListeners() {
        this.listeners.forEach(listener => listener(this.getHighlights()));
    }
}

// 高亮选中文本的函数（使用覆盖层方法，保存 Range）
const highlightSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.toString().trim() === '') {
        alert('请先选中要高亮的文本');
        return;
    }

    try {
        const range = selection.getRangeAt(0);
        const selectedText = selection.toString();

        // 克隆 range 以保存选择
        const clonedRange = range.cloneRange();

        // 保存高亮信息
        const highlightId = `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        HighlightManager.addHighlight({
            id: highlightId,
            text: selectedText.substring(0, 50) + (selectedText.length > 50 ? '...' : ''),
            range: clonedRange,
        });

        // 清除选择
        selection.removeAllRanges();

        // console.log('已高亮文本:', selectedText); // 移除日志避免控制台污染
    } catch (error) {
        console.error('高亮失败:', error);
        alert('高亮失败，请重试');
    }
};

// 清除所有高亮
const clearAllHighlights = () => {
    HighlightManager.clearHighlights();
    // console.log('已清除所有高亮'); // 移除日志避免控制台污染
};

// ArticleControl 的操作按钮配置
const articleActions: ArticleAction[] = [
    {
        id: 'highlight-selection',
        label: '高亮选中',
        description: '高亮当前选中的文本',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
        ),
        action: () => {
            highlightSelection();
        },
    },
    {
        id: 'clear-highlight',
        label: '清除高亮',
        description: '清除所有高亮标记',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
        action: () => {
            clearAllHighlights();
        },
    },
    {
        id: 'copy',
        label: '复制',
        description: '复制选中文本或全文',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
        ),
        action: (content, selection) => {
            const textToCopy = selection?.text || content;
            navigator.clipboard.writeText(textToCopy).then(() => {
                alert('已复制到剪贴板');
            }).catch(() => {
                alert('复制失败，请重试');
            });
        },
    },
    {
        id: 'stats',
        label: '统计信息',
        description: '查看文章字数统计',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        action: (content, selection) => {
            const text = selection?.text || content;
            const chars = text.length;
            const words = text.trim().split(/\s+/).length;
            const lines = text.split('\n').length;
            alert(`统计信息:\n字符数: ${chars}\n单词数: ${words}\n行数: ${lines}`);
        },
    },
];

// 右键菜单配置
const contextMenuItems: ContextMenuItem[] = [
    {
        id: 'highlight-selection',
        label: '高亮选中',
        description: '高亮当前选中的文本',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
        ),
        action: () => {
            highlightSelection();
        },
    },
    {
        id: 'clear-highlight',
        label: '清除高亮',
        description: '清除所有高亮标记',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
        action: () => {
            clearAllHighlights();
        },
    },
    {
        id: 'copy',
        label: '复制',
        description: '复制选中文本或全文',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
        ),
        action: (content, selection) => {
            const textToCopy = selection?.text || content;
            navigator.clipboard.writeText(textToCopy).then(() => {
                // 复制成功，无需提示
            });
        },
    },
    {
        id: 'stats',
        label: '统计信息',
        description: '查看文章字数统计',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        action: (content, selection) => {
            const text = selection?.text || content;
            const chars = text.length;
            const words = text.trim().split(/\s+/).length;
            const lines = text.split('\n').length;
            alert(`统计信息:\n字符数: ${chars}\n单词数: ${words}\n行数: ${lines}`);
        },
    },
];

// 高亮覆盖层组件（独立组件，避免影响 Markdown 渲染）
const HighlightOverlay: React.FC = () => {
    const [highlights, setHighlights] = useState<HighlightInfo[]>([]);
    const [, forceUpdate] = useState(0);
    const rafRef = useRef<number | null>(null);
    const isUpdatingRef = useRef(false);

    useEffect(() => {
        // 订阅高亮状态变化
        const unsubscribe = HighlightManager.subscribe((newHighlights) => {
            setHighlights(newHighlights);
        });

        // 初始化高亮状态
        setHighlights(HighlightManager.getHighlights());

        // 使用 requestAnimationFrame 优化滚动更新
        const handleUpdate = () => {
            if (isUpdatingRef.current) return;

            isUpdatingRef.current = true;

            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }

            rafRef.current = requestAnimationFrame(() => {
                forceUpdate(prev => prev + 1);
                isUpdatingRef.current = false;
            });
        };

        window.addEventListener('scroll', handleUpdate, { passive: true, capture: true });
        window.addEventListener('resize', handleUpdate, { passive: true });

        // 清理函数
        return () => {
            unsubscribe();
            window.removeEventListener('scroll', handleUpdate, true);
            window.removeEventListener('resize', handleUpdate);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, []);

    // 渲染高亮覆盖层
    return (
        <>
            {highlights.map(highlight => {
                try {
                    // 获取当前 range 的位置
                    const rects = Array.from(highlight.range.getClientRects());

                    return (
                        <React.Fragment key={highlight.id}>
                            {rects.map((rect, index) => (
                                <div
                                    key={`${highlight.id}-${index}`}
                                    className="fixed pointer-events-none"
                                    style={{
                                        left: `${rect.left}px`,
                                        top: `${rect.top}px`,
                                        width: `${rect.width}px`,
                                        height: `${rect.height}px`,
                                        backgroundColor: '#fef08a',
                                        opacity: 0.4,
                                        borderRadius: '2px',
                                        zIndex: 10,
                                        transition: 'none', // 禁用过渡动画，使位置更新更快
                                    }}
                                />
                            ))}
                        </React.Fragment>
                    );
                } catch (error) {
                    // Range 可能已失效，忽略错误
                    return null;
                }
            })}
        </>
    );
};

// Markdown 包装组件
const MarkdownWithHighlight: React.FC<{ mdPath: string }> = ({ mdPath }) => {
    return (
        <>
            {/* Markdown 内容 */}
            <Markdown
                source='url'
                content={mdPath}
                enableMarkmap={true}
                enableMermaid={true}
                enableMdx={true}
                showArticleControl={true}
                showContextMenu={true}
                contextMenuItems={contextMenuItems}
                articleControlProps={{
                    initialPosition: { x: window.innerWidth - 320, y: 100 },
                    initialExpanded: true,
                    actions: articleActions,
                }}
            />
        </>
    );
};

// 从 menuItems 动态生成路由配置（扁平化处理）
const generateRoutesFromMenu = (items: MenuItem[]): RouteConfig[] => {
    const routes: RouteConfig[] = [];

    const flattenItems = (items: MenuItem[]) => {
        items.forEach(item => {
            if (item.path) {
                // 检查是否是目录（有 children）
                const isDirectory = item.children && item.children.length > 0;

                if (isDirectory) {
                    // 为目录添加重定向路由
                    const firstChildPath = getFirstChildPath(item);
                    if (firstChildPath) {
                        const redirectRoute: RouteConfig = {
                            path: item.path,
                            component: () => <RedirectComponent to={firstChildPath} />,
                        };
                        routes.push(redirectRoute);
                    }
                } else {
                    // 为文件添加正常路由
                    const mdPath = item.path === '/'
                        ? `${window.location.origin}/docs/index.md`
                        : `${window.location.origin}/docs${item.path}.md`;

                    const route: RouteConfig = {
                        path: item.path,
                        component: () => (
                            <div className="p-6">
                                <MarkdownWithHighlight mdPath={mdPath} />
                            </div>
                        ),
                    };

                    routes.push(route);
                }
            }

            // 递归处理子项（扁平化）
            if (item.children && item.children.length > 0) {
                flattenItems(item.children);
            }
        });
    };

    flattenItems(items);
    return routes;
};

// 生成路由配置
const routesConfig = generateRoutesFromMenu(menuItems);
console.log('Generated routes:', routesConfig);

const router = createRouterFromConfig(routesConfig, AppLayoutWrapper);

// 从 menuItems 动态生成搜索数据
const generateSearchData = (items: typeof menuItems, parentPath = ''): Array<{
    id: string;
    title: string;
    path: string;
    description: string;
}> => {
    const result: Array<{
        id: string;
        title: string;
        path: string;
        description: string;
    }> = [];

    items.forEach(item => {
        // 添加当前项
        if (item.path) {
            result.push({
                id: item.id,
                title: item.label,
                path: item.path,
                description: `${item.label} - doc`
            });
        }

        // 递归处理子项
        if (item.children && item.children.length > 0) {
            result.push(...generateSearchData(item.children, item.path || parentPath));
        }
    });

    return result;
};

// 文档搜索数据（从 menuItems 动态生成）
const searchData = generateSearchData(menuItems);

// 搜索配置
const searchConfig = {
    enabled: true,
    placeholder: { zh: '搜索文档...', en: 'Search docs...' },
    shortcut: '⌘K',
    searchFunction: (term: string) => {
        if (!term.trim()) return [];

        const lowerTerm = term.toLowerCase();
        return searchData
            .filter(item =>
                item.title.toLowerCase().includes(lowerTerm) ||
                item.id.toLowerCase().includes(lowerTerm)
            )
            .map(item => ({
                title: item.title,
                description: item.description,
                path: item.path,
                score: item.title.toLowerCase().includes(lowerTerm) ? 1 : 0.5,
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
    },
};

const App: React.FC = () => {
    return (
        <>
            <AppShell
                title="My Doc Site"
                router={router}
                initialLang="zh"
                initialTheme="eyecare"  // 可选: light, dark, retro, cyberpunk, matrix, oceanblue, eyecare, ghibli
                menuItems={menuItems}
                searchConfig={searchConfig}
                sidebarWidth={260}  // 有效范围: 160-400px
                sidebarCollapsedWidth={64}  // 可选: 收起时的宽度
            />
            {/* 全局高亮覆盖层 */}
            <HighlightOverlay />
        </>
    );
};

export default App;
