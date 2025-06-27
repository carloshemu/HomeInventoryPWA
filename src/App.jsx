import React, { useState, useEffect } from 'react';
import { DatabaseService } from './services/database';
import { PWAService } from './services/pwa';
import { debounce, showNotification } from './utils/helpers';
import ItemCard from './components/ItemCard';
import ItemForm from './components/ItemForm';
import DataManager from './components/DataManager';
import LocationManager from './components/LocationManager';

function App() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDataManager, setShowDataManager] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLocationManager, setShowLocationManager] = useState(false);

  // 初始化PWA
  useEffect(() => {
    PWAService.init();
  }, []);

  // 加载数据
  const loadData = async () => {
    try {
      const [allItems, allCategories] = await Promise.all([
        DatabaseService.getAllItems(),
        DatabaseService.getAllCategories()
      ]);
      setItems(allItems);
      setCategories(allCategories);
    } catch (error) {
      showNotification('加载数据失败: ' + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 搜索和过滤
  const debouncedSearch = debounce(async (query) => {
    if (!query.trim()) {
      setFilteredItems(items);
      return;
    }

    try {
      const results = await DatabaseService.searchItems(query);
      setFilteredItems(results);
    } catch (error) {
      showNotification('搜索失败: ' + error.message, 'error');
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, items]);

  // 按分类过滤
  useEffect(() => {
    if (!selectedCategory) {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item => item.category === selectedCategory);
      setFilteredItems(filtered);
    }
  }, [selectedCategory, items]);

  // 添加物品
  const handleAddItem = async (itemData) => {
    try {
      const newItem = await DatabaseService.addItem(itemData);
      setItems(prev => [newItem, ...prev]);
      setShowForm(false);
      
      // 更新分类列表
      if (itemData.category && !categories.includes(itemData.category)) {
        setCategories(prev => [...prev, itemData.category].sort());
      }
    } catch (error) {
      throw error;
    }
  };

  // 编辑物品
  const handleEditItem = async (itemData) => {
    try {
      const updatedItem = await DatabaseService.updateItem(editingItem.id, itemData);
      setItems(prev => prev.map(item => 
        item.id === editingItem.id ? updatedItem : item
      ));
      setEditingItem(null);
      setShowForm(false);
      
      // 更新分类列表
      if (itemData.category && !categories.includes(itemData.category)) {
        setCategories(prev => [...prev, itemData.category].sort());
      }
    } catch (error) {
      throw error;
    }
  };

  // 删除物品
  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('确定要删除这个物品吗？')) {
      return;
    }

    try {
      await DatabaseService.deleteItem(itemId);
      setItems(prev => prev.filter(item => item.id !== itemId));
      showNotification('物品删除成功', 'success');
    } catch (error) {
      showNotification('删除失败: ' + error.message, 'error');
    }
  };

  // 保存物品（添加或编辑）
  const handleSaveItem = async (itemData) => {
    if (editingItem) {
      await handleEditItem(itemData);
    } else {
      await handleAddItem(itemData);
    }
  };

  // 打开编辑表单
  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  // 关闭表单
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  // 数据变化回调
  const handleDataChange = () => {
    loadData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">🏠 家庭物品跟踪</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDataManager(!showDataManager)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="数据管理"
              >
                ⚙️
              </button>
              <button
                onClick={() => setShowLocationManager(!showLocationManager)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="位置管理"
              >
                📍
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="添加物品"
              >
                ➕
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-4">
        {/* 数据管理器 */}
        {showDataManager && (
          <DataManager onDataChange={handleDataChange} />
        )}

        {/* 位置管理器 */}
        {showLocationManager && (
          <LocationManager onClose={() => setShowLocationManager(false)} />
        )}

        {/* 搜索栏 */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索物品..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
        </div>

        {/* 分类过滤器 */}
        {categories.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === '' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                全部
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedCategory === category 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 物品表单内嵌卡片，始终显示在物品列表之前 */}
        {showForm && (
          <div className="max-w-md mx-auto my-6">
            <ItemForm
              item={editingItem}
              onSave={handleSaveItem}
              onCancel={handleCloseForm}
              categories={categories}
              show={true}
              onClose={handleCloseForm}
            />
          </div>
        )}

        {/* 物品列表 */}
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                {searchQuery || selectedCategory ? '没有找到相关物品' : '还没有物品'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || selectedCategory 
                  ? '尝试调整搜索条件或分类筛选' 
                  : '点击右上角的 ➕ 按钮添加第一个物品'
                }
              </p>
              {!searchQuery && !selectedCategory && (
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  添加物品
                </button>
              )}
            </div>
          ) : (
            filteredItems.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDeleteItem}
              />
            ))
          )}
        </div>

        {/* 统计信息 */}
        {items.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500">
            共 {items.length} 个物品
            {searchQuery && `，搜索到 ${filteredItems.length} 个结果`}
            {selectedCategory && `，分类 "${selectedCategory}" 下 ${filteredItems.length} 个物品`}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
