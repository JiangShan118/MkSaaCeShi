import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { LocaleLink } from '@/i18n/navigation';
import { isDemoWebsite } from '@/lib/demo';
import React, { type ComponentProps, type ReactNode } from 'react';
import { CreditsBalanceButton } from '../layout/credits-balance-button';
import LocaleSwitcher from '../layout/locale-switcher';
import { ModeSwitcher } from '../layout/mode-switcher';

interface DashboardBreadcrumbItem {
  label: string;
  href?: ComponentProps<typeof LocaleLink>['href'];
  isCurrentPage?: boolean;
}

interface DashboardHeaderProps {
  breadcrumbs: DashboardBreadcrumbItem[];
  actions?: ReactNode;
}

/**
 * Dashboard header
 */
export function DashboardHeader({
  breadcrumbs,
  actions,
}: DashboardHeaderProps) {
  const isDemo = isDemoWebsite();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full min-w-0 items-center gap-2 px-4 lg:px-6">
        <SidebarTrigger className="-ml-1 shrink-0" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 data-vertical:self-auto"
        />

        <Breadcrumb className="min-w-0 flex-1">
          <BreadcrumbList className="text-base font-medium">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={`breadcrumb-${index}`}>
                {index > 0 && (
                  <BreadcrumbSeparator
                    key={`sep-${index}`}
                    className="hidden md:block"
                  />
                )}
                <BreadcrumbItem
                  key={`item-${index}`}
                  className={
                    index < breadcrumbs.length - 1 ? 'hidden md:block' : ''
                  }
                >
                  {item.isCurrentPage ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : item.href ? (
                    <BreadcrumbLink asChild>
                      <LocaleLink href={item.href}>{item.label}</LocaleLink>
                    </BreadcrumbLink>
                  ) : (
                    item.label
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        {/* dashboard header actions on the right side */}
        <div className="ml-auto flex shrink-0 items-center gap-3 pl-4">
          {actions}

          <CreditsBalanceButton />
          <ModeSwitcher />
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}
