// src/features/editor/hooks/use-editor.tsx
import { useCallback, useMemo, useRef, useState } from 'react';
import { fabric } from 'fabric';

import { 
  Editor, 
  FILL_COLOR, 
  STROKE_COLOR,
  STROKE_WIDTH,
  CIRCLE_OPTIONS, 
  RECTANGLE_OPTIONS, 
  TRIANGLE_OPTIONS, 
  DIAMOND_OPTIONS 
} from '../types';
import { useAutoResize } from './use-auto-resize';
import { useCanvasEvents } from './use-canvas-events';
import { isTextType } from '../utils'

interface CanvasHistory {
  states: string[];
  currentStateIndex: number;
}

export const useEditor = () => {
  // Canvas and Container State
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  // Style State
  const [fillColor, setFillColor] = useState(FILL_COLOR);
  const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
  const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);
  
  // Selection State
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);
  
  // History Management
  const canvasHistory = useRef<CanvasHistory>({
    states: [],
    currentStateIndex: -1,
  });

  // Initialize Auto-resize
  const { autoZoom } = useAutoResize({ canvas, container });

  // Canvas Utility Methods
  const getWorkspace = useCallback(() => {
    return canvas?.getObjects().find((object) => object.name === "clip");
  }, [canvas]);

  const center = useCallback((object: fabric.Object) => {
    const workspace = getWorkspace();
    const center = workspace?.getCenterPoint();
    
    if (!center || !canvas) return;

    // @ts-ignore - Method exists but not typed in fabric types
    canvas._centerObject(object, center);
  }, [canvas, getWorkspace]);

  const addToCanvas = useCallback((object: fabric.Object) => {
    if (!canvas) return;
    
    center(object);
    canvas.add(object);
    canvas.setActiveObject(object);
    saveState();
  }, [canvas, center]);

  // History Methods
  const saveState = useCallback(() => {
    if (!canvas) return;

    const json = JSON.stringify(canvas.toJSON());
    const { states, currentStateIndex } = canvasHistory.current;

    // Remove any future states if we're not at the latest state
    const newStates = states.slice(0, currentStateIndex + 1);
    newStates.push(json);

    canvasHistory.current = {
      states: newStates,
      currentStateIndex: newStates.length - 1,
    };
  }, [canvas]);

  // Color Management Methods
  const changeFillColor = useCallback((value: string) => {
    setFillColor(value);
    
    canvas?.getActiveObjects().forEach((object) => {
      object.set({ fill: value });
    });
    
    canvas?.renderAll();
    saveState();
  }, [canvas, saveState]);

  const changeStrokeColor = useCallback((value: string) => {
    setStrokeColor(value);
    
    canvas?.getActiveObjects().forEach((object) => {
      if (isTextType(object.type)) {
        object.set({ fill: value });
        return;
      }
      object.set({ stroke: value });
    });
    
    canvas?.renderAll();
    saveState();
  }, [canvas, saveState]);

  const changeStrokeWidth = useCallback((value: number) => {
    setStrokeWidth(value);
    
    canvas?.getActiveObjects().forEach((object) => {
      object.set({ strokeWidth: value });
    });
    
    canvas?.renderAll();
    saveState();
  }, [canvas, saveState]);

  // Initialize canvas events
  useCanvasEvents({
    canvas,
    setSelectedObjects,
  });

  // Build and memoize editor interface
  const editor = useMemo(() => {
    if (!canvas) return;

    return {
      // Canvas reference
      canvas,
      
      // Selection
      selectedObjects,
      isObjectSelected: () => canvas.getActiveObjects().length > 0,
      getActiveObjects: () => canvas.getActiveObjects(),

      // Color Management
      changeFillColor,
      changeStrokeColor,
      changeStrokeWidth,
      getFillColor: () => fillColor,
      getStrokeColor: () => strokeColor,
      getStrokeWidth: () => strokeWidth,

      // Shape Creation
      addCircle: () => {
        const circle = new fabric.Circle({
          ...CIRCLE_OPTIONS,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
        });
        addToCanvas(circle);
      },

      addSoftRectangle: () => {
        const rect = new fabric.Rect({
          ...RECTANGLE_OPTIONS,
          rx: 50,
          ry: 50,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
        });
        addToCanvas(rect);
      },

      addRectangle: () => {
        const rect = new fabric.Rect({
          ...RECTANGLE_OPTIONS,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
        });
        addToCanvas(rect);
      },

      addTriangle: () => {
        const triangle = new fabric.Triangle({
          ...TRIANGLE_OPTIONS,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
        });
        addToCanvas(triangle);
      },

      addInverseTriangle: () => {
        const { width, height } = TRIANGLE_OPTIONS;
        const points = [
          { x: 0, y: 0 },
          { x: width, y: 0 },
          { x: width / 2, y: height }
        ];
        
        const triangle = new fabric.Polygon(points, {
          ...TRIANGLE_OPTIONS,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
        });
        addToCanvas(triangle);
      },

      addDiamond: () => {
        const { width, height } = DIAMOND_OPTIONS;
        const points = [
          { x: width / 2, y: 0 },
          { x: width, y: height / 2 },
          { x: width / 2, y: height },
          { x: 0, y: height / 2 }
        ];
        
        const diamond = new fabric.Polygon(points, {
          ...DIAMOND_OPTIONS,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
        });
        addToCanvas(diamond);
      },
    };
  }, [
    canvas,
    fillColor,
    strokeColor,
    strokeWidth,
    selectedObjects,
    addToCanvas,
    changeFillColor,
    changeStrokeColor,
    changeStrokeWidth,
  ]);

  // Canvas initialization
  const init = useCallback(({ 
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

    // Save initial state
    canvasHistory.current = {
      states: [JSON.stringify(fabricCanvas.toJSON())],
      currentStateIndex: 0,
    };

    return fabricCanvas;
  }, []);

  return {
    init,
    editor,
  };
};