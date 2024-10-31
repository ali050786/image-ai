

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "../../../../lib/utils"
import { Button } from "../../../../components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../../../../components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../components/ui/popover"
import { GoogleFont, fontService } from '../../api/fonts';
import { ScrollArea } from '../../../../components/ui/scroll-area';

interface FontDropdownProps {
  value: string;
  onSelect: (value: string) => void;
}

export function FontDropdown({ value, onSelect }: FontDropdownProps) {
  const [open, setOpen] = useState(false);
  const [fonts, setFonts] = useState<GoogleFont[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingFont, setLoadingFont] = useState<string | null>(null);

  // Load initial fonts
  useEffect(() => {
    const loadInitialFonts = async () => {
      try {
        const allFonts = await fontService.getFonts();
        setFonts(allFonts.slice(0, 50));
        
        // Preload popular fonts
        await Promise.all([
          // Load current font if it exists
          value && fontService.loadFont(value),
          // Load top fonts
          ...allFonts.slice(0, 20).map(font => 
            fontService.loadFont(font.family)
          )
        ]);
      } catch (error) {
        console.error('Error loading fonts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialFonts();
  }, [value]);

  // Filter and sort fonts based on search term
  const filteredFonts = useMemo(() => {
    if (!searchTerm) return fonts;

    return fonts
      .filter(font => 
        font.family.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const aStarts = a.family.toLowerCase().startsWith(searchTerm.toLowerCase());
        const bStarts = b.family.toLowerCase().startsWith(searchTerm.toLowerCase());
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.family.localeCompare(b.family);
      });
  }, [fonts, searchTerm]);

  const loadMoreFonts = useCallback(async () => {
    if (loadingMore) return;

    try {
      setLoadingMore(true);
      const allFonts = await fontService.getFonts();
      const nextBatch = allFonts.slice(fonts.length, fonts.length + 50);
      
      if (nextBatch.length > 0) {
        setFonts(prevFonts => [...prevFonts, ...nextBatch]);
        // Preload next batch
        await Promise.all(
          nextBatch.slice(0, 10).map(font => 
            fontService.loadFont(font.family)
          )
        );
      }
    } catch (error) {
      console.error('Error loading more fonts:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [fonts.length, loadingMore]);

  const handleSelect = async (fontFamily: string) => {
    try {
      setLoadingFont(fontFamily);
      await fontService.loadFont(fontFamily);
      onSelect(fontFamily);
      setOpen(false);
    } catch (error) {
      console.error('Error loading font:', error);
    } finally {
      setLoadingFont(null);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          style={{ fontFamily: value }}
        >
          {loadingFont === value ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            value || "Select font..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput 
            placeholder="Search fonts..." 
            onValueChange={setSearchTerm}
          />
          <ScrollArea className="h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <CommandGroup>
                {filteredFonts.length === 0 ? (
                  <CommandEmpty>No fonts found.</CommandEmpty>
                ) : (
                  <>
                    {filteredFonts.map((font) => (
                      <CommandItem
                        key={font.family}
                        value={font.family}
                        onSelect={() => handleSelect(font.family)}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === font.family ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <span style={{ fontFamily: font.family }}>
                            {font.family}
                          </span>
                        </div>
                        {loadingFont === font.family && (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                      </CommandItem>
                    ))}
                    {filteredFonts.length >= 50 && !searchTerm && (
                      <div 
                        className="flex items-center justify-center p-2"
                        onMouseEnter={loadMoreFonts}
                      >
                        {loadingMore ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Scroll for more...
                          </span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </CommandGroup>
            )}
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
}