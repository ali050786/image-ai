// src/features/editor/types.ts
import { fabric } from 'fabric';

export interface Editor {
  canvas: fabric.Canvas;
  selectedObjects: fabric.Object[];
  
  // Selection methods
  isObjectSelected: () => boolean;
  getActiveObjects: () => fabric.Object[];

  // Color management methods
  getFillColor: () => string;
  getStrokeWidth: () => number;
  changeFillColor: (value: string) => void;
  changeStrokeColor: (value: string) => void;
  changeStrokeWidth: (value: number) => void;
  getActiveFillColor: () => string;
  getActiveStrokeColor: () => string;
  getActiveStrokeWidth: () => number;  // Add this line

  getActiveStrokeDashArray: () => number[];
  getActiveStrokeLineJoin: () => string;
  getActiveStrokeLineCap: () => string;
  changeStrokeDashArray: (value: number[]) => void;
  changeStrokeLineJoin: (value: string) => void;
  changeStrokeLineCap: (value: string) => void;


  bringForward: () => void;
  sendBackwards: () => void;

  // Shape creation methods
  addCircle: () => void;
  addSoftRectangle: () => void;
  addRectangle: () => void;
  addTriangle: () => void;
  addInverseTriangle: () => void;
  addDiamond: () => void;
}

// Default style constants
export const FILL_COLOR = 'rgba(0, 0, 0, 1)';
export const STROKE_COLOR = 'rgba(0, 0, 0, 1)';
export const STROKE_WIDTH = 2;

export const CIRCLE_OPTIONS = {
  radius: 150,
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
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