import { Ripple } from '@/components/magicui/ripple';
import { AnimatedGroup } from '@/components/tailark/motion/animated-group';
import { TextEffect } from '@/components/tailark/motion/text-effect';
import { Button } from '@/components/ui/button';
import { LocaleLink } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      y: 12,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        bounce: 0,
        duration: 0.8,
      },
    },
  },
};

export default function HeroSection() {
  const t = useTranslations('HomePage.hero');
  const linkIntroduction = 'https://x.com/mksaascom';
  const linkPrimary = '/#pricing';
  const linkSecondary = 'https://demo.mksaas.com';

  return (
    <section id="hero" className="overflow-hidden">
      {/* background, light shadows on top of the hero section */}
      <div
        aria-hidden
        className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block"
      >
        <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,oklch(0.85_0.04_55/.12)_0,oklch(0.7_0.02_45/.04)_50%,transparent_80%)]" />
        <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,oklch(0.88_0.05_38/.1)_0,oklch(0.6_0.02_38/.03)_80%,transparent_100%)] [translate:5%_-50%]" />
        <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,oklch(0.9_0.03_65/.08)_0,oklch(0.65_0.015_50/.03)_80%,transparent_100%)]" />
      </div>

      <div className="relative pt-12">
        <div className="mx-auto max-w-7xl px-6">
          <Ripple />

          <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
            {/* introduction */}
            <AnimatedGroup variants={transitionVariants}>
              <LocaleLink
                href={linkIntroduction}
                className="hover:bg-muted group mx-auto flex w-fit items-center gap-2 rounded-full border border-border p-1 pl-4 transition-colors"
              >
                <span className="text-sm text-foreground font-medium">
                  {t('introduction')}
                </span>

                <div className="size-6 overflow-hidden rounded-full bg-muted duration-500">
                  <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                    <span className="flex size-6">
                      <ArrowRight className="m-auto size-3 text-foreground" />
                    </span>
                    <span className="flex size-6">
                      <ArrowRight className="m-auto size-3 text-foreground" />
                    </span>
                  </div>
                </div>
              </LocaleLink>
            </AnimatedGroup>

            {/* title */}
            <TextEffect
              per="line"
              preset="fade-in-blur"
              speedSegment={0.3}
              as="h1"
              className="mt-8 text-balance text-5xl font-bricolage-grotesque lg:mt-16 xl:text-[5rem]"
            >
              {t('title')}
            </TextEffect>

            {/* description */}
            <TextEffect
              per="line"
              preset="fade-in-blur"
              speedSegment={0.3}
              delay={0.5}
              as="p"
              className="mx-auto mt-8 max-w-4xl text-balance text-lg text-muted-foreground"
            >
              {t('description')}
            </TextEffect>

            {/* action buttons */}
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                ...transitionVariants,
              }}
              className="mt-12 flex flex-row items-center justify-center gap-4"
            >
              <div key={1} className="bg-foreground/10 rounded-xl">
                <Button
                  asChild
                  size="lg"
                  className="h-10.5 rounded-xl px-5 text-base"
                >
                  <LocaleLink href={linkPrimary}>
                    <span className="text-nowrap">{t('primary')}</span>
                  </LocaleLink>
                </Button>
              </div>
              <Button
                key={2}
                asChild
                size="lg"
                variant="outline"
                className="h-10.5 rounded-xl px-5"
              >
                <LocaleLink href={linkSecondary}>
                  <span className="text-nowrap">{t('secondary')}</span>
                </LocaleLink>
              </Button>
            </AnimatedGroup>
          </div>
        </div>

        {/* images */}
        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.75,
                },
              },
            },
            ...transitionVariants,
          }}
        >
          <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
            <div
              aria-hidden
              className="bg-linear-to-b to-muted/50 absolute inset-0 z-10 from-transparent from-35%"
            />
            <div className="inset-shadow-2xs ring-muted/50 dark:inset-shadow-white/20 bg-muted/50 relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
              <Image
                className="bg-muted/50 relative hidden rounded-2xl dark:block"
                src="https://cdn.mksaas.com/blocks/music.png"
                alt="MkSaaS dashboard screenshot showing the application interface in dark mode"
                width={2796}
                height={2008}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1152px"
              />
              <Image
                className="z-2 border-border/25 relative rounded-2xl border dark:hidden"
                src="https://cdn.mksaas.com/blocks/music-light.png"
                alt="MkSaaS dashboard screenshot showing the application interface in light mode"
                width={2796}
                height={2008}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1152px"
              />
            </div>
          </div>
        </AnimatedGroup>
      </div>
    </section>
  );
}
