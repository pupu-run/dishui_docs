#!/bin/bash

# 重新构建 DishUI 并更新到 dishui_docs 项目的脚本

set -e

echo "🔨 开始构建 DishUI..."
cd ../DishUI
pnpm run build

echo "✅ DishUI 构建完成！"
echo ""
echo "🔄 更新 dishui_docs 依赖..."
cd ../dishui_docs
rm -rf node_modules/dishui node_modules/.vite dist
pnpm install

echo "✅ 依赖更新完成！"
echo ""
echo "🚀 重启开发服务器..."
echo "请在浏览器中硬刷新（Cmd+Shift+R 或 Ctrl+Shift+R）以清除缓存"

