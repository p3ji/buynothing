/**
 * Image Security Utility: Strips EXIF & GPS Metadata from smartphone camera uploads.
 * Re-draws raw pixels onto an offscreen canvas to guarantee zero location leakage.
 */
export async function stripExifAndCompress(
  file: File,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.85
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    reader.onerror = (err) => reject(err);

    img.onload = () => {
      let { width, height } = img;

      // Maintain aspect ratio while resizing
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to create canvas context for image processing'));
        return;
      }

      // Drawing to canvas strips ALL EXIF, GPS, camera metadata
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Image blob conversion failed'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
