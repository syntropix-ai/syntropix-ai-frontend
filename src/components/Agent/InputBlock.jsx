import { useState } from "react";
import InputTextArea from "./InputTextArea";
import { Handle, NodeResizer } from '@xyflow/react';
import { motion } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

const InputBlock = ({ selected, data, id, onDelete }) => {
  const [input, setInput] = useState("");
  const [width, setWidth] = useState(data.width || 384);
  const [height, setHeight] = useState(data.height || 160);
  const [isResizing, setIsResizing] = useState(false);
  
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="relative w-[24rem] h-[10rem] bg-white rounded-lg shadow-lg border-2 border-gray-200 hover:border-blue-400 transition-colors"
      style={{ width, height: isResizing ? height : "auto" }}
    >
      <motion.div 
        className="text-sm font-semibold text-gray-600 p-2 border-b"
        whileHover={{ backgroundColor: '#f3f4f6' }}
      >
        Input
      </motion.div>

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

      {/* 主要内容区域 */}
      <div className="px-2 py-1">
        <InputTextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full resize-none"
        />
      </div>

      {/* 输出连接点 */}
      <Handle
        type="source"
        position="bottom"
        className="w-3 h-3 bg-blue-400 border-2 border-white"
        style={{ bottom: -10 }}
      />
    </motion.div>
  );
}

export default InputBlock;