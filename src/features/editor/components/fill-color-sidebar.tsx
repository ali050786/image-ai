import { useEffect, useState } from "react";
import { fabric } from 'fabric';
import { Editor, FILL_COLOR } from "../types";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ColorPicker } from "./color-picker";
import { GradientEditor } from "./gradient/GradientEditor";
import { GradientPicker } from "./gradient/GradientPicker";
import { ActiveTool } from "../active-types";
import { cn } from "../../../lib/utils";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import type { GradientConfig, GradientStop } from "../types/gradient.types";

export const FillColorSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}) => {
  // States
  const [currentGradient, setCurrentGradient] = useState<GradientConfig>({
    type: 'linear',
    angle: 90,
    stops: [
      { offset: 0, color: '#000000' },
      { offset: 1, color: '#ffffff' }
    ]
  });

  // Get selected object
  const selectedObject = editor?.selectedObjects[0];

  // Handlers
  const handleSolidColorChange = (color: string) => {
    if (!editor) return;
    editor.changeFillColor(color);
  };

  // Effect to update gradient state when selection changes
  useEffect(() => {
    if (selectedObject?.fill instanceof fabric.Gradient) {
      const gradientConfig = editor?.getGradientConfig();
      if (gradientConfig) {
        setCurrentGradient(gradientConfig);
      }
    }
  }, [selectedObject, editor]);

  return (
    <aside
      className={cn(
        "bg-white fixed left-16 top-32 border-r bg-background border rounded-xl shadow-lg p-2 z-50 z-[40] w-[360px] h-auto flex flex-col",
        activeTool === "fill" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Fill"
        description="Customize the fill style of your element"
      />

      <ScrollArea className="flex-grow">
        <div className="p-4">
          <Tabs defaultValue="solid">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="solid">Solid Color</TabsTrigger>
              <TabsTrigger value="gradient">Gradient</TabsTrigger>
            </TabsList>

            <TabsContent value="solid" className="mt-4">
              <ColorPicker
                value={selectedObject?.fill instanceof fabric.Gradient
                  ? '#000000'
                  : (selectedObject?.fill as string || FILL_COLOR)}
                onChange={handleSolidColorChange}
              />
            </TabsContent>

            <TabsContent value="gradient" className="mt-4">
              {editor && (
                <GradientEditor
                  editor={{
                    canvas: editor.canvas,
                    selectedObjects: editor.selectedObjects
                  }}
                  onClose={() => onChangeActiveTool("select")}
                />
              )}
              
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>

      <ToolSidebarClose onClick={() => onChangeActiveTool("select")} />
    </aside>
  );
};