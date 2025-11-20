#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const docsDir = path.join(projectRoot, 'public/docs');
const autogenDir = path.join(projectRoot, 'src/autogen');
const menuPath = path.join(autogenDir, 'menu.tsx');

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

// 生成菜单文件内容
function generateMenuFile(tree) {
    let menuItemsCode;
    
    if (tree.files.length === 0 && Object.keys(tree.dirs).length === 0) {
        menuItemsCode = `export const menuItems: MenuItem[] = [
    {
        id: 'home',
        label: '首页',
        path: '/',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    }
];`;
    } else {
        const menuTreeCode = generateMenuTreeCode(tree, null, '', true);
        menuItemsCode = `export const menuItems: MenuItem[] = [\n${menuTreeCode}\n];`;
    }

    return `
import type { MenuItem } from 'dishui';

${menuItemsCode}`;
}

// 主函数
function main() {
    console.log('🔍 扫描 docs 目录...');
    const tree = buildDocTree(docsDir);
    
    // 确保 autogen 目录存在
    if (!fs.existsSync(autogenDir)) {
        fs.mkdirSync(autogenDir, { recursive: true });
        console.log(`📁 创建目录: ${autogenDir}`);
    }
    
    console.log('\n✨ 生成 menu.tsx...');
    const menuContent = generateMenuFile(tree);
    
    fs.writeFileSync(menuPath, menuContent, 'utf-8');
    
    console.log(`✅ menu.tsx 已生成！(${menuPath})`);
}

main();


