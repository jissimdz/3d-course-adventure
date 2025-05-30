import React, { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Image as FabricImage, Circle, Line, loadSVGFromURL, IText } from 'fabric';
import { toast } from "sonner";

interface CanvasProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
}

const Canvas = ({ width = 800, height = 600, backgroundColor = '#ffffff' }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      const canvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        backgroundColor,
      });
      fabricCanvasRef.current = canvas;
    }

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
      }
    };
  }, [backgroundColor, height, width]);

  const addCircle = () => {
    if (fabricCanvasRef.current) {
      const circle = new Circle({
        radius: 50,
        fill: 'blue',
        left: 100,
        top: 100,
      });
      fabricCanvasRef.current.add(circle);
      fabricCanvasRef.current.renderAll();
    }
  };

  const startDrawLine = () => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    isDrawingRef.current = true;
    
    // Disable object selection during line drawing
    canvas.selection = false;
    
    let line: Line;
    let pointer: { x: number, y: number };
    
    canvas.on('mouse:down', (o) => {
      if (!isDrawingRef.current) return;
      pointer = canvas.getPointer(o.e);
      line = new Line([pointer.x, pointer.y, pointer.x, pointer.y], {
        stroke: '#000000',
        strokeWidth: 2,
        selectable: true,
        evented: true,
      });
      canvas.add(line);
    });
    
    canvas.on('mouse:move', (o) => {
      if (!isDrawingRef.current || !line) return;
      pointer = canvas.getPointer(o.e);
      line.set({ x2: pointer.x, y2: pointer.y });
      canvas.renderAll();
    });
    
    canvas.on('mouse:up', () => {
      if (!isDrawingRef.current) return;
      isDrawingRef.current = false;
      if (line) {
        line.setCoords();
        // Re-enable selection after line is drawn
        canvas.selection = true;
      }
    });
    
    toast("Mode tracé ligne activé");
  };

  const stopDrawLine = () => {
    if (!fabricCanvasRef.current) return;
    isDrawingRef.current = false;
    fabricCanvasRef.current.selection = true;
    
    // Remove event listeners
    fabricCanvasRef.current.off('mouse:down');
    fabricCanvasRef.current.off('mouse:move');
    fabricCanvasRef.current.off('mouse:up');
    
    toast("Mode tracé ligne désactivé");
  };

  const addText = (text: string = "Double-cliquez pour éditer") => {
    if (!fabricCanvasRef.current) return;
    
    const textObj = new IText(text, {
      left: 150,
      top: 150,
      fontFamily: 'Arial',
      fontSize: 20,
      fill: '#000000',
      borderColor: 'red',
      cornerColor: 'green',
      cornerSize: 12,
      transparentCorners: false,
      editingBorderColor: 'blue',
    });
    
    fabricCanvasRef.current.add(textObj);
    fabricCanvasRef.current.setActiveObject(textObj);
    fabricCanvasRef.current.renderAll();
    toast("Texte ajouté. Double-cliquez pour éditer");
  };

  const addImage = (imageUrl: string, isLoading: (state: boolean) => void) => {
    if (!fabricCanvasRef.current) return;
    
    isLoading(true);

    if (imageUrl.endsWith('.png') || imageUrl.endsWith('.jpg') || imageUrl.endsWith('.jpeg')) {
      // Pour les images raster (PNG, JPG)
      FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' })
        .then((img) => {
          if (img && fabricCanvasRef.current) {
            img.set({
              left: 150,
              top: 150,
              scaleX: 0.5,
              scaleY: 0.5,
              hasControls: true,
              borderColor: 'red',
              cornerColor: 'green',
              cornerSize: 12,
              transparentCorners: false,
            });
            img.on('selected', function() {
              toast("Image sélectionnée");
            });
            fabricCanvasRef.current.add(img);
            fabricCanvasRef.current.renderAll();
            toast("Image ajoutée avec succès");
          }
          isLoading(false);
        })
        .catch(() => {
          toast.error("Erreur lors du chargement de l'image");
          isLoading(false);
        });
    } else {
      // Pour les images SVG
      loadSVGFromURL(imageUrl)
        .then(({objects, options}) => {
          if (objects && objects.length > 0 && fabricCanvasRef.current) {
            // Grouper les objets SVG
            objects.forEach(obj => {
              obj.set({
                left: 150,
                top: 150,
                scaleX: 0.5,
                scaleY: 0.5,
                borderColor: 'red',
                cornerColor: 'green',
                cornerSize: 12,
                transparentCorners: false,
              });
              
              obj.on('selected', function() {
                toast("Icône SVG sélectionnée");
              });
              
              fabricCanvasRef.current?.add(obj);
            });
            
            fabricCanvasRef.current.renderAll();
            toast("Icône SVG ajoutée avec succès");
          }
          isLoading(false);
        })
        .catch(err => {
          console.error("Error loading SVG:", err);
          toast.error("Erreur lors du chargement du SVG");
          isLoading(false);
        });
    }
  };

  const addUploadedFile = (file: File, isLoading: (state: boolean) => void) => {
    if (!file || !fabricCanvasRef.current) return;

    isLoading(true);
    const reader = new FileReader();

    reader.onload = function(event) {
      if (event.target?.result && fabricCanvasRef.current) {
        const dataUrl = event.target.result.toString();

        if (file.type === 'image/svg+xml') {
          loadSVGFromURL(dataUrl)
            .then(({objects, options}) => {
              if (objects && objects.length > 0 && fabricCanvasRef.current) {
                objects.forEach((object) => {
                  object.set({
                    left: 150,
                    top: 150,
                    borderColor: 'red',
                    cornerColor: 'green',
                    cornerSize: 12,
                    transparentCorners: false,
                  });
                  object.on('selected', function() {
                    toast("SVG sélectionné");
                  });
                  fabricCanvasRef.current!.add(object);
                });
                fabricCanvasRef.current.renderAll();
                toast("SVG importé avec succès");
              }
              isLoading(false);
            })
            .catch(err => {
              toast.error("Erreur lors du chargement du SVG");
              isLoading(false);
            });
        } else {
          FabricImage.fromURL(dataUrl, { crossOrigin: 'anonymous' })
            .then((img) => {
              if (img && fabricCanvasRef.current) {
                img.set({
                  left: 150,
                  top: 150,
                  borderColor: 'red',
                  cornerColor: 'green',
                  cornerSize: 12,
                  transparentCorners: false,
                });
                img.on('selected', function() {
                  toast("Image sélectionnée");
                });
                fabricCanvasRef.current.add(img);
                fabricCanvasRef.current.renderAll();
                toast("Image importée avec succès");
              }
              isLoading(false);
            })
            .catch(() => {
              toast.error("Erreur lors du chargement de l'image");
              isLoading(false);
            });
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const exportCanvas = () => {
    if (fabricCanvasRef.current) {
      const dataURL = fabricCanvasRef.current.toDataURL({
        format: 'png',
        multiplier: 1,
      });
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'schema.png';
      link.click();
      toast("Schéma exporté en PNG");
    }
  };

  const addIconFromLibrary = (iconData: string) => {
    if (!fabricCanvasRef.current) return;
    
    FabricImage.fromURL(iconData, { crossOrigin: 'anonymous' })
      .then((img) => {
        if (img && fabricCanvasRef.current) {
          img.set({
            left: 150,
            top: 150,
            scaleX: 0.5,
            scaleY: 0.5,
            hasControls: true,
            borderColor: 'red',
            cornerColor: 'green',
            cornerSize: 12,
            transparentCorners: false,
          });
          fabricCanvasRef.current.add(img);
          fabricCanvasRef.current.renderAll();
          toast("Icône ajoutée depuis la bibliothèque");
        }
      })
      .catch(() => {
        toast.error("Erreur lors du chargement de l'icône");
      });
  };

  return {
    canvasRef,
    addCircle,
    addImage,
    addUploadedFile,
    exportCanvas,
    startDrawLine,
    stopDrawLine,
    addIconFromLibrary,
    addText,
  };
};

export default Canvas;
