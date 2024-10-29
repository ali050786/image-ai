// src/features/editor/components/stroke-width-sidebar.tsx
import { Editor, STROKE_WIDTH } from "../types";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ActiveTool } from "../active-types";

import { cn } from "../../../lib/utils";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Label } from "../../../components/ui/label";
import { Slider } from "../../../components/ui/slider";
import { Button } from "../../../components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Separator } from "../../../components/ui/separator";

// Define stroke style options
const STROKE_STYLES = [
  { label: "Solid", value: [], preview: "─────" },
  { label: "Dashed", value: [12, 6], preview: "---- ----" },
  { label: "Dotted", value: [3, 3], preview: "·····" },
  { label: "Dash Dot", value: [12, 6, 3, 6], preview: "-·-·-·" },
  { label: "Long Dash", value: [24, 12], preview: "─ ─ ─" },
];

const LINE_JOIN_STYLES = [
  { label: "Miter", value: "miter" },
  { label: "Round", value: "round" },
  { label: "Bevel", value: "bevel" },
];

const LINE_CAP_STYLES = [
  { label: "Butt", value: "butt" },
  { label: "Round", value: "round" },
  { label: "Square", value: "square" },
];

interface StrokeWidthSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const StrokeWidthSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: StrokeWidthSidebarProps) => {
  const value = editor?.getActiveStrokeWidth() || STROKE_WIDTH;
  const strokeDashArray = editor?.getActiveStrokeDashArray() || [];
  const strokeLineJoin = editor?.getActiveStrokeLineJoin() || 'miter';
  const strokeLineCap = editor?.getActiveStrokeLineCap() || 'butt';

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onChangeWidth = (value: number) => {
    editor?.changeStrokeWidth(value);
  };

  const onChangeStrokeStyle = (style: number[]) => {
    editor?.changeStrokeDashArray(style);
  };

  const onChangeLineJoin = (value: string) => {
    editor?.changeStrokeLineJoin(value);
  };

  const onChangeLineCap = (value: string) => {
    editor?.changeStrokeLineCap(value);
  };

  return (
    <aside
      className={cn(
        "bg-white fixed left-16 top-32 border-r bg-background border rounded-xl shadow-lg p-2 z-50 z-[40] w-[360px] h-auto flex flex-col",
        
        activeTool === "stroke-width" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader
        title="Stroke Options"
        description="Modify the stroke properties of selected element"
      />
      <ScrollArea>
        <div className="p-4 space-y-6">
          {/* Stroke Width */}
          <div className="space-y-4">
            <Label>Stroke Width</Label>
            <Slider 
              value={[value]}
              min={0}
              max={20} 
              step={1}
              onValueChange={(values) => onChangeWidth(values[0])} 
            />
          </div>

          <Separator />

          {/* Stroke Style */}
          <div className="space-y-4">
            <Label>Stroke Style</Label>
            <div className="grid grid-cols-2 gap-2">
              {STROKE_STYLES.map((style) => (
                <Button
                  key={style.preview}
                  variant="outline"
                  className={cn(
                    "h-12 justify-start font-mono",
                    JSON.stringify(strokeDashArray) === JSON.stringify(style.value) && 
                    "border-2 border-primary"
                  )}
                  onClick={() => onChangeStrokeStyle(style.value)}
                >
                  {style.preview}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Line Join Style */}
          <div className="space-y-4">
            <Label>Line Join</Label>
            <Select 
              value={strokeLineJoin}
              onValueChange={onChangeLineJoin}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select join style" />
              </SelectTrigger>
              <SelectContent>
                {LINE_JOIN_STYLES.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Line Cap Style */}
          <div className="space-y-4">
            <Label>Line Cap</Label>
            <Select
              value={strokeLineCap}
              onValueChange={onChangeLineCap}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cap style" />
              </SelectTrigger>
              <SelectContent>
                {LINE_CAP_STYLES.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};