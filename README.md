# 🏠 家庭物品跟踪系统 (HomeInventory PWA)

一个轻量级的渐进式Web应用(PWA)，用于管理和跟踪家庭物品的位置。支持离线使用，所有数据保存在本地，无需后端服务器。

## ✨ 功能特性

- 📱 **PWA支持** - 可安装到主屏幕，提供原生应用体验
- 🔍 **智能搜索** - 支持按名称、位置、备注、分类搜索
- 🏷️ **分类管理** - 自定义分类标签，快速筛选物品
- 📸 **图片支持** - 拍照或上传图片，支持图片压缩
- 💾 **本地存储** - 使用IndexedDB，数据持久化保存
- 📤 **数据导出** - 支持导出JSON格式备份文件
- 📥 **数据导入** - 支持从JSON文件恢复数据
- 🔄 **离线使用** - Service Worker缓存，完全离线可用
- 📱 **移动优化** - 专为iPhone等移动设备优化

## 🚀 快速开始

### 开发环境

```bash
# 克隆项目
git clone <repository-url>
cd HomeInventoryPWA

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 生产构建

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 📱 PWA安装

1. 在Safari中访问应用
2. 点击分享按钮
3. 选择"添加到主屏幕"
4. 应用将安装到主屏幕，提供原生应用体验

## 🛠️ 技术栈

- **前端框架**: React 18 + Vite
- **样式**: Tailwind CSS
- **数据库**: IndexedDB (通过Dexie.js)
- **PWA**: Service Worker + Web App Manifest
- **图片处理**: Canvas API
- **构建工具**: Vite

## 📁 项目结构

```
src/
├── components/          # React组件
│   ├── ItemCard.jsx    # 物品卡片组件
│   ├── ItemForm.jsx    # 物品表单组件
│   └── DataManager.jsx # 数据管理组件
├── services/           # 服务层
│   ├── database.js     # 数据库服务
│   └── pwa.js         # PWA服务
├── utils/              # 工具函数
│   └── helpers.js      # 通用工具函数
├── App.jsx            # 主应用组件
└── main.jsx           # 应用入口

public/
├── manifest.json      # PWA清单文件
├── sw.js             # Service Worker
└── icon-*.png        # PWA图标
```

## 💾 数据管理

### 导出数据
- 点击右上角⚙️按钮打开数据管理
- 点击"导出"按钮下载JSON备份文件

### 导入数据
- 在数据管理中选择"导入"
- 选择之前导出的JSON文件
- 数据将被导入并覆盖现有数据

### 数据格式
```json
[
  {
    "id": "uuid",
    "name": "物品名称",
    "location": "存放位置",
    "category": "分类",
    "note": "备注",
    "photoUrl": "base64图片数据",
    "createdAt": "创建时间",
    "updatedAt": "更新时间"
  }
]
```

## 🔧 开发说明

### 添加新功能
1. 在`src/components/`中创建新组件
2. 在`src/services/`中添加相关服务
3. 在`src/utils/`中添加工具函数
4. 更新主应用组件

### 数据库操作
所有数据库操作通过`DatabaseService`类进行：
- `addItem()` - 添加物品
- `updateItem()` - 更新物品
- `deleteItem()` - 删除物品
- `searchItems()` - 搜索物品
- `exportData()` - 导出数据
- `importData()` - 导入数据

## 📱 移动端优化

- 响应式设计，适配各种屏幕尺寸
- 触摸友好的UI交互
- 支持拍照上传图片
- 离线缓存支持
- 快速加载和流畅动画

## 🔒 隐私说明

- 所有数据仅保存在本地设备
- 不会上传任何数据到服务器
- 支持数据导出备份
- 无网络连接也可正常使用

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

---

**注意**: 这是一个纯前端应用，所有数据保存在浏览器本地。建议定期导出数据作为备份。
