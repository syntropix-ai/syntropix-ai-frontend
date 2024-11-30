import React, { forwardRef, useImperativeHandle, useCallback, useEffect, useState, useRef } from 'react';
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
import { getNodeStatusUpdates, getEdgeStatusUpdates } from "./EventHandler";

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
const getLayoutedElements = (nodes, edges, direction = "TB") => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 100,
    ranksep: 200,
    marginx: 20,
    marginy: 20,
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

  // 获取布局后的图形尺寸
  const graphWidth = dagreGraph.graph().width;
  const graphHeight = dagreGraph.graph().height;

  // 计算偏移量，使图形居中
  const xOffset = (window.innerWidth - graphWidth) / 2;
  const yOffset = 50; // 根据需要调整垂直偏移量

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x + xOffset,
        y: nodeWithPosition.y + yOffset,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};


const Flow = forwardRef((props, ref) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeCount, setNodeCount] = useState({
    agent: initialNodes.filter((n) => n.type === "agent").length,
    tool: initialNodes.filter((n) => n.type === "tool").length,
  });

  // 添加动画定时器状态
  const animationTimers = useRef(new Map());

  // 直接定义函数，不使用 useCallback
  const addAgentNode = ({name, description, systemMessage, modelName} = {}) => {
    const newNode = {
      id: `agent-${nodeCount.agent + 1}`,
      type: "agent",
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: {
        type: "synthora.agents.VanillaAgent",
        name: name || `Agent${nodeCount.agent + 1}`,
        description: description || "Agent",
        systemMessage: systemMessage || "You are a helpful assistant.",
        modelName: modelName || "gpt-4",
        status: "idle",
        onDelete: handleDelete,
      },
    };

    setNodes((nodes) => [...nodes, newNode]);
    setNodeCount((prev) => ({ ...prev, agent: prev.agent + 1 }));
  };

  const addToolNode = ({name, description, args} = {}) => {
    const newNode = {
      id: `tool-${nodeCount.tool + 1}`,
      type: "tool",
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: {
        name: name || `Tool${nodeCount.tool + 1}`,
        description: description || "Tool",
        type: "synthora.toolkits.SearchToolkit",
        args: args || {},
        onDelete: handleDelete,
        onSettings: handleSettings,
      },
    };

    setNodes((nodes) => [...nodes, newNode]);
    setNodeCount((prev) => ({ ...prev, tool: prev.tool + 1 }));
  };

  const onLayout = () => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges
    );
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
  };

  const resetNodeStatuses = () => {
    setNodes((nds) => 
      nds.map((node) => {
        node.data.status = "idle";
        return {...node, data: {...node.data, status: "idle"}}
      })
    );
  }
  const updateNodeStatuses = useCallback((event) => {
    const nodeUpdates = getNodeStatusUpdates(event, nodes);
    const edgeUpdates = getEdgeStatusUpdates(event, nodes, edges);
    
    // 清除相关边的已有定时器
    edgeUpdates.forEach((_, edgeId) => {
      if (animationTimers.current.has(edgeId)) {
        clearTimeout(animationTimers.current.get(edgeId));
        animationTimers.current.delete(edgeId);
      }
    });

    setNodes((nds) => 
      nds.map((node) => {
        if (nodeUpdates.has(node.id)) {
          return {
            ...node,
            data: {
              ...node.data,
              status: nodeUpdates.get(node.id),
            },
          };
        }
        return node;
      })
    );

    setEdges((eds) =>
      eds.map((edge) => {
        if (edgeUpdates.has(edge.id)) {
          const newAnimation = edgeUpdates.get(edge.id);
          
          // 如果是 backward 动画，设置3秒后重置
          if (newAnimation === 'backward') {
            const timer = setTimeout(() => {
              setEdges(currentEdges => 
                currentEdges.map(e => 
                  e.id === edge.id 
                    ? { ...e, data: { ...e.data, animation: 'none' } }
                    : e
                )
              );
            }, 3000);
            animationTimers.current.set(edge.id, timer);
          }
          
          return {
            ...edge,
            data: {
              ...edge.data,
              animation: newAnimation,
            },
          };
        }
        return edge;
      })
    );
  }, [nodes, edges]);

  // 修改 useImperativeHandle，暴露 nodes 和 edges
  useImperativeHandle(ref, () => ({
    addAgentNode,
    addToolNode,
    onLayout,
    nodes,
    edges,
    updateNodeStatuses,
    resetNodeStatuses
  }));

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
        data: needsBidirectional ? { animation: "none" } : {},
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

  // 修改 useEffect，移除自动布局
  useEffect(() => {
    // 仅在首次加载时执行一次布局
    const timer = setTimeout(() => {
      onLayout();
    }, 100);
    return () => clearTimeout(timer);
  }, []); // 仅在组件挂载时执行

  // 清理定时器
  useEffect(() => {
    return () => {
      animationTimers.current.forEach(timer => clearTimeout(timer));
      animationTimers.current.clear();
    };
  }, []);

  return (
    <div className="w-full h-full">
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
});

// 添加显示名称（可选但推荐）
Flow.displayName = 'Flow';

export default Flow;
