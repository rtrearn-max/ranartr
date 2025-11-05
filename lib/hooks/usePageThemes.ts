import { useState, useEffect } from 'react';
import { db, type PageTheme, type PageKey } from '../db';
import { dispatchThemeUpdate } from '../theme-context';

const THEME_UPDATE_EVENT = 'theme-update';

export function usePageThemes() {
  const [themes, setThemes] = useState<PageTheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshThemes = async () => {
    const allThemes = await db.pageThemes.toArray();
    setThemes(allThemes);
    setIsLoading(false);
  };

  const getTheme = async (pageKey: PageKey): Promise<PageTheme | undefined> => {
    return await db.pageThemes.where('pageKey').equals(pageKey).first();
  };

  const setTheme = async (pageKey: PageKey, imageData: string): Promise<void> => {
    const existing = await getTheme(pageKey);
    
    if (existing) {
      await db.pageThemes.update(existing.id!, {
        imageData,
        updatedAt: new Date(),
      });
    } else {
      await db.pageThemes.add({
        pageKey,
        imageData,
        updatedAt: new Date(),
      });
    }
    
    dispatchThemeUpdate();
  };

  const removeTheme = async (pageKey: PageKey): Promise<void> => {
    const existing = await getTheme(pageKey);
    if (existing?.id) {
      await db.pageThemes.delete(existing.id);
      dispatchThemeUpdate();
    }
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.size > 5 * 1024 * 1024) {
        reject(new Error('Image size must be less than 5MB'));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert image'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    refreshThemes();

    const handleThemeUpdate = () => {
      refreshThemes();
    };

    window.addEventListener(THEME_UPDATE_EVENT, handleThemeUpdate);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme-update-trigger') {
        refreshThemes();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(THEME_UPDATE_EVENT, handleThemeUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    themes,
    isLoading,
    getTheme,
    setTheme,
    removeTheme,
    convertImageToBase64,
    refreshThemes,
  };
}
