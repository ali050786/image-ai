// src/features/editor/hooks/use-editor.ts
import { useState, useCallback } from 'react';
import { fabric } from 'fabric';
import { useAutoResize } from './use-auto-resize';

export const useEditor = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const { autoZoom } = useAutoResize({ canvas, container });

  const init = useCallback(({ 
    canvasElement, 
    container: containerElement 
  }: {
    canvasElement: HTMLCanvasElement;
    container: HTMLDivElement;
  }) => {
    // Create canvas instance
    const fabricCanvas = new fabric.Canvas(canvasElement, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
    });

    // Set initial dimensions
    fabricCanvas.setWidth(containerElement.offsetWidth);
    fabricCanvas.setHeight(containerElement.offsetHeight);

    // Create workspace
    const workspace = new fabric.Rect({
      width: 900,
      height: 1200,
      name: 'clip',
      fill: 'white',
      selectable: false,
      hasControls: false,
      shadow: new fabric.Shadow({
        color: 'rgba(0,0,0,0.8)',
        blur: 5,
      }),
    });

     // Style object controls
     fabric.Object.prototype.set({
        cornerColor: '#FFF',
        cornerStyle: 'rect',
        borderColor: '#3B82F6',
        borderScaleFactor: 1.5,
        transparentCorners: false,
        borderOpacityWhenMoving: 1,
        cornerStrokeColor: '#3B82F6',
      });

    // Add and center workspace
    fabricCanvas.add(workspace);
    fabricCanvas.centerObject(workspace);
    fabricCanvas.clipPath = workspace;

    // Create test rectangle
    const test = new fabric.Rect({
      height: 100,
      width: 100,
      fill: 'black',
    });

    fabricCanvas.add(test);
    fabricCanvas.centerObject(test);

    // Update state
    setCanvas(fabricCanvas);
    setContainer(containerElement);

    return fabricCanvas;
  }, []);

  return {
    init,
    canvas,
    autoZoom,
  };
};