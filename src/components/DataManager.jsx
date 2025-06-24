import React, { useState } from 'react';
import { fileUtils, showNotification } from '../utils/helpers';
import { DatabaseService } from '../services/database';

const DataManager = ({ onDataChange }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = await DatabaseService.exportData();
      const filename = `home-inventory-${new Date().toISOString().split('T')[0]}.json`;
      fileUtils.downloadJSON(data, filename);
      showNotification('数据导出成功', 'success');
    } catch (error) {
      showNotification('数据导出失败: ' + error.message, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      showNotification('请选择JSON文件', 'error');
      return;
    }

    setIsImporting(true);
    try {
      const data = await fileUtils.readJSONFile(file);
      await DatabaseService.importData(JSON.stringify(data));
      showNotification('数据导入成功', 'success');
      onDataChange(); // 通知父组件数据已更新
    } catch (error) {
      showNotification('数据导入失败: ' + error.message, 'error');
    } finally {
      setIsImporting(false);
      // 清空文件输入
      e.target.value = '';
    }
  };

  const handleClearData = async () => {
    if (!window.confirm('确定要清空所有数据吗？此操作不可恢复！')) {
      return;
    }

    try {
      await DatabaseService.clearAllData();
      showNotification('数据已清空', 'success');
      onDataChange(); // 通知父组件数据已更新
    } catch (error) {
      showNotification('清空数据失败: ' + error.message, 'error');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-semibold mb-3">数据管理</h3>
      
      <div className="space-y-3">
        {/* 导出数据 */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-700">导出数据</h4>
            <p className="text-sm text-gray-500">将当前所有数据导出为JSON文件</p>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isExporting ? '导出中...' : '📤 导出'}
          </button>
        </div>

        {/* 导入数据 */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-700">导入数据</h4>
            <p className="text-sm text-gray-500">从JSON文件导入数据（将覆盖现有数据）</p>
          </div>
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              id="import-file"
              disabled={isImporting}
            />
            <label
              htmlFor="import-file"
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 ${
                isImporting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isImporting ? '导入中...' : '📥 导入'}
            </label>
          </div>
        </div>

        {/* 清空数据 */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-700">清空数据</h4>
            <p className="text-sm text-gray-500">删除所有物品数据（不可恢复）</p>
          </div>
          <button
            onClick={handleClearData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            🗑️ 清空
          </button>
        </div>
      </div>

      {/* 使用说明 */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-2">使用说明</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 导出功能会将所有数据保存为JSON文件</li>
          <li>• 导入功能会覆盖现有数据，请谨慎操作</li>
          <li>• 建议定期导出数据作为备份</li>
          <li>• 数据仅保存在本地，不会上传到服务器</li>
        </ul>
      </div>
    </div>
  );
};

export default DataManager; 