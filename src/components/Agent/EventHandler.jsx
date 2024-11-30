// 将filterStack改为独立的辅助函数
const filterStack = (stack) => {
  return stack.filter(item => ['agent', 'tool'].includes(item.type));
};

// 添加一个 Map 来存储定时器
const animationTimers = new Map();

// 添加获取边更新的辅助函数
const getEdgeStatusUpdates = (event, nodes, edges) => {
  const updates = new Map();
  const current = event.current;
  
  if (!current) return updates;
  
  const relatedEdges = edges.filter(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    return sourceNode?.data.name === current.name || targetNode?.data.name === current.name;
  });

  relatedEdges.forEach(edge => {
    switch (event.event_type) {
      case 'on_tool_start':
        updates.set(edge.id, 'forward');
        break;
      case 'on_tool_end':
      case 'on_tool_error':
        updates.set(edge.id, 'backward');
        break;
      case 'on_end':
        updates.set(edge.id, 'none');
        break;
    }
  });

  return updates;
};

// 将类方法改为独立函数
const getNodeStatusUpdates = (event, nodes) => {
  const currentStack = filterStack(event.stack);
  const updates = new Map();
  console.log("current", event.current);
  const current = event.current;
  console.log("type", event.event_type);
  if (event.event_type === "on_llm_start") {
    const ancestorNode = nodes.find(
      (n) => n.data.name === current.ancestor.name
    );
    console.log("on_llm_start", ancestorNode);
    if (ancestorNode) {
      updates.set(ancestorNode.id, "running");
    }
    return updates;
  } else if (event.event_type === "on_llm_end") {
    const ancestorNode = nodes.find(
      (n) => n.data.name === current.ancestor.name
    );
    console.log("on_llm_end", ancestorNode);
    if (ancestorNode) {
      updates.set(ancestorNode.id, "success");
    }
    return updates;
  }
  
  const currentNode = nodes.find(n => n.data.name === current.name);
  if (currentNode) {
    switch (event.event_type) {
      case "on_agent_start":
      case "on_tool_start":
        updates.set(currentNode.id, "running");
        if (current.ancestor) {
          const ancestorNode = nodes.find(
            (n) => n.data.name === current.ancestor.name
          );
          if (ancestorNode) {
            updates.set(ancestorNode.id, "success");
          }
        }
        break;

      case "on_agent_end":
      case "on_llm_end":
      case "on_tool_end":
        updates.set(currentNode.id, "success");
        break;

      case "on_agent_error":
      case "on_tool_error":
      case "on_llm_error":
        updates.set(currentNode.id, "failed");
        break;
    }
  }
  

  return updates;
};

// 导出两个函数
export { getNodeStatusUpdates, getEdgeStatusUpdates };