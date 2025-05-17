
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

interface PuzzlePiece {
  id: number;
  xPos: number;
  yPos: number;
  left: number;
  top: number;
}

const PuzzlePage: React.FC = () => {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const puzzleContainerRef = useRef<HTMLDivElement>(null);
  const draggedPieceRef = useRef<number | null>(null);
  
  // Image scientifique de placeholder
  const imageUrl = "https://images.unsplash.com/photo-1518770660439-4636190af475";
  
  useEffect(() => {
    initPuzzle();
  }, []);

  const initPuzzle = () => {
    const pieceCount = 16; // 4x4
    const newPieces: PuzzlePiece[] = [];

    for (let i = 0; i < pieceCount; i++) {
      const xPos = (i % 4) * 100;
      const yPos = Math.floor(i / 4) * 100;
      
      newPieces.push({
        id: i,
        xPos,
        yPos,
        left: Math.random() * 350,
        top: Math.random() * 350
      });
    }
    
    setPieces(newPieces);
  };

  const shufflePieces = () => {
    setPieces(pieces.map(piece => ({
      ...piece,
      left: Math.random() * 350,
      top: Math.random() * 350
    })));
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    draggedPieceRef.current = id;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (draggedPieceRef.current === null || !puzzleContainerRef.current) return;
    
    const containerRect = puzzleContainerRef.current.getBoundingClientRect();
    const newLeft = e.clientX - containerRect.left - 50;
    const newTop = e.clientY - containerRect.top - 50;
    
    setPieces(pieces.map(piece => 
      piece.id === draggedPieceRef.current
        ? { ...piece, left: newLeft, top: newTop }
        : piece
    ));
    
    draggedPieceRef.current = null;
  };

  const checkCompletion = () => {
    // Vérifier si les pièces sont à leur place correcte (à implémenter)
    alert("Bravo! Vous avez terminé le puzzle!");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-brand-blue mb-6">
          Puzzle Scientifique
        </h1>
        
        <div className="flex flex-col items-center mb-8">
          <img 
            src={imageUrl} 
            alt="Image de référence" 
            className="w-full max-w-xs mb-4 rounded-lg shadow-md"
          />
          
          <div className="flex gap-4">
            <Button onClick={shufflePieces} variant="default" className="bg-brand-teal hover:bg-brand-teal/90">
              Mélanger les pièces
            </Button>
            <Button onClick={checkCompletion} variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue/10">
              Vérifier
            </Button>
          </div>
        </div>
        
        <div 
          ref={puzzleContainerRef}
          className="w-full max-w-[500px] h-[500px] border-2 border-gray-300 relative mx-auto rounded-lg bg-gray-50"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {pieces.map(piece => (
            <div
              key={piece.id}
              draggable
              onDragStart={(e) => handleDragStart(e, piece.id)}
              className="absolute w-[100px] h-[100px] cursor-move border border-white"
              style={{
                left: `${piece.left}px`,
                top: `${piece.top}px`,
                backgroundImage: `url(${imageUrl})`,
                backgroundPosition: `-${piece.xPos}px -${piece.yPos}px`,
                backgroundSize: '500px 500px',
              }}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default PuzzlePage;
