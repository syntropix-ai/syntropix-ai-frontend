import React, { useCallback, useEffect } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
} from "@xyflow/react";
import BiDirectionalEdge from "./BiDirectionalEdge";
import dagre from "dagre";

import "@xyflow/react/dist/base.css";
import ToolBlock from "./ToolBlock";
import InputBlock from "./InputBlock";
import AgentBlock from "./AgentBlock";

const nodeTypes = {
  custom: InputBlock,
  agent: AgentBlock,
  tool: ToolBlock,
};

// 添加自定义边类型
const edgeTypes = {
  bidirectional: BiDirectionalEdge,
};

// 初始节点数据
const initialNodes = [
  {
    id: "1",
    type: "custom",
    position: { x: 50, y: 200 },
    data: { label: "Input Node" },
  },
  {
    id: "2",
    type: "agent",
    position: { x: 300, y: 200 },
    data: {
      name: "Agent 1",
      description: "这是一个示例 Agent",
      systemMessage: "你是一个助手",
      modelName: "gpt-4",
    },
  },
  {
    id: "3",
    type: "tool",
    position: { x: 600, y: 200 },
    data: {
      name: "搜索工具",
      description: "用于网络搜索的工具",
      type: "search_tool",
      args: {
        api_key: "",
        max_results: "10",
        language: "zh",
      },
    },
  },
  {
    id: "4",
    type: "tool",
    position: { x: 600, y: 400 },
    data: {
      name: "计算器工具",
      description: "用于执行数学计算的工具",
      type: "calculator_tool",
      args: {
        precision: "2",
        allow_complex: "false",
      },
    },
  },
];

// 初始边数据
const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "default",
    style: { stroke: "#2563eb", strokeWidth: 2 },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    type: "bidirectional",
    data: { animation: "backward" },
  },
  {
    id: "e2-4",
    source: "2",
    target: "4",
    type: "bidirectional",
    data: { animation: "backward" },
  },
];

// 添加布局函数 (在 Flow 组件外)
const getLayoutedElements = (nodes, edges, direction = "LR") => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 300,
    ranksep: 300,
    align: "UL", // 左对齐
    marginx: 50,
    marginy: 50,
  });

  nodes.forEach((node) => {
    const width = 250;
    const height = 200;
    dagreGraph.setNode(node.id, { width, height });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  // 找到最左侧节点的 x 坐标
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    minX = Math.min(minX, nodeWithPosition.x);
    minY = Math.min(minY, nodeWithPosition.y);
    maxY = Math.max(maxY, nodeWithPosition.y);
  });

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        // x 坐标减去最左侧节点的位置，再加上左边距
        x: nodeWithPosition.x - minX + 50, // 50是左边距
        // y 坐标居中
        y: nodeWithPosition.y - (maxY + minY) / 2 + 400,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

const Flow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  // 添加删除节点的处理函数
  const handleDelete = useCallback(
    (id) => {
      setNodes((nodes) => nodes.filter((node) => node.id !== id));
      setEdges((edges) =>
        edges.filter((edge) => edge.source !== id && edge.target !== id)
      );
    },
    [setNodes, setEdges]
  );

  // 添加设置节点的处理函数
  const handleSettings = useCallback((id) => {
    console.log("Open settings for node:", id);
    // 这里可以添加打开设置面板的逻辑
  }, []);

  // 添加自动布局按钮的处理函数
  const onLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges
    );
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
  }, [nodes, edges]);

  useEffect(() => {
    onLayout();
  }, []); // 仅在组件挂载时执行一次

  return (
    <div className="w-full h-[800px]">
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={onLayout}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          自动布局
        </button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
        // fitView
        fitViewOptions={{
          padding: 0.2,
          minZoom: 0.5,
          maxZoom: 1.5,
        }}
        className="bg-teal-50"
      >
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default Flow;
