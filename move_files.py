import os
import shutil
from pathlib import Path

def move_files():
    # Create mappings of source to destination
    moves = {
        # Components
        "src/components/hint.tsx": "src/components/common/Hint/Hint.tsx",
        
        # Editor Components
        "src/features/editor/components/background-removal.tsx": "src/features/editor/components/Sidebar/BackgroundRemoval/index.tsx",
        "src/features/editor/components/color-picker.tsx": "src/features/editor/components/common/ColorPicker/index.tsx",
        "src/features/editor/components/debug-panel.tsx": "src/features/editor/components/Debug/index.tsx",
        "src/features/editor/components/editor.tsx": "src/features/editor/components/Canvas/index.tsx",
        "src/features/editor/components/fill-color-sidebar.tsx": "src/features/editor/components/Sidebar/FillColor/index.tsx",
        "src/features/editor/components/image-sidebar.tsx": "src/features/editor/components/Sidebar/Images/index.tsx",
        "src/features/editor/components/navbar.tsx": "src/features/editor/components/Navbar/index.tsx",
        "src/features/editor/components/opacity-sidebar.tsx": "src/features/editor/components/Sidebar/Opacity/index.tsx",
        "src/features/editor/components/shape-sidebar.tsx": "src/features/editor/components/Sidebar/Shapes/index.tsx",
        "src/features/editor/components/sidebar-item.tsx": "src/features/editor/components/Sidebar/common/SidebarItem.tsx",
        "src/features/editor/components/stroke-color-sidebar.tsx": "src/features/editor/components/Sidebar/Stroke/ColorSidebar.tsx",
        "src/features/editor/components/stroke-width-sidebar.tsx": "src/features/editor/components/Sidebar/Stroke/WidthSidebar.tsx",
        "src/features/editor/components/text-sidebar.tsx": "src/features/editor/components/Sidebar/Text/index.tsx",
        "src/features/editor/components/toolbar.tsx": "src/features/editor/components/Toolbar/index.tsx",
        
        # Types
        "src/features/editor/active-types.ts": "src/features/editor/types/active.types.ts",
        "src/features/editor/color-types.ts": "src/features/editor/types/color.types.ts",
        "src/features/editor/types.ts": "src/features/editor/types/editor.types.ts",
    }

    # Ensure all destination directories exist
    for dest in moves.values():
        os.makedirs(os.path.dirname(dest), exist_ok=True)

    # Move files
    for src, dest in moves.items():
        try:
            if os.path.exists(src):
                print(f"Moving {src} -> {dest}")
                shutil.move(src, dest)
            else:
                print(f"Warning: Source file not found: {src}")
        except Exception as e:
            print(f"Error moving {src}: {e}")

if __name__ == "__main__":
    move_files()