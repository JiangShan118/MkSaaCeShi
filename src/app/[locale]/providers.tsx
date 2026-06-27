'use client';

import { PostHogProvider } from '@/analytics/posthog-analytics';
import { QueryProvider } from '@/components/providers/query-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { websiteConfig } from '@/config/website';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Providers
 *
 * This component is used to wrap the app in the providers.
 *
 * - PostHogProvider: Provides the PostHog analytics to the app.
 * - QueryProvider: Provides the query client to the app.
 * - ThemeProvider: Provides the theme to the app.
 * - TooltipProvider: Provides the tooltip to the app.
 */
export function Providers({ children }: ProvidersProps) {
  const defaultMode = websiteConfig.ui.mode?.defaultMode ?? 'system';

  return (
    <PostHogProvider>
      <QueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme={defaultMode}
          enableSystem={true}
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </QueryProvider>
    </PostHogProvider>
  );
}
