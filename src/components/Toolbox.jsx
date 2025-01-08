import React from 'react';
import { Battery, Wind, Database, Server, Cloud, Cpu, Gauge, Settings } from 'lucide-react';

const tools = [
  { type: 'turbine', icon: Wind, label: 'Wind Turbine' },
  { type: 'battery', icon: Battery, label: 'Battery Storage' },
  { type: 'storage', icon: Database, label: 'Data Storage' },
  { type: 'server', icon: Server, label: 'Server' },
  { type: 'cloud', icon: Cloud, label: 'Cloud Service' },
  { type: 'processor', icon: Cpu, label: 'Processor' },
  { type: 'meter', icon: Gauge, label: 'Smart Meter' },
  { type: 'controller', icon: Settings, label: 'Controller' }
];

const Toolbox = ({ onDragStart }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Devices</h2>
      <div className="space-y-3">
        {tools.map(({ type, icon: Icon, label }) => (
          <div
            key={type}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', type);
              onDragStart(type);
            }}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-md cursor-move hover:bg-gray-100 transition-colors"
          >
            <Icon className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Toolbox;