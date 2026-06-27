import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { getTranslations } from 'next-intl/server';

interface ApiKeysLayoutProps {
  children: React.ReactNode;
}

export default async function ApiKeysLayout({ children }: ApiKeysLayoutProps) {
  const t = await getTranslations('Dashboard.settings');

  const breadcrumbs = [
    {
      label: t('title'),
      isCurrentPage: false,
    },
    {
      label: t('apiKeys.title'),
      isCurrentPage: true,
    },
  ];

  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />

      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6 space-y-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {t('apiKeys.title')}
                </h1>
                <p className="text-muted-foreground mt-2">
                  {t('apiKeys.description')}
                </p>
              </div>

              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
