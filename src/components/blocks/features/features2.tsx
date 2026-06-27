import { HeaderSection } from '@/components/layout/header-section';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import {
  ActivityIcon,
  DraftingCompassIcon,
  MailIcon,
  ZapIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

/**
 * https://nsui.irung.me/features
 * pnpm dlx shadcn@canary add https://nsui.irung.me/r/features-5.json
 */
export default function Features2Section() {
  const t = useTranslations('HomePage.features2');

  return (
    <section id="features2" className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-2 lg:px-0 space-y-8 lg:space-y-20">
        <ScrollReveal>
          <HeaderSection
            title={t('title')}
            subtitle={t('subtitle')}
            description={t('description')}
          />
        </ScrollReveal>

        <ScrollReveal
          delay={150}
          className="grid items-center gap-12 lg:grid-cols-5 lg:gap-24"
        >
          <div className="lg:col-span-2">
            <div className="lg:pr-0">
              <h2 className="text-4xl font-semibold">{t('title')}</h2>
              <p className="mt-6 text-muted-foreground">{t('description')}</p>
            </div>

            <ul className="mt-8 divide-y border-y *:flex *:items-center *:gap-3 *:py-3">
              <li>
                <MailIcon className="size-5 shrink-0" />
                {t('feature-1')}
              </li>
              <li>
                <ZapIcon className="size-5 shrink-0" />
                {t('feature-2')}
              </li>
              <li>
                <ActivityIcon className="size-5 shrink-0" />
                {t('feature-3')}
              </li>
              <li>
                <DraftingCompassIcon className="size-5 shrink-0" />
                {t('feature-4')}
              </li>
            </ul>
          </div>

          <div className="border-border/50 relative rounded-3xl border p-3 lg:col-span-3">
            <div className="bg-linear-to-b aspect-76/59 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
              <Image
                src="https://cdn.mksaas.com/blocks/dark-card.webp"
                className="hidden size-full rounded-[15px] object-cover dark:block"
                alt="card illustration dark"
                width={1207}
                height={929}
              />
              <Image
                src="https://cdn.mksaas.com/blocks/card.png"
                className="size-full rounded-[15px] object-cover shadow dark:hidden"
                alt="card illustration light"
                width={1207}
                height={929}
              />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
