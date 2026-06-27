import Container from '@/components/layout/container';
import { AiTaglineCard } from '@/components/ai/ai-tagline-card';
import { constructMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return constructMetadata({
    title: 'AI Playground | ' + t('title'),
    description:
      'Demo of AI features powered by Vercel AI SDK with DeepSeek, and OpenAI GPT models.',
    locale,
    pathname: '/ai',
  });
}

export default async function AiPage() {
  const t = await getTranslations('AiPage');

  return (
    <Container className="py-16 px-4">
      <div className="mx-auto max-w-5xl space-y-10 pb-16">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-lg text-muted-foreground">{t('description')}</p>
        </div>

        <section id="tagline-generator" className="scroll-mt-20">
          <AiTaglineCard />
        </section>
      </div>
    </Container>
  );
}
