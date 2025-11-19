#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const docsDir = path.join(projectRoot, 'public/docs');
const appPath = path.join(projectRoot, 'src/App.tsx');

// 读取 markdown 文件的标题
function readMarkdownTitle(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const firstLine = content.split('\n')[0];
        if (firstLine.startsWith('#')) {
            return firstLine.replace(/^#+\s*/, '').trim();
        }
    } catch (e) {
        console.warn(`无法读取文件: ${filePath}`);
    }
    return path.basename(filePath, '.md');
}

// 构建文档树结构
function buildDocTree(dir, baseDir = dir, parentPath = '') {
    const tree = {
        files: [],
        dirs: {}
    };
    
    if (!fs.existsSync(dir)) {
        return tree;
    }
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            const dirPath = parentPath ? `${parentPath}/${item}` : item;
            tree.dirs[item] = buildDocTree(fullPath, baseDir, dirPath);
        } else if (item.endsWith('.md')) {
            const fileName = path.basename(item, '.md');
            const isIndex = fileName === 'index';
            const relativePath = path.relative(baseDir, fullPath);
            
            let urlPath;
            if (isIndex && !parentPath) {
                urlPath = '/';
            } else if (isIndex) {
                urlPath = `/${parentPath}`;
            } else {
                urlPath = parentPath ? `/${parentPath}/${fileName}` : `/${fileName}`;
            }
            
            const publicPath = '/docs/' + relativePath.replace(/\\/g, '/');
            const title = readMarkdownTitle(fullPath);
            
            tree.files.push({
                fileName,
                filePath: relativePath,
                urlPath,
                publicPath,
                title,
                id: urlPath.replace(/\//g, '-').slice(1) || 'home',
                isIndex,
            });
        }
    }
    
    // 排序：index.md 放在最前面
    tree.files.sort((a, b) => {
        if (a.isIndex) return -1;
        if (b.isIndex) return 1;
        return a.fileName.localeCompare(b.fileName);
    });
    
    return tree;
}

// 将树结构转换为扁平列表（用于路由）
function flattenTree(tree, result = []) {
    result.push(...tree.files);
    for (const dirName in tree.dirs) {
        flattenTree(tree.dirs[dirName], result);
    }
    return result;
}

// 生成菜单项代码（支持层级）
function generateMenuItemCode(doc, isFirst, indent = '    ') {
    const icon = isFirst ? 
        `<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
${indent}        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
${indent}    </svg>` :
        `<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
${indent}        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
${indent}    </svg>`;
    
    return `${indent}{
${indent}    id: '${doc.id}',
${indent}    label: '${doc.title}',
${indent}    path: '${doc.urlPath}',
${indent}    icon: (
${indent}        ${icon}
${indent}    ),
${indent}}`;
}

function generateMenuTreeCode(tree, dirName = null, parentPath = '', isFirst = false, indent = '    ') {
    const items = [];
    
    // 处理当前目录的文件
    for (let i = 0; i < tree.files.length; i++) {
        const doc = tree.files[i];
        // 跳过 index.md，除非它在根目录
        if (doc.isIndex && parentPath) {
            continue;
        }
        items.push(generateMenuItemCode(doc, isFirst && i === 0, indent));
    }
    
    // 处理子目录
    for (const subDirName in tree.dirs) {
        const subTree = tree.dirs[subDirName];
        const subPath = parentPath ? `${parentPath}/${subDirName}` : subDirName;
        const dirId = subPath.replace(/\//g, '-');
        
        // 找到这个目录的 index.md 作为目录标题
        const indexFile = subTree.files.find(f => f.isIndex);
        const dirTitle = indexFile ? indexFile.title : subDirName;
        const dirUrlPath = `/${subPath}`;
        
        // 生成子菜单项
        const childrenCode = [];
        
        // 添加非 index 的文件
        for (const doc of subTree.files) {
            if (!doc.isIndex) {
                childrenCode.push(generateMenuItemCode(doc, false, indent + '        '));
            }
        }
        
        // 递归添加子目录
        for (const subSubDirName in subTree.dirs) {
            const subSubTree = subTree.dirs[subSubDirName];
            const subSubPath = `${subPath}/${subSubDirName}`;
            childrenCode.push(generateMenuTreeCode({ files: [], dirs: { [subSubDirName]: subSubTree } }, subSubDirName, subPath, false, indent + '        '));
        }
        
        // 生成带 children 的目录项
        const dirItem = `${indent}{
${indent}    id: '${dirId}',
${indent}    label: '${dirTitle}',
${indent}    path: '${dirUrlPath}',
${indent}    icon: (
${indent}        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
${indent}            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
${indent}        </svg>
${indent}    ),${childrenCode.length > 0 ? `
${indent}    children: [
${childrenCode.join(',\n')}
${indent}    ],` : ''}
${indent}}`;
        
        items.push(dirItem);
    }
    
    return items.join(',\n');
}

// 生成菜单项代码
function generateMenuItems(tree) {
    if (tree.files.length === 0 && Object.keys(tree.dirs).length === 0) {
        return `const menuItems: MenuItem[] = [
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
];`;
    }

    const menuItemsCode = generateMenuTreeCode(tree, null, '', true);
    return `const menuItems: MenuItem[] = [\n${menuItemsCode}\n];`;
}

// 生成路由代码
function generateRoutes(docs) {
    if (docs.length === 0) {
        return {
            routesCode: `// 创建首页路由
const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">欢迎使用文档系统</h1>
            <p>请在 public/docs/ 目录下添加 markdown 文档</p>
        </div>
    ),
});`,
            routeTreeCode: `const routeTree = rootRoute.addChildren([indexRoute]);`
        };
    }

    const routesCode = docs.map((doc, index) => {
        const routeName = doc.isIndex && doc.urlPath === '/' ? 'indexRoute' : `route${index}`;
        const routePath = doc.urlPath;
        
        return `// ${doc.title}
const ${routeName} = createRoute({
    getParentRoute: () => rootRoute,
    path: '${routePath}',
    component: () => (
        <div className="p-6">
            <Markdown source='url' content='${doc.publicPath}' enableMarkmap={true} enableMdx={true} />
        </div>
    ),
});`;
    }).join('\n\n');

    const routeNames = docs.map((doc, index) => 
        doc.isIndex && doc.urlPath === '/' ? 'indexRoute' : `route${index}`
    ).join(', ');

    const routeTreeCode = `const routeTree = rootRoute.addChildren([${routeNames}]);`;

    return { routesCode, routeTreeCode };
}

// 生成搜索配置
function generateSearchConfig(docs) {
    const searchItems = docs.map(doc => ({
        id: doc.id,
        title: doc.title,
        path: doc.urlPath,
        description: `${doc.title} - 文档`,
    }));
    
    return `// 文档搜索数据
const searchData = ${JSON.stringify(searchItems, null, 4)};

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
};`;
}

// 生成完整的 App.tsx
function generateApp(tree, docs) {
    const { routesCode, routeTreeCode } = generateRoutes(docs);
    const menuItemsCode = generateMenuItems(tree);
    const searchConfigCode = generateSearchConfig(docs);

    return `import { AppShell, AppLayoutWrapper, Markdown } from 'dishui';
import type { MenuItem } from 'dishui';
import 'dishui/dist/dishui.css';
import React from 'react';
import { createRouter, createRootRoute, createRoute } from '@tanstack/react-router';

// 创建根路由
const rootRoute = createRootRoute({
    component: AppLayoutWrapper,
});

${routesCode}

// 创建路由树
${routeTreeCode}

// 创建 router 实例
const router = createRouter({ routeTree });

// 声明路由类型
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

${menuItemsCode}

${searchConfigCode}

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
`;
}

// 主函数
function main() {
    console.log('🔍 扫描 docs 目录...');
    const tree = buildDocTree(docsDir);
    const docs = flattenTree(tree);
    
    console.log(`📄 找到 ${docs.length} 个文档:`);
    docs.forEach(doc => {
        console.log(`   - ${doc.title} (${doc.filePath})`);
    });
    
    console.log('\n✨ 生成 App.tsx...');
    const appContent = generateApp(tree, docs);
    
    fs.writeFileSync(appPath, appContent, 'utf-8');
    
    console.log(`✅ App.tsx 已生成！(${appPath})`);
    console.log('\n📋 生成的配置:');
    console.log(`   - ${docs.length} 个路由`);
    console.log(`   - 菜单支持层级结构`);
    console.log(`   - ${docs.length} 个搜索项`);
}

main();
