import { useState } from "react";
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

  const STATUS = {
    IDLE: 1,
    RUNNING: 2,
    FAILED: 3,
    SUCCESS: 4,
  };

  const statusStyles = {
    [STATUS.IDLE]: { color: "gray", borderColor: "gray-200" },
    [STATUS.RUNNING]: { color: "blue", borderColor: "blue-400" },
    [STATUS.FAILED]: { color: "red", borderColor: "red-400" },
    [STATUS.SUCCESS]: { color: "green", borderColor: "green-400" },
  };

  const [status, setStatus] = useState(data.status || STATUS.SUCCESS);

  const StatusIcon = () => {
    switch (status) {
      case STATUS.RUNNING:
        return <BiLoaderAlt className="animate-spin text-blue-500" />;
      case STATUS.FAILED:
        return <BiError className="text-red-500" />;
      case STATUS.SUCCESS:
        return <BiCheck className="text-green-500" />;
      default:
        return <BsCircle className="text-gray-400" />;
    }
  };

  // 判断是否正在调整大小
  const [isResizing, setIsResizing] = useState(false);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        borderColor: `var(--tw-${statusStyles[status].borderColor})`,
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`relative bg-white rounded-lg shadow-lg border-2 transition-colors ${
        selected ? "border-dashed" : ""
      }`}
      style={{ width, height: isResizing ? height : "auto" }} // 当调整大小时，使用固定高度
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
          onChange={(e) => setName(e.target.value)}
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
            onChange={(e) => setDescription(e.target.value)}
            className="w-full resize-none px-2 py-1 border rounded text-sm"
            style={{ height: "4rem" }} // 使用内联样式设置高度
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">System Message</label>
          <textarea
            value={systemMessage}
            onChange={(e) => setSystemMessage(e.target.value)}
            className="w-full resize-none px-2 py-1 border rounded text-sm"
            style={{ height: "5rem" }} // 使用内联样式设置高度
          />
        </div>
      </div>

      <Handle
        type="source"
        position="right"
        className={`w-3 h-3 bg-${statusStyles[status].color}-400 border-2 border-white`}
        style={{ right: -10 }}
      />
      <Handle
        type="target"
        position="left"
        className={`w-3 h-3 bg-${statusStyles[status].color}-400 border-2 border-white`}
        style={{ left: -10 }}
      />
    </motion.div>
  );
};

export default AgentBlock;
