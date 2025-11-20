import { AppShell, Markdown, type RouteConfig, createRouterFromConfig, AppLayoutWrapper } from 'dishui';
import 'dishui/dist/dishui.css';
import { menuItems } from './autogen/menu';
import React, { useEffect } from 'react';
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
                                <Markdown
                                    source='url'
                                    content={mdPath}
                                    enableMarkmap={true}
                                    enableMermaid={true}
                                    enableMdx={true}
                                />
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
    );
};

export default App;
