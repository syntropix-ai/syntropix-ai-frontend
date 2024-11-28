import React, { useCallback, useEffect, useState } from "react";
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
];

// 初始边数据
const initialEdges = [];

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

  // 修改连线处理函数
  const onConnect = useCallback(
    (params) => {
      // 获取源节点和目标节点的类型
      const sourceNode = nodes.find((node) => node.id === params.source);
      const targetNode = nodes.find((node) => node.id === params.target);

      console.log("Source node:", sourceNode); // 添加调试日志
      console.log("Target node:", targetNode); // 添加调试日志

      // 检查 input node 的连接限制
      if (sourceNode?.type === "custom") {
        // input 只能作为源节点连接到 agent
        if (targetNode?.type !== "agent") {
          console.warn("Input node can only connect to agent nodes");
          return;
        }

        // 检查是否已经存在连接
        const existingInputEdges = edges.filter(
          (edge) => edge.source === sourceNode.id
        );
        if (existingInputEdges.length > 0) {
          console.warn("Input node can only connect to one agent");
          return;
        }
      }

      // 检查是否需要双向连线
      const needsBidirectional =
        (sourceNode?.type === "agent" && targetNode?.type === "agent") ||
        (sourceNode?.type === "agent" && targetNode?.type === "tool") ||
        (sourceNode?.type === "tool" && targetNode?.type === "agent");

      // 创建新的边
      const newEdge = {
        ...params,
        id: `e${params.source}-${params.target}`,
        type: needsBidirectional ? "bidirectional" : "default",
        style: { stroke: "#2563eb", strokeWidth: 2 },
        data: needsBidirectional ? { animation: "backward" } : {},
      };

      setEdges((eds) => addEdge(newEdge, eds));
    },
    [nodes, edges]
  );

  // 添加删除节点的处理函数
  const handleDelete = (id) => {
    console.log("Delete node:", id);
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) =>
      edges.filter((edge) => edge.source !== id && edge.target !== id)
    );
  };

  // 添加设置节点的处理函数
  const handleSettings = useCallback((id) => {
    console.log("Open settings for node:", id);
    // 这里可以添加打开设置面板的逻辑
  }, []);

  // 修改 onLayout，添加正确的依赖项
  const onLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges
    );
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
  }, [nodes, edges, setNodes, setEdges]); // 添加所有必要的依赖项

  // 修改 useEffect，移除自动布局
  useEffect(() => {
    // 仅在首次加载时执行一次布局
    const timer = setTimeout(() => {
      onLayout();
    }, 100);
    return () => clearTimeout(timer);
  }, []); // 仅在组件挂载时执行

  // 添加节点计数器 state
  const [nodeCount, setNodeCount] = useState({
    agent: initialNodes.filter((n) => n.type === "agent").length,
    tool: initialNodes.filter((n) => n.type === "tool").length,
  });

  // 修改添加节点函数，移除自动布局
  const addAgentNode = useCallback(() => {
    const newNode = {
      id: `agent-${nodeCount.agent + 1}`,
      type: "agent",
      position: { x: Math.random() * 500, y: Math.random() * 500 }, // 随机位置

      data: {
        name: `Agent ${nodeCount.agent + 1}`,
        description: "新建 Agent",
        systemMessage: "",
        modelName: "gpt-4",
        onDelete: handleDelete,
      },
    };

    setNodes((nodes) => [...nodes, newNode]);
    setNodeCount((prev) => ({ ...prev, agent: prev.agent + 1 }));
  }, [nodeCount, setNodes, handleDelete]);

  const addToolNode = useCallback(() => {
    const newNode = {
      id: `tool-${nodeCount.tool + 1}`,
      type: "tool",
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: {
        name: `工具 ${nodeCount.tool + 1}`,
        description: "工具",
        type: "custom_tool",
        args: {},
        onDelete: handleDelete,
        onSettings: handleSettings,
      },
    };

    setNodes((nodes) => [...nodes, newNode]);
    setNodeCount((prev) => ({ ...prev, tool: prev.tool + 1 }));
  }, [nodeCount, setNodes, handleDelete, handleSettings]);

  return (
    <div className="w-full h-screen">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {/* <button
          onClick={onLayout}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          布局
        </button> */}
        <button
          onClick={addAgentNode}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Agent
        </button>
        <button
          onClick={addToolNode}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          工具
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
