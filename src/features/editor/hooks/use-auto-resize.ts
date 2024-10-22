import { useEffect, useCallback } from 'react';
import { fabric } from 'fabric';

interface UseAutoResizeProps {
  canvas: fabric.Canvas | null;
  container: HTMLDivElement | null;
}

export const useAutoResize = ({ canvas, container }: UseAutoResizeProps) => {
  const autoZoom = useCallback(() => {
    if (!canvas || !container) return;

    // Get container dimensions
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    // Update canvas dimensions
    canvas.setWidth(width);
    canvas.setHeight(height);

    // Get canvas center
    const center = canvas.getCenter();

    // Define zoom ratio
    const zoomRatio = 0.85;

    // Find workspace
    const localWorkspace = canvas
      .getObjects()
      .find((object) => object.name === "clip");

    if (!localWorkspace) return;

    // @ts-ignore - Method exists but not in types
    const scale = fabric.util.findScaleToFit(localWorkspace, {
      width,
      height,
    });

    // Calculate zoom
    const zoom = zoomRatio * scale;

    // Reset viewport and apply zoom
    canvas.setViewportTransform(fabric.iMatrix.concat());
    canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoom);

    // Get workspace center
    const workspaceCenter = localWorkspace.getCenterPoint();
    const viewportTransform = canvas.viewportTransform;

    if (
      canvas.width === undefined ||
      canvas.height === undefined ||
      !viewportTransform
    ) {
      return;
    }

    // Calculate new transform values
    viewportTransform[4] = canvas.width / 2 - workspaceCenter.x * viewportTransform[0];
    viewportTransform[5] = canvas.height / 2 - workspaceCenter.y * viewportTransform[3];

    // Apply new transform
    canvas.setViewportTransform(viewportTransform);

    // Clone and update clipPath
    localWorkspace.clone((cloned: fabric.Rect) => {
      canvas.clipPath = cloned;
      canvas.requestRenderAll();
    });
  }, [canvas, container]);

  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;

    if (canvas && container) {
      resizeObserver = new ResizeObserver(() => {
        autoZoom();
      });

      resizeObserver.observe(container);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [canvas, container, autoZoom]);

  return { autoZoom };
};