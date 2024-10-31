// src/features/editor/api/fonts.ts

// Default popular fonts as fallback
const DEFAULT_FONTS = [
    'Arial',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Oswald',
    'Source Sans Pro',
    'Slabo 27px',
    'Raleway',
    'PT Sans',
    'Merriweather',
    'Ubuntu',
    'Playfair Display',
  ];
  
  export interface GoogleFont {
    family: string;
    variants: string[];
    subsets: string[];
    category: string;
    files?: {
      [key: string]: string;
    };
  }
  
  export interface FontCategory {
    name: string;
    fonts: GoogleFont[];
  }
  
  class FontService {
    private loadedFonts: Set<string> = new Set();
    private fontList: GoogleFont[] = [];
    private apiKey: string | undefined;
    
    constructor() {
      // Access environment variable
      this.apiKey = process.env.REACT_APP_GOOGLE_FONTS_API_KEY;
      if (!this.apiKey) {
        console.warn('Google Fonts API key not found. Using default fonts.');
      }
    }
  
    async getFonts(): Promise<GoogleFont[]> {
      if (this.fontList.length > 0) {
        return this.fontList;
      }
  
      if (!this.apiKey) {
        // Return default fonts if no API key
        return DEFAULT_FONTS.map(family => ({
          family,
          variants: ['regular'],
          subsets: ['latin'],
          category: 'sans-serif'
        }));
      }
  
      try {
        const response = await fetch(
          `https://www.googleapis.com/webfonts/v1/webfonts?key=${this.apiKey}&sort=popularity`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch fonts');
        }
  
        const data = await response.json();
        this.fontList = data.items;
        return this.fontList;
      } catch (error) {
        console.error('Error fetching fonts:', error);
        // Fallback to default fonts on error
        return DEFAULT_FONTS.map(family => ({
          family,
          variants: ['regular'],
          subsets: ['latin'],
          category: 'sans-serif'
        }));
      }
    }
  
    async getFontCategories(): Promise<FontCategory[]> {
      const fonts = await this.getFonts();
      const categoriesMap = new Map<string, GoogleFont[]>();
  
      fonts.forEach(font => {
        const category = font.category || 'sans-serif';
        if (!categoriesMap.has(category)) {
          categoriesMap.set(category, []);
        }
        categoriesMap.get(category)?.push(font);
      });
  
      return Array.from(categoriesMap.entries()).map(([name, fonts]) => ({
        name,
        fonts
      }));
    }
  
    async loadFont(fontFamily: string): Promise<void> {
      if (this.loadedFonts.has(fontFamily) || DEFAULT_FONTS.includes(fontFamily)) {
        return;
      }
  
      try {
        // Create a WebFont loader script
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:wght@400;700&display=swap`;
        link.rel = 'stylesheet';
        
        // Create a promise to wait for the font to load
        const loadPromise = new Promise((resolve, reject) => {
          link.onload = resolve;
          link.onerror = reject;
        });
  
        // Add the link to the document
        document.head.appendChild(link);
        
        // Wait for the font to load
        await loadPromise;
        
        // Create a dummy element to trigger font loading
        const dummy = document.createElement('div');
        dummy.style.fontFamily = fontFamily;
        dummy.style.opacity = '0';
        dummy.textContent = 'Font Load Test';
        document.body.appendChild(dummy);
        
        // Wait a bit to ensure the font is loaded
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Cleanup
        document.body.removeChild(dummy);
        
        this.loadedFonts.add(fontFamily);
      } catch (error) {
        console.error(`Error loading font ${fontFamily}:`, error);
        throw error;
      }
    }
  
    async preloadPopularFonts(count: number = 10): Promise<void> {
      const fonts = await this.getFonts();
      const popularFonts = fonts.slice(0, count);
      
      await Promise.all(
        popularFonts.map(font => this.loadFont(font.family))
      );
    }
  
    // Helper method to check if a font is loaded
    isFontLoaded(fontFamily: string): boolean {
      return this.loadedFonts.has(fontFamily) || DEFAULT_FONTS.includes(fontFamily);
    }
  }
  
  export const fontService = new FontService();