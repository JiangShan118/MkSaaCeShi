import { HeaderSection } from '@/components/layout/header-section';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { PricingTable } from '@/components/pricing/pricing-table';
import { useTranslations } from 'next-intl';

export default function PricingSection() {
  const t = useTranslations('HomePage.pricing');

  return (
    <section id="pricing" className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl space-y-16">
        <ScrollReveal>
          <HeaderSection
            subtitle={t('subtitle')}
            subtitleClassName="text-4xl font-bold"
            description={t('description')}
          />
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <PricingTable />
        </ScrollReveal>
      </div>
    </section>
  );
}
