// src/features/editor/components/toolbar.tsx
import { useMemo } from "react";
import { Editor } from "../types";
import { cn } from "../../../lib/utils";
import { Button } from "../../../components/ui/button";
import { Hint } from "../../../components/hint";
import { ActiveTool } from "../active-types";
import { BsBorderWidth } from "react-icons/bs";
import { FontDropdown } from './fonts/FontDropdown'
import {
  BringToFrontIcon,
  SendToBackIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  DeleteIcon,
  Trash2Icon,
  ArrowUpFromLine,
  ArrowDownFromLine,
  EraserIcon,
  LucideLoader2
} from "lucide-react";
import { RxTransparencyGrid } from "react-icons/rx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../../components/ui/select";
import { fonts } from "../types";
import { Label } from "../../../components/ui/label";
import { Slider } from "../../../components/ui/slider";
import { isTextType } from "../utils";
import { Separator } from "../../../components/ui/separator";

interface ToolbarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const Toolbar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ToolbarProps) => {


  const getFontWeight = () => editor?.getActiveFontWeight() ?? 400;
  const getFontStyle = () => editor?.getActiveFontStyle() ?? "normal";
  const getTextAlign = () => editor?.getActiveTextAlign() ?? "left";
  const getFontUnderline = () => editor?.getActiveFontUnderline() ?? false;
  const getFontLinethrough = () => editor?.getActiveFontLinethrough() ?? false;
  const getFontFamily = () => editor?.getActiveFontFamily() ?? "Arial";
  const getFontSize = () => editor?.getActiveFontSize() ?? 32;

  const hasSelection = editor?.isObjectSelected();

  if (!hasSelection) {
    return (
      <div className="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2" />
    );
  }

  const activeObjects = editor?.getActiveObjects() || [];
  const isMultipleSelection = activeObjects.length > 1;
  const firstObject = activeObjects[0];
  const isImage = firstObject?.type === "image";
  const isText = firstObject && isTextType(firstObject.type);
  const fillColor = editor?.getActiveFillColor();
  const strokeColor = editor?.getActiveStrokeColor();

  return (
    <div className="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2">
      {/* Fill Color Button - Show for all except images */}
      {!isImage && (
        <div className="flex items-center h-full justify-center">
          <Hint
            label={isMultipleSelection ? "Change all colors" : "Fill color"}
            side="bottom"
            sideOffset={5}
          >
            <Button
              onClick={() => onChangeActiveTool("fill")}
              size="icon"
              variant="ghost"
              className={cn(activeTool === "fill" && "bg-gray-100")}
            >
              <div
                className="rounded-sm size-4 border"
                style={{ backgroundColor: fillColor }}
              />
            </Button>
          </Hint>
        </div>
      )}

      {/* Stroke Controls - Show only for shapes, not for text or images */}
      {!isImage && !isText && (
        <>
          <div className="flex items-center h-full justify-center">
            <Hint
              label="Stroke color"
              side="bottom"
              sideOffset={5}
            >
              <Button
                onClick={() => onChangeActiveTool("stroke-color")}
                size="icon"
                variant="ghost"
                className={cn(activeTool === "stroke-color" && "bg-gray-100")}
              >
                <div
                  className="rounded-sm size-4 border-2 bg-white"
                  style={{ borderColor: strokeColor }}
                />
              </Button>
            </Hint>
          </div>
          <div className="flex items-center h-full justify-center">
            <Hint
              label="Stroke width Options"
              side="bottom"
              sideOffset={5}
            >
              <Button
                onClick={() => onChangeActiveTool("stroke-width")}
                size="icon"
                variant="ghost"
                className={cn(activeTool === "stroke-width" && "bg-gray-100")}
              >
                <BsBorderWidth className="size-4" />
              </Button>
            </Hint>
          </div>
        </>
      )}

      {/* Text Controls - Show only when text is selected */}
      {isText && (
        <>
          <Separator orientation="vertical" className="h-8" />

          {/* Font Family */}
          <FontDropdown
            value={getFontFamily()}
            onSelect={(value) => editor?.changeFontFamily(value)}
          />

          {/* Font Size */}
          <div className="flex items-center gap-x-2">
            <Label className="text-sm">Size</Label>
            <Slider
              className="w-[100px]"
              min={8}
              max={200}
              step={1}
              value={[getFontSize()]}
              onValueChange={([value]) => editor?.changeFontSize(value)}
            />
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Text Alignment */}
          <div className="flex items-center gap-x-1">
            <Button
              variant={getTextAlign() === "left" ? "default" : "ghost"}
              size="icon"
              onClick={() => editor?.changeTextAlign("left")}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant={getTextAlign() === "center" ? "default" : "ghost"}
              size="icon"
              onClick={() => editor?.changeTextAlign("center")}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant={getTextAlign() === "right" ? "default" : "ghost"}
              size="icon"
              onClick={() => editor?.changeTextAlign("right")}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Text Style */}
          <div className="flex items-center gap-x-1">
            <Button
              variant={getFontWeight() > 500 ? "default" : "ghost"}
              size="icon"
              onClick={() => {
                const newWeight = getFontWeight() > 500 ? 400 : 700;
                editor?.changeFontWeight(newWeight);
              }}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant={getFontStyle() === "italic" ? "default" : "ghost"}
              size="icon"
              onClick={() => {
                const newStyle = getFontStyle() === "italic" ? "normal" : "italic";
                editor?.changeFontStyle(newStyle);
              }}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant={getFontUnderline() ? "default" : "ghost"}
              size="icon"
              onClick={() => editor?.changeFontUnderline(!getFontUnderline())}
            >
              <Underline className="h-4 w-4" />
            </Button>
            <Button
              variant={getFontLinethrough() ? "default" : "ghost"}
              size="icon"
              onClick={() => editor?.changeFontLinethrough(!getFontLinethrough())}
            >
              <Strikethrough className="h-4 w-4" />
            </Button>

          </div>
        </>

      )}


      {/* Common Controls - Show for all objects */}
      <Separator orientation="vertical" className="h-8" />

      <div className="flex items-center gap-x-1">
        <Hint label="Bring Forward" side="bottom" sideOffset={5}>
          <Button
            onClick={() => editor?.bringForward()}
            size="icon"
            variant="ghost"
          >
            <ArrowUpFromLine className="size-4" />
          </Button>
        </Hint>

        <Hint label="Send Backwards" side="bottom" sideOffset={5}>
          <Button
            onClick={() => editor?.sendBackwards()}
            size="icon"
            variant="ghost"
          >
            <ArrowDownFromLine className="size-4" />
          </Button>
        </Hint>

        <Hint label="Opacity" side="bottom" sideOffset={5}>
          <Button
            onClick={() => onChangeActiveTool("opacity")}
            size="icon"
            variant="ghost"
            className={cn(activeTool === "opacity" && "bg-gray-100")}
          >
            <RxTransparencyGrid className="size-4" />
          </Button>
        </Hint>
        <Hint label="Delete" side="bottom" sideOffset={5}>
          <Button
            onClick={() => editor?.delete()}
            size="icon"
            variant="ghost"
          >
            <Trash2Icon className="size-4" />
          </Button>
        </Hint>

        {isImage && (
          <>
            <Separator orientation="vertical" className="h-8" />
            <div className="flex items-center h-full justify-center">
              <Hint label="Remove Background" side="bottom" sideOffset={5}>
                <Button
                  onClick={() => editor?.removeBackground()}
                  size="icon"
                  variant="ghost"
                  disabled={editor?.isProcessingImage}
                  className={cn(
                    activeTool === "remove-bg" && "bg-gray-100",
                    "relative"
                  )}
                >
                  {editor?.isProcessingImage ? (
                    <LucideLoader2 className="size-4 animate-spin" />
                  ) : (
                    <EraserIcon className="size-4" />
                  )}
                </Button>
              </Hint>
            </div>
          </>


        )}
      </div>
    </div>
  );
};