import os
import shutil
from pathlib import Path

def organize_files():
    # Define moves as (source, destination)
    moves = {
        # Components
        'src/features/editor/components/editor.tsx': 'src/features/editor/components/Canvas/Editor.tsx',
        'src/features/editor/components/toolbar.tsx': 'src/features/editor/components/Toolbar/Toolbar.tsx',
        'src/features/editor/components/navbar.tsx': 'src/features/editor/components/Navbar/Navbar.tsx',
        
        # Sidebar Components
        'src/features/editor/components/background-removal.tsx': 'src/features/editor/components/Sidebar/BackgroundRemoval/BackgroundRemoval.tsx',
        'src/features/editor/components/fill-color-sidebar.tsx': 'src/features/editor/components/Sidebar/FillColor/FillColorSidebar.tsx',
        'src/features/editor/components/image-sidebar.tsx': 'src/features/editor/components/Sidebar/Images/ImageSidebar.tsx',
        'src/features/editor/components/opacity-sidebar.tsx': 'src/features/editor/components/Sidebar/Opacity/OpacitySidebar.tsx',
        'src/features/editor/components/shape-sidebar.tsx': 'src/features/editor/components/Sidebar/Shapes/ShapeSidebar.tsx',
        'src/features/editor/components/text-sidebar.tsx': 'src/features/editor/components/Sidebar/Text/TextSidebar.tsx',
        'src/features/editor/components/stroke-color-sidebar.tsx': 'src/features/editor/components/Sidebar/Stroke/StrokeColorSidebar.tsx',
        'src/features/editor/components/stroke-width-sidebar.tsx': 'src/features/editor/components/Sidebar/Stroke/StrokeWidthSidebar.tsx',
        
        # Common Components
        'src/features/editor/components/sidebar-item.tsx': 'src/features/editor/components/Sidebar/common/SidebarItem.tsx',
        'src/features/editor/components/color-picker.tsx': 'src/features/editor/components/common/ColorPicker/ColorPicker.tsx',
        
        # Hooks (We'll keep use-editor.tsx for now as we'll break it down in next steps)
        'src/features/editor/hooks/use-auto-resize.ts': 'src/features/editor/hooks/core/use-auto-resize.ts',
        'src/features/editor/hooks/use-canvas-events.ts': 'src/features/editor/hooks/core/use-canvas-events.ts',
        'src/features/editor/hooks/use-toast.tsx': 'src/features/editor/hooks/core/use-toast.tsx',
        
        # Types
        'src/features/editor/types.ts': 'src/features/editor/types/editor.types.ts',
        'src/features/editor/active-types.ts': 'src/features/editor/types/active.types.ts',
        'src/features/editor/color-types.ts': 'src/features/editor/types/color.types.ts',
    }

    # Create all necessary directories first
    for _, dest in moves.items():
        os.makedirs(os.path.dirname(dest), exist_ok=True)

    # Move files
    for src, dest in moves.items():
        src_path = Path(src)
        dest_path = Path(dest)
        
        if src_path.exists():
            print(f"Moving {src} -> {dest}")
            if dest_path.exists():
                print(f"Warning: Destination exists, backing up: {dest}")
                backup_path = str(dest_path) + '.backup'
                shutil.copy2(dest_path, backup_path)
            shutil.move(src_path, dest_path)
        else:
            print(f"Warning: Source file not found: {src}")

    # Create index.ts files
    index_files = {
        'src/features/editor/components/index.ts': 'export * from "./Canvas";\nexport * from "./Toolbar";\nexport * from "./Navbar";\n',
        'src/features/editor/components/Canvas/index.ts': 'export * from "./Editor";\n',
        'src/features/editor/components/Toolbar/index.ts': 'export * from "./Toolbar";\n',
        'src/features/editor/components/Navbar/index.ts': 'export * from "./Navbar";\n',
        'src/features/editor/components/Sidebar/index.ts': 'export * from "./BackgroundRemoval";\nexport * from "./FillColor";\nexport * from "./Images";\nexport * from "./Opacity";\nexport * from "./Shapes";\nexport * from "./Text";\nexport * from "./Stroke";\n',
        'src/features/editor/types/index.ts': 'export * from "./editor.types";\nexport * from "./active.types";\nexport * from "./color.types";\n',
        'src/features/editor/hooks/index.ts': 'export * from "./core/use-editor";\nexport * from "./core/use-auto-resize";\nexport * from "./core/use-canvas-events";\nexport * from "./core/use-toast";\n',
    }

    for file_path, content in index_files.items():
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, 'w') as f:
            f.write(content)
        print(f"Created index file: {file_path}")

if __name__ == "__main__":
    organize_files()