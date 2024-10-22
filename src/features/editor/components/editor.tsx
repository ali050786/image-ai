import { useCallback, useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

import { useEditor } from '../hooks/use-editor';
import { Navbar } from './navbar';
import { Sidebar } from './sidebar';
import { ActiveTool } from '../active-types';

export const Editor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTool, setActiveTool] = useState<ActiveTool>("select");
  
  const { init } = useEditor();

  const onChangeActiveTool = useCallback((tool: ActiveTool) => {
    // If clicking same tool, reset to select
    if (tool === activeTool) {
      return setActiveTool("select");
    }

    // Handle special case for draw tool
    if (tool === "draw") {
      // TODO: Enable draw mode
    }

    if (activeTool === "draw") {
      // TODO: Disable draw mode
    }

    setActiveTool(tool);
  }, [activeTool]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = init({
      canvasElement: canvasRef.current,
      container: containerRef.current,
    });

    return () => {
      canvas?.dispose();
    };
  }, [init]);

  return (
    <div className="h-full flex flex-col">
      <Navbar 
        activeTool={activeTool} 
        onChangeActiveTool={onChangeActiveTool} 
      />
      <div className="flex-1 flex">
        <Sidebar 
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <div 
          ref={containerRef} 
          className="flex-1 bg-muted relative overflow-hidden"
        >
          <canvas 
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};