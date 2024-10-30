import React, { useState } from 'react';
import { fabric } from 'fabric';
import { Button } from '../../../../components/ui/button';
import { Label } from '../../../../components/ui/label';
import { Slider } from '../../../../components/ui/slider';
import { ScrollArea } from '../../../../components/ui/scroll-area';

interface GradientColors {
  startColor: string;
  endColor: string;
}

interface GradientPosition {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface GradientEditorProps {
  editor: {
    canvas: fabric.Canvas | null;
    selectedObjects: fabric.Object[];
  };
  onClose: () => void;
}

// Color utility functions
const hexToRgb = (hex: string) => {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return { r, g, b };
};

const rgbToHex = (r: number, g: number, b: number) => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

const interpolateColor = (startColor: string, endColor: string, factor: number) => {
  // Convert hex to rgb
  const start = hexToRgb(startColor);
  const end = hexToRgb(endColor);
  
  // Interpolate each component
  const r = Math.round(start.r + (end.r - start.r) * factor);
  const g = Math.round(start.g + (end.g - start.g) * factor);
  const b = Math.round(start.b + (end.b - start.b) * factor);
  
  // Convert back to hex
  return rgbToHex(r, g, b);
};

export const GradientEditor = ({ editor, onClose }: GradientEditorProps) => {
  const [gradientColors, setGradientColors] = useState<GradientColors>({
    startColor: '#ff0000',
    endColor: '#0000ff'
  });

  const [gradientPosition, setGradientPosition] = useState<GradientPosition>({
    startX: 0,
    startY: 50,
    endX: 100,
    endY: 50
  });

  const [currentDirection, setCurrentDirection] = useState<'horizontal' | 'vertical' | 'diagonal'>('horizontal');

  const applyGradient = (
    direction: 'horizontal' | 'vertical' | 'diagonal'
  ) => {
    if (!editor.canvas || editor.selectedObjects.length === 0) return;

    setCurrentDirection(direction);

    editor.selectedObjects.forEach(obj => {
      const width = obj.width! * (obj.scaleX || 1);
      const height = obj.height! * (obj.scaleY || 1);

      // Calculate coordinates based on gradient position percentages
      const x1 = (gradientPosition.startX / 100 - 0.5) * width;
      const y1 = (gradientPosition.startY / 100 - 0.5) * height;
      const x2 = (gradientPosition.endX / 100 - 0.5) * width;
      const y2 = (gradientPosition.endY / 100 - 0.5) * height;

      // Create gradient with current positions
      const gradient = new fabric.Gradient({
        type: 'linear',
        gradientUnits: 'pixels',
        coords: { x1, y1, x2, y2 },
        colorStops: [
          { offset: 0, color: gradientColors.startColor },
          { offset: 0.5, color: interpolateColor(gradientColors.startColor, gradientColors.endColor, 0.5) },
          { offset: 1, color: gradientColors.endColor }
        ]
      });

      obj.set({ fill: gradient });
    });

    editor.canvas.renderAll();
  };

  const handleDirectionClick = (direction: 'horizontal' | 'vertical' | 'diagonal') => {
    let newPosition: GradientPosition;
    switch (direction) {
      case 'horizontal':
        newPosition = { startX: 0, startY: 50, endX: 100, endY: 50 };
        break;
      case 'vertical':
        newPosition = { startX: 50, startY: 0, endX: 50, endY: 100 };
        break;
      case 'diagonal':
        newPosition = { startX: 0, startY: 0, endX: 100, endY: 100 };
        break;
    }
    setGradientPosition(newPosition);
    applyGradient(direction);
  };

  const handlePositionChange = (
    type: keyof GradientPosition,
    value: number
  ) => {
    setGradientPosition(prev => ({
      ...prev,
      [type]: value
    }));
    applyGradient(currentDirection);
  };

  const getPreviewStyle = () => {
    const angle = Math.atan2(
      gradientPosition.endY - gradientPosition.startY,
      gradientPosition.endX - gradientPosition.startX
    ) * (180 / Math.PI);

    return {
      background: `linear-gradient(${angle}deg, ${gradientColors.startColor}, ${gradientColors.endColor})`
    };
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
              onChange={(e) => {
                setGradientColors(prev => ({ ...prev, startColor: e.target.value }));
                applyGradient(currentDirection);
              }}
              className="w-full h-8 mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">End Color</Label>
            <input
              type="color"
              value={gradientColors.endColor}
              onChange={(e) => {
                setGradientColors(prev => ({ ...prev, endColor: e.target.value }));
                applyGradient(currentDirection);
              }}
              className="w-full h-8 mt-1"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Gradient Direction</Label>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={currentDirection === 'horizontal' ? 'default' : 'outline'}
            onClick={() => handleDirectionClick('horizontal')}
            className="w-full"
          >
            Horizontal
          </Button>
          <Button
            variant={currentDirection === 'vertical' ? 'default' : 'outline'}
            onClick={() => handleDirectionClick('vertical')}
            className="w-full"
          >
            Vertical
          </Button>
          <Button
            variant={currentDirection === 'diagonal' ? 'default' : 'outline'}
            onClick={() => handleDirectionClick('diagonal')}
            className="w-full"
          >
            Diagonal
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Start Point</Label>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">X Position ({gradientPosition.startX}%)</Label>
            <Slider
              value={[gradientPosition.startX]}
              min={0}
              max={100}
              step={1}
              onValueChange={([value]) => handlePositionChange('startX', value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Y Position ({gradientPosition.startY}%)</Label>
            <Slider
              value={[gradientPosition.startY]}
              min={0}
              max={100}
              step={1}
              onValueChange={([value]) => handlePositionChange('startY', value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>End Point</Label>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">X Position ({gradientPosition.endX}%)</Label>
            <Slider
              value={[gradientPosition.endX]}
              min={0}
              max={100}
              step={1}
              onValueChange={([value]) => handlePositionChange('endX', value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Y Position ({gradientPosition.endY}%)</Label>
            <Slider
              value={[gradientPosition.endY]}
              min={0}
              max={100}
              step={1}
              onValueChange={([value]) => handlePositionChange('endY', value)}
            />
          </div>
        </div>
      </div>

      {/* Gradient Preview */}
      <div className="mt-4 p-2 border rounded">
        <Label className="text-xs mb-2">Preview</Label>
        <div 
          className="w-full h-16 rounded"
          style={getPreviewStyle()}
        />
      </div>
    </div>
  );
};

export default GradientEditor;