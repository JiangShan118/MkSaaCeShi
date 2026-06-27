'use client';

import { UserAvatar } from '@/components/layout/user-avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAvatarLinks } from '@/config/avatar-config';
import { websiteConfig } from '@/config/website';
import { useLocaleRouter } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';
import type { User } from 'better-auth';
import { LogOutIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';
import { CreditsBalanceMenu } from './credits-balance-menu';

interface UserButtonProps {
  user: User;
}

export function UserButton({ user }: UserButtonProps) {
  const t = useTranslations();
  const avatarLinks = useAvatarLinks();
  const localeRouter = useLocaleRouter();
  const [open, setOpen] = useState(false);
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          // TanStack Query automatically handles cache invalidation on sign out
          localeRouter.replace('/');
        },
        onError: (error) => {
          console.error('sign out error:', error);
          toast.error(t('Common.logoutFailed'));
        },
      },
    });
  };

  // Desktop View, use DropdownMenu
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <UserAvatar
          name={user.name}
          image={user.image}
          className="size-8 border"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {/* show user name and email */}
        <div className="flex items-center gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{user.name}</p>
            <p className="truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />

        {/* show credits balance button if credits are enabled */}
        {websiteConfig.credits.enableCredits && (
          <>
            <DropdownMenuItem>
              <CreditsBalanceMenu />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {avatarLinks.map((item) => (
          <DropdownMenuItem
            key={item.title}
            onClick={() => {
              if (item.href) {
                localeRouter.push(item.href);
              }
            }}
          >
            {item.icon ? item.icon : null}
            {item.title}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={async (event) => {
            event.preventDefault();
            setOpen(false);
            handleSignOut();
          }}
        >
          <LogOutIcon className="size-4" />
          {t('Common.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
