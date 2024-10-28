// src/features/editor/api/images.ts

export interface UnsplashImage {
    id: string;
    urls: {
      raw: string;
      full: string;
      regular: string;
      small: string;
      thumb: string;
    };
    alt_description: string;
    description: string;
    user: {
      name: string;
      username: string;
    };
  }
  
  export interface SearchResponse {
    photos: UnsplashImage[];
    pagination: {
      total: number;
      total_pages: number;
      current_page: number;
      per_page: number;
    };
  }
  
  export interface SearchParams {
    query: string;  // Make query required but can be empty string
    page: number;   // Make page required
    per_page: number; // Make per_page required
    orientation?: 'landscape' | 'portrait' | 'squarish';
    color?: string;
    order_by: 'relevant' | 'latest';
  }
  // Get base URL from environment variable
  const API_BASE_URL = "http://localhost:5000/api";
  
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not defined in environment variables');
  }
  
  export const imageApi = {
    // Get random or filtered images
    getImages: async (params?: {
      query?: string;
      orientation?: string;
      count?: number;
    }): Promise<UnsplashImage[]> => {
      try {
        const searchParams = new URLSearchParams();
        if (params?.query) searchParams.append('query', params.query);
        if (params?.orientation) searchParams.append('orientation', params.orientation);
        if (params?.count) searchParams.append('count', params.count.toString());
  
        const response = await fetch(`${API_BASE_URL}/images?${searchParams}`);
        if (!response.ok) throw new Error('Failed to fetch images');
        
        const data = await response.json();
        return data.success ? data.data : [];
      } catch (error) {
        console.error('Error fetching images:', error);
        throw error;
      }
    },
  
    // Get specific image by ID
    getImageById: async (photoId: string): Promise<UnsplashImage> => {
      try {
        const response = await fetch(`${API_BASE_URL}/images/${photoId}`);
        if (!response.ok) throw new Error('Failed to fetch image');
        
        const data = await response.json();
        return data.success ? data.data : null;
      } catch (error) {
        console.error('Error fetching image:', error);
        throw error;
      }
    },
  
    // Search images with advanced parameters
    searchImages: async (params: SearchParams): Promise<SearchResponse> => {
      try {
        const searchParams = new URLSearchParams();
        if (params.query) searchParams.append('query', params.query);
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.per_page) searchParams.append('per_page', params.per_page.toString());
        if (params.orientation) searchParams.append('orientation', params.orientation);
        if (params.color) searchParams.append('color', params.color);
        if (params.order_by) searchParams.append('order_by', params.order_by);
  
        const response = await fetch(`${API_BASE_URL}/images/search?${searchParams}`);
        if (!response.ok) throw new Error('Failed to search images');
        
        const data = await response.json();
        return data.success ? data.data : { photos: [], pagination: { total: 0, total_pages: 0, current_page: 1, per_page: 30 }};
      } catch (error) {
        console.error('Error searching images:', error);
        throw error;
      }
    },
  
    uploadImage: async (file: File): Promise<UnsplashImage> => {
      try {
        const formData = new FormData();
        formData.append('image', file);
  
        const response = await fetch(`${API_BASE_URL}/images/upload`, {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) throw new Error('Failed to upload image');
  
        const data = await response.json();
        return data.success ? data.data : null;
      } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
      }
    }
  };