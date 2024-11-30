export const convertFlowToConfig = (flowInstance) => {
  const nodes = flowInstance.nodes;
  const edges = flowInstance.edges;

  // 找到输入节点连接的第一个 agent
  const inputNode = nodes.find(node => node.type === "custom");
  const inputEdges = edges.filter(edge => edge.source === inputNode?.id);
  const entryAgentNode = nodes.find(n => n.id === inputEdges[0]?.target);

  if (!entryAgentNode) {
    return null;
  }

  // 递归构建 agent 配置
  const buildAgentConfig = (agentNode) => {
    // 查找该 agent 连接的工具和子 agent
    const connectedNodes = edges
      .filter(edge => edge.source === agentNode.id)
      .map(edge => {
        const targetNode = nodes.find(n => n.id === edge.target);
        if (!targetNode) return null;
        
        if (targetNode.type === "tool") {
          return {
            target: targetNode.data.type,
            trace: true,
            args: targetNode.data.args || {}
          };
        } else if (targetNode.type === "agent") {
          return {
            target: targetNode.data.type || "default",
            trace: true,
            args: buildAgentConfig(targetNode)
          };
        }
        return null;
      })
      .filter(Boolean);

    return {
      name: agentNode.data.name,
      type: "vanilla",
      description: agentNode.data.description || undefined,
      model: {
        model_type: "gpt-4o-mini",
        name: agentNode.data.modelName || undefined,
        backend: "openai_chat",
        config: {
          stream: true,
        },
      },
      prompt: agentNode.data.systemMessage,
      tools: connectedNodes.length > 0 ? connectedNodes : undefined,
    };
  };

  // 返回入口 agent 的配置
  return buildAgentConfig(entryAgentNode);
};
