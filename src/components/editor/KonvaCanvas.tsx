
import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer } from 'react-konva';
import CanvasElements from './elements/CanvasElements';

interface KonvaCanvasProps {
  width: number;
  height: number;
  elements: any[];
  selectedElementId: string | null;
  onElementSelect: (id: string | null) => void;
  onElementUpdate: (id: string, updates: any) => void;
  onCanvasClick: (e: any) => void;
  className?: string;
}

export interface KonvaCanvasRef {
  exportCanvas: () => string;
}

const KonvaCanvas = forwardRef<KonvaCanvasRef, KonvaCanvasProps>(({
  width,
  height,
  elements,
  selectedElementId,
  onElementSelect,
  onElementUpdate,
  onCanvasClick,
  className = ""
}, ref) => {
  const stageRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    exportCanvas: () => {
      if (stageRef.current) {
        return stageRef.current.toDataURL();
      }
      return '';
    }
  }));

  const handleMouseDown = (e: any) => {
    if (e.target === e.target.getStage()) {
      onElementSelect(null);
    }
  };

  const handleMouseMove = () => {
    // Handle mouse move if needed
  };

  const handleMouseUp = () => {
    // Handle mouse up if needed
  };

  return (
    <Stage
      width={width}
      height={height}
      ref={stageRef}
      onClick={onCanvasClick}
      onMouseDown={handleMouseDown}
      onMousemove={handleMouseMove}
      onMouseup={handleMouseUp}
      className={className}
    >
      <Layer>
        <CanvasElements 
          elements={elements}
          selectedElementId={selectedElementId}
          onElementSelect={onElementSelect}
          onElementUpdate={onElementUpdate}
        />
      </Layer>
    </Stage>
  );
});

KonvaCanvas.displayName = 'KonvaCanvas';

export default KonvaCanvas;
