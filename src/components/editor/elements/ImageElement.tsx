
import React, { useState } from 'react';
import { Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';

interface ImageElementProps {
  element: {
    id: number;
    x: number;
    y: number;
    src: string;
    width?: number;
    height?: number;
  };
  onUpdate: (id: number, updates: any) => void;
  onDelete: (id: number) => void;
}

const ImageElement: React.FC<ImageElementProps> = ({ element, onUpdate, onDelete }) => {
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

export default ImageElement;
