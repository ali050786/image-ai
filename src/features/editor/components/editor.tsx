// src/features/editor/components/editor.tsx

import { useCallback, useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

import { useEditor } from '../hooks/use-editor';
import { Navbar } from './navbar';
import { Sidebar } from './sidebar';
import { ActiveTool } from '../active-types';
import { ShapeSidebar } from './shape-sidebar';
import { FillColorSidebar } from './fill-color-sidebar';
import { Toolbar } from './toolbar';
import { StrokeColorSidebar } from './stroke-color-sidebar';
import { StrokeWidthSidebar } from './stroke-width-sidebar';
import { OpacitySidebar } from './opacity-sidebar';
import { TextSidebar } from './text-sidebar';
import { ImageSidebar } from './image-sidebar';
import { BackgroundRemovalSidebar } from './background-removal';
import { ToastContainer } from '../hooks/use-toast';
import { EditorErrorBoundary } from './editor-error-boundary';

export const Editor = () => {
  // Canvas and container refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Active tool state
  const [activeTool, setActiveTool] = useState<ActiveTool>("select");
  
  // Initialize editor
  const { init, editor } = useEditor({
    clearSelectionCallback: useCallback(() => {
      setActiveTool("select");
    }, [])
  });

  // Tool change handler
  const onChangeActiveTool = useCallback((tool: ActiveTool) => {
    if (tool === activeTool) {
      return setActiveTool("select");
    }
    setActiveTool(tool);
  }, [activeTool]);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) {
      console.log("Canvas or container refs not ready");
      return;
    }

    console.log("Initializing canvas...");
    const canvas = init({
      canvasElement: canvasRef.current,
      container: containerRef.current,
    });

    console.log("Canvas initialized:", canvas);

    return () => {
      console.log("Cleaning up canvas...");
      canvas?.dispose();
    };
  }, [init]);

  // Monitor editor state
  useEffect(() => {
    console.log("Editor state updated:", {
      isInitialized: !!editor,
      hasCanvas: !!editor?.canvas,
      activeTool
    });
  }, [editor, activeTool]);

  return (
    <EditorErrorBoundary>
      <ToastContainer>
        <div className="h-full flex flex-col">
          {/* Navigation Bar */}
          <Navbar
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
            editor={editor}
          />

          <div className="flex-1 flex">
            {/* Main Sidebar */}
            <Sidebar
              activeTool={activeTool}
              onChangeActiveTool={onChangeActiveTool}
            />

            {/* Tool-specific Sidebars */}
            <BackgroundRemovalSidebar
              editor={editor}
              activeTool={activeTool}
              onChangeActiveTool={onChangeActiveTool}
            />
            
            <ShapeSidebar
              editor={editor}
              activeTool={activeTool}
              onChangeActiveTool={onChangeActiveTool}
            />
            
            <FillColorSidebar
              editor={editor}
              activeTool={activeTool}
              onChangeActiveTool={onChangeActiveTool}
            />
            
            <StrokeColorSidebar
              editor={editor}
              activeTool={activeTool}
              onChangeActiveTool={onChangeActiveTool}
            />
            
            <StrokeWidthSidebar
              editor={editor}
              activeTool={activeTool}
              onChangeActiveTool={onChangeActiveTool}
            />
            
            <OpacitySidebar
              editor={editor}
              activeTool={activeTool}
              onChangeActiveTool={onChangeActiveTool}
            />
            
            <TextSidebar
              editor={editor}
              activeTool={activeTool}
              onChangeActiveTool={onChangeActiveTool}
            />
            
            <ImageSidebar
              editor={editor}
              activeTool={activeTool}
              onChangeActiveTool={onChangeActiveTool}
            />

            {/* Main Canvas Area */}
            <div className="flex-1 flex flex-col bg-muted relative overflow-hidden">
              {/* Toolbar */}
              <Toolbar
                editor={editor}
                activeTool={activeTool}
                onChangeActiveTool={onChangeActiveTool}
              />
              
              {/* Canvas Container */}
              <div
                ref={containerRef}
                className="flex-1 relative"
              >
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </ToastContainer>
    </EditorErrorBoundary>
  );
};

// Helper Types
interface EditorDimensions {
  width: number;
  height: number;
}

// CSS Module Import (if using CSS modules)
// import styles from './editor.module.css';