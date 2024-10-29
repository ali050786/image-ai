// src/features/editor/hooks/useEditor.tsx

import { useMemo } from 'react';
import { fabric } from 'fabric';
import { useEditorCore } from './core/useEditorCore';
import { useEditorObjects } from './objects/useEditorObjects';
import { useEditorStyles } from './styling/useEditorStyles';
import { Editor, FontStyle, TextAlign } from '../types';
import { useSVGImport } from './objects/useSVGImport';

export interface EditorHookProps {
  clearSelectionCallback?: () => void;
}

export interface EditorHookResult {
  init: (props: {
    canvasElement: HTMLCanvasElement;
    container: HTMLDivElement;
  }) => fabric.Canvas;
  editor: Editor | undefined;
}

export const useEditor = ({ clearSelectionCallback }: EditorHookProps = {}): EditorHookResult => {
  // Initialize core functionality
  const core = useEditorCore({ clearSelectionCallback });

  // Initialize object management
  const objects = useEditorObjects({
    ...core,
    addToCanvas: core.addToCanvas,
    saveState: core.saveState,
  });

  // Initialize styling functionality
  const styles = useEditorStyles({
    ...core,
    saveState: core.saveState,
  });


   // Initialize SVG import functionality
   const svgImport = useSVGImport({
    ...core,
    addToCanvas: core.addToCanvas,
    saveState: core.saveState,
  });

  // Combine all functionality into the editor interface
  const editor = useMemo(() => {
    if (!core.canvas) return undefined;

    const editorInterface: Editor = {
      // Core Properties
      canvas: core.canvas,
      selectedObjects: core.selectedObjects,
      
      // Core Methods
      isObjectSelected: core.isObjectSelected,
      getActiveObjects: core.getActiveObjects,
      
      // Object Methods
      addCircle: objects.addCircle,
      addSoftRectangle: objects.addSoftRectangle,
      addRectangle: objects.addRectangle,
      addTriangle: objects.addTriangle,
      addInverseTriangle: objects.addInverseTriangle,
      addDiamond: objects.addDiamond,
      addText: objects.addText,
      delete: objects.deleteObjects,
      bringForward: objects.bringForward,
      sendBackwards: objects.sendBackwards,
      
      // Style Methods
      changeFillColor: styles.changeFillColor,
      changeStrokeColor: styles.changeStrokeColor,
      changeStrokeWidth: styles.changeStrokeWidth,
      changeOpacity: styles.changeOpacity,
      changeFontFamily: styles.changeFontFamily,
      changeFontStyle: styles.changeFontStyle,
      changeTextAlign: styles.changeTextAlign,
      changeFontSize: styles.changeFontSize,
      changeFontWeight: styles.changeFontWeight,
      changeFontUnderline: styles.changeFontUnderline,
      changeFontLinethrough: styles.changeFontLinethrough,
      
      // Font Methods
      getActiveFontSize: styles.getActiveFontSize || (() => 32),
      getActiveFontFamily: styles.getActiveFontFamily || (() => "Arial"),
      getActiveFontStyle: styles.getActiveFontStyle || (() => "normal" as FontStyle),
      getActiveFontWeight: styles.getActiveFontWeight || (() => 400),
      getActiveTextAlign: styles.getActiveTextAlign || (() => "left" as TextAlign),
      getActiveFontUnderline: styles.getActiveFontUnderline || (() => false),
      getActiveFontLinethrough: styles.getActiveFontLinethrough || (() => false),
      
      // Style Getters
      getFillColor: () => styles.fillColor,
      getStrokeColor: () => styles.strokeColor,
      getStrokeWidth: () => styles.strokeWidth,
      getActiveFillColor: styles.getActiveFillColor,
      getActiveStrokeColor: styles.getActiveStrokeColor,
      getActiveStrokeWidth: styles.getActiveStrokeWidth,
      getActiveOpacity: styles.getActiveOpacity,
      
      
      // Stroke Methods
      getActiveStrokeDashArray: () => [], // Add implementation if needed
      getActiveStrokeLineJoin: () => 'miter', // Add implementation if needed
      getActiveStrokeLineCap: () => 'butt', // Add implementation if needed
      changeStrokeDashArray: () => {}, // Add implementation if needed
      changeStrokeLineJoin: () => {}, // Add implementation if needed
      changeStrokeLineCap: () => {}, // Add implementation if needed
      
      // Background Removal
      removeBackground: styles.removeBackground,
      isProcessingImage: styles.isProcessingImage,
      loadSVG: svgImport.loadSVG,
    };

    return editorInterface;
  }, [core.canvas, core.selectedObjects, core, objects, styles, svgImport]);

  return {
    init: core.init,
    editor,
  };
};