import { useState, useEffect } from 'react';
import { db, type SystemSettings } from '../db';

export function useSettings() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSettings = async () => {
    const systemSettings = await db.systemSettings.toCollection().first();
    if (systemSettings) {
      setSettings(systemSettings);
    }
    setIsLoading(false);
  };

  const updateSettings = async (updates: Partial<SystemSettings>) => {
    if (!settings?.id) return;
    
    await db.systemSettings.update(settings.id, updates);
    await refreshSettings();
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return {
    settings,
    isLoading,
    refreshSettings,
    updateSettings,
  };
}
