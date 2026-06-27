'use client';

import { LoginWrapper } from '@/components/auth/login-wrapper';
import Container from '@/components/layout/container';
import { Logo } from '@/components/layout/logo';
import { ModeSwitcher } from '@/components/layout/mode-switcher';
import { NavbarMobile } from '@/components/layout/navbar-mobile';
import { UserButton } from '@/components/layout/user-button';
import { buttonVariants } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavbarLinks } from '@/config/navbar-config';
import { useScroll } from '@/hooks/use-scroll';
import { LocaleLink, useLocalePathname } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { Routes } from '@/routes';
import { ArrowUpRightIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import LocaleSwitcher from './locale-switcher';

interface NavBarProps {
  scroll?: boolean;
}

export function Navbar({ scroll = true }: NavBarProps) {
  const t = useTranslations();
  const scrolled = useScroll(50);
  const menuLinks = useNavbarLinks();
  const localePathname = useLocalePathname();
  const [mounted, setMounted] = useState(false);
  const [menuValue, setMenuValue] = useState<string | undefined>(undefined);
  const { data: session, isPending } = authClient.useSession();
  const currentUser = session?.user;
  const showBarBg = scroll && scrolled;

  // Sync mount (avoid auth hydration mismatch) and close menu on route change
  useEffect(() => {
    setMounted(true);
    setMenuValue(undefined);
  }, [localePathname]);

  return (
    <header
      className={cn(
        'sticky inset-x-0 top-0 z-40 py-4 transition-all duration-300',
        showBarBg && 'border-b'
      )}
    >
      {showBarBg && (
        <div
          className="absolute inset-0 z-0 bg-muted/50 backdrop-blur-md"
          aria-hidden="true"
        />
      )}
      <div className="relative z-10">
        <Container className="px-4">
          {/* desktop navbar */}
          <nav
            aria-label="Main navigation"
            className="hidden lg:flex lg:items-center lg:justify-between lg:gap-4"
          >
            <LocaleLink
              href="/"
              aria-label="Home"
              className="flex items-center gap-2 shrink-0"
            >
              <Logo />
              <span className="text-xl font-semibold">
                {t('Metadata.name')}
              </span>
            </LocaleLink>

            <NavigationMenu
              value={menuValue}
              onValueChange={setMenuValue}
              className="flex-1 justify-center"
            >
              <NavigationMenuList aria-orientation={undefined}>
                {menuLinks?.map((item) =>
                  item.items ? (
                    <NavigationMenuItem key={item.title} value={item.title}>
                      <NavigationMenuTrigger
                        className={cn(
                          'bg-transparent',
                          item.items.some((sub) =>
                            sub.href
                              ? localePathname.startsWith(sub.href)
                              : false
                          ) && 'font-semibold text-foreground'
                        )}
                      >
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-100 gap-3 p-3 md:w-125 md:grid-cols-2 lg:w-150">
                          {item.items.map((sub) => {
                            const isSubActive =
                              sub.href && localePathname.startsWith(sub.href);
                            return (
                              <li key={sub.title}>
                                <NavigationMenuLink asChild>
                                  <LocaleLink
                                    href={sub.href ?? '#'}
                                    target={sub.external ? '_blank' : undefined}
                                    rel={
                                      sub.external
                                        ? 'noopener noreferrer'
                                        : undefined
                                    }
                                    onClick={() => setMenuValue(undefined)}
                                    className={cn(
                                      'group flex select-none flex-row items-center gap-4 rounded-md',
                                      'p-2 leading-none no-underline outline-hidden transition-colors',
                                      'hover:bg-accent hover:text-accent-foreground',
                                      'focus:bg-accent focus:text-accent-foreground',
                                      isSubActive &&
                                        'bg-accent text-accent-foreground'
                                    )}
                                  >
                                    {sub.icon ? (
                                      <div className="size-4 shrink-0">
                                        {sub.icon}
                                      </div>
                                    ) : null}
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-medium">
                                        {sub.title}
                                      </div>
                                      {sub.description ? (
                                        <p className="text-xs text-muted-foreground">
                                          {sub.description}
                                        </p>
                                      ) : null}
                                    </div>
                                    {sub.external ? (
                                      <ArrowUpRightIcon className="size-4 shrink-0" />
                                    ) : null}
                                  </LocaleLink>
                                </NavigationMenuLink>
                              </li>
                            );
                          })}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ) : (
                    <NavigationMenuItem key={item.title}>
                      <NavigationMenuLink
                        asChild
                        className={cn(
                          navigationMenuTriggerStyle(),
                          'bg-transparent',
                          item.href &&
                            (item.href === '/'
                              ? localePathname === '/'
                              : localePathname.startsWith(item.href)) &&
                            'font-semibold text-primary'
                        )}
                      >
                        <LocaleLink
                          href={item.href || '#'}
                          target={item.external ? '_blank' : undefined}
                          rel={
                            item.external ? 'noopener noreferrer' : undefined
                          }
                        >
                          {item.title}
                        </LocaleLink>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )
                )}
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center gap-4 shrink-0">
              <ModeSwitcher />
              <LocaleSwitcher />
              {!mounted || isPending ? (
                <Skeleton className="size-8 rounded-full" />
              ) : currentUser ? (
                <UserButton user={currentUser} />
              ) : (
                <>
                  <LoginWrapper mode="modal" asChild>
                    <button
                      type="button"
                      className={cn(
                        buttonVariants({
                          variant: 'outline',
                          size: 'sm',
                        }),
                        'cursor-pointer'
                      )}
                    >
                      {t('Common.login')}
                    </button>
                  </LoginWrapper>
                  <LocaleLink
                    href={Routes.Register}
                    className={buttonVariants({ size: 'sm' })}
                  >
                    {t('Common.signUp')}
                  </LocaleLink>
                </>
              )}
            </div>
          </nav>

          {/* mobile navbar */}
          <NavbarMobile className="lg:hidden" />
        </Container>
      </div>
    </header>
  );
}
