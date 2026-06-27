'use client';

import LocaleSelector from '@/components/layout/locale-selector';
import { Logo } from '@/components/layout/logo';
import { ModeSwitcherHorizontal } from '@/components/layout/mode-switcher-horizontal';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavbarLinks } from '@/config/navbar-config';
import { LocaleLink, useLocalePathname } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { Routes } from '@/routes';
import { LoginWrapper } from '@/components/auth/login-wrapper';
import {
  ArrowUpRightIcon,
  ChevronRightIcon,
  MenuIcon,
  XIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { UserButtonMobile } from './user-button-mobile';

const mobileLinkClass =
  'flex w-full items-center rounded-md p-2 text-base text-muted-foreground transition-colors duration-150 hover:text-foreground';
const mobileLinkActiveClass = 'font-semibold text-primary';
const mobileSubLinkClass =
  'flex w-full items-center gap-4 rounded-md p-2 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground';

interface NavbarMobileProps extends React.HTMLAttributes<HTMLDivElement> {}

export function NavbarMobile({ className, ...props }: NavbarMobileProps) {
  const t = useTranslations();
  const localePathname = useLocalePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const currentUser = session?.user;
  const menuLinks = useNavbarLinks();

  // Sync mount (avoid hydration mismatch) and close drawer on route change
  useEffect(() => {
    setMounted(true);
    setOpen(false);
  }, [localePathname]);

  if (!mounted) return null;

  return (
    <>
      <div
        className={cn('flex items-center justify-between', className)}
        {...props}
      >
        <LocaleLink href="/" className="flex items-center gap-2">
          <Logo />
          <span className="text-xl font-semibold">{t('Metadata.name')}</span>
        </LocaleLink>

        <div className="flex items-center gap-4">
          {isPending ? (
            <Skeleton className="size-8 rounded-full" />
          ) : currentUser ? (
            <UserButtonMobile user={currentUser} />
          ) : null}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-expanded={open}
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
            className="size-8 rounded-md border"
          >
            {open ? (
              <XIcon className="size-4" />
            ) : (
              <MenuIcon className="size-4" />
            )}
          </Button>
        </div>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="fixed inset-0 top-14.25 z-50 flex flex-col overflow-y-auto bg-background animate-in fade-in-0 duration-200"
        >
          <div className="flex flex-1 flex-col items-start gap-4 p-4">
            {!currentUser && (
              <div className="flex w-full flex-col gap-4">
                <LoginWrapper mode="redirect" asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => setOpen(false)}
                  >
                    {t('Common.login')}
                  </Button>
                </LoginWrapper>
                <LocaleLink
                  href={Routes.Register}
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ size: 'lg' }), 'w-full')}
                >
                  {t('Common.signUp')}
                </LocaleLink>
              </div>
            )}

            <ul className="w-full space-y-1">
              {menuLinks?.map((item) => {
                const active = item.href
                  ? item.href === '/'
                    ? localePathname === '/'
                    : localePathname.startsWith(item.href)
                  : item.items?.some(
                      (sub) => sub.href && localePathname.startsWith(sub.href)
                    );

                return (
                  <li key={item.title} className="py-1">
                    {item.items ? (
                      <Collapsible>
                        <CollapsibleTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            className={cn(
                              'w-full justify-between text-left text-base',
                              'bg-transparent text-muted-foreground hover:text-foreground',
                              active && 'font-semibold text-primary'
                            )}
                          >
                            {item.title}
                            <ChevronRightIcon className="size-4" />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pl-2">
                          <ul className="mt-2 space-y-2">
                            {item.items.map((sub) => (
                              <li key={sub.title}>
                                <LocaleLink
                                  href={sub.href ?? '#'}
                                  target={sub.external ? '_blank' : undefined}
                                  rel={
                                    sub.external
                                      ? 'noopener noreferrer'
                                      : undefined
                                  }
                                  onClick={() => setOpen(false)}
                                  className={cn(
                                    mobileSubLinkClass,
                                    sub.href &&
                                      localePathname.startsWith(sub.href) &&
                                      mobileLinkActiveClass
                                  )}
                                >
                                  {sub.icon ? (
                                    <div className="size-4 shrink-0">
                                      {sub.icon}
                                    </div>
                                  ) : null}
                                  {sub.title}
                                  {sub.external ? (
                                    <ArrowUpRightIcon className="size-4 shrink-0" />
                                  ) : null}
                                </LocaleLink>
                              </li>
                            ))}
                          </ul>
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <LocaleLink
                        href={item.href ?? '#'}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        onClick={() => setOpen(false)}
                        className={cn(
                          mobileLinkClass,
                          active && mobileLinkActiveClass
                        )}
                      >
                        {item.title}
                      </LocaleLink>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="mt-auto w-full border-t border-border/50 p-4 flex items-center justify-between">
              <LocaleSelector />
              <ModeSwitcherHorizontal />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
