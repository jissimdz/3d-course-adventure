
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
  toDataURL: () => string;
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
    },
    toDataURL: () => {
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

  return (
    <Stage
      width={width}
      height={height}
      ref={stageRef}
      onClick={onCanvasClick}
      onMouseDown={handleMouseDown}
      className={className}
    >
      <Layer>
        <CanvasElements 
          elements={elements}
          onUpdateElement={(id: number, updates: any) => onElementUpdate(id.toString(), updates)}
          onDeleteElement={(id: number) => {}}
        />
      </Layer>
    </Stage>
  );
});

KonvaCanvas.displayName = 'KonvaCanvas';

export default KonvaCanvas;
