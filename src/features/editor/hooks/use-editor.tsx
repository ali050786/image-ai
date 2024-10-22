// src/features/editor/hooks/use-editor.ts
import { useCallback, useMemo, useState } from 'react';
import { fabric } from 'fabric';
import { 
  Editor, 
  CIRCLE_OPTIONS, 
  RECTANGLE_OPTIONS, 
  TRIANGLE_OPTIONS, 
  DIAMOND_OPTIONS 
} from '../types';
import { useAutoResize } from './use-auto-resize';

export const useEditor = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const { autoZoom } = useAutoResize({ canvas, container });

  const getWorkspace = useCallback(() => {
    return canvas?.getObjects().find((object) => object.name === "clip");
  }, [canvas]);

  const center = useCallback((object: fabric.Object) => {
    const workspace = getWorkspace();
    const center = workspace?.getCenterPoint();
    
    if (!center) return;

    // @ts-ignore - Method exists but not typed in fabric types
    canvas?._centerObject(object, center);
  }, [canvas, getWorkspace]);

  const addToCanvas = useCallback((object: fabric.Object) => {
    if (!canvas) return;
    
    center(object);
    canvas.add(object);
    canvas.setActiveObject(object);
  }, [canvas, center]);

  const editor = useMemo(() => {
    if (!canvas) return;

    return {
      canvas,
      
      // Basic circle shape
      addCircle: () => {
        const circle = new fabric.Circle(CIRCLE_OPTIONS);
        addToCanvas(circle);
      },

      // Rectangle with rounded corners
      addSoftRectangle: () => {
        const rect = new fabric.Rect({
          ...RECTANGLE_OPTIONS,
          rx: 50,
          ry: 50,
        });
        addToCanvas(rect);
      },

      // Regular rectangle
      addRectangle: () => {
        const rect = new fabric.Rect(RECTANGLE_OPTIONS);
        addToCanvas(rect);
      },

      // Regular triangle
      addTriangle: () => {
        const triangle = new fabric.Triangle(TRIANGLE_OPTIONS);
        addToCanvas(triangle);
      },

      // Inverted triangle using polygon
      addInverseTriangle: () => {
        const { width, height } = TRIANGLE_OPTIONS;
        const points = [
          { x: 0, y: 0 },          // Top-left point
          { x: width, y: 0 },      // Top-right point
          { x: width / 2, y: height } // Bottom-center point
        ];
        
        const triangle = new fabric.Polygon(points, {
          ...TRIANGLE_OPTIONS,
        });
        addToCanvas(triangle);
      },

      // Diamond shape using polygon
      addDiamond: () => {
        const { width, height } = DIAMOND_OPTIONS;
        const points = [
          { x: width / 2, y: 0 },     // Top point
          { x: width, y: height / 2 }, // Right point
          { x: width / 2, y: height }, // Bottom point
          { x: 0, y: height / 2 }      // Left point
        ];
        
        const diamond = new fabric.Polygon(points, {
          ...DIAMOND_OPTIONS,
        });
        addToCanvas(diamond);
      }
    };
  }, [canvas, addToCanvas]);

  return {
    init: useCallback(({ 
      canvasElement, 
      container: containerElement 
    }: {
      canvasElement: HTMLCanvasElement;
      container: HTMLDivElement;
    }) => {
      // Initialize fabric canvas
      const fabricCanvas = new fabric.Canvas(canvasElement, {
        controlsAboveOverlay: true,
        preserveObjectStacking: true,
      });

      // Set canvas dimensions to match container
      fabricCanvas.setWidth(containerElement.offsetWidth);
      fabricCanvas.setHeight(containerElement.offsetHeight);

      // Create workspace (white background)
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

      // Add workspace and set up clipping
      fabricCanvas.add(workspace);
      fabricCanvas.centerObject(workspace);
      fabricCanvas.clipPath = workspace;

      // Set up object controls styling
      fabric.Object.prototype.set({
        cornerColor: '#FFF',
        cornerStyle: 'circle',
        borderColor: '#3b82f6',
        borderScaleFactor: 1.5,
        transparentCorners: false,
        borderOpacityWhenMoving: 1,
        cornerStrokeColor: '#3b82f6',
      });

      // Update state
      setCanvas(fabricCanvas);
      setContainer(containerElement);

      return fabricCanvas;
    }, []),
    editor,
  };
};