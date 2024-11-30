import { useState, useEffect } from "react";
import { Handle, NodeResizer } from "@xyflow/react";
import { motion } from "framer-motion";
import { IoClose, IoSettings } from "react-icons/io5";
import { BiCheck, BiError, BiLoaderAlt } from "react-icons/bi";
import { BsCircle } from "react-icons/bs";

const AgentBlock = ({ selected, data, id, onDelete, onSettings }) => {
  const [name, setName] = useState(data.name || "Agent");
  const [description, setDescription] = useState(data.description || "");
  const [systemMessage, setSystemMessage] = useState(data.systemMessage || "");
  const [width, setWidth] = useState(data.width || 384);
  const [height, setHeight] = useState(data.height || "auto"); // 初始高度设为 'auto'

  const modelName = "gpt-4";

  const statusStyles = {
    idle: { color: "gray", borderColor: "gray-200" },
    running: { color: "blue", borderColor: "blue-400" },
    failed: { color: "red", borderColor: "red-400" },
    success: { color: "green", borderColor: "green-400" },
  };

  const [status, setStatus] = useState(data.status || "idle");
  useEffect(() => {
    if (data.status !== status) {
      setStatus(data.status);
    }
  }, [data.status]);

  const StatusIcon = () => {
    
    if (status === "running") {
      return <BiLoaderAlt className="animate-spin text-blue-500" />;
    } else if (status === "failed") {
      return <BiError className="text-red-500" />;
    } else if (status === "success") {
      return <BiCheck className="text-green-500" />;
    } else {
      return <BsCircle className="text-gray-400" />;
    }

  };

  // 判断是否正在调整大小
  const [isResizing, setIsResizing] = useState(false);

  const getGlowStyle = (status) => {
    switch (status) {
      case "running":
        return "!shadow-[0_0_25px_rgba(59,130,246,0.7)] border-blue-400"; // 使用 !important
      case "success":
        return "!shadow-[0_0_25px_rgba(34,197,94,0.7)] border-green-400";
      case "failed":
        return "!shadow-[0_0_25px_rgba(239,68,68,0.7)] border-red-400";
      default:
        return "!shadow-md border-gray-200";
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`relative bg-white rounded-lg border-2 transition-all ${
        selected ? "border-dashed" : ""
      } ${getGlowStyle(status)}`}
      style={{ width, height: isResizing ? height : "auto" }}
    >
      {selected && (
        <NodeResizer
          color="#3b82f6"
          isVisible={selected}
          minWidth={200}
          minHeight={150}
          onResizeStart={() => {
            setIsResizing(true); // 开始调整大小
          }}
          onResize={(event, params) => {
            setWidth(params.width);
            setHeight(params.height);
            data.width = params.width;
            data.height = params.height;
          }}
          onResizeEnd={() => {
            setIsResizing(false); // 结束调整大小
          }}
          handleStyle={{
            borderWidth: 1,
            borderColor: "#3b82f6",
            backgroundColor: "white",
          }}
          lineStyle={{ borderWidth: 1, borderColor: "#3b82f6" }}
        />
      )}

      <motion.div
        className="text-sm font-semibold text-gray-600 p-2 border-b flex items-center justify-between"
        whileHover={{ backgroundColor: "#f3f4f6" }}
      >
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            data.name = e.target.value;
          }}
          className="bg-transparent border-none outline-none flex-1"
        />
        <StatusIcon />
      </motion.div>

      {selected && (
        <>
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-3 -right-3 bg-white rounded-full p-1 text-gray-400 hover:text-red-500 transition-colors shadow-lg border border-gray-200"
            onClick={(e) => {
              e.stopPropagation();
              data.onDelete(id);
            }}
          >
            <IoClose size={16} />
          </motion.button>

          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-3 right-8 bg-white rounded-full p-1 text-gray-400 hover:text-blue-500 transition-colors shadow-lg border border-gray-200"
            onClick={(e) => {
              e.stopPropagation();
              onSettings(id);
            }}
          >
            <IoSettings size={16} />
          </motion.button>
        </>
      )}

      <div className="p-2">
        <label className="text-xs text-gray-500">Model</label>
        <input
          type="text"
          value={modelName}
          readOnly
          className="w-full px-2 py-1 border rounded bg-gray-50 text-gray-500"
        />
      </div>

      <div className="px-2 py-1 space-y-2">
        <div>
          <label className="text-xs text-gray-500">Description</label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              data.description = e.target.value;
            }}
            className="w-full resize-none px-2 py-1 border rounded text-sm"
            style={{ height: "4rem" }} // 使用内联样式设置高度
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">System Message</label>
          <textarea
            value={systemMessage}
            onChange={(e) => {
              setSystemMessage(e.target.value);
              data.systemMessage = e.target.value;
            }}
            className="w-full resize-none px-2 py-1 border rounded text-sm"
            style={{ height: "5rem" }} // 使用内联样式设置高度
          />
        </div>
      </div>

      <Handle
        type="target"
        position="top"
        className={`w-3 h-3 bg-${statusStyles[status].color}-400 border-2 border-white`}
        style={{ top: -10 }}
      />
      <Handle
        type="source"
        position="bottom"
        className={`w-3 h-3 bg-${statusStyles[status].color}-400 border-2 border-white`}
        style={{ bottom: -10 }}
      />
    </motion.div>
  );
};

export default AgentBlock;
