import React, { useState } from 'react';
import { 
  Download, 
  FileJson, 
  FileImage,
  Loader2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../..//components/ui/input";
import { Label } from "../../..//components/ui/label";
import { exportApi, ExportOptions } from '../api/exports';
import { useToast } from '../hooks/use-toast';

interface ExportDialogProps {
  editor: {
    canvas: fabric.Canvas;
  } | undefined;
}

const ExportDialog = ({ editor }: ExportDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();

  const handleExport = async (format: ExportOptions['format']) => {
    if (!editor?.canvas) {
      toast({
        title: "Export Failed",
        description: "Canvas is not initialized",
        status: "error"
      });
      return;
    }

    try {
      setLoading(true);
      let exportData: string;

      // Export based on format
      if (format === 'json') {
        exportData = exportApi.exportToJSON(editor.canvas);
      } else {
        exportData = exportApi.exportToSVG(editor.canvas);
      }

      // Download the export
      await exportApi.downloadExport(exportData, {
        format,
        name: fileName
      });

      toast({
        title: "Export Successful",
        description: `Canvas exported as ${format.toUpperCase()}`,
        status: "success"
      });

      setOpen(false);
    } catch (error) {
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "Failed to export canvas",
        status: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          disabled={!editor?.canvas}
        >
          <Download className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Canvas</DialogTitle>
          <DialogDescription>
            Choose a format to export your canvas
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex gap-2 justify-end">
            <Button
              onClick={() => handleExport('json')}
              disabled={loading || !editor?.canvas}
              className="gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileJson className="h-4 w-4" />
              )}
              Export JSON
            </Button>
            <Button
              onClick={() => handleExport('svg')}
              disabled={loading || !editor?.canvas}
              className="gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileImage className="h-4 w-4" />
              )}
              Export SVG
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;