// src/features/editor/types.ts
import { fabric } from 'fabric';


export interface TextObject extends fabric.IText {
  fontSize?: number;
  fontFamily?: string;
  fontStyle?: "" | "normal" | "italic" | "oblique";  // Updated type
  fontWeight?: number;
  textAlign?: "left" | "center" | "right" | "justify";  // Specific alignment options 
  underline?: boolean;
  linethrough?: boolean;
}


export interface Editor {
    // Core Properties
    canvas: fabric.Canvas;
    selectedObjects: fabric.Object[];
  
    // Core Methods
    isObjectSelected: () => boolean;
    getActiveObjects: () => fabric.Object[];
  
    // Object Methods
    addCircle: (options?: typeof CIRCLE_OPTIONS) => void;
    addSoftRectangle: () => void;
    addRectangle: () => void;
    addTriangle: () => void;
    addInverseTriangle: () => void;
    addDiamond: () => void;
    addText: (value: string, options?: Partial<fabric.ITextboxOptions>) => void;
    delete: () => void;
    bringForward: () => void;
    sendBackwards: () => void;
  
    // Style Methods
    changeFillColor: (value: string) => void;
    changeStrokeColor: (value: string) => void;
    changeStrokeWidth: (value: number) => void;
    changeOpacity: (value: number) => void;
    changeFontFamily: (value: string) => void;
    changeFontStyle: (value: FontStyle) => void;
    changeTextAlign: (value: TextAlign) => void;
    changeFontSize: (value: number) => void;
    changeFontWeight: (value: number) => void;
    changeFontUnderline: (value: boolean) => void;
    changeFontLinethrough: (value: boolean) => void;
  
    // Style Getters
    getFillColor: () => string;
    getStrokeColor: () => string;
    getStrokeWidth: () => number;
    getActiveFillColor: () => string;
    getActiveStrokeColor: () => string;
    getActiveStrokeWidth: () => number;
    getActiveOpacity: () => number;
  
    // Font Getters
    getActiveFontSize: () => number;
    getActiveFontFamily: () => string;
    getActiveFontStyle: () => FontStyle;
    getActiveFontWeight: () => number;
    getActiveTextAlign: () => TextAlign;
    getActiveFontUnderline: () => boolean;
    getActiveFontLinethrough: () => boolean;
  
    // Stroke Methods
    getActiveStrokeDashArray: () => number[];
    getActiveStrokeLineJoin: () => string;
    getActiveStrokeLineCap: () => string;
    changeStrokeDashArray: (value: number[]) => void;
    changeStrokeLineJoin: (value: string) => void;
    changeStrokeLineCap: (value: string) => void;
  
    // Background Removal
    removeBackground: () => Promise<void>;
    isProcessingImage: boolean;

    loadSVG: (file: File) => Promise<void>;
}

// Default style constants
export const FILL_COLOR = 'rgba(0, 0, 0, 1)';
export const STROKE_COLOR = 'rgba(0, 0, 0, 1)';
export const STROKE_WIDTH = 2;
export const FONT_FAMILY = "Arial";
export const FONT_SIZE = 32

export type FontStyle = "" | "normal" | "italic" | "oblique";
export type TextAlign = "left" | "center" | "right" | "justify";

export const CIRCLE_OPTIONS = {
  radius: 150,
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
};

export const TEXT_OPTIONS = {
  type: "textbox",
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  fontSize: FONT_SIZE,
  fontFamily: FONT_FAMILY,
};

export const RECTANGLE_OPTIONS = {
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
  width: 400,
  height: 400,
  angle: 0,
};

export const TRIANGLE_OPTIONS = {
  ...RECTANGLE_OPTIONS
};

export const DIAMOND_OPTIONS = {
  ...RECTANGLE_OPTIONS,
  width: 600,
  height: 600,
};

export const selectionDependentTools = [
  "fill",
  "stroke-color",  // Add this
  "font",
  "filter",
  "opacity",
  "remove-bg",
  "stroke-width",
] as const;

export const fonts = [
  "Arial",
  "Arial Black",
  "Verdana",
  "Helvetica",
  "Tahoma",
  "Times New Roman",
  "Georgia",
  "Courier New",
  "Comic Sans MS"
] as const;

export interface EditorState {
  isProcessingImage: boolean;
}