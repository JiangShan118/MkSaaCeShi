'use client';

import { NewsletterForm } from '@/components/newsletter/newsletter-form';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { websiteConfig } from '@/config/website';
import { useTranslations } from 'next-intl';
import { HeaderSection } from '../layout/header-section';

export function NewsletterCard() {
  // show nothing if newsletter is disabled
  if (!websiteConfig.newsletter.enable) {
    return null;
  }

  const t = useTranslations('Newsletter');

  return (
    <ScrollReveal>
      <div className="w-full rounded-lg bg-linear-to-br from-primary/5 via-muted/80 to-chart-1/8 dark:from-primary/8 dark:via-muted/50 dark:to-chart-1/5 px-4 py-12 sm:px-8 md:p-16">
        <div className="flex flex-col items-center justify-center gap-8">
          {/* Header */}
          <HeaderSection
            title={t('title')}
            subtitle={t('subtitle')}
            description={t('description')}
          />

          <NewsletterForm />
        </div>
      </div>
    </ScrollReveal>
  );
}
