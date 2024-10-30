import React, { useState } from 'react';
import { fabric } from 'fabric';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { TabsContent } from '../../../components/ui/tabs';
import { cn } from '../../../lib/utils';

interface GradientStop {
  offset: number;
  color: string;
}

interface GradientDirection {
  name: string;
  apply: (object: fabric.Object, startColor: string, endColor: string) => void;
}

const applyHorizontalGradient = (obj: fabric.Object, startColor: string, endColor: string) => {
  const width = obj.width! * (obj.scaleX || 1);
  obj.set({
    fill: new fabric.Gradient({
      type: 'linear',
      gradientUnits: 'pixels',
      coords: {
        x1: -width/2,
        y1: 0,
        x2: width/2,
        y2: 0
      },
      colorStops: [
        { offset: 0, color: startColor },
        { offset: 1, color: endColor }
      ]
    })
  });
};

const applyVerticalGradient = (obj: fabric.Object, startColor: string, endColor: string) => {
  const height = obj.height! * (obj.scaleY || 1);
  obj.set({
    fill: new fabric.Gradient({
      type: 'linear',
      gradientUnits: 'pixels',
      coords: {
        x1: 0,
        y1: -height/2,
        x2: 0,
        y2: height/2
      },
      colorStops: [
        { offset: 0, color: startColor },
        { offset: 1, color: endColor }
      ]
    })
  });
};

const applyDiagonalGradient = (obj: fabric.Object, startColor: string, endColor: string) => {
  const width = obj.width! * (obj.scaleX || 1);
  const height = obj.height! * (obj.scaleY || 1);
  obj.set({
    fill: new fabric.Gradient({
      type: 'linear',
      gradientUnits: 'pixels',
      coords: {
        x1: -width/2,
        y1: -height/2,
        x2: width/2,
        y2: height/2
      },
      colorStops: [
        { offset: 0, color: startColor },
        { offset: 1, color: endColor }
      ]
    })
  });
};

const GRADIENT_DIRECTIONS: GradientDirection[] = [
  { name: 'Horizontal', apply: applyHorizontalGradient },
  { name: 'Vertical', apply: applyVerticalGradient },
  { name: 'Diagonal', apply: applyDiagonalGradient },
];

export const GradientEditor = ({ 
  editor, 
  onClose 
}: { 
  editor: { 
    canvas: fabric.Canvas | null;
    selectedObjects: fabric.Object[];
  };
  onClose: () => void;
}) => {
  const [gradientColors, setGradientColors] = useState({
    startColor: '#ff0000',
    endColor: '#0000ff'
  });

  const handleGradientApply = (direction: GradientDirection) => {
    if (!editor.canvas || editor.selectedObjects.length === 0) return;

    editor.selectedObjects.forEach(obj => {
      direction.apply(obj, gradientColors.startColor, gradientColors.endColor);
    });

    editor.canvas.renderAll();
  };

  const handleColorChange = (type: 'startColor' | 'endColor', color: string) => {
    setGradientColors(prev => ({
      ...prev,
      [type]: color
    }));
  };

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Label>Gradient Colors</Label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs">Start Color</Label>
            <input
              type="color"
              value={gradientColors.startColor}
              onChange={(e) => handleColorChange('startColor', e.target.value)}
              className="w-full h-8 mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">End Color</Label>
            <input
              type="color"
              value={gradientColors.endColor}
              onChange={(e) => handleColorChange('endColor', e.target.value)}
              className="w-full h-8 mt-1"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Gradient Direction</Label>
        <div className="grid grid-cols-3 gap-2">
          {GRADIENT_DIRECTIONS.map((direction) => (
            <Button
              key={direction.name}
              variant="outline"
              onClick={() => handleGradientApply(direction)}
              className="w-full"
            >
              {direction.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Gradient Preview */}
      <div className="mt-4 p-2 border rounded">
        <Label className="text-xs mb-2">Preview</Label>
        <div 
          className="w-full h-16 rounded"
          style={{
            background: `linear-gradient(to right, ${gradientColors.startColor}, ${gradientColors.endColor})`
          }}
        />
      </div>
    </div>
  );
};

export default GradientEditor;