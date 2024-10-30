// src/features/editor/api/exports.ts

import { fabric } from 'fabric';
import { createCanvasState, downloadFile } from '../utils';

export interface ExportOptions {
  format: 'json' | 'svg';
  name?: string;
}

interface ExportAPI {
  exportToJSON: (canvas: fabric.Canvas) => string;
  exportToSVG: (canvas: fabric.Canvas) => string;
  downloadExport: (data: string, options: ExportOptions) => void;
}

export const exportApi: ExportAPI = {
  // Export to JSON format
  exportToJSON: (canvas: fabric.Canvas): string => {
    try {
      return createCanvasState(canvas);
    } catch (error) {
      console.error('Error exporting to JSON:', error);
      throw new Error('Failed to export canvas to JSON');
    }
  },

  // Export to SVG format
  exportToSVG: (canvas: fabric.Canvas): string => {
    try {
      // Get workspace dimensions
      const workspace = canvas.getObjects().find(obj => obj.name === 'clip');
      if (!workspace) throw new Error('Workspace not found');

      // Get workspace bounds
      const bounds = workspace.getBoundingRect();

      // Configure SVG export options
      const options: fabric.IToSVGOptions = {
        width: bounds.width.toString(),
        height: bounds.height.toString(),
        viewBox: {
          x: bounds.left,
          y: bounds.top,
          width: bounds.width,
          height: bounds.height
        },
        encoding: 'UTF-8',
        suppressPreamble: false
      };

      // Get SVG string with proper dimensions
      let svgString = canvas.toSVG(options);

      // Post-process SVG if needed
      svgString = svgString.replace(
        /xmlns="http:\/\/www\.w3\.org\/2000\/svg"/,
        'xmlns="http://www.w3.org/2000/svg"'
      );

      return svgString;
    } catch (error) {
      console.error('Error exporting to SVG:', error);
      throw new Error('Failed to export canvas to SVG');
    }
  },

  // Download exported file
  downloadExport: (data: string, options: ExportOptions): void => {
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const defaultName = `canvas-export-${timestamp}`;
      const fileName = options.name || defaultName;
      
      switch (options.format) {
        case 'json': {
          const blob = new Blob([data], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          downloadFile(url, 'json');
          URL.revokeObjectURL(url);
          break;
        }
        case 'svg': {
          const blob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          downloadFile(url, 'svg');
          URL.revokeObjectURL(url);
          break;
        }
        default:
          throw new Error(`Unsupported export format: ${options.format}`);
      }
    } catch (error) {
      console.error('Error downloading export:', error);
      throw new Error('Failed to download export');
    }
  }
};