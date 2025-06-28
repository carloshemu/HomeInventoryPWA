import React from 'react';
import { formatDate } from '../utils/helpers';

const ItemCard = ({ item, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm px-4 py-4 border border-gray-100 hover:shadow-md transition-all flex items-start justify-between gap-4 overflow-hidden">
      {/* 左侧内容 */}
      <div className="flex-1 space-y-2">
        {/* 名称与分类 */}
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-lg font-semibold text-gray-900 break-all">{item.name}</h3>
          {item.category && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
              {item.category}
            </span>
          )}
        </div>
        {/* 位置 */}
        {item.location && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-gray-400">📍</span>
            <span className="break-all">
              {typeof item.location === 'object'
                ? `${item.location.area || ''}${item.location.area && item.location.place ? ' - ' : ''}${item.location.place || ''}`
                : item.location}
            </span>
          </div>
        )}
        {/* 备注 */}
        {item.note && (
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <span className="text-gray-400 mt-0.5">📝</span>
            <span className="line-clamp-2 break-all">{item.note}</span>
          </div>
        )}
        {/* 图片 */}
        {item.photoUrl && (
          <div>
            <img
              src={item.photoUrl}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-lg border"
            />
          </div>
        )}
        {/* 时间 */}
        <div className="text-xs text-gray-400 pt-1">
          创建于: {formatDate(item.createdAt)}
          {item.updatedAt && item.updatedAt !== item.createdAt && (
            <span className="ml-2">更新于: {formatDate(item.updatedAt)}</span>
          )}
        </div>
      </div>
      {/* 操作按钮 */}
      <div className="flex flex-col justify-start gap-2 min-w-[44px] pr-1">
        <button
          onClick={() => onEdit(item)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          title="编辑"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
          title="删除"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
