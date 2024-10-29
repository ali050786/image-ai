import { 
    ImageIcon,
    LayoutTemplate,
    Pencil, 
    Settings,
    Shapes,
    Sparkles,
    Type
  } from "lucide-react";
  import { ActiveTool } from "../active-types";
  import { SidebarItem } from "./sidebar-item";
  import { Hint } from "../../../components/hint";
  
  interface SidebarProps {
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
  }
  
  export const Sidebar = ({
    activeTool,
    onChangeActiveTool,
  }: SidebarProps) => {
    return (
      <aside className="fixed left-2 top-32 flex flex-col items-center justify-center bg-background border rounded-xl shadow-lg p-2 z-10">
        <ul className="flex flex-col">
          <Hint
              label="Design Template"
              side="bottom"
              sideOffset={5}
            >
          <SidebarItem
            icon={LayoutTemplate}
            label="Design"
            isActive={activeTool === "templates"}
            onClick={() => onChangeActiveTool("templates")}
          />
          </Hint>
          <SidebarItem
            icon={ImageIcon} 
            label="Image"
            isActive={activeTool === "images"}
            onClick={() => onChangeActiveTool("images")}
          />
          <SidebarItem
            icon={Type}
            label="Text"
            isActive={activeTool === "text"}
            onClick={() => onChangeActiveTool("text")}
          />
          <SidebarItem
            icon={Shapes}
            label="Shapes"
            isActive={activeTool === "shapes"}
            onClick={() => onChangeActiveTool("shapes")}
          />
          <SidebarItem
            icon={Sparkles}
            label="AI"
            isActive={activeTool === "ai"}
            onClick={() => onChangeActiveTool("ai")}
          />
          <SidebarItem
            icon={Settings}
            label="Settings"
            isActive={activeTool === "settings"}
            onClick={() => onChangeActiveTool("settings")}
          />
        </ul>
      </aside>
    );
  };