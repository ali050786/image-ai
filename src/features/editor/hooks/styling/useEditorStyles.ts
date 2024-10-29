import { useCallback, useState } from 'react';
import { isTextType } from '../../utils';
import { TextObject, FontStyle, TextAlign } from '../../types';
import { backgroundApi } from '../../api/background';
import type { EditorCoreState } from '../core/useEditorCore';
import { fabric } from 'fabric';

interface UseEditorStylesProps extends EditorCoreState {
  saveState: () => void;
}

export const useEditorStyles = ({
    canvas,
    selectedObjects,
    saveState
  }: UseEditorStylesProps) => {

    // Style States
  const [fillColor, setFillColor] = useState('rgba(0, 0, 0, 1)');
  const [strokeColor, setStrokeColor] = useState('rgba(0, 0, 0, 1)');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // Color Management
  const changeFillColor = useCallback((value: string) => {
    setFillColor(value);
    canvas?.getActiveObjects().forEach((object) => {
      object.set({ fill: value });
    });
    canvas?.renderAll();
    saveState();
  }, [canvas, saveState]);

  // Font Methods
  const changeFontSize = useCallback((value: number) => {
    if (!canvas) return;
    canvas.getActiveObjects().forEach((object) => {
      if (isTextType(object.type)) {
        (object as TextObject).set({ fontSize: value });
      }
    });
    canvas.renderAll();
    saveState();
  }, [canvas, saveState]);

  const changeFontWeight = useCallback((value: number) => {
    if (!canvas) return;
    canvas.getActiveObjects().forEach((object) => {
      if (isTextType(object.type)) {
        (object as TextObject).set({ fontWeight: value });
      }
    });
    canvas.renderAll();
    saveState();
  }, [canvas, saveState]);

  const changeFontUnderline = useCallback((value: boolean) => {
    if (!canvas) return;
    canvas.getActiveObjects().forEach((object) => {
      if (isTextType(object.type)) {
        (object as TextObject).set({ underline: value });
      }
    });
    canvas.renderAll();
    saveState();
  }, [canvas, saveState]);

  const changeFontLinethrough = useCallback((value: boolean) => {
    if (!canvas) return;
    canvas.getActiveObjects().forEach((object) => {
      if (isTextType(object.type)) {
        (object as TextObject).set({ linethrough: value });
      }
    });
    canvas.renderAll();
    saveState();
  }, [canvas, saveState]);

  // Font Getters

  const getActiveFontUnderline = useCallback(() => {
    const selectedObject = selectedObjects[0] as TextObject;
    if (!selectedObject || !isTextType(selectedObject.type)) {
      return false;
    }
    return selectedObject.underline || false;
  }, [selectedObjects]);

  const getActiveFontLinethrough = useCallback(() => {
    const selectedObject = selectedObjects[0] as TextObject;
    if (!selectedObject || !isTextType(selectedObject.type)) {
      return false;
    }
    return selectedObject.linethrough || false;
  }, [selectedObjects]);

  // Style States
  // Color Management
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

  // Stroke Management
  const changeStrokeWidth = useCallback((value: number) => {
    setStrokeWidth(value);
    
    canvas?.getActiveObjects().forEach((object) => {
      object.set({ strokeWidth: value });
    });

    canvas?.renderAll();
    saveState();
  }, [canvas, saveState]);

  // Opacity Management
  const changeOpacity = useCallback((value: number) => {
    canvas?.getActiveObjects().forEach((object) => {
      object.set({ opacity: value });
    });

    canvas?.renderAll();
    saveState();
  }, [canvas, saveState]);

  // Text Styling
  const changeFontFamily = useCallback((value: string) => {
    canvas?.getActiveObjects().forEach((object) => {
      if (isTextType(object.type)) {
        (object as TextObject).set({ fontFamily: value });
      }
    });

    canvas?.renderAll();
    saveState();
  }, [canvas, saveState]);

  const changeFontStyle = useCallback((value: FontStyle) => {
    canvas?.getActiveObjects().forEach((object) => {
      if (isTextType(object.type)) {
        (object as TextObject).set({ fontStyle: value });
      }
    });

    canvas?.renderAll();
    saveState();
  }, [canvas, saveState]);

  const changeTextAlign = useCallback((value: TextAlign) => {
    canvas?.getActiveObjects().forEach((object) => {
      if (isTextType(object.type)) {
        (object as TextObject).set({ textAlign: value });
      }
    });

    canvas?.renderAll();
    saveState();
  }, [canvas, saveState]);

  // Background Removal
  const removeBackground = useCallback(async () => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObjects()[0];
    if (!activeObject || activeObject.type !== 'image') return;

    try {
      setIsProcessingImage(true);
      
      const imageElement = (activeObject as fabric.Image).getElement() as HTMLImageElement;
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = imageElement.width;
      tempCanvas.height = imageElement.height;
      
      const ctx = tempCanvas.getContext('2d');
      if (!ctx) return;
      
      ctx.drawImage(imageElement, 0, 0);
      const imageData = tempCanvas.toDataURL();
      
      const processedImageData = await backgroundApi.removeBackground(imageData);
      
      fabric.Image.fromURL(processedImageData, (img) => {
        if (!canvas) return;
        
        img.set({
          left: activeObject.left,
          top: activeObject.top,
          scaleX: activeObject.scaleX,
          scaleY: activeObject.scaleY,
          angle: activeObject.angle,
        });
        
        canvas.remove(activeObject);
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        saveState();
      });
    } catch (error) {
      console.error('Failed to remove background:', error);
    } finally {
      setIsProcessingImage(false);
    }
  }, [canvas, saveState]);

  // Getters
  const getActiveFillColor = useCallback(() => {
    return selectedObjects[0]?.get('fill') as string || fillColor;
  }, [selectedObjects, fillColor]);

  const getActiveStrokeColor = useCallback(() => {
    return selectedObjects[0]?.get('stroke') as string || strokeColor;
  }, [selectedObjects, strokeColor]);

  const getActiveStrokeWidth = useCallback(() => {
    return selectedObjects[0]?.get('strokeWidth') as number || strokeWidth;
  }, [selectedObjects, strokeWidth]);

  const getActiveOpacity = useCallback(() => {
    return selectedObjects[0]?.get('opacity') as number || 1;
  }, [selectedObjects]);

  const getActiveFontFamily = useCallback(() => {
    const selectedObject = selectedObjects[0] as TextObject;
    if (!selectedObject || !isTextType(selectedObject.type)) {
      return "Arial";
    }
    return selectedObject.fontFamily || "Arial";
  }, [selectedObjects]);

  const getActiveFontStyle = useCallback(() => {
    const selectedObject = selectedObjects[0] as TextObject;
    if (!selectedObject || !isTextType(selectedObject.type)) {
      return "normal" as FontStyle;
    }
    return (selectedObject.fontStyle || "normal") as FontStyle;
  }, [selectedObjects]);

  const getActiveFontSize = useCallback(() => {
    const selectedObject = selectedObjects[0] as TextObject;
    if (!selectedObject || !isTextType(selectedObject.type)) {
      return 32;
    }
    return selectedObject.fontSize || 32;
  }, [selectedObjects]);

  const getActiveTextAlign = useCallback(() => {
    const selectedObject = selectedObjects[0] as TextObject;
    if (!selectedObject || !isTextType(selectedObject.type)) {
      return "left" as TextAlign;
    }
    return (selectedObject.textAlign || "left") as TextAlign;
  }, [selectedObjects]);

  const getActiveFontWeight = useCallback(() => {
    const selectedObject = selectedObjects[0] as TextObject;
    if (!selectedObject || !isTextType(selectedObject.type)) {
      return 400;
    }
    return selectedObject.fontWeight || 400;
  }, [selectedObjects]);

  return {
    // States
    fillColor,
    strokeColor,
    strokeWidth,
    isProcessingImage,

    // Color Methods
    changeFillColor,
    changeStrokeColor,
    changeStrokeWidth,
    changeOpacity,

    // Font Methods
    changeFontSize,
    changeFontWeight,
    changeFontUnderline,
    changeFontLinethrough,
    changeFontFamily,
    changeFontStyle,
    changeTextAlign,

    // Font Getters
    getActiveFontSize,
    getActiveFontUnderline,
    getActiveFontLinethrough,
    getActiveFontFamily,
    getActiveFontStyle,
    getActiveFontWeight,
    getActiveTextAlign,

    // Style Getters
    getActiveFillColor,
    getActiveStrokeColor,
    getActiveStrokeWidth,
    getActiveOpacity,

    // Background Methods
    removeBackground,
  };
};