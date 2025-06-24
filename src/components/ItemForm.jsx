import React, { useState, useEffect } from 'react';
import { fileUtils, showNotification } from '../utils/helpers';

const ItemForm = ({ item, onSave, onCancel, categories = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    category: '',
    note: '',
    photoUrl: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        location: item.location || '',
        category: item.category || '',
        note: item.note || '',
        photoUrl: item.photoUrl || ''
      });
    }
  }, [item]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '物品名称不能为空';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = '存放位置不能为空';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotification('请选择图片文件', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB限制
      showNotification('图片大小不能超过5MB', 'error');
      return;
    }

    setIsLoading(true);
    try {
      // 压缩图片
      const compressedBlob = await fileUtils.compressImage(file);
      const base64 = await fileUtils.fileToBase64(compressedBlob);
      
      setFormData(prev => ({
        ...prev,
        photoUrl: base64
      }));
      
      showNotification('图片上传成功', 'success');
    } catch (error) {
      showNotification('图片处理失败', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      await onSave(formData);
      showNotification(item ? '物品更新成功' : '物品添加成功', 'success');
    } catch (error) {
      showNotification(error.message || '操作失败', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      photoUrl: ''
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {item ? '编辑物品' : '添加物品'}
          </h2>
          <div className="space-y-4">
            {/* 物品名称 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                物品名称 *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="请输入物品名称"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* 存放位置 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                存放位置 *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="例如：客厅抽屉、卧室衣柜"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>

            {/* 分类 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                分类
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入分类名称"
                  list="categories"
                />
                <datalist id="categories">
                  {categories.map(cat => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* 备注 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                备注
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="添加备注信息..."
              />
            </div>

            {/* 图片上传 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                图片
              </label>
              <div className="space-y-2">
                {formData.photoUrl ? (
                  <div className="relative">
                    <img
                      src={formData.photoUrl}
                      alt="预览"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={isLoading}
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer text-blue-600 hover:text-blue-700"
                    >
                      {isLoading ? '处理中...' : '📷 拍照或选择图片'}
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* 按钮组 */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? '保存中...' : (item ? '更新' : '添加')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemForm; 