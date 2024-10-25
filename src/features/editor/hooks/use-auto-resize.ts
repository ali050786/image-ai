// src/features/editor/hooks/use-auto-resize.ts
import { useEffect, useCallback, useRef } from 'react';
import { fabric } from 'fabric';

interface UseAutoResizeProps {
  canvas: fabric.Canvas | null;
  container: HTMLDivElement | null;
}

export const useAutoResize = ({ canvas, container }: UseAutoResizeProps) => {
  // Add a debounce timer ref
  const resizeTimer = useRef<number>();
  const isResizing = useRef(false);

  const autoZoom = useCallback(() => {
    if (!canvas || !container || isResizing.current) return;

    try {
      isResizing.current = true;

      const width = container.offsetWidth;
      const height = container.offsetHeight;

      canvas.setWidth(width);
      canvas.setHeight(height);

      const center = canvas.getCenter();
      const zoomRatio = 0.85;

      const localWorkspace = canvas
        .getObjects()
        .find((object) => object.name === "clip");

      if (!localWorkspace) {
        isResizing.current = false;
        return;
      }

      // @ts-ignore
      const scale = fabric.util.findScaleToFit(localWorkspace, {
        width,
        height,
      });

      const zoom = zoomRatio * scale;

      canvas.setViewportTransform(fabric.iMatrix.concat());
      canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoom);

      const workspaceCenter = localWorkspace.getCenterPoint();
      const viewportTransform = canvas.viewportTransform;

      if (
        canvas.width === undefined ||
        canvas.height === undefined ||
        !viewportTransform
      ) {
        isResizing.current = false;
        return;
      }

      viewportTransform[4] = canvas.width / 2 - workspaceCenter.x * viewportTransform[0];
      viewportTransform[5] = canvas.height / 2 - workspaceCenter.y * viewportTransform[3];

      canvas.setViewportTransform(viewportTransform);

      localWorkspace.clone((cloned: fabric.Rect) => {
        if (canvas.clipPath !== cloned) {
          canvas.clipPath = cloned;
          canvas.requestRenderAll();
        }
        isResizing.current = false;
      });
    } catch (error) {
      console.error("Error in autoZoom:", error);
      isResizing.current = false;
    }
  }, [canvas, container]);

  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;

    const handleResize = () => {
      // Clear existing timer
      if (resizeTimer.current) {
        window.clearTimeout(resizeTimer.current);
      }

      // Set new timer
      resizeTimer.current = window.setTimeout(() => {
        if (!isResizing.current) {
          autoZoom();
        }
      }, 100); // Debounce time of 100ms
    };

    if (canvas && container) {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(container);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (resizeTimer.current) {
        window.clearTimeout(resizeTimer.current);
      }
    };
  }, [canvas, container, autoZoom]);

  return { autoZoom };
};