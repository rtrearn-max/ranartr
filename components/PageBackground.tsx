import { type ReactNode } from 'react';
import { useThemeBackground } from '@/lib/theme-context';
import type { PageKey } from '@/lib/db';

interface PageBackgroundProps {
  pageKey: PageKey;
  children: ReactNode;
}

export function PageBackground({ pageKey, children }: PageBackgroundProps) {
  const { imageUrl, hasBackground } = useThemeBackground(pageKey);

  return (
    <div className={`relative min-h-full ${!hasBackground ? 'bg-background' : ''}`}>
      {hasBackground && imageUrl && (
        <>
          <div
            className="fixed inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${imageUrl})`,
              zIndex: -2,
            }}
          />
          <div
            className="fixed inset-0 bg-background/60"
            style={{ zIndex: -1 }}
          />
        </>
      )}
      {children}
    </div>
  );
}
