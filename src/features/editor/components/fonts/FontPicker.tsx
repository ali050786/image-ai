import React, { useEffect, useState } from 'react';
import { GoogleFont, fontService } from '../../api/fonts';
import { ScrollArea } from '../../../../components/ui/scroll-area';
import { Input } from '../../../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import { Search, Loader2 } from 'lucide-react';
import debounce from 'lodash/debounce';

interface FontPickerProps {
  value: string;
  onChange: (font: string) => void;
}

export default function FontPicker({ value, onChange }: FontPickerProps) {
  const [fonts, setFonts] = useState<GoogleFont[]>([]);
  const [categories, setCategories] = useState<{ name: string; fonts: GoogleFont[] }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFont, setLoadingFont] = useState<string | null>(null);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        const [allFonts, fontCategories] = await Promise.all([
          fontService.getFonts(),
          fontService.getFontCategories()
        ]);
        
        setFonts(allFonts);
        setCategories(fontCategories);
        
        // Preload popular fonts
        await fontService.preloadPopularFonts();
      } catch (error) {
        console.error('Error loading fonts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFonts();
  }, []);

  const filteredFonts = fonts.filter(font =>
    font.family.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = debounce((value: string) => {
    setSearchQuery(value);
  }, 300);

  const handleFontSelect = async (fontFamily: string) => {
    try {
      setLoadingFont(fontFamily);
      await fontService.loadFont(fontFamily);
      onChange(fontFamily);
    } catch (error) {
      console.error('Error loading font:', error);
    } finally {
      setLoadingFont(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search fonts..."
          className="pl-9"
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.slice(0, 3).map((category) => (
            <TabsTrigger key={category.name} value={category.name}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          <ScrollArea className="h-[300px]">
            <div className="space-y-2 p-2">
              {filteredFonts.map((font) => (
                <button
                  key={font.family}
                  onClick={() => handleFontSelect(font.family)}
                  className={`w-full text-left p-2 hover:bg-accent rounded-md flex items-center justify-between ${
                    value === font.family ? 'bg-accent' : ''
                  }`}
                >
                  <span 
                    className="text-lg"
                    style={{ 
                      fontFamily: fontService.isFontLoaded(font.family) ? font.family : 'system-ui' 
                    }}
                  >
                    {font.family}
                  </span>
                  {loadingFont === font.family && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {categories.map((category) => (
          <TabsContent key={category.name} value={category.name}>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2 p-2">
                {category.fonts.map((font) => (
                  <button
                    key={font.family}
                    onClick={() => handleFontSelect(font.family)}
                    className={`w-full text-left p-2 hover:bg-accent rounded-md flex items-center justify-between ${
                      value === font.family ? 'bg-accent' : ''
                    }`}
                  >
                    <span 
                      className="text-lg"
                      style={{ 
                        fontFamily: fontService.isFontLoaded(font.family) ? font.family : 'system-ui' 
                      }}
                    >
                      {font.family}
                    </span>
                    {loadingFont === font.family && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}