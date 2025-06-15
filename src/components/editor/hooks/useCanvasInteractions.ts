
import { useState } from 'react';

interface Element {
  id: number;
  type: 'circle' | 'text' | 'image' | 'line';
  x: number;
  y: number;
  [key: string]: any;
}

interface UseCanvasInteractionsProps {
  selectedTool: string;
  onAddElement: (element: any) => void;
}

export const useCanvasInteractions = ({ selectedTool, onAddElement }: UseCanvasInteractionsProps) => {
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

  return {
    isDrawing,
    currentLine,
    handleStageClick,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};
