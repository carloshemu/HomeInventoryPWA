import React from 'react';
import { formatDate } from '../utils/helpers';

const ItemCard = ({ item, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
            {item.category && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {item.category}
              </span>
            )}
          </div>
          
          <div className="text-gray-600 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">📍</span>
              <span>{
                item.location && typeof item.location === 'object'
                  ? `${item.location.area || ''}${item.location.area && item.location.place ? '-' : ''}${item.location.place || ''}`
                  : item.location || ''
              }</span>
            </div>
          </div>
          
          {item.note && (
            <div className="text-gray-600 mb-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-gray-500 mt-0.5">📝</span>
                <span className="line-clamp-2">{item.note}</span>
              </div>
            </div>
          )}
          
          {item.photoUrl && (
            <div className="mb-3">
              <img 
                src={item.photoUrl} 
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg border"
              />
            </div>
          )}
          
          <div className="text-xs text-gray-400">
            创建于: {formatDate(item.createdAt)}
            {item.updatedAt && item.updatedAt !== item.createdAt && (
              <span className="ml-2">更新于: {formatDate(item.updatedAt)}</span>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-2 ml-4">
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="编辑"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="删除"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard; 