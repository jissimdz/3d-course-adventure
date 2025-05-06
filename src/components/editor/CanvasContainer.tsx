
import React from "react";

interface CanvasContainerProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const CanvasContainer: React.FC<CanvasContainerProps> = ({ canvasRef }) => {
  return (
    <div className="rounded-lg border border-gray-200 shadow-md bg-white">
      <canvas ref={canvasRef} id="fabric-canvas" />
      <div className="p-2 text-xs text-gray-500">
        Glissez-déposez des icônes depuis la bibliothèque vers la zone d'édition
      </div>
    </div>
  );
};

export default CanvasContainer;
