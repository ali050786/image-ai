// src/features/editor/hooks/objects/useSVGImport.ts

import { useCallback } from 'react';
import { fabric } from 'fabric';
import type { EditorCoreState } from '../core/useEditorCore';

interface UseSVGImportProps extends EditorCoreState {
  addToCanvas: (object: fabric.Object) => void;
  saveState: () => void;
}

export const useSVGImport = ({
  canvas,
  addToCanvas,
  saveState
}: UseSVGImportProps) => {
  const loadSVG = useCallback(async (file: File): Promise<void> => {
    if (!canvas) {
      throw new Error('Canvas not initialized');
    }

    try {
      const text = await file.text();
      
      return new Promise((resolve, reject) => {
        fabric.loadSVGFromString(text, (objects, options) => {
          try {
            if (objects.length === 0) {
              reject(new Error('No valid SVG elements found'));
              return;
            }

            // Scale factor calculation
            const svgGroup = new fabric.Group(objects);
            const maxDimension = Math.max(svgGroup.width || 0, svgGroup.height || 0);
            const scaleFactor = maxDimension > 500 ? 500 / maxDimension : 1;

            // If multiple objects, group them
            if (objects.length > 1) {
              const group = new fabric.Group(objects);
              group.scale(scaleFactor);
              
              // Center the group
              const canvasCenter = canvas.getCenter();
              group.set({
                left: canvasCenter.left,
                top: canvasCenter.top,
                originX: 'center',
                originY: 'center'
              });
              
              addToCanvas(group);
            } else {
              // Single object
              const object = objects[0];
              object.scale(scaleFactor);
              
              // Center the object
              const canvasCenter = canvas.getCenter();
              object.set({
                left: canvasCenter.left,
                top: canvasCenter.top,
                originX: 'center',
                originY: 'center'
              });
              
              addToCanvas(object);
            }
            
            saveState();
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error('Error importing SVG:', error);
      throw error;
    }
  }, [canvas, addToCanvas, saveState]);

  return { loadSVG };
};
