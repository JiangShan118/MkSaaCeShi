'use client';

import { HeaderSection } from '@/components/layout/header-section';
import { BorderBeam } from '@/components/magicui/border-beam';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  ChartBarIncreasingIcon,
  Database,
  Fingerprint,
  IdCard,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';

/**
 * https://nsui.irung.me/features
 * pnpm dlx shadcn@canary add https://nsui.irung.me/r/features-12.json
 */
export default function FeaturesSection() {
  const t = useTranslations('HomePage.features');
  type ImageKey = 'item-1' | 'item-2' | 'item-3' | 'item-4';
  const [activeItem, setActiveItem] = useState<ImageKey>('item-1');

  const images = {
    'item-1': {
      image: 'https://cdn.mksaas.com/blocks/charts-light.png',
      darkImage: 'https://cdn.mksaas.com/blocks/charts.png',
      alt: 'Product Feature One',
    },
    'item-2': {
      image: 'https://cdn.mksaas.com/blocks/music-light.png',
      darkImage: 'https://cdn.mksaas.com/blocks/music.png',
      alt: 'Product Feature Two',
    },
    'item-3': {
      image: 'https://cdn.mksaas.com/blocks/mail2-light.png',
      darkImage: 'https://cdn.mksaas.com/blocks/mail2.png',
      alt: 'Product Feature Three',
    },
    'item-4': {
      image: 'https://cdn.mksaas.com/blocks/payments-light.png',
      darkImage: 'https://cdn.mksaas.com/blocks/payments.png',
      alt: 'Product Feature Four',
    },
  };

  return (
    <section id="features" className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-2 lg:px-0 space-y-8 lg:space-y-20 dark:[--color-border:color-mix(in_oklab,var(--color-white)_10%,transparent)]">
        <ScrollReveal>
          <HeaderSection
            title={t('title')}
            subtitle={t('subtitle')}
            description={t('description')}
          />
        </ScrollReveal>

        <ScrollReveal
          delay={150}
          className="grid gap-12 lg:grid-cols-12 lg:gap-24"
        >
          <div className="flex flex-col gap-8 lg:col-span-5">
            <div className="text-left lg:pr-0">
              <h3 className="text-3xl font-semibold lg:text-4xl text-foreground leading-normal py-1">
                {t('title')}
              </h3>
              <p className="mt-4 text-muted-foreground">{t('description')}</p>
            </div>
            <Accordion
              type="single"
              value={activeItem}
              onValueChange={(value) => setActiveItem(value as ImageKey)}
              className="w-full"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex items-center gap-2 text-base">
                    <Database className="size-4" />
                    {t('items.item-1.title')}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {t('items.item-1.description')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  <div className="flex items-center gap-2 text-base">
                    <Fingerprint className="size-4" />
                    {t('items.item-2.title')}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {t('items.item-2.description')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  <div className="flex items-center gap-2 text-base">
                    <IdCard className="size-4" />
                    {t('items.item-3.title')}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {t('items.item-3.description')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  <div className="flex items-center gap-2 text-base">
                    <ChartBarIncreasingIcon className="size-4" />
                    {t('items.item-4.title')}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {t('items.item-4.description')}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="relative flex w-full overflow-hidden rounded-2xl border bg-background p-2 lg:col-span-7 lg:h-auto">
            <div className="relative w-full rounded-2xl aspect-76/59 bg-background">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeItem}-id`}
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="size-full overflow-hidden rounded-2xl border bg-muted shadow-md"
                >
                  <Image
                    src={images[activeItem].image}
                    className="size-full object-cover object-top-left dark:hidden"
                    alt={images[activeItem].alt}
                    width={1207}
                    height={929}
                  />
                  <Image
                    src={images[activeItem].darkImage}
                    className="size-full object-cover object-top-left dark:block hidden"
                    alt={images[activeItem].alt}
                    width={1207}
                    height={929}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <BorderBeam
              duration={6}
              size={200}
              className="from-transparent via-primary/60 to-transparent dark:via-primary/30"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
