import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Button } from '@/components/ui/button';
import { LocaleLink } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function CallToActionSection() {
  const t = useTranslations('HomePage.calltoaction');

  return (
    <section
      id="call-to-action"
      className="relative overflow-hidden px-4 py-16 md:py-24"
    >
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-muted/80 to-chart-1/8 dark:from-primary/8 dark:via-muted/50 dark:to-chart-1/5" />
      <div className="relative mx-auto max-w-5xl px-6">
        <ScrollReveal className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('description')}
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <LocaleLink href="/#pricing">
                <span>{t('primaryButton')}</span>
              </LocaleLink>
            </Button>

            <Button asChild size="lg" variant="outline">
              <LocaleLink href="https://demo.mksaas.com">
                <span>{t('secondaryButton')}</span>
              </LocaleLink>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
