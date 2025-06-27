import Dexie from 'dexie';
import { uuidv4 } from '../utils/helpers';

// 创建数据库实例
const db = new Dexie('HomeInventoryDB');

// 定义数据库结构
db.version(1).stores({
  items: 'id, name, location, category, createdAt, updatedAt'
});

// 新增 locations 表
// 位置数据模型
export class Location {
  constructor(data = {}) {
    this.id = data.id || uuidv4();
    this.area = data.area || '';
    this.place = data.place || '';
  }
}

db.version(2).stores({
  locations: 'id, area, place'
});

// 物品数据模型
export class Item {
  constructor(data = {}) {
    this.id = data.id || uuidv4();
    this.name = data.name || '';
    // location支持对象格式，兼容老数据
    if (typeof data.location === 'object' && data.location !== null) {
      this.location = {
        area: data.location.area || '',
        place: data.location.place || ''
      };
    } else {
      this.location = { area: '', place: '' };
    }
    this.category = data.category || '';
    this.note = data.note || '';
    this.photoUrl = data.photoUrl || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// 数据库操作类
export class DatabaseService {
  // 添加物品
  static async addItem(itemData) {
    const item = new Item(itemData);
    await db.items.add(item);
    return item;
  }

  // 获取所有物品
  static async getAllItems() {
    return await db.items.orderBy('createdAt').reverse().toArray();
  }

  // 根据ID获取物品
  static async getItemById(id) {
    return await db.items.get(id);
  }

  // 更新物品
  static async updateItem(id, updates) {
    const item = await db.items.get(id);
    if (!item) {
      throw new Error('物品不存在');
    }
    
    const updatedItem = {
      ...item,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await db.items.put(updatedItem);
    return updatedItem;
  }

  // 删除物品
  static async deleteItem(id) {
    await db.items.delete(id);
  }

  // 搜索物品
  static async searchItems(query) {
    const items = await this.getAllItems();
    const lowerQuery = query.toLowerCase();
    
    return items.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) ||
      item.location.area.toLowerCase().includes(lowerQuery) ||
      item.location.place.toLowerCase().includes(lowerQuery) ||
      (item.note && item.note.toLowerCase().includes(lowerQuery)) ||
      (item.category && item.category.toLowerCase().includes(lowerQuery))
    );
  }

  // 按分类获取物品
  static async getItemsByCategory(category) {
    return await db.items.where('category').equals(category).toArray();
  }

  // 获取所有分类
  static async getAllCategories() {
    const items = await this.getAllItems();
    const categories = [...new Set(items.map(item => item.category).filter(Boolean))];
    return categories.sort();
  }

  // 导出所有数据
  static async exportData() {
    const items = await this.getAllItems();
    return JSON.stringify(items, null, 2);
  }

  // 导入数据
  static async importData(jsonData) {
    try {
      const items = JSON.parse(jsonData);
      if (!Array.isArray(items)) {
        throw new Error('数据格式错误');
      }
      
      // 清空现有数据
      await db.items.clear();
      
      // 导入新数据
      for (const itemData of items) {
        const item = new Item(itemData);
        await db.items.add(item);
      }
      
      return true;
    } catch (error) {
      throw new Error('导入数据失败: ' + error.message);
    }
  }

  // 清空所有数据
  static async clearAllData() {
    await db.items.clear();
  }
}

// 位置数据库操作
export class LocationService {
  // 获取所有位置
  static async getAllLocations() {
    return await db.locations.toArray();
  }
  // 新增位置
  static async addLocation(locationData) {
    const location = new Location(locationData);
    await db.locations.add(location);
    return location;
  }
  // 删除位置
  static async deleteLocation(id) {
    await db.locations.delete(id);
  }
  // 导出位置数据
  static async exportLocations() {
    const locations = await this.getAllLocations();
    return JSON.stringify(locations, null, 2);
  }
  // 导入位置数据
  static async importLocations(jsonData) {
    try {
      const locations = JSON.parse(jsonData);
      if (!Array.isArray(locations)) throw new Error('数据格式错误');
      await db.locations.clear();
      for (const loc of locations) {
        const location = new Location(loc);
        await db.locations.add(location);
      }
      return true;
    } catch (e) {
      throw new Error('导入位置数据失败: ' + e.message);
    }
  }
}

export default db; 