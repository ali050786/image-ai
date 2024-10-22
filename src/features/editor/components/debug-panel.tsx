// src/features/editor/components/debug-panel.tsx
import React from 'react';
import { fabric } from 'fabric';

interface DebugPanelProps {
  testObject: fabric.Rect | null;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ testObject }) => {
  if (!testObject) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
      <h3 className="font-bold mb-2">Test Rectangle Debug</h3>
      <div className="space-y-1 text-sm">
        <p>Width: {testObject.width}</p>
        <p>Height: {testObject.height}</p>
        <p>Left: {Math.round(testObject.left || 0)}</p>
        <p>Top: {Math.round(testObject.top || 0)}</p>
        <p>Angle: {Math.round(testObject.angle || 0)}°</p>
      </div>
    </div>
  );
};