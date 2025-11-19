import { AppShell, AppLayoutWrapper, Markdown } from 'dishui';
import type { MenuItem } from 'dishui';
import 'dishui/dist/dishui.css';
import React from 'react';
import { createRouter, createRootRoute, createRoute } from '@tanstack/react-router';

// 创建根路由
const rootRoute = createRootRoute({
    component: AppLayoutWrapper,
});

// 首页
const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => (
        <div className="p-6">
            <Markdown source='url' content='/docs/index.md' enableMarkmap={true} enableMdx={true} />
        </div>
    ),
});

// 组件文档
const route1 = createRoute({
    getParentRoute: () => rootRoute,
    path: '/components',
    component: () => (
        <div className="p-6">
            <Markdown source='url' content='/docs/components.md' enableMarkmap={true} enableMdx={true} />
        </div>
    ),
});

// t1
const route2 = createRoute({
    getParentRoute: () => rootRoute,
    path: '/t1',
    component: () => (
        <div className="p-6">
            <Markdown source='url' content='/docs/t1.md' enableMarkmap={true} enableMdx={true} />
        </div>
    ),
});

// 系统使用说明
const route3 = createRoute({
    getParentRoute: () => rootRoute,
    path: '/usage',
    component: () => (
        <div className="p-6">
            <Markdown source='url' content='/docs/usage.md' enableMarkmap={true} enableMdx={true} />
        </div>
    ),
});

// API 文档
const route4 = createRoute({
    getParentRoute: () => rootRoute,
    path: '/api',
    component: () => (
        <div className="p-6">
            <Markdown source='url' content='/docs/api/index.md' enableMarkmap={true} enableMdx={true} />
        </div>
    ),
});

// 组件 API
const route5 = createRoute({
    getParentRoute: () => rootRoute,
    path: '/api/components',
    component: () => (
        <div className="p-6">
            <Markdown source='url' content='/docs/api/components.md' enableMarkmap={true} enableMdx={true} />
        </div>
    ),
});

// 工具函数
const route6 = createRoute({
    getParentRoute: () => rootRoute,
    path: '/api/utils',
    component: () => (
        <div className="p-6">
            <Markdown source='url' content='/docs/api/utils.md' enableMarkmap={true} enableMdx={true} />
        </div>
    ),
});

// 使用指南
const route7 = createRoute({
    getParentRoute: () => rootRoute,
    path: '/guide',
    component: () => (
        <div className="p-6">
            <Markdown source='url' content='/docs/guide/index.md' enableMarkmap={true} enableMdx={true} />
        </div>
    ),
});

// 快速开始
const route8 = createRoute({
    getParentRoute: () => rootRoute,
    path: '/guide/getting-started',
    component: () => (
        <div className="p-6">
            <Markdown source='url' content='/docs/guide/getting-started.md' enableMarkmap={true} enableMdx={true} />
        </div>
    ),
});

// 创建路由树
const routeTree = rootRoute.addChildren([indexRoute, route1, route2, route3, route4, route5, route6, route7, route8]);

// 创建 router 实例
const router = createRouter({ routeTree });

// 声明路由类型
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

const menuItems: MenuItem[] = [
    {
        id: 'home',
        label: '首页',
        path: '/',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        ),
    },
    {
        id: 'components',
        label: '组件文档',
        path: '/components',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        ),
    },
    {
        id: 't1',
        label: 't1',
        path: '/t1',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        ),
    },
    {
        id: 'usage',
        label: '系统使用说明',
        path: '/usage',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        ),
    },
    {
        id: 'api',
        label: 'API 文档',
        path: '/api',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
        ),
        children: [
            {
                id: 'api-components',
                label: '组件 API',
                path: '/api/components',
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                ),
            },
            {
                id: 'api-utils',
                label: '工具函数',
                path: '/api/utils',
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                ),
            }
        ],
    },
    {
        id: 'guide',
        label: '使用指南',
        path: '/guide',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
        ),
        children: [
            {
                id: 'guide-getting-started',
                label: '快速开始',
                path: '/guide/getting-started',
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                ),
            }
        ],
    }
];

// 文档搜索数据
const searchData = [
    {
        "id": "home",
        "title": "首页",
        "path": "/",
        "description": "首页 - 文档"
    },
    {
        "id": "components",
        "title": "组件文档",
        "path": "/components",
        "description": "组件文档 - 文档"
    },
    {
        "id": "t1",
        "title": "t1",
        "path": "/t1",
        "description": "t1 - 文档"
    },
    {
        "id": "usage",
        "title": "系统使用说明",
        "path": "/usage",
        "description": "系统使用说明 - 文档"
    },
    {
        "id": "api",
        "title": "API 文档",
        "path": "/api",
        "description": "API 文档 - 文档"
    },
    {
        "id": "api-components",
        "title": "组件 API",
        "path": "/api/components",
        "description": "组件 API - 文档"
    },
    {
        "id": "api-utils",
        "title": "工具函数",
        "path": "/api/utils",
        "description": "工具函数 - 文档"
    },
    {
        "id": "guide",
        "title": "使用指南",
        "path": "/guide",
        "description": "使用指南 - 文档"
    },
    {
        "id": "guide-getting-started",
        "title": "快速开始",
        "path": "/guide/getting-started",
        "description": "快速开始 - 文档"
    }
];

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
            router={router}
            initialLang="zh"
            initialTheme="eyecare"  // 可选: light, dark, retro, cyberpunk, matrix, oceanblue, eyecare, ghibli
            menuItems={menuItems}
            searchConfig={searchConfig}
            sidebarWidth={160}  // 有效范围: 160-400px
            sidebarCollapsedWidth={64}  // 可选: 收起时的宽度
        />
    );
};

export default App;
