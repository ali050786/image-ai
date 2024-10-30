import { useState, useCallback } from 'react';
import { Button } from '../../../../components/ui/button';
import { Slider } from '../../../../components/ui/slider';
import { Label } from '../../../../components/ui/label';
import { ColorPicker } from '../color-picker';
import { PlusIcon, MinusIcon } from 'lucide-react';
import type { GradientStop } from '../../types/gradient.types';
import { fabric } from 'fabric';

interface GradientPickerProps {
  editor?: {
    canvas: fabric.Canvas | null;
    selectedObjects: fabric.Object[];
  };
  stops: GradientStop[];
  onChange: (stops: GradientStop[]) => void;
  maxStops?: number;
}

export const GradientPicker = ({ 
  editor,
  stops, 
  onChange,
  maxStops = 5 
}: GradientPickerProps) => {
  const [selectedStop, setSelectedStop] = useState<number>(0);

  const updateCanvas = useCallback((newStops: GradientStop[]) => {
    if (!editor?.canvas || editor.selectedObjects.length === 0) return;

    const obj = editor.selectedObjects[0];
    const width = obj.width! * (obj.scaleX || 1);
    const height = obj.height! * (obj.scaleY || 1);

    // Create and apply gradient
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
        colorStops: newStops.map(stop => ({
          offset: stop.offset,
          color: stop.color
        }))
      })
    });

    editor.canvas.renderAll();
  }, [editor]);

  const handleAddStop = () => {
    if (stops.length >= maxStops) return;

    const newStops = [...stops];
    newStops.push({
      offset: 0.5,
      color: '#000000'
    });
    
    const sortedStops = newStops.sort((a, b) => a.offset - b.offset);
    onChange(sortedStops);
    updateCanvas(sortedStops);
    setSelectedStop(newStops.length - 1);
  };

  const handleRemoveStop = () => {
    if (stops.length <= 2) return;

    const newStops = stops.filter((_, index) => index !== selectedStop);
    onChange(newStops);
    updateCanvas(newStops);
    setSelectedStop(0);
  };

  const handleStopColorChange = (color: string) => {
    const newStops = [...stops];
    newStops[selectedStop] = {
      ...newStops[selectedStop],
      color
    };
    onChange(newStops);
    updateCanvas(newStops);
  };

  const handleStopPositionChange = (position: number) => {
    const newStops = [...stops];
    newStops[selectedStop] = {
      ...newStops[selectedStop],
      offset: position / 100
    };
    const sortedStops = newStops.sort((a, b) => a.offset - b.offset);
    onChange(sortedStops);
    updateCanvas(sortedStops);
  };

  return (
    <div className="space-y-4">
      {/* Controls for adding/removing stops */}
      <div className="flex items-center justify-between">
        <Label>Color Stops</Label>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddStop}
            disabled={stops.length >= maxStops}
          >
            <PlusIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemoveStop}
            disabled={stops.length <= 2}
          >
            <MinusIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Gradient Preview */}
      <div className="h-8 w-full rounded-md" style={{
        background: `linear-gradient(to right, ${
          stops.map(stop => `${stop.color} ${stop.offset * 100}%`).join(', ')
        })`
      }} />

      {/* Color Stops */}
      <div className="space-y-4">
        {stops.map((stop, index) => (
          <div
            key={index}
            className={`p-2 border rounded-lg ${
              selectedStop === index ? 'border-primary' : ''
            }`}
            onClick={() => setSelectedStop(index)}
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div
                  className="w-6 h-6 rounded-full border"
                  style={{ backgroundColor: stop.color }}
                />
              </div>
              <div className="flex-grow">
                <Slider
                  value={[stop.offset * 100]}
                  max={100}
                  step={1}
                  onValueChange={([v]) => handleStopPositionChange(v)}
                />
              </div>
            </div>
            {selectedStop === index && (
              <div className="mt-2">
                <ColorPicker
                  value={stop.color}
                  onChange={handleStopColorChange}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};