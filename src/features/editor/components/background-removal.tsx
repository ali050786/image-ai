import { useCallback, useState } from "react";
import { fabric } from "fabric";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Button } from "../../../components/ui/button";
import { Loader2, ImageIcon } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Editor } from "../types";
import { ActiveTool } from "../active-types";

interface BackgroundRemovalSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const BackgroundRemovalSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: BackgroundRemovalSidebarProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const removeBackground = useCallback(async () => {
    if (!editor?.canvas || !editor.isObjectSelected()) return;

    const selectedObject = editor.getActiveObjects()[0];
    if (selectedObject?.type !== "image") return;

    try {
      setIsLoading(true);

      // Create a temporary canvas to get the image data
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = selectedObject.width!;
      tempCanvas.height = selectedObject.height!;
      const ctx = tempCanvas.getContext("2d");
      
      if (!ctx) return;

      // Draw the image to the temporary canvas
      const imageElement = (selectedObject as fabric.Image).getElement();
      ctx.drawImage(imageElement, 0, 0);

      // Get base64 data
      const imageData = tempCanvas.toDataURL();

      // Make API request
      const response = await fetch("http://localhost:5000/api/background/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove background");
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to remove background");
      }

      // Create new image with removed background
      fabric.Image.fromURL(result.data.image, (img) => {
        if (!editor?.canvas) return;

        // Maintain position and size of original image
        img.set({
          left: selectedObject.left,
          top: selectedObject.top,
          scaleX: selectedObject.scaleX,
          scaleY: selectedObject.scaleY,
        });

        // Replace old image with new one
        editor.canvas.remove(selectedObject);
        editor.canvas.add(img);
        editor.canvas.setActiveObject(img);
        editor.canvas.renderAll();
      });

      // Switch back to select tool
      onChangeActiveTool("select");
    } catch (error) {
      console.error("Error removing background:", error);
    } finally {
      setIsLoading(false);
    }
  }, [editor, onChangeActiveTool]);

  const hasImageSelected = editor?.selectedObjects[0]?.type === "image";

  return (
    <aside
      className={cn(
        "bg-white fixed left-16 top-32 border-r bg-background border rounded-xl shadow-lg p-2 z-50 z-[40] w-[360px] h-auto flex flex-col",
        activeTool === "remove-bg" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Remove Background"
        description="Remove background from selected image"
      />
      <ScrollArea>
        <div className="p-4 space-y-4">
          {!hasImageSelected ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground space-y-4">
              <ImageIcon className="h-16 w-16" />
              <p>Select an image to remove its background</p>
            </div>
          ) : (
            <Button 
              className="w-full" 
              onClick={removeBackground}
              disabled={isLoading}
            >
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Remove Background
            </Button>
          )}
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={() => onChangeActiveTool("select")} />
    </aside>
  );
};