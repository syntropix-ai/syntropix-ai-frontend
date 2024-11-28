import React from "react";
import { BaseEdge } from "@xyflow/react";

const BiDirectionalEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
}) => {
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const len = Math.sqrt(dx * dx + dy * dy);

  const offset = 20;
  const offsetX = (offset * dy) / len;
  const offsetY = (-offset * dx) / len;

  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;

  const controlX1 = midX + offsetX;
  const controlY1 = midY + offsetY;

  const controlX2 = midX - offsetX;
  const controlY2 = midY - offsetY;

  const edgePathForward = `M ${sourceX},${sourceY} Q ${controlX1},${controlY1} ${targetX},${targetY}`;
  const edgePathBackward = `M ${sourceX},${sourceY} Q ${controlX2},${controlY2} ${targetX},${targetY}`;

  const forwardStyle = {
    ...style,
    stroke: "#2563eb",
    strokeWidth: 2,
  };

  const backwardStyle = {
    ...style,
    stroke: "#dc2626",
    strokeWidth: 2,
  };

  return (
    <>
      <BaseEdge
        path={edgePathForward}
        style={forwardStyle}
        markerEnd="url(#forward-arrow)"
      />

      <BaseEdge
        path={edgePathBackward}
        style={backwardStyle}
        markerEnd="url(#backward-arrow)"
      />

      <defs>
        <marker
          id="forward-arrow"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerUnits="strokeWidth"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb" />
        </marker>
        <marker
          id="backward-arrow"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerUnits="strokeWidth"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#dc2626" />
        </marker>
      </defs>
    </>
  );
};

export default BiDirectionalEdge;
