import { MousePointerClick, ChevronDown, File, FileUp } from "lucide-react";
import { useRef } from 'react';
import { ActiveTool } from "../active-types";
import { Button } from "../../../components/ui/button";
import { Separator } from "../../../components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Hint } from "../../../components/hint";
import { cn } from "../../../lib/utils";
import { Editor } from "../types"; // Add this import
import { useToast } from "../hooks/use-toast";
import ExportDialog from './export-dialog';

interface NavbarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  editor?: Editor; // Make editor optional since it might be undefined initially
}

export const Navbar = ({
  activeTool,
  onChangeActiveTool,
  editor,
}: NavbarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSVGImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log("File selected:", file); // Debug log

    if (!file) {
      console.log("No file selected"); // Debug log
      return;
    }

    if (!editor) {
      console.log("Editor not initialized"); // Debug log
      return;
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.svg')) {
      console.log("Invalid file type:", file.type); // Debug log
      toast({
        title: "Error",
        description: "Please select a valid SVG file",
        status: "error"
      });
      return;
    }

    try {
      console.log("Starting SVG import..."); // Debug log
      toast({
        title: "Processing",
        description: "Importing SVG...",
        status: "loading"
      });

      await editor.loadSVG(file);
      console.log("SVG import successful"); // Debug log

      toast({
        title: "Success",
        description: "SVG imported successfully",
        status: "success"
      });
    } catch (error) {
      console.error("SVG import error:", error); // Debug log
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import SVG",
        status: "error"
      });
    } finally {
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    console.log("Upload button clicked"); // Debug log
    fileInputRef.current?.click();
  };

  return (
    <nav className="w-full flex items-center p-4 h-[68px]">
      <div className="px-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 40 40">
          <path fill="#F06225" d="M20 0c11.046 0 20 8.954 20 20v14a6 6 0 0 1-6 6H21v-8.774c0-2.002.122-4.076 1.172-5.78a10 10 0 0 1 6.904-4.627l.383-.062a.8.8 0 0 0 0-1.514l-.383-.062a10 10 0 0 1-8.257-8.257l-.062-.383a.8.8 0 0 0-1.514 0l-.062.383a9.999 9.999 0 0 1-4.627 6.904C12.85 18.878 10.776 19 8.774 19H.024C.547 8.419 9.29 0 20 0Z" />
          <path fill="#F06225" d="M0 21h8.774c2.002 0 4.076.122 5.78 1.172a10.02 10.02 0 0 1 3.274 3.274C18.878 27.15 19 29.224 19 31.226V40H6a6 6 0 0 1-6-6V21ZM40 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
        </svg>
      </div>
      <div className="w-full flex items-center gap-x-1 h-full">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              File
              <ChevronDown className="size-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-60">
            <DropdownMenuItem className="flex items-center gap-x-2">
              <File className="size-8" />
              <div>
                <p>Open</p>
                <p className="text-xs text-muted-foreground">
                  Open a JSON file
                </p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Separator orientation="vertical" className="mx-2" />

        <input
          ref={fileInputRef}
          type="file"
          accept=".svg"
          onChange={handleSVGImport}
          className="hidden"
          onClick={e => console.log("File input clicked")} // Debug log
        />

        <Hint label="Import SVG" side="bottom" sideOffset={10}>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleUploadClick}
          >
            <FileUp className="size-4" />
          </Button>
        </Hint>
        <Separator orientation="vertical" className="mx-2" />

        <Hint label="Select" side="bottom" sideOffset={10}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChangeActiveTool("select")}
            className={cn(
              activeTool === "select" && "bg-gray-100"
            )}
          >
            <MousePointerClick className="size-4" />
          </Button>
        </Hint>
        <Hint label="Export" side="bottom" sideOffset={10}>
          <ExportDialog editor={editor} />
        </Hint>
      </div>
    </nav>
  );
};