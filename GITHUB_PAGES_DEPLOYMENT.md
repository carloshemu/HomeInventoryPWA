# GitHub Pages 部署指南

## 概述

GitHub Pages 是 GitHub 提供的免费静态网站托管服务。它可以直接从你的 GitHub 仓库部署网站，非常适合前端项目。

## 部署过程详解

### 1. 修改 Vite 配置

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.NODE_ENV === 'production' ? '/HomeInventoryPWA/' : '/',
})
```

**解释**：
- `base` 配置告诉 Vite 在生产环境下，所有资源的基础路径是 `/HomeInventoryPWA/`
- 这是因为 GitHub Pages 的 URL 格式是：`https://用户名.github.io/仓库名/`
- 在开发环境（localhost）中，基础路径仍然是 `/`

### 2. 添加部署脚本

```json
// package.json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist",
  "predeploy": "npm run build"
}
```

**解释**：
- `predeploy`：在部署前自动运行构建命令
- `deploy`：构建项目并将 `dist` 文件夹部署到 GitHub Pages
- `gh-pages -d dist`：使用 gh-pages 包将 dist 目录的内容推送到 GitHub 的 gh-pages 分支

### 3. 安装 gh-pages 包

```bash
npm install --save-dev gh-pages
```

**解释**：
- `gh-pages` 是一个专门用于部署到 GitHub Pages 的工具
- 它会自动创建一个 `gh-pages` 分支，并将构建后的文件推送到这个分支
- GitHub Pages 会从这个分支读取网站文件

### 4. 连接本地仓库到 GitHub

```bash
git remote add origin https://github.com/carloshemu/HomeInventoryPWA.git
```

**解释**：
- `git remote add` 添加一个远程仓库
- `origin` 是远程仓库的别名（约定俗成）
- 这样本地仓库就知道代码要推送到哪里了

### 5. 推送代码到 GitHub

```bash
git add .
git commit -m "Configure for GitHub Pages deployment"
git push -u origin main
```

**解释**：
- `git add .`：将所有更改添加到暂存区
- `git commit`：提交更改到本地仓库
- `git push -u origin main`：将本地 main 分支推送到远程仓库，并设置跟踪关系

### 6. 部署到 GitHub Pages

```bash
npm run deploy
```

**这个命令实际上做了以下事情**：

1. **构建项目**：
   ```bash
   npm run build
   ```
   - 运行 Vite 构建命令
   - 将 React 代码编译成静态文件
   - 生成 `dist` 文件夹，包含 HTML、CSS、JS 文件

2. **部署到 gh-pages 分支**：
   ```bash
   gh-pages -d dist
   ```
   - 创建或更新 `gh-pages` 分支
   - 将 `dist` 文件夹的内容复制到 `gh-pages` 分支
   - 推送到 GitHub

## GitHub Pages 的工作原理

```
你的代码 (main 分支)
    ↓
npm run build
    ↓
生成静态文件 (dist 文件夹)
    ↓
gh-pages 工具
    ↓
推送到 gh-pages 分支
    ↓
GitHub Pages 服务器
    ↓
用户访问 https://carloshemu.github.io/HomeInventoryPWA/
```

## 文件结构说明

### 开发时
```
HomeInventoryPWA/
├── src/          # React 源代码
├── public/       # 静态资源
├── package.json  # 项目配置
└── vite.config.js # Vite 配置
```

### 构建后
```
dist/             # 构建输出目录
├── index.html    # 主页面
├── assets/       # 编译后的 CSS 和 JS
│   ├── index-xxx.css
│   └── index-xxx.js
└── 其他静态文件
```

### 部署后
```
gh-pages 分支 (GitHub)
├── index.html    # 主页面
├── assets/       # 编译后的 CSS 和 JS
└── 其他静态文件
```

## gh-pages 分支与其他分支的区别

### 分支的用途不同

#### 普通分支（如 main、develop）：
- **用途**：存储源代码
- **内容**：React 组件、TypeScript 文件、配置文件等
- **访问者**：开发者
- **作用**：代码版本控制、协作开发

#### gh-pages 分支：
- **用途**：存储部署文件
- **内容**：构建后的静态文件（HTML、CSS、JS）
- **访问者**：网站用户
- **作用**：网站托管

### 文件内容对比

#### main 分支包含：
```
HomeInventoryPWA/
├── src/
│   ├── App.jsx          # React 组件源代码
│   ├── components/
│   │   ├── ItemCard.jsx
│   │   └── ItemForm.jsx
│   └── main.jsx
├── public/
│   ├── manifest.json
│   └── sw.js
├── package.json         # 项目配置
├── vite.config.js       # 构建配置
└── node_modules/        # 依赖包
```

#### gh-pages 分支包含：
```
/
├── index.html           # 构建后的 HTML
├── assets/
│   ├── index-xxx.css   # 编译后的 CSS
│   └── index-xxx.js    # 编译后的 JS
├── icon-192.png        # 静态资源
├── icon-512.png
└── manifest.json       # PWA 配置
```

### 分支的生命周期

#### main 分支：
```bash
# 开发者工作流程
git checkout main
# 编写代码
git add .
git commit -m "Add new feature"
git push origin main
```

#### gh-pages 分支：
```bash
# 自动部署流程
npm run deploy
# 这个命令会：
# 1. 从 main 分支读取源代码
# 2. 运行 npm run build
# 3. 将 dist/ 文件夹的内容推送到 gh-pages 分支
```

### 分支的访问方式

#### main 分支：
- **GitHub 访问**：https://github.com/carloshemu/HomeInventoryPWA
- **用途**：查看源代码、提交历史、Issues、Pull Requests

#### gh-pages 分支：
- **网站访问**：https://carloshemu.github.io/HomeInventoryPWA/
- **用途**：用户访问你的网站

### 分支的更新频率

#### main 分支：
- **更新频率**：每次代码提交
- **触发条件**：开发者主动提交
- **内容变化**：源代码的增删改

#### gh-pages 分支：
- **更新频率**：每次部署
- **触发条件**：运行 `npm run deploy`
- **内容变化**：构建后的文件

### 分支关系图

```
main 分支 (源代码)
    │
    ├── 开发者提交代码
    │   ├── git add .
    │   ├── git commit
    │   └── git push
    │
    └── 部署流程
        ├── npm run build (生成 dist/)
        └── gh-pages -d dist
            │
            └── gh-pages 分支 (部署文件)
                └── GitHub Pages 服务器
                    └── 用户访问网站
```

### 为什么需要两个分支？

#### 问题：为什么不直接在 main 分支部署？

**原因 1：文件类型不同**
- main 分支：源代码（.jsx, .ts, .json）
- 部署需要：编译后的文件（.html, .css, .js）

**原因 2：安全性**
- 源代码可能包含敏感信息（API 密钥、数据库配置）
- 部署文件应该是公开的静态文件

**原因 3：性能**
- 部署文件经过优化（压缩、合并）
- 源代码文件较大且未优化

### 分支管理最佳实践

#### 不要手动修改 gh-pages 分支：
```bash
# ❌ 错误做法
git checkout gh-pages
# 手动修改文件
git push

# ✅ 正确做法
# 修改 main 分支的源代码
npm run deploy  # 自动更新 gh-pages 分支
```

#### 分支保护：
- main 分支：设置保护规则，需要代码审查
- gh-pages 分支：通常不需要保护，因为只通过工具更新

## 分支对比总结

| 特性 | main 分支 | gh-pages 分支 |
|------|-----------|---------------|
| 内容 | 源代码 | 构建后的文件 |
| 更新方式 | 手动提交 | 自动部署 |
| 访问方式 | GitHub 仓库页面 | 网站 URL |
| 用途 | 开发协作 | 网站托管 |
| 文件类型 | .jsx, .ts, .json | .html, .css, .js |

## 部署后的维护

### 更新网站：
```bash
# 1. 修改代码
# 2. 提交更改
git add .
git commit -m "Update website"
git push

# 3. 重新部署
npm run deploy
```

### 查看部署状态：
- 访问 GitHub 仓库的 "Actions" 标签
- 或者直接访问你的网站 URL

## 常见问题

**Q: 为什么网站显示 404？**
A: 可能需要等待几分钟让 GitHub Pages 完成部署

**Q: 为什么样式没有加载？**
A: 检查 vite.config.js 中的 base 路径是否正确

**Q: 如何知道部署是否成功？**
A: 在 GitHub 仓库页面，应该能看到一个绿色的勾号表示部署成功

## 配置 GitHub Pages 设置

1. 打开浏览器，访问你的仓库：https://github.com/carloshemu/HomeInventoryPWA
2. 点击仓库页面顶部的 "Settings" 标签
3. 在左侧菜单中找到 "Pages"
4. 在 "Source" 部分，选择 "Deploy from a branch"
5. 在 "Branch" 下拉菜单中选择 "gh-pages" 分支
6. 点击 "Save"

## 访问你的应用

配置完成后，你的应用将在以下地址可用：
**https://carloshemu.github.io/HomeInventoryPWA/**

部署过程可能需要几分钟时间。你可以：

1. 在 GitHub 仓库的 "Actions" 标签中查看部署状态
2. 等待几分钟后访问上面的 URL

## 总结

我们已经成功完成了以下步骤：

✅ 配置了 Vite 以支持 GitHub Pages  
✅ 添加了部署脚本到 package.json  
✅ 安装了 gh-pages 包  
✅ 连接了本地仓库到 GitHub  
✅ 删除了大文件并重新推送代码  
✅ 成功部署到 GitHub Pages  

你的 HomeInventoryPWA 应用现在应该可以通过 https://carloshemu.github.io/HomeInventoryPWA/ 访问了！

如果你需要更新应用，只需要：
1. 修改代码
2. 运行 `git add . && git commit -m "your message" && git push`
3. 运行 `npm run deploy` 