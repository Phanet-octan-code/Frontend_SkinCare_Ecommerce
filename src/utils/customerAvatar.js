/**
 * Customer Avatar Helper
 * Provides seamless retrieval, storage, and compression of customer profile avatars.
 */

export function getCustomerAvatar(customer) {
  if (!customer) return null;
  if (customer.avatar && typeof customer.avatar === 'string' && customer.avatar.trim()) {
    return customer.avatar;
  }
  const key = customer.id ? `skincare_customer_avatar_${customer.id}` : (customer.email ? `skincare_customer_avatar_${customer.email}` : null);
  if (key) {
    try {
      const stored = localStorage.getItem(key);
      if (stored) return stored;
    } catch {
      // Ignore storage errors
    }
  }
  return null;
}

export function saveCustomerAvatar(customer, dataUrl) {
  if (!customer) return;
  const key = customer.id ? `skincare_customer_avatar_${customer.id}` : (customer.email ? `skincare_customer_avatar_${customer.email}` : null);
  if (key) {
    try {
      if (dataUrl) {
        localStorage.setItem(key, dataUrl);
      } else {
        localStorage.removeItem(key);
      }
    } catch {
      // Ignore storage errors
    }
  }
}

/**
 * Resizes and compresses an uploaded image file into a clean, lightweight data URL.
 * Max dimension 400x400 with high JPEG/WebP quality.
 */
export function compressImageFile(file, maxDimension = 400, quality = 0.88) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Please select a valid image file.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read selected image.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to parse selected image.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to initialize canvas context.'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Prefer webp, fallback to jpeg
        try {
          const webpData = canvas.toDataURL('image/webp', quality);
          if (webpData.startsWith('data:image/webp')) {
            resolve(webpData);
            return;
          }
        } catch {
          // fallback
        }
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

