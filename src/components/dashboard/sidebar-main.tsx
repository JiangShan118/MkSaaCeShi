'use client';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { LocaleLink, useLocalePathname } from '@/i18n/navigation';
import type { NestedMenuItem } from '@/types';

/**
 * Main navigation for the dashboard sidebar
 */
export function SidebarMain({ items }: { items: NestedMenuItem[] }) {
  const pathname = useLocalePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const closeMobileSidebar = () => {
    if (isMobile) setOpenMobile(false);
  };

  // Function to check if a path is active
  const isActive = (href: string | undefined): boolean => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      {/* Render items with children as SidebarGroup */}
      {items.map((item) =>
        item.items && item.items.length > 0 ? (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent className="flex flex-col gap-2">
              <SidebarMenu className="gap-2">
                {item.items.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(subItem.href)}
                    >
                      <LocaleLink
                        href={subItem.href || ''}
                        onClick={closeMobileSidebar}
                      >
                        {subItem.icon ? subItem.icon : null}
                        <span className="truncate font-medium text-sm">
                          {subItem.title}
                        </span>
                      </LocaleLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          /* Render items without children directly in a SidebarMenu */
          <SidebarGroup key={item.title}>
            <SidebarGroupContent className="flex flex-col gap-2">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <LocaleLink
                      href={item.href || ''}
                      onClick={closeMobileSidebar}
                    >
                      {item.icon ? item.icon : null}
                      <span className="truncate font-medium text-sm">
                        {item.title}
                      </span>
                    </LocaleLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )
      )}
    </>
  );
}
