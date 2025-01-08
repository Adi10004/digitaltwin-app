import React from 'react';
import { Handle, Position } from 'reactflow';

const CustomNode = ({ data }) => {
  const Icon = data.icon;
  return (
    <div className="bg-white p-4 rounded-lg shadow-md relative group">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 !bg-blue-400 group-hover:!bg-blue-500" 
      />
      <div className="flex flex-col items-center gap-2">
        <Icon className="w-6 h-6 text-gray-600" />
        <span className="text-xs font-medium text-gray-500">{data.label}</span>
      </div>
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 !bg-blue-400 group-hover:!bg-blue-500" 
      />
    </div>
  );
};

export const nodeTypes = {
  turbine: CustomNode,
  battery: CustomNode,
  storage: CustomNode,
  server: CustomNode,
  cloud: CustomNode,
  processor: CustomNode,
  meter: CustomNode,
  controller: CustomNode,
};