'use client';

import { HeaderSection } from '@/components/layout/header-section';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useTranslations } from 'next-intl';

type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

export default function FaqSection() {
  const t = useTranslations('HomePage.faqs');

  const faqItems: FAQItem[] = [
    {
      id: 'item-1',
      question: t('items.item-1.question'),
      answer: t('items.item-1.answer'),
    },
    {
      id: 'item-2',
      question: t('items.item-2.question'),
      answer: t('items.item-2.answer'),
    },
    {
      id: 'item-3',
      question: t('items.item-3.question'),
      answer: t('items.item-3.answer'),
    },
    {
      id: 'item-4',
      question: t('items.item-4.question'),
      answer: t('items.item-4.answer'),
    },
    {
      id: 'item-5',
      question: t('items.item-5.question'),
      answer: t('items.item-5.answer'),
    },
  ];

  return (
    <section id="faqs" className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <ScrollReveal>
          <HeaderSection title={t('title')} subtitle={t('subtitle')} />
        </ScrollReveal>

        <ScrollReveal delay={150} className="mx-auto max-w-4xl mt-12">
          <Accordion
            type="single"
            collapsible
            className="ring-primary/10 w-full rounded-2xl border border-primary/15 px-4 py-3 shadow-sm ring-4 dark:ring-primary/5 dark:border-primary/10 sm:px-8"
          >
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-dashed"
              >
                <AccordionTrigger className="text-base hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-base text-muted-foreground">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>
      </div>
    </section>
  );
}
