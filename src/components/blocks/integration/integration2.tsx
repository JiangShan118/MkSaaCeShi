import { Logo } from '@/components/layout/logo';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import {
  Gemini,
  GooglePaLM,
  MagicUI,
  MediaWiki,
  Replit,
  VSCodium,
} from '@/components/tailark/logos';
import { Button } from '@/components/ui/button';
import { LocaleLink } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export default function Integration2Section() {
  const t = useTranslations('HomePage.integration2');

  return (
    <section>
      <div className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-linear-to-tl from-primary/5 via-muted/70 to-chart-1/6 dark:from-primary/6 dark:via-muted/40 dark:to-chart-1/4" />
        <div className="relative mx-auto max-w-5xl px-6">
          <div className="grid items-center gap-8 sm:grid-cols-2 sm:gap-0">
            <ScrollReveal className="relative mx-auto w-fit">
              <div className="mx-auto mb-2 flex w-fit justify-center gap-2">
                <IntegrationCard>
                  <Gemini />
                </IntegrationCard>
                <IntegrationCard>
                  <Replit />
                </IntegrationCard>
              </div>
              <div className="mx-auto my-2 flex w-fit justify-center gap-2">
                <IntegrationCard>
                  <MagicUI />
                </IntegrationCard>
                <IntegrationCard
                  borderClassName="border-black/25 dark:border-white/25"
                  className="dark:bg-muted"
                >
                  <Logo />
                </IntegrationCard>
                <IntegrationCard>
                  <VSCodium />
                </IntegrationCard>
              </div>

              <div className="mx-auto flex w-fit justify-center gap-2">
                <IntegrationCard>
                  <MediaWiki />
                </IntegrationCard>

                <IntegrationCard>
                  <GooglePaLM />
                </IntegrationCard>
              </div>
            </ScrollReveal>
            <ScrollReveal
              delay={200}
              className="mx-auto mt-6 max-w-lg space-y-6 text-center sm:mt-0 sm:text-left"
            >
              <h2 className="text-balance text-3xl font-semibold md:text-4xl">
                {t('title')}
              </h2>
              <p className="text-muted-foreground">{t('description')}</p>

              <div className="mt-12 flex flex-wrap justify-center md:justify-start gap-4">
                <Button asChild size="lg">
                  <LocaleLink href="/">
                    <span>{t('primaryButton')}</span>
                  </LocaleLink>
                </Button>

                <Button asChild size="lg" variant="outline">
                  <LocaleLink href="/">
                    <span>{t('secondaryButton')}</span>
                  </LocaleLink>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

const IntegrationCard = ({
  children,
  className,
  borderClassName,
}: {
  children: React.ReactNode;
  className?: string;
  borderClassName?: string;
}) => {
  return (
    <div
      className={cn(
        'relative flex size-20 rounded-xl bg-muted dark:bg-muted/50 transition-colors duration-200 hover:bg-accent dark:hover:bg-muted',
        className
      )}
    >
      <div
        role="presentation"
        className={cn('absolute inset-0 rounded-xl border', borderClassName)}
      />
      <div className="relative z-20 m-auto size-fit *:size-8 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};
