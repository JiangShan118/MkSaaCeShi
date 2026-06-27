'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { websiteConfig } from '@/config/website';
import { useCurrentPlan } from '@/hooks/use-payment';
import { LocaleLink } from '@/i18n/navigation';
import { Routes } from '@/routes';
import { SparklesIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

interface UpgradeCardProps {
  userId: string;
}

export function UpgradeCard({ userId }: UpgradeCardProps) {
  const t = useTranslations('Dashboard.upgrade');
  const [mounted, setMounted] = useState(false);
  const { data: paymentData, isLoading } = useCurrentPlan(userId);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!websiteConfig.features.enableUpgradeCard) {
    return null;
  }

  // Don't show the upgrade card if the user has a lifetime membership or a subscription
  const isMember =
    paymentData?.currentPlan?.isLifetime || !!paymentData?.subscription;

  // Ensure the upgrade card is only shown when the data is loaded
  if (!mounted || isLoading || !paymentData) {
    return null;
  }

  // If the user is a member, don't show the upgrade card
  if (isMember) {
    return null;
  }

  return (
    <Card className="shadow-none">
      <CardHeader className="gap-2">
        <CardTitle className="flex items-center gap-2">
          <SparklesIcon className="size-4" />
          {t('title')}
        </CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-full shadow-none" size="sm">
          <LocaleLink href={Routes.SettingsBilling}>{t('button')}</LocaleLink>
        </Button>
      </CardContent>
    </Card>
  );
}
