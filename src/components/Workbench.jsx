import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Battery, Wind, Database, Server, Cloud, Cpu, Gauge, Settings, Trash2 } from 'lucide-react';
import { nodeTypes } from './CustomNodes';

const getIcon = (type) => {
  const icons = {
    turbine: Wind,
    battery: Battery,
    storage: Database,
    server: Server,
    cloud: Cloud,
    processor: Cpu,
    meter: Gauge,
    controller: Settings,
  };
  return icons[type] || Wind;
};

const Workbench = ({ objects, onObjectDrop }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [clickedNodeIds, setClickedNodeIds] = useState(new Set()); // State to track clicked nodes

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: '#000', strokeWidth: 2 },
          },
          eds
        )
      ),
    [setEdges]
  );

  const onDrop = (event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('text/plain');
    const { left, top } = event.currentTarget.getBoundingClientRect();
    const position = {
      x: event.clientX - left - 75,
      y: event.clientY - top - 25,
    };

    const newNode = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      position,
      data: {
        icon: getIcon(type),
        label: type.charAt(0).toUpperCase() + type.slice(1),
      },
    };

    setNodes((nds) => [...nds, newNode]);
    onObjectDrop(type, position);
  };

  // Function to handle node click and toggle remove icon display
  const onNodeClick = (event, node) => {
    event.stopPropagation();
    setClickedNodeIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(node.id)) {
        newSet.delete(node.id);
      } else {
        newSet.add(node.id);
      }
      return newSet;
    });
  };

  // Function to handle node removal
  const removeNode = (nodeId) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setClickedNodeIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(nodeId);
      return newSet;
    });
  };

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes.map((node) => ({
          ...node,
          data: {
            ...node.data,
            label: (
              <div className="relative">
                {node.data.label}
                {clickedNodeIds.has(node.id) && (
                  <div className="absolute -top-3 -right-3">
                    <div className="group relative cursor-pointer" onClick={(event) => {
                      event.stopPropagation();
                      removeNode(node.id);
                    }}>
                      <Trash2 size={12} className="text-red-500" />
                      <div className="absolute hidden group-hover:flex flex-col items-center -top-6 -right-6">
                        <span className="text-xs bg-gray-500 text-white py-1 px-2 rounded-md shadow-lg">
                          Remove
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ),
          },
        }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onDrop={onDrop}
        onDragOver={(event) => event.preventDefault()}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#93c5fd', strokeWidth: 2 },
        }}
      >
        <Background color="#cbd5e1" gap={16} />
        <Controls />
        <MiniMap
          nodeColor="#e2e8f0"
          maskColor="rgba(0, 0, 0, 0.1)"
          className="bg-white rounded-lg shadow-lg"
        />
      </ReactFlow>
    </div>
  );
};

export default Workbench;
