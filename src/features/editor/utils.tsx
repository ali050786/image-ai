// src/features/editor/utils.ts
import { fabric } from "fabric";
import type { RGBColor } from "react-color";


interface Bounds {
    left: number;
    top: number;
    width: number;
    height: number;
  }
/**
 * Checks if the given type is a text-based fabric object type
 */
export function isTextType(type: string | undefined): boolean {
  return type === "text" || 
         type === "i-text" || 
         type === "textbox";
}

/**
 * Converts JSON objects with text properties for fabric.js compatibility
 */
export function transformText(objects: any) {
  if (!objects) return;

  objects.forEach((item: any) => {
    if (item.objects) {
      transformText(item.objects);
    } else {
      if (item.type === "text") {
        item.type = "textbox";
      }
    }
  });
}

/**
 * Converts a file to a downloadable format
 */
export function downloadFile(file: string, type: string) {
  const anchorElement = document.createElement("a");
  anchorElement.href = file;
  anchorElement.download = `${crypto.randomUUID()}.${type}`;
  document.body.appendChild(anchorElement);
  anchorElement.click();
  anchorElement.remove();
}

/**
 * Converts an RGBA color object to a string representation
 */
export function rgbaObjectToString(rgba: RGBColor | "transparent"): string {
  if (rgba === "transparent") {
    return `rgba(0,0,0,0)`;
  }

  const alpha = rgba.a === undefined ? 1 : rgba.a;
  return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${alpha})`;
}

/**
 * Gets the center point of a fabric object
 */
export function getObjectCenter(object: fabric.Object): { x: number; y: number } {
  const bounds = object.getBoundingRect();
  return {
    x: bounds.left + bounds.width / 2,
    y: bounds.top + bounds.height / 2
  };
}

/**
 * Check if a value is a valid color string
 */
export function isValidColor(color: any): boolean {
  if (typeof color !== 'string') return false;
  
  // Check for transparent
  if (color === 'transparent') return true;
  
  // Check for rgba
  if (color.startsWith('rgba(')) {
    const values = color.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([0-9.]+)\)$/);
    if (!values) return false;
    
    const [_, r, g, b, a] = values.map(Number);
    return (
      r >= 0 && r <= 255 &&
      g >= 0 && g <= 255 &&
      b >= 0 && b <= 255 &&
      a >= 0 && a <= 1
    );
  }
  
  // Check for hex
  if (color.startsWith('#')) {
    return /^#([A-Fa-f0-9]{3}){1,2}$/.test(color);
  }
  
  return false;
}

/**
 * Creates a JSON representation of canvas state for saving
 */
export function createCanvasState(canvas: fabric.Canvas): string {
  const json = canvas.toJSON([
    'name',
    'gradientAngle',
    'selectable',
    'hasControls',
    'lockMovementX',
    'lockMovementY',
    'lockRotation',
    'lockScalingX',
    'lockScalingY',
    'lockUniScaling',
    'editable',
    'objectCaching'
  ]);
  
  transformText(json.objects);
  return JSON.stringify(json);
}

/**
 * Calculates dimensions while maintaining aspect ratio
 */
export function calculateAspectRatioDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const ratio = Math.min(maxWidth / originalWidth, maxHeight / originalHeight);
  
  return {
    width: originalWidth * ratio,
    height: originalHeight * ratio
  };
}

/**
 * Checks if an object is within the bounds of another object
 */
export function isWithinBounds(
  object: fabric.Object,
  bounds: fabric.Object
): boolean {
  const objectBounds = object.getBoundingRect();
  const containerBounds = bounds.getBoundingRect();
  
  return (
    objectBounds.left >= containerBounds.left &&
    objectBounds.top >= containerBounds.top &&
    objectBounds.left + objectBounds.width <= containerBounds.left + containerBounds.width &&
    objectBounds.top + objectBounds.height <= containerBounds.top + containerBounds.height
  );
}

/**
 * Groups selected objects while maintaining their relative positions
 */
export function groupSelectedObjects(canvas: fabric.Canvas): void {
  const activeSelection = canvas.getActiveObject() as fabric.ActiveSelection;
  if (!activeSelection || !activeSelection.type || activeSelection.type !== 'activeSelection') return;

  activeSelection.toGroup();
  canvas.requestRenderAll();
}

/**
 * Ungroups a selected group while maintaining object positions
 */
export function ungroupSelectedObjects(canvas: fabric.Canvas): void {
  const activeObject = canvas.getActiveObject() as fabric.Group;
  if (!activeObject || !activeObject.type || activeObject.type !== 'group') return;

  activeObject.toActiveSelection();
  canvas.requestRenderAll();
}

/**
 * Aligns objects relative to the canvas or selection bounds
 */
export type AlignmentType = 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom';

export function alignObjects(
    canvas: fabric.Canvas,
    alignType: AlignmentType,
    relativeToBounds: boolean = false
  ): void {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
  
    const objects = activeObject.type === 'activeSelection' 
      ? (activeObject as fabric.ActiveSelection).getObjects()
      : [activeObject];
  
    if (objects.length === 0) return;
  
    const bounds = relativeToBounds
      ? activeObject.getBoundingRect()
      : {
          left: canvas.getVpCenter().x,
          top: canvas.getVpCenter().y,
          width: canvas.getWidth(),
          height: canvas.getHeight(),
        };
  
    objects.forEach(obj => {
      switch(alignType) {
        case 'left':
          obj.set({ left: bounds.left });
          break;
        case 'center':
          obj.centerH();
          break;
        case 'right':
          obj.set({ left: bounds.left + bounds.width - obj.getScaledWidth() });
          break;
        case 'top':
          obj.set({ top: bounds.top });
          break;
        case 'middle':
          obj.centerV();
          break;
        case 'bottom':
          obj.set({ top: bounds.top + bounds.height - obj.getScaledHeight() });
          break;
      }
    });

  canvas.requestRenderAll();
}