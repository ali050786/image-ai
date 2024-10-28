const API_BASE_URL = "http://localhost:5000/api";

export const backgroundApi = {
  removeBackground: async (imageData: string): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/background/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageData })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove background');
      }

      const data = await response.json();
      return data.data.image;
    } catch (error) {
      console.error('Error removing background:', error);
      throw error;
    }
  }
};
