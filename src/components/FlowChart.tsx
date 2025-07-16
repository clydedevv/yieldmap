'use client';

import React, { useCallback } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CategoryNode, Strategy } from '@/types/strategy';

interface CustomNodeData {
  label: string;
  category?: string;
  subcategory?: string;
  strategies?: Strategy[];
  onClick?: () => void;
}

const CustomNode = ({ data }: { data: CustomNodeData }) => {
  return (
    <div className="px-6 py-4 bg-white border-2 border-slate-200 rounded-xl min-w-[180px] text-center hover-lift-btc transition-all duration-200 hover:border-orange-400 hover:shadow-lg cursor-pointer">
      <Handle type="target" position={Position.Top} />
      <div 
        className="text-sm font-bold text-slate-900 hover:text-orange-600 transition-colors"
        onClick={data.onClick}
      >
        {data.label}
      </div>
      {data.strategies && data.strategies.length > 0 && (
        <div className="text-xs text-slate-700 mt-2 bg-orange-50 px-2 py-1 rounded-full font-semibold">
          {data.strategies.length} strategies
        </div>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

interface FlowChartProps {
  onNodeClick: (category?: string, subcategory?: string, strategies?: Strategy[]) => void;
  categoryNodes: CategoryNode[];
  allStrategies: Strategy[];
}

export default function FlowChart({ onNodeClick, categoryNodes, allStrategies }: FlowChartProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const initializeRootNodes = useCallback(() => {
    const rootNode: Node = {
      id: 'root',
      type: 'custom',
      position: { x: 400, y: 50 },
      data: { 
        label: 'BTC Yield Explorer',
        onClick: () => {
          // Will be handled in component
        }
      },
    };

    const categoryNodesList: Node[] = categoryNodes.map((cat, index) => ({
      id: cat.id,
      type: 'custom',
      position: { x: 100 + (index * 200), y: 200 },
      data: { 
        label: cat.label,
        category: cat.category,
        onClick: () => handleCategoryClick(cat)
      },
    }));

    const categoryEdges: Edge[] = categoryNodes.map((cat) => ({
      id: `root-${cat.id}`,
      source: 'root',
      target: cat.id,
      animated: true,
      style: { stroke: '#f7931a', strokeWidth: 2 },
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setNodes([rootNode, ...categoryNodesList] as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setEdges(categoryEdges as any);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCategoryClick = (category: CategoryNode) => {
    if (category.children && category.children.length > 0) {
      
      const categoryNode: Node = {
        id: category.id,
        type: 'custom',
        position: { x: 400, y: 50 },
        data: { 
          label: category.label,
          onClick: () => initializeRootNodes()
        },
      };

      const subcategoryNodes: Node[] = category.children.map((sub, index) => ({
        id: `${category.id}-${sub.id}`,
        type: 'custom',
        position: { x: 100 + (index * 200), y: 200 },
        data: { 
          label: sub.label,
          subcategory: sub.subcategory,
          strategies: sub.strategies,
          onClick: () => handleSubcategoryClick(category.category, sub.subcategory, sub.strategies)
        },
      }));

      const subcategoryEdges: Edge[] = category.children.map((sub) => ({
        id: `${category.id}-${sub.id}`,
        source: category.id,
        target: `${category.id}-${sub.id}`,
        animated: true,
        style: { stroke: '#f7931a', strokeWidth: 2 },
      }));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setNodes([categoryNode, ...subcategoryNodes] as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setEdges(subcategoryEdges as any);
    } else {
      const categoryStrategies = allStrategies.filter(s => s.category === category.category);
      onNodeClick(category.category, undefined, categoryStrategies);
    }
  };

  const handleSubcategoryClick = (category: string, subcategory: string, strategies: Strategy[]) => {
    onNodeClick(category, subcategory, strategies);
  };

  React.useEffect(() => {
    initializeRootNodes();
  }, [initializeRootNodes]);

  const onConnect = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (params: Edge | Connection) => setEdges((eds: any) => addEdge(params, eds) as any),
    [setEdges]
  );

  return (
    <div className="w-full h-96 border-2 border-orange-200 rounded-2xl overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gradient-to-br from-orange-50 to-amber-50"
        proOptions={{ hideAttribution: true }}
      >
        <Controls className="bg-white/90 backdrop-blur-sm rounded-lg border border-orange-200" />
        <Background color="#f7931a" gap={20} size={1} />
      </ReactFlow>
    </div>
  );
}