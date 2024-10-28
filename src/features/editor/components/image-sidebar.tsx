import { useEffect, useRef, useState, useCallback } from "react";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { cn } from "../../../lib/utils";
import { imageApi, UnsplashImage, SearchParams } from "../api/images";
import { Editor } from "../types";
import { ActiveTool } from "../active-types";
import { Button } from "../../../components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import { fabric } from "fabric";
import { Loader2, Search, Upload, X, FilterIcon } from "lucide-react";
import debounce from 'lodash.debounce';

interface ImageSidebarProps {
    editor: Editor | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}


const ORIENTATIONS = [
    { label: 'All', value: 'all' },  // Changed from empty string to 'all'
    { label: 'Landscape', value: 'landscape' },
    { label: 'Portrait', value: 'portrait' },
    { label: 'Square', value: 'squarish' }
];

const COLORS = [
    { label: 'All Colors', value: 'all' },
    { label: 'Black & White', value: 'black_and_white' },
    { label: 'Black', value: 'black' },
    { label: 'White', value: 'white' },
    { label: 'Yellow', value: 'yellow' },
    { label: 'Orange', value: 'orange' },
    { label: 'Red', value: 'red' },
    { label: 'Purple', value: 'purple' },
    { label: 'Magenta', value: 'magenta' },
    { label: 'Green', value: 'green' },
    { label: 'Teal', value: 'teal' },
    { label: 'Blue', value: 'blue' }
];

const SORT_OPTIONS = [
    { label: 'Relevance', value: 'relevant' },
    { label: 'Latest', value: 'latest' }
];

export const ImageSidebar = ({
    editor,
    activeTool,
    onChangeActiveTool,
}: ImageSidebarProps) => {
    const [searchParams, setSearchParams] = useState<SearchParams>({
        query: '',
        page: 1,
        per_page: 30,
        orientation: undefined,
        color: undefined,
        order_by: 'relevant'
    });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [images, setImages] = useState<UnsplashImage[]>([]);

    // Fetch images function
    const fetchImages = useCallback(async (params: SearchParams) => {
        try {
            setLoading(true);
            if (params.query) {
                const result = await imageApi.searchImages(params);
                setImages(prev => params.page === 1 ? result.photos : [...prev, ...result.photos]);
                setTotalPages(result.pagination.total_pages);
            } else {
                const result = await imageApi.getImages({
                    orientation: params.orientation,
                    count: params.per_page
                });
                setImages(result);
                setTotalPages(1);
            }
        } catch (error) {
            console.error("Failed to fetch images:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounced search
    const debouncedSearch = useCallback(
        debounce((params: SearchParams) => {
            fetchImages(params);
        }, 500),
        [fetchImages]
    );

    // Initial load
    useEffect(() => {
        if (activeTool === "images") {
            fetchImages(searchParams);
        }
    }, [activeTool, fetchImages, searchParams]);

    const handleSearchChange = (query: string) => {
        setSearchParams(prev => ({
            ...prev,
            query,
            page: 1
        }));
    };

    const handleFilterChange = (key: keyof SearchParams, value: string) => {
        setSearchParams(prev => ({
            ...prev,
            [key]: value,
            page: 1
        }));
    };

    const loadMore = () => {
        if (searchParams.page < totalPages) {
            setSearchParams(prev => ({
                ...prev,
                page: prev.page + 1
            }));
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            await imageApi.uploadImage(file);
            await fetchImages(searchParams);
        } catch (error) {
            console.error("Failed to upload image:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleImageClick = async (image: UnsplashImage) => {
        if (!editor?.canvas) return;
    
        try {
            fabric.Image.fromURL(image.urls.regular, (img) => {
                if (!editor?.canvas) return;
    
                const maxWidth = 500;
                const scale = maxWidth / img.width!;
                img.scale(scale);
    
                editor.canvas.add(img);
                editor.canvas.setActiveObject(img);
                editor.canvas.renderAll();
                onChangeActiveTool("select");
            }, { crossOrigin: 'anonymous' }); // Add crossOrigin here
        } catch (error) {
            console.error("Failed to add image to canvas:", error);
        }
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Function to trigger file input click
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // Function to handle file upload
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !editor?.canvas) return;

        try {
            // Create object URL for preview
            const objectUrl = URL.createObjectURL(file);

            // Load image into fabric canvas
            fabric.Image.fromURL(objectUrl, (img) => {
                if (!editor?.canvas) return;

                // Scale image to reasonable size if needed
                const maxWidth = 500;
                if (img.width && img.width > maxWidth) {
                    const scale = maxWidth / img.width;
                    img.scale(scale);
                }

                editor.canvas.add(img);
                editor.canvas.setActiveObject(img);
                editor.canvas.renderAll();
                onChangeActiveTool("select");

                // Clean up object URL
                URL.revokeObjectURL(objectUrl);
            });

            // Clear file input for reuse
            event.target.value = '';
        } catch (error) {
            console.error("Failed to load image:", error);
        }
    };

    return (
        <aside
            className={cn(
                "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
                activeTool === "images" ? "visible" : "hidden"
            )}
        >
            <div className="flex-none">
                <ToolSidebarHeader
                    title="Images"
                    description="Add images to your design"
                />

                {/* Search and Filters */}
                <div className="p-4 space-y-4 border-b">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search images..."
                            value={searchParams.query}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="w-full pl-9 pr-9 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        {searchParams.query && (
                            <button
                                onClick={() => handleSearchChange('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Filter Toggle */}
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <FilterIcon className="w-4 h-4 mr-2" />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </Button>

                    {/* Filters */}
                    {showFilters && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Orientation</label>
                                <Select
                                    value={searchParams.orientation}
                                    onValueChange={(value) => handleFilterChange('orientation', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select orientation" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ORIENTATIONS.map((orientation) => (
                                            <SelectItem key={orientation.value} value={orientation.value}>
                                                {orientation.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Color</label>
                                <Select
                                    value={searchParams.color}
                                    onValueChange={(value) => handleFilterChange('color', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select color" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {COLORS.map((color) => (
                                            <SelectItem key={color.value} value={color.value}>
                                                {color.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Sort By</label>
                                <Select
                                    value={searchParams.order_by}
                                    onValueChange={(value) => handleFilterChange('order_by', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select sort order" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SORT_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {/* Upload Button */}
                    <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={triggerFileInput}
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                    </Button>
                    </div>
                    
                </div>
            </div>

            {/* Images Grid */}
            <div className="flex-grow overflow-hidden h-96">
                <ScrollArea className="h-full">
                    {loading ? (
                        <div className="flex items-center justify-center p-8">
                            <Loader2 className="w-6 h-6 animate-spin" />
                        </div>
                    ) : images.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                            <p>No images found</p>
                            {searchParams.query && (
                                <Button
                                    variant="link"
                                    onClick={() => handleSearchChange('')}
                                    className="mt-2"
                                >
                                    Clear search
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6 p-4">
                            <div className="grid grid-cols-2 gap-4">
                                {images.map((image) => (
                                    <button
                                        key={image.id}
                                        className="group relative aspect-square overflow-hidden rounded-md hover:opacity-90 transition"
                                        onClick={() => handleImageClick(image)}
                                    >
                                        <img
                                            src={image.urls.thumb}
                                            alt={image.alt_description || "Unsplash image"}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                        {/* Image Info Overlay */}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                                            <p className="text-xs text-white truncate">
                                                by {image.user.name}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Load More Button */}
                            {searchParams.query && searchParams.page < totalPages && (
                                <div className="flex justify-center pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={loadMore}
                                        className="w-full"
                                    >
                                        Load More
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </ScrollArea>
            </div>

            <ToolSidebarClose onClick={() => onChangeActiveTool("select")} />
        </aside>
    );
};
