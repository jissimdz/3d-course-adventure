
import React from 'react';
import { Circle, Text, Line } from 'react-konva';
import ImageElement from './ImageElement';

interface Element {
  id: number;
  type: 'circle' | 'text' | 'image' | 'line';
  x: number;
  y: number;
  [key: string]: any;
}

interface CanvasElementsProps {
  elements: Element[];
  onUpdateElement: (id: number, updates: any) => void;
  onDeleteElement: (id: number) => void;
}

const CanvasElements: React.FC<CanvasElementsProps> = ({ 
  elements, 
  onUpdateElement, 
  onDeleteElement 
}) => {
  return (
    <>
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
        } else if (element.type === 'image' && element.src) {
          return (
            <ImageElement
              key={element.id}
              element={{
                id: element.id,
                x: element.x,
                y: element.y,
                src: element.src,
                width: element.width,
                height: element.height
              }}
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
    </>
  );
};

export default CanvasElements;
