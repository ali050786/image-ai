import { fabric } from 'fabric';

export interface EditorState {
  canvas: fabric.Canvas | null;
  workspace: fabric.Rect | null;
  testObject: fabric.Rect | null;
}

export interface EditorObjects {
  workspace?: fabric.Rect;
  testObject?: fabric.Rect;
}

export interface WorkspaceConfig {
  width: number;
  height: number;
  background: string;
}

export interface TestObjectConfig {
  width: number;
  height: number;
  fill: string;
}