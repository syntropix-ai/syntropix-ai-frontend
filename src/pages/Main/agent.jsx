import React, { useRef } from 'react';
import Flow from '../../components/Agent/Flow';
import InputTextArea from "../../components/Agent/InputTextArea";
import { useState, useCallback, useEffect } from "react";
import { convertFlowToConfig } from '../../components/Agent/utils';

const Agent = () => {
  const [splitPosition, setSplitPosition] = useState(50);
  const [activeTab, setActiveTab] = useState("chat");
  const [isDragging, setIsDragging] = useState(false);
  const flowRef = useRef(null);

  // 处理拖动逻辑
  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        const windowWidth = window.innerWidth;
        const newPosition = (e.clientX / windowWidth) * 100;
        // 限制拖动范围在20%到80%之间
        setSplitPosition(Math.min(Math.max(newPosition, 20), 80));
      }
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 添加和移除事件监听
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const tabs = [
    { id: "chat", label: "Chat" },
    { id: "settings", label: "Settings" },
    // 可以添加更多标签页
  ];

  const handleStreamResponse = async () => {
    flowRef.current?.resetNodeStatuses();
    const eventSource = new EventSource("http://localhost:8000/");
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // console.log(data);
      flowRef.current?.updateNodeStatuses(data);
    };
    eventSource.onerror = (event) => {
      // console.error('EventSource failed:', event);
      eventSource.close();
    };

  };

  return (
    <div className="flex h-[85vh] w-[90vw] overflow-x-hidden">
      {/* 左侧Flow区域 */}
      <div
        className="h-full overflow-hidden relative"
        style={{ width: `${splitPosition}%` }}
      >
        {/* 将按钮移到这里，使用绝对定位居中 */}
        <div className="absolute left-1/2 top-4 transform -translate-x-1/2 flex gap-2 z-10">
          <button
            onClick={() => {
              const config = convertFlowToConfig(flowRef.current);
              console.log(JSON.stringify(config, null, 2));
              
              flowRef.current?.onLayout();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 shadow-lg"
          >
            布局
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 shadow-lg"
            onClick={() => flowRef.current?.addAgentNode()}
          >
            Agent
          </button>
          <button
            onClick={() => flowRef.current?.addToolNode()}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 shadow-lg"
          >
            工具
          </button>
          <button
            onClick={handleStreamResponse}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 shadow-lg"
          >
            运行
          </button>
        </div>
        <Flow ref={flowRef} />
      </div>

      {/* 可拖动的分隔条 */}
      <div
        className={`w-2 bg-gray-200 cursor-col-resize hover:bg-gray-300 active:bg-gray-400 flex-shrink-0 ${
          isDragging ? "bg-gray-400" : ""
        }`}
        onMouseDown={handleMouseDown}
      />

      {/* 右侧Tab和聊天区域 */}
      <div
        className="flex flex-col h-full overflow-hidden"
        style={{ width: `${100 - splitPosition}%` }}
      >
        {/* 自定义Tab栏 */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 font-medium ${
                activeTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab内容区域 */}
        <div className="flex-1">
          {activeTab === "chat" && (
            <div className="h-full flex flex-col">
              {/* 聊天记录区域 */}
              <div className="flex-1 overflow-y-auto p-4">
                {/* 这里放置对话内容 */}
              </div>

              {/* 输入框区域 */}
              <div className="p-4 border-t border-gray-200">
                <InputTextArea />
              </div>
            </div>
          )}
          {activeTab === "settings" && (
            <div className="p-4">
              {/* 设置页面内容 */}
              Settings content goes here
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Agent;
