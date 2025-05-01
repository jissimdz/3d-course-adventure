
import React from "react";

interface CanvasContainerProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const CanvasContainer: React.FC<CanvasContainerProps> = ({ canvasRef }) => {
  return (
    <div className="rounded-lg border border-gray-200 shadow-md">
      <canvas ref={canvasRef} id="fabric-canvas" />
    </div>
  );
};

export default CanvasContainer;
