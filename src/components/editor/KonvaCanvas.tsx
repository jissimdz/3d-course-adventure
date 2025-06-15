
import React, { forwardRef, useEffect } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { useCanvasInteractions } from './hooks/useCanvasInteractions';
import CanvasElements from './elements/CanvasElements';

interface Element {
  id: number;
  type: 'circle' | 'text' | 'image' | 'line';
  x: number;
  y: number;
  [key: string]: any;
}

interface KonvaCanvasProps {
  elements: Element[];
  selectedTool: string;
  onUpdateElement: (id: number, updates: any) => void;
  onDeleteElement: (id: number) => void;
  onAddElement: (element: any) => void;
}

const KonvaCanvas = forwardRef<any, KonvaCanvasProps>(({
  elements,
  selectedTool,
  onUpdateElement,
  onDeleteElement,
  onAddElement
}, ref) => {
  const {
    isDrawing,
    currentLine,
    handleStageClick,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useCanvasInteractions({ selectedTool, onAddElement });

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      // Implémenter la suppression d'éléments sélectionnés
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative">
      <Stage
        width={800}
        height={600}
        ref={ref}
        onClick={handleStageClick}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        className="border border-gray-300 bg-white"
      >
        <Layer>
          <CanvasElements
            elements={elements}
            onUpdateElement={onUpdateElement}
            onDeleteElement={onDeleteElement}
          />
          
          {/* Ligne en cours de dessin */}
          {isDrawing && selectedTool === 'line' && (
            <Line
              points={currentLine}
              stroke="#999999"
              strokeWidth={2}
              dash={[5, 5]}
            />
          )}
        </Layer>
      </Stage>
      
      <div className="p-2 text-xs text-gray-500">
        Cliquez pour ajouter des éléments. Glissez pour déplacer. Double-cliquez sur le texte pour l'éditer.
      </div>
    </div>
  );
});

KonvaCanvas.displayName = 'KonvaCanvas';

export default KonvaCanvas;
