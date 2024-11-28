import { useState } from "react";
import { Handle, NodeResizer } from '@xyflow/react';
import { motion } from 'framer-motion';
import { IoClose, IoSettings } from 'react-icons/io5';
import { BiCheck, BiError, BiLoaderAlt } from 'react-icons/bi';
import { BsCircle } from 'react-icons/bs';

const ToolBlock = ({ selected, data, id, onDelete, onSettings }) => {
  const [name, setName] = useState(data.name || "Tool");
  const [description, setDescription] = useState(data.description || "");
  const [args, setArgs] = useState(data.args || {});
  const type = data.type || "default_tool_type"; // 不可修改的类型
  
  const STATUS = {
    IDLE: 1,
    RUNNING: 2,
    FAILED: 3,
    SUCCESS: 4
  };
  
  const [status, setStatus] = useState(data.status || STATUS.IDLE);
  
  const [width, setWidth] = useState(data.width || 384);
  const [height, setHeight] = useState(data.height || "auto");
  const [isResizing, setIsResizing] = useState(false);

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

  const handleArgChange = (key, value) => {
    setArgs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="relative w-[24rem] bg-white rounded-lg shadow-lg border-2 border-gray-200 hover:border-green-400 transition-colors"
      style={{ width, height: isResizing ? height : "auto" }}
    >
      {selected && (
        <NodeResizer
          color="#3b82f6"
          isVisible={selected}
          minWidth={200}
          minHeight={150}
          onResizeStart={() => setIsResizing(true)}
          onResize={(event, params) => {
            setWidth(params.width);
            setHeight(params.height);
            data.width = params.width;
            data.height = params.height;
          }}
          onResizeEnd={() => setIsResizing(false)}
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
              onDelete(id);
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

      <div className="px-2 py-1 space-y-2">
        <div>
          <label className="text-xs text-gray-500">Type</label>
          <input
            type="text"
            value={type}
            readOnly
            className="w-full px-2 py-1 border rounded bg-gray-50 text-gray-500"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full resize-none h-16 px-2 py-1 border rounded text-sm"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">Arguments</label>
          <div className="space-y-2">
            {Object.entries(args).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 min-w-[100px]">{key}:</span>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleArgChange(key, e.target.value)}
                  className="flex-1 px-2 py-1 border rounded text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 只有左侧入口连接点 */}
      <Handle
        type="target"
        position="top"
        className="w-3 h-3 bg-green-400 border-2 border-white"
        style={{ top: -10 }}
      />
    </motion.div>
  );
}

export default ToolBlock; 