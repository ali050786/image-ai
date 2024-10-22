// src/features/editor/components/shape-sidebar.tsx
import { ScrollArea } from "../../../components/ui/scroll-area";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ShapeTool } from "./shape-tool";
import { cn } from "../../../lib/utils";
import { ActiveTool } from "../active-types";
import { 
  Circle,
  Square,
  Triangle,
  Diamond
} from "lucide-react";

interface ShapeSidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const ShapeSidebar = ({
  activeTool,
  onChangeActiveTool,
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
            onClick={() => {}} // Will be implemented later
            icon={Circle}
          />
          <ShapeTool
            onClick={() => {}}
            icon={Square}
          />
          <ShapeTool
            onClick={() => {}}
            icon={Square}
            iconClassName="fill-current" // For filled square
          />
          <ShapeTool
            onClick={() => {}}
            icon={Triangle}
          />
          <ShapeTool
            onClick={() => {}}
            icon={Triangle}
            iconClassName="rotate-180"
          />
          <ShapeTool
            onClick={() => {}}
            icon={Diamond}
          />
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};