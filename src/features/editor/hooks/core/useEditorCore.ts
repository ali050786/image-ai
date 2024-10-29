// src/features/editor/hooks/core/useEditorCore.ts

import { useCallback, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { useAutoResize } from '../use-auto-resize';
import { useCanvasEvents } from '../use-canvas-events';

interface CanvasHistory {
  states: string[];
  currentStateIndex: number;
}

export interface EditorCoreState {
  canvas: fabric.Canvas | null;
  container: HTMLDivElement | null;
  selectedObjects: fabric.Object[];
}

export interface EditorCoreProps {
  clearSelectionCallback?: () => void;
}

export const useEditorCore = ({ clearSelectionCallback }: EditorCoreProps = {}) => {
  // Core State - Define states first
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);

  // History Management
  const canvasHistory = useRef<CanvasHistory>({
    states: [],
    currentStateIndex: -1,
  });

  // Initialize Auto-resize
  const { autoZoom } = useAutoResize({ canvas, container });

  // Initialize canvas events
  useCanvasEvents({
    canvas,
    setSelectedObjects,
    clearSelectionCallback,
  });

  // Workspace Management
  const getWorkspace = useCallback(() => {
    return canvas?.getObjects().find((object) => object.name === "clip");
  }, [canvas]);

  // Center Object
  const center = useCallback((object: fabric.Object) => {
    const workspace = getWorkspace();
    const center = workspace?.getCenterPoint();

    if (!center || !canvas) return;

    // @ts-ignore - Method exists but not typed in fabric types
    canvas._centerObject(object, center);
  }, [canvas, getWorkspace]);

  // Add object to canvas
  const addToCanvas = useCallback((object: fabric.Object) => {
    if (!canvas) return;

    center(object);
    canvas.add(object);
    canvas.setActiveObject(object);
    saveState();
  }, [canvas, center]);

  // History Management
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

  // Selection helpers
  const isObjectSelected = useCallback((): boolean => {
    if (!canvas) return false;
    const activeObjects = canvas.getActiveObjects();
    return activeObjects ? activeObjects.length > 0 : false;
  }, [canvas]);

  const getActiveObjects = useCallback((): fabric.Object[] => {
    if (!canvas) return [];
    return canvas.getActiveObjects() || [];
  }, [canvas]);

  // Canvas Initialization
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

    // Set canvas dimensions
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

    // Setup workspace and clipping
    fabricCanvas.add(workspace);
    fabricCanvas.centerObject(workspace);
    fabricCanvas.clipPath = workspace;

    // Configure object controls
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

    // Initialize history
    canvasHistory.current = {
      states: [JSON.stringify(fabricCanvas.toJSON())],
      currentStateIndex: 0,
    };

    return fabricCanvas;
  }, []);

  return {
    // State
    canvas,
    container,
    selectedObjects,
    
    // Core Methods
    init,
    addToCanvas,
    saveState,
    getWorkspace,
    center,
    autoZoom,
    
    // Selection Methods
    isObjectSelected,
    getActiveObjects,
  };
};