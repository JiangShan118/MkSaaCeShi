'use client';

import { websiteConfig } from '@/config/website';
import type { Translations } from 'fumadocs-ui/i18n';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useParams } from 'next/navigation';
import type { ReactNode } from 'react';

/**
 * Wraps Fumadocs RootProvider (Shiki, MDX components context).
 * Only used in docs, blog post, and legal layouts so fumadocs-ui is not loaded on other pages.
 */
export function DocsRootProvider({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const params = useParams();
  const locale = (params?.locale as string) ?? websiteConfig.i18n.defaultLocale;

  const locales = Object.entries(websiteConfig.i18n.locales).map(
    ([loc, data]) => ({
      name: data.name,
      locale: loc,
    })
  );

  const t = useTranslations('DocsPage');
  const translations: Partial<Translations> = {
    toc: t('toc'),
    search: t('search'),
    lastUpdate: t('lastUpdate'),
    searchNoResult: t('searchNoResult'),
    previousPage: t('previousPage'),
    nextPage: t('nextPage'),
    chooseLanguage: t('chooseLanguage'),
  };

  return (
    <RootProvider theme={theme} i18n={{ locale, locales, translations }}>
      {children}
    </RootProvider>
  );
}
