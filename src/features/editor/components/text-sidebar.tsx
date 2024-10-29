// src/features/editor/components/text-sidebar.tsx
import { Editor } from "../types";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { cn } from "../../../lib/utils";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Button } from "../../../components/ui/button";
import { ActiveTool } from "../active-types";

interface TextSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const TextSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: TextSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "bg-white fixed left-16 top-32 border-r bg-background border rounded-xl shadow-lg p-2 z-50 z-[40] w-[360px] h-auto flex flex-col",
        activeTool === "text" ? "visible" : "hidden",
      )}
    > 
      <ToolSidebarHeader 
        title="Text" 
        description="Add text to your canvas" 
      />
      <ScrollArea>
        <div className="p-4 space-y-4">
          <Button
            className="w-full"
            onClick={() => editor?.addText("Textbox")}
          >
            Add a textbox
          </Button>
          <Button
            className="w-full h-16"
            variant="secondary"
            size="lg"
            onClick={() => editor?.addText("Heading", {
              fontSize: 80,
              fontWeight: 700,
            })}
          >
            <span className="text-3xl font-bold">
              Add a heading
            </span>
          </Button>
          <Button
            className="w-full h-16"
            variant="secondary"
            size="lg"
            onClick={() => editor?.addText("Subheading", {
              fontSize: 44,
              fontWeight: 600,
            })}
          >
            <span className="text-xl font-semibold">
              Add a subheading
            </span>
          </Button>
          <Button
            className="w-full h-16"
            variant="secondary"
            size="lg"
            onClick={() => editor?.addText("Paragraph", {
              fontSize: 32,
            })}
          >
            Paragraph
          </Button>
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};