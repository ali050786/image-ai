// src/features/editor/hooks/objects/useEditorObjects.ts

import { useCallback } from 'react';
import { fabric } from 'fabric';
import {
  CIRCLE_OPTIONS,
  RECTANGLE_OPTIONS,
  TRIANGLE_OPTIONS,
  DIAMOND_OPTIONS,
  TEXT_OPTIONS,
} from '../../types';
import type { EditorCoreState } from '../core/useEditorCore';

interface UseEditorObjectsProps extends EditorCoreState {
  addToCanvas: (object: fabric.Object) => void;
  saveState: () => void;
}

export const useEditorObjects = ({
  canvas,
  addToCanvas,
  saveState
}: UseEditorObjectsProps) => {
  // Shape Creation
  const addCircle = useCallback((options = CIRCLE_OPTIONS) => {
    const circle = new fabric.Circle(options);
    addToCanvas(circle);
  }, [addToCanvas]);

  const addSoftRectangle = useCallback(() => {
    const rect = new fabric.Rect({
      ...RECTANGLE_OPTIONS,
      rx: 50,
      ry: 50,
    });
    addToCanvas(rect);
  }, [addToCanvas]);

  const addRectangle = useCallback(() => {
    const rect = new fabric.Rect(RECTANGLE_OPTIONS);
    addToCanvas(rect);
  }, [addToCanvas]);

  const addTriangle = useCallback(() => {
    const triangle = new fabric.Triangle(TRIANGLE_OPTIONS);
    addToCanvas(triangle);
  }, [addToCanvas]);

  const addInverseTriangle = useCallback(() => {
    const { width, height } = TRIANGLE_OPTIONS;
    const points = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width / 2, y: height }
    ];

    const triangle = new fabric.Polygon(points, TRIANGLE_OPTIONS);
    addToCanvas(triangle);
  }, [addToCanvas]);

  const addDiamond = useCallback(() => {
    const { width, height } = DIAMOND_OPTIONS;
    const points = [
      { x: width / 2, y: 0 },
      { x: width, y: height / 2 },
      { x: width / 2, y: height },
      { x: 0, y: height / 2 }
    ];

    const diamond = new fabric.Polygon(points, DIAMOND_OPTIONS);
    addToCanvas(diamond);
  }, [addToCanvas]);

  // Text Creation
  const addText = useCallback((value: string, options: Partial<fabric.ITextboxOptions> = {}) => {
    const textbox = new fabric.Textbox(value, {
      ...TEXT_OPTIONS,
      ...options
    });
    addToCanvas(textbox);
  }, [addToCanvas]);

  // Object Manipulation
  const deleteObjects = useCallback(() => {
    if (!canvas) return;
    
    canvas.getActiveObjects().forEach((object) => canvas.remove(object));
    canvas.discardActiveObject();
    canvas.renderAll();
    saveState();
  }, [canvas, saveState]);

  const bringForward = useCallback(() => {
    if (!canvas) return;

    canvas.getActiveObjects().forEach((object) => {
      canvas.bringForward(object);
    });

    canvas.renderAll();

    // Keep workspace in back
    const workspace = canvas.getObjects().find((obj) => obj.name === "clip");
    workspace?.sendToBack();

    saveState();
  }, [canvas, saveState]);

  const sendBackwards = useCallback(() => {
    if (!canvas) return;

    canvas.getActiveObjects().forEach((object) => {
      canvas.sendBackwards(object);
    });

    canvas.renderAll();

    // Keep workspace in back
    const workspace = canvas.getObjects().find((obj) => obj.name === "clip");
    workspace?.sendToBack();

    saveState();
  }, [canvas, saveState]);

  return {
    // Shape Creation
    addCircle,
    addSoftRectangle,
    addRectangle,
    addTriangle,
    addInverseTriangle,
    addDiamond,
    
    // Text Creation
    addText,
    
    // Object Manipulation
    deleteObjects,
    bringForward,
    sendBackwards,
  };
};