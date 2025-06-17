
import React, { useState, useRef } from "react";
import Layout from "@/components/Layout";
import KonvaCanvas from "@/components/editor/KonvaCanvas";
import NewEditorToolbar from "@/components/editor/NewEditorToolbar";
import NewIconLibrary from "@/components/editor/NewIconLibrary";

const EditorPage: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<'select' | 'icon' | 'text' | 'circle' | 'line'>('select');
  const [elements, setElements] = useState<any[]>([]);
  const [counter, setCounter] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const canvasRef = useRef<any>(null);

  const addElement = (element: any) => {
    const newElement = {
      ...element,
      id: counter,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
    };
    setElements([...elements, newElement]);
    setCounter(counter + 1);
  };

  const updateElement = (id: string, updates: any) => {
    setElements(prev => 
      prev.map(el => el.id.toString() === id ? { ...el, ...updates } : el)
    );
  };

  const deleteElement = (id: number) => {
    setElements(prev => prev.filter(el => el.id !== id));
  };

  const exportCanvas = () => {
    if (canvasRef.current) {
      const uri = canvasRef.current.toDataURL();
      const link = document.createElement('a');
      link.download = 'schema.png';
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const clearCanvas = () => {
    setElements([]);
    setSelectedElementId(null);
  };

  const handleCanvasClick = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedElementId(null);
    }

    if (selectedTool === 'circle') {
      const pos = e.target.getStage().getPointerPosition();
      addElement({ 
        type: 'circle', 
        x: pos.x, 
        y: pos.y, 
        radius: 50, 
        fill: '#3B82F6' 
      });
    } else if (selectedTool === 'text') {
      const pos = e.target.getStage().getPointerPosition();
      addElement({ 
        type: 'text', 
        x: pos.x, 
        y: pos.y, 
        text: 'Nouveau texte', 
        fontSize: 20, 
        fill: '#000000' 
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-brand-blue">Éditeur de Schémas</h1>

        <NewEditorToolbar
          selectedTool={selectedTool}
          onToolSelect={setSelectedTool}
          onExport={exportCanvas}
          onClear={clearCanvas}
          onAddCircle={() => addElement({ type: 'circle', radius: 50, fill: '#3B82F6' })}
          onAddText={() => addElement({ type: 'text', text: 'Nouveau texte', fontSize: 20, fill: '#000000' })}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <NewIconLibrary onAddIcon={(iconSrc) => addElement({ type: 'image', src: iconSrc, width: 100, height: 100 })} />
          </div>
          
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 shadow-md">
              <KonvaCanvas
                ref={canvasRef}
                width={800}
                height={600}
                elements={elements}
                selectedElementId={selectedElementId}
                onElementSelect={setSelectedElementId}
                onElementUpdate={updateElement}
                onCanvasClick={handleCanvasClick}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditorPage;
