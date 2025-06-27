import React, { useState, useEffect, useRef } from 'react';
import { LocationService } from '../services/database';
import { showNotification } from '../utils/helpers';

const LocationManager = ({ onClose }) => {
  const [locations, setLocations] = useState([]);
  const [area, setArea] = useState('');
  const [place, setPlace] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef();

  const loadLocations = async () => {
    setLocations(await LocationService.getAllLocations());
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const handleAdd = async () => {
    if (!area.trim() || !place.trim()) {
      showNotification('请填写完整的区域和位置', 'error');
      return;
    }
    try {
      await LocationService.addLocation({ area, place });
      setArea('');
      setPlace('');
      await loadLocations();
      showNotification('位置添加成功', 'success');
    } catch (e) {
      showNotification(e.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('确定要删除该位置吗？')) return;
    await LocationService.deleteLocation(id);
    await loadLocations();
    showNotification('位置已删除', 'success');
  };

  const handleExport = async () => {
    const json = await LocationService.exportLocations();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'locations.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('导出成功', 'success');
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsImporting(true);
    try {
      const text = await file.text();
      await LocationService.importLocations(text);
      await loadLocations();
      showNotification('导入成功', 'success');
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setIsImporting(false);
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">位置管理</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-2xl font-bold px-2" aria-label="关闭">×</button>
      </div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="区域（如：地下室）"
          value={area}
          onChange={e => setArea(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="位置（如：铁架子）"
          value={place}
          onChange={e => setPlace(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">添加</button>
      </div>
      <div className="mb-4 flex gap-2">
        <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">导出</button>
        <input
          type="file"
          accept="application/json"
          ref={fileInputRef}
          onChange={handleImport}
          className="hidden"
          id="import-locations"
          disabled={isImporting}
        />
        <label htmlFor="import-locations" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">导入</label>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="px-2 py-1 text-left">区域</th>
              <th className="px-2 py-1 text-left">位置</th>
              <th className="px-2 py-1"></th>
            </tr>
          </thead>
          <tbody>
            {locations.map(loc => (
              <tr key={loc.id}>
                <td className="px-2 py-1">{loc.area}</td>
                <td className="px-2 py-1">{loc.place}</td>
                <td className="px-2 py-1">
                  <button onClick={() => handleDelete(loc.id)} className="text-red-500 hover:underline">删除</button>
                </td>
              </tr>
            ))}
            {locations.length === 0 && (
              <tr><td colSpan={3} className="text-center text-gray-400 py-4">暂无位置</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LocationManager; 