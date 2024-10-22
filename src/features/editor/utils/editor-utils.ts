import { fabric } from 'fabric';

export const createTestRect = (config: {
  width: number;
  height: number;
  fill: string;
}) => {
  return new fabric.Rect({
    ...config,
    originX: 'center',
    originY: 'center',
  });
};

export const centerObjectInWorkspace = (
  canvas: fabric.Canvas,
  object: fabric.Object,
  workspace: fabric.Rect
) => {
  const workspaceCenter = workspace.getCenterPoint();
  object.setPositionByOrigin(workspaceCenter, 'center', 'center');
  canvas.renderAll();
};