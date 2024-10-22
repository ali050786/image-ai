// src/features/editor/components/editor.tsx
import { useEffect, useRef } from 'react';
import { useEditor } from '../hooks/use-editor';

export const Editor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { init } = useEditor();

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
  );
};