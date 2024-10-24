// src/features/editor/components/toolbar.tsx
import { useMemo } from "react";
import { Editor } from "../types";
import { cn } from "../../../lib/utils";
import { Button } from "../../../components/ui/button";
import { Hint } from "../../../components/hint";
import { ActiveTool } from "../active-types";
import { BsBorderWidth } from "react-icons/bs";
import { BringToFrontIcon, SendToBackIcon } from "lucide-react";
import { RxTransparencyGrid } from "react-icons/rx";

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
  const fillColor = editor?.getActiveFillColor();
  const strokeColor = editor?.getActiveStrokeColor();

  return (
    <div className="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2">
      {!isImage && (
        <>
          {/* Fill Color Button */}
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
                className={cn(
                  activeTool === "fill" && "bg-gray-100"
                )}
              >
                <div
                  className="rounded-sm size-4 border"
                  style={{ backgroundColor: fillColor }}
                />
              </Button>
            </Hint>
          </div>

          {/* Stroke Color Button */}
          <div className="flex items-center h-full justify-center">
            <Hint
              label={isMultipleSelection ? "Change all stroke colors" : "Stroke color"}
              side="bottom"
              sideOffset={5}
            >
              <Button
                onClick={() => onChangeActiveTool("stroke-color")}
                size="icon"
                variant="ghost"
                className={cn(
                  activeTool === "stroke-color" && "bg-gray-100"
                )}
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
              label={isMultipleSelection ? "Change all stroke colors" : "Stroke color"}
              side="bottom"
              sideOffset={5}
            >
              <Button
                onClick={() => onChangeActiveTool("stroke-width")}
                size="icon"
                variant="ghost"
                className={cn(
                  activeTool === "stroke-width" && "bg-gray-100"
                )}
              >
                <BsBorderWidth className="size-4" />
              </Button>
            </Hint>
          </div>
          <div className="flex items-center h-full justify-center">
            <Hint
              label="Bring Forward"
              side="bottom"
              sideOffset={5}
            >
              <Button
                onClick={() => editor?.bringForward()}
                size="icon"
                variant="ghost"
              >
                <BringToFrontIcon className="size-4" />
              </Button>
            </Hint>
          </div>

          <div className="flex items-center h-full justify-center">
            <Hint
              label="Send Backwards"
              side="bottom"
              sideOffset={5}
            >
              <Button
                onClick={() => editor?.sendBackwards()}
                size="icon"
                variant="ghost"
              >
                <SendToBackIcon className="size-4" />
              </Button>
            </Hint>
          </div>
          <div className="flex items-center h-full justify-center">
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
          </div>
        </>
      )}
    </div>
  );
};