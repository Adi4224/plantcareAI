export class ImageProcessor {
  static async resizeImage(file: File, maxWidth = 1024, maxHeight = 1024, quality = 0.85): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to base64
        const base64 = canvas.toDataURL('image/jpeg', quality);
        resolve(base64.split(',')[1]); // Remove data:image/jpeg;base64, prefix
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  static async validateImage(file: File): Promise<{ isValid: boolean; error?: string }> {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Please upload a JPG, PNG, or WEBP image file.'
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File size must be less than 5MB.'
      };
    }

    // Check if it's actually an image by trying to load it
    try {
      await this.loadImage(file);
      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: 'Invalid image file or corrupted data.'
      };
    }
  }

  private static loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  static getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  static createThumbnail(file: File, size = 150): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = size;
        canvas.height = size;

        // Calculate crop dimensions for square thumbnail
        const minDimension = Math.min(img.width, img.height);
        const sourceX = (img.width - minDimension) / 2;
        const sourceY = (img.height - minDimension) / 2;

        ctx?.drawImage(
          img,
          sourceX, sourceY, minDimension, minDimension,
          0, 0, size, size
        );
        
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }
}
