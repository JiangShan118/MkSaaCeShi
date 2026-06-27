import { HeaderSection } from '@/components/layout/header-section';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { useTranslations } from 'next-intl';

export default function StatsSection() {
  const t = useTranslations('HomePage.stats');

  return (
    <section id="stats" className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6 space-y-8 md:space-y-16">
        <ScrollReveal>
          <HeaderSection
            title={t('title')}
            subtitle={t('subtitle')}
            description={t('description')}
          />
        </ScrollReveal>

        <div className="grid gap-2 *:text-center md:grid-cols-3 md:divide-x md:divide-border">
          <ScrollReveal className="space-y-4 py-4 md:py-0">
            <div className="text-5xl font-bold tabular-nums text-primary">
              +1200
            </div>
            <p className="text-muted-foreground font-medium">
              {t('items.item-1.title')}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={120} className="space-y-4 py-4 md:py-0">
            <div className="text-5xl font-bold tabular-nums text-primary">
              22 Million
            </div>
            <p className="text-muted-foreground font-medium">
              {t('items.item-2.title')}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={240} className="space-y-4 py-4 md:py-0">
            <div className="text-5xl font-bold tabular-nums text-primary">
              +500
            </div>
            <p className="text-muted-foreground font-medium">
              {t('items.item-3.title')}
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
