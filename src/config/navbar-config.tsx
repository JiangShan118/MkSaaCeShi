'use client';

import { Routes } from '@/routes';
import type { NestedMenuItem } from '@/types';
import {
  AudioLinesIcon,
  BuildingIcon,
  ChartNoAxesCombinedIcon,
  CircleDollarSignIcon,
  CircleHelpIcon,
  ComponentIcon,
  CookieIcon,
  FileTextIcon,
  FilmIcon,
  FlameIcon,
  FootprintsIcon,
  ImageIcon,
  ListChecksIcon,
  LockKeyholeIcon,
  LogInIcon,
  MailIcon,
  MailboxIcon,
  MessageCircleIcon,
  NewspaperIcon,
  RocketIcon,
  ShieldCheckIcon,
  SnowflakeIcon,
  SplitSquareVerticalIcon,
  SquareCodeIcon,
  SquareKanbanIcon,
  SquarePenIcon,
  ThumbsUpIcon,
  UserPlusIcon,
  UsersIcon,
  WandSparklesIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { websiteConfig } from './website';

/**
 * Get navbar config with translations
 *
 * NOTICE: used in client components only
 *
 * docs:
 * https://mksaas.com/docs/config/navbar
 *
 * @returns The navbar config with translated titles and descriptions
 */
export function useNavbarLinks(): NestedMenuItem[] {
  const t = useTranslations('Marketing.navbar');

  return [
    {
      title: t('features.title'),
      href: Routes.Features,
      external: false,
    },
    {
      title: t('pricing.title'),
      href: Routes.Pricing,
      external: false,
    },
    ...(websiteConfig.blog.enable
      ? [
          {
            title: t('blog.title'),
            href: Routes.Blog,
            external: false,
          },
        ]
      : []),
    ...(websiteConfig.docs.enable
      ? [
          {
            title: t('docs.title'),
            href: Routes.Docs,
            external: false,
          },
        ]
      : []),
    {
      title: t('pages.title'),
      items: [
        {
          title: t('pages.items.about.title'),
          description: t('pages.items.about.description'),
          icon: <BuildingIcon className="size-4 shrink-0" />,
          href: Routes.About,
          external: false,
        },
        {
          title: t('pages.items.contact.title'),
          description: t('pages.items.contact.description'),
          icon: <MailIcon className="size-4 shrink-0" />,
          href: Routes.Contact,
          external: false,
        },
        {
          title: t('pages.items.waitlist.title'),
          description: t('pages.items.waitlist.description'),
          icon: <MailboxIcon className="size-4 shrink-0" />,
          href: Routes.Waitlist,
          external: false,
        },
        {
          title: t('pages.items.roadmap.title'),
          description: t('pages.items.roadmap.description'),
          icon: <SquareKanbanIcon className="size-4 shrink-0" />,
          href: Routes.Roadmap,
          external: false,
        },
        {
          title: t('pages.items.changelog.title'),
          description: t('pages.items.changelog.description'),
          icon: <ListChecksIcon className="size-4 shrink-0" />,
          href: Routes.Changelog,
          external: false,
        },
        {
          title: t('pages.items.ai.title'),
          description: t('pages.items.ai.description'),
          icon: <WandSparklesIcon className="size-4 shrink-0" />,
          href: Routes.Ai,
          external: false,
        },
        {
          title: t('pages.items.cookiePolicy.title'),
          description: t('pages.items.cookiePolicy.description'),
          icon: <CookieIcon className="size-4 shrink-0" />,
          href: Routes.CookiePolicy,
          external: false,
        },
        {
          title: t('pages.items.privacyPolicy.title'),
          description: t('pages.items.privacyPolicy.description'),
          icon: <ShieldCheckIcon className="size-4 shrink-0" />,
          href: Routes.PrivacyPolicy,
          external: false,
        },
        {
          title: t('pages.items.termsOfService.title'),
          description: t('pages.items.termsOfService.description'),
          icon: <FileTextIcon className="size-4 shrink-0" />,
          href: Routes.TermsOfService,
          external: false,
        },
      ],
    },
  ];
}
