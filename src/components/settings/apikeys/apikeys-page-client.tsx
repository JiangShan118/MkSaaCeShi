'use client';

import { ApiKeysTable } from '@/components/settings/apikeys/apikeys-table';
import {
  useApiKeys,
  useCreateApiKey,
  useDeleteApiKey,
} from '@/hooks/use-apikeys';
import { useTranslations } from 'next-intl';
import { parseAsIndex, parseAsInteger, useQueryStates } from 'nuqs';
import { toast } from 'sonner';

export function ApiKeysPageClient() {
  const t = useTranslations('Dashboard.settings.apiKeys');

  const [{ page, size }, setQueryStates] = useQueryStates({
    page: parseAsIndex.withDefault(0),
    size: parseAsInteger.withDefault(10),
  });

  const { data, isLoading } = useApiKeys(page, size);

  const createMutation = useCreateApiKey();
  const deleteMutation = useDeleteApiKey();

  const handleCreate = async (name: string) => {
    return new Promise<{ key: string } | undefined>((resolve) => {
      createMutation.mutate(
        { name },
        {
          onSuccess: (data) => {
            toast.success(t('createSuccess'));
            // Return the key to show in the dialog
            resolve(data?.key ? { key: data.key } : undefined);
          },
          onError: () => {
            toast.error(t('createError'));
            resolve(undefined);
          },
        }
      );
    });
  };

  const handleDelete = (keyId: string) => {
    deleteMutation.mutate(
      { keyId },
      {
        onSuccess: () => {
          toast.success(t('deleteSuccess'));
        },
        onError: () => {
          toast.error(t('deleteError'));
        },
      }
    );
  };

  return (
    <ApiKeysTable
      data={data?.items || []}
      total={data?.total || 0}
      pageIndex={page}
      pageSize={size}
      loading={isLoading}
      creating={createMutation.isPending}
      onPageChange={(newPageIndex) => setQueryStates({ page: newPageIndex })}
      onPageSizeChange={(newPageSize) =>
        setQueryStates({ size: newPageSize, page: 0 })
      }
      onDelete={handleDelete}
      onCreate={handleCreate}
    />
  );
}
