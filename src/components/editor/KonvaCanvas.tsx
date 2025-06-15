
import React, { forwardRef, useState } from 'react';
import { Stage, Layer, Circle, Text, Image as KonvaImage, Line } from 'react-konva';
import { toast } from 'sonner';
import useImage from 'use-image';

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

const ImageElement = ({ element, onUpdate, onDelete }: any) => {
  const [image] = useImage(element.src);
  const [isSelected, setIsSelected] = useState(false);

  return (
    <KonvaImage
      image={image}
      x={element.x}
      y={element.y}
      width={element.width || 100}
      height={element.height || 100}
      draggable
      onClick={() => setIsSelected(!isSelected)}
      onDragEnd={(e) => {
        onUpdate(element.id, {
          x: e.target.x(),
          y: e.target.y(),
        });
      }}
      onTransformEnd={(e) => {
        const node = e.target;
        onUpdate(element.id, {
          x: node.x(),
          y: node.y(),
          width: node.width() * node.scaleX(),
          height: node.height() * node.scaleY(),
        });
        node.scaleX(1);
        node.scaleY(1);
      }}
      stroke={isSelected ? '#0066cc' : undefined}
      strokeWidth={isSelected ? 2 : 0}
    />
  );
};

const KonvaCanvas = forwardRef<any, KonvaCanvasProps>(({
  elements,
  selectedTool,
  onUpdateElement,
  onDeleteElement,
  onAddElement
}, ref) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState<number[]>([]);

  const handleStageClick = (e: any) => {
    if (selectedTool === 'circle') {
      const pos = e.target.getStage().getPointerPosition();
      onAddElement({
        type: 'circle',
        x: pos.x,
        y: pos.y,
        radius: 50,
        fill: '#3B82F6'
      });
    } else if (selectedTool === 'text') {
      const pos = e.target.getStage().getPointerPosition();
      onAddElement({
        type: 'text',
        x: pos.x,
        y: pos.y,
        text: 'Nouveau texte',
        fontSize: 20,
        fill: '#000000'
      });
    }
  };

  const handleMouseDown = (e: any) => {
    if (selectedTool === 'line') {
      setIsDrawing(true);
      const pos = e.target.getStage().getPointerPosition();
      setCurrentLine([pos.x, pos.y]);
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing || selectedTool !== 'line') return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    setCurrentLine(prev => [...prev, point.x, point.y]);
  };

  const handleMouseUp = () => {
    if (isDrawing && selectedTool === 'line' && currentLine.length > 2) {
      onAddElement({
        type: 'line',
        points: currentLine,
        stroke: '#000000',
        strokeWidth: 2
      });
    }
    setIsDrawing(false);
    setCurrentLine([]);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      // Implémenter la suppression d'éléments sélectionnés
    }
  };

  React.useEffect(() => {
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
          {elements.map((element) => {
            if (element.type === 'circle') {
              return (
                <Circle
                  key={element.id}
                  x={element.x}
                  y={element.y}
                  radius={element.radius}
                  fill={element.fill}
                  draggable
                  onDragEnd={(e) => {
                    onUpdateElement(element.id, {
                      x: e.target.x(),
                      y: e.target.y(),
                    });
                  }}
                />
              );
            } else if (element.type === 'text') {
              return (
                <Text
                  key={element.id}
                  x={element.x}
                  y={element.y}
                  text={element.text}
                  fontSize={element.fontSize}
                  fill={element.fill}
                  draggable
                  onDragEnd={(e) => {
                    onUpdateElement(element.id, {
                      x: e.target.x(),
                      y: e.target.y(),
                    });
                  }}
                  onDblClick={() => {
                    const newText = prompt('Modifier le texte:', element.text);
                    if (newText !== null) {
                      onUpdateElement(element.id, { text: newText });
                    }
                  }}
                />
              );
            } else if (element.type === 'image') {
              return (
                <ImageElement
                  key={element.id}
                  element={element}
                  onUpdate={onUpdateElement}
                  onDelete={onDeleteElement}
                />
              );
            } else if (element.type === 'line') {
              return (
                <Line
                  key={element.id}
                  points={element.points}
                  stroke={element.stroke}
                  strokeWidth={element.strokeWidth}
                />
              );
            }
            return null;
          })}
          
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
