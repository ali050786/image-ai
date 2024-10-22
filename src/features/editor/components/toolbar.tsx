// src/features/editor/components/toolbar.tsx
import { useMemo } from "react";
import { Editor } from "../types";
import { cn } from "../../../lib/utils";
import { Button } from "../../../components/ui/button";
import { Hint } from "../../../components/hint";
import { ActiveTool } from "../active-types";

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
    
    // Return empty toolbar if no selection
    if (!hasSelection) {
      return (
        <div className="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2" />
      );
    }
  
    const activeObjects = editor?.getActiveObjects() || [];
    const isMultipleSelection = activeObjects.length > 1;
    const firstObject = activeObjects[0];
    const isImage = firstObject?.type === "image";
    const fillColor = editor?.getFillColor();
  
    return (
      <div className="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2">
        {!isImage && (
          <div className="flex items-center h-full justify-center">
            <Hint 
              label={isMultipleSelection ? "Change all colors" : "Color"} 
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
        )}
      </div>
    );
  };