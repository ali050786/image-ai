import {
    Editor,
} from "../types";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { fonts } from "../types";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Label } from "../../../components/ui/label";
import { Separator } from "../../../components/ui/separator";
import { cn } from "../../../lib/utils";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Button } from "../../../components/ui/button";
import { isTextType } from "../utils";
import { Slider } from "../../../components/ui/slider"
import { ActiveTool } from "../active-types"
import {
    AlignLeft,
    AlignCenter,
    AlignRight,
    Bold,
    Italic,
    Underline,
    Strikethrough
} from "lucide-react";


interface TextSidebarProps {
    editor: Editor | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
};

export const TextSidebar = ({
    editor,
    activeTool,
    onChangeActiveTool,
}: TextSidebarProps) => {
    const onClose = () => {
        onChangeActiveTool("select");
    };

    const selectedObject = editor?.selectedObjects[0];
    const isText = selectedObject && isTextType(selectedObject.type);

    return (
        <aside
            className={cn(
                "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
                activeTool === "text" ? "visible" : "hidden",
            )}
        >
            <ToolSidebarHeader
                title="Text"
                description="Add and style text"
            />
            <ScrollArea>
                <div className="p-4 space-y-6">
                    {/* Add Text Buttons */}
                    <div className="space-y-4 border-b pb-6">
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

                    {isText && (
                        <>
                            {/* Font Family */}
                            <div className="space-y-4">
                                <Label>Font Family</Label>
                                <Select
                                    value={editor?.getActiveFontFamily()}
                                    onValueChange={editor?.changeFontFamily}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select font" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {fonts.map((font) => (
                                            <SelectItem
                                                key={font}
                                                value={font}
                                                style={{ fontFamily: font }}
                                            >
                                                {font}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Separator />

                            {/* Font Size */}
                            <div className="space-y-4">
                                <Label>Font Size</Label>
                                <Slider
                                    min={8}
                                    max={200}
                                    step={1}
                                    value={[editor?.getActiveFontSize() || 32]}
                                    onValueChange={([value]) => editor?.changeFontSize(value)}
                                />
                            </div>

                            <Separator />

                            {/* Text Alignment */}
                            <div className="space-y-4">
                                <Label>Text Alignment</Label>
                                <div className="flex gap-2">
                                    <Button
                                        variant={editor?.getActiveTextAlign() === "left" ? "default" : "outline"}
                                        size="icon"
                                        onClick={() => editor?.changeTextAlign("left")}
                                    >
                                        <AlignLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={editor?.getActiveTextAlign() === "center" ? "default" : "outline"}
                                        size="icon"
                                        onClick={() => editor?.changeTextAlign("center")}
                                    >
                                        <AlignCenter className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={editor?.getActiveTextAlign() === "right" ? "default" : "outline"}
                                        size="icon"
                                        onClick={() => editor?.changeTextAlign("right")}
                                    >
                                        <AlignRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <Separator />

                            {/* Text Style */}
                            <div className="space-y-4">
                                <Label>Text Style</Label>
                                <div className="flex gap-2">
                                    <Button
                                        variant={editor?.getActiveFontWeight() > 500 ? "default" : "outline"}
                                        size="icon"
                                        onClick={() => editor?.changeFontWeight(
                                            editor.getActiveFontWeight() > 500 ? 400 : 700
                                        )}
                                    >
                                        <Bold className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={editor?.getActiveFontStyle() === "italic" ? "default" : "outline"}
                                        size="icon"
                                        onClick={() => editor?.changeFontStyle(
                                            editor.getActiveFontStyle() === "italic" ? "normal" : "italic"
                                        )}
                                    >
                                        <Italic className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={editor?.getActiveFontUnderline() ? "default" : "outline"}
                                        size="icon"
                                        onClick={() => editor?.changeFontUnderline(!editor.getActiveFontUnderline())}
                                    >
                                        <Underline className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={editor?.getActiveFontLinethrough() ? "default" : "outline"}
                                        size="icon"
                                        onClick={() => editor?.changeFontLinethrough(!editor.getActiveFontLinethrough())}
                                    >
                                        <Strikethrough className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </ScrollArea>
            <ToolSidebarClose onClick={onClose} />
        </aside>
    );
};