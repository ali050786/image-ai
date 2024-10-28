import { ScrollArea } from "../../../components/ui/scroll-area";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ShapeTool } from "./shape-tool";
import { cn } from "../../../lib/utils";
import { ActiveTool } from "../active-types";
import { Editor } from "../types";
import { 
  Circle,
  Square,
  Triangle,
  Diamond
} from "lucide-react";

interface ShapeSidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  editor: Editor | undefined;
}

export const ShapeSidebar = ({
  activeTool,
  onChangeActiveTool,
  editor,
}: ShapeSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "shapes" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader
        title="Shapes"
        description="Add shapes to your canvas"
      />
      <ScrollArea>
        <div className="grid grid-cols-3 gap-4 p-4">
          <ShapeTool
            onClick={() => editor?.addCircle()}
            icon={Circle}
            iconClassName="fill-current"
          />
          <ShapeTool
            onClick={() => editor?.addSoftRectangle()}
            icon={Square}
            iconClassName="fill-current"
          />
          <ShapeTool
            onClick={() => editor?.addRectangle()}
            icon={Square}
            iconClassName="fill-current"
          />
          <ShapeTool
            onClick={() => editor?.addTriangle()}
            icon={Triangle}
            iconClassName="fill-current"
          />
          <ShapeTool
            onClick={() => editor?.addInverseTriangle()}
            icon={Triangle}
            iconClassName="rotate-180 fill-current"
          />
          <ShapeTool
            onClick={() => editor?.addDiamond()}
            icon={Diamond}
            iconClassName="fill-current"
          />
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};