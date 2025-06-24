#!/bin/bash

# 家庭物品跟踪系统部署脚本

echo "🏠 开始构建家庭物品跟踪系统..."

# 安装依赖
echo "📦 安装依赖..."
npm install

# 构建生产版本
echo "🔨 构建生产版本..."
npm run build

echo "✅ 构建完成！"
echo ""
echo "📱 部署说明："
echo "1. 将 dist/ 目录的内容上传到你的Web服务器"
echo "2. 或者使用以下服务进行部署："
echo "   - GitHub Pages: 将dist/内容推送到gh-pages分支"
echo "   - Vercel: 连接GitHub仓库自动部署"
echo "   - Netlify: 拖拽dist/文件夹到Netlify"
echo ""
echo "🌐 本地预览："
echo "npm run preview"
echo ""
echo "📱 PWA功能："
echo "- 在Safari中访问应用"
echo "- 点击分享按钮"
echo "- 选择'添加到主屏幕'"
echo ""
echo "🎉 部署完成！" 