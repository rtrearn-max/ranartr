import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { db, type PageKey, type PageTheme } from './db';

interface ThemeContextType {
  themes: Map<string, PageTheme>;
  refreshThemes: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_UPDATE_EVENT = 'theme-update';

export function dispatchThemeUpdate() {
  window.dispatchEvent(new CustomEvent(THEME_UPDATE_EVENT));
  localStorage.setItem('theme-update-trigger', Date.now().toString());
  localStorage.removeItem('theme-update-trigger');
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themes, setThemes] = useState<Map<string, PageTheme>>(new Map());

  const refreshThemes = useCallback(async () => {
    const allThemes = await db.pageThemes.toArray();
    const themeMap = new Map<string, PageTheme>();
    allThemes.forEach(theme => {
      themeMap.set(theme.pageKey, theme);
    });
    setThemes(themeMap);
  }, []);

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
  }, [refreshThemes]);

  const value = useMemo(() => ({
    themes,
    refreshThemes,
  }), [themes, refreshThemes]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export function useThemeBackground(pageKey: PageKey) {
  const { themes } = useTheme();
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [hasBackground, setHasBackground] = useState(false);

  useEffect(() => {
    const theme = themes.get(pageKey);
    setImageUrl(theme?.imageData);
    setHasBackground(!!theme?.imageData);
  }, [themes, pageKey]);

  return {
    imageUrl,
    hasBackground,
  };
}
