'use client';

import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ApiKey } from '@/db/types';
import { formatDate } from '@/lib/formatter';
import {
  type ColumnDef,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  CheckIcon,
  CopyIcon,
  MoreHorizontalIcon,
  PlusIcon,
  TrashIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

function TableRowSkeleton({ columns }: { columns: number }) {
  return (
    <TableRow className="h-14">
      {Array.from({ length: columns }).map((_, index) => (
        <TableCell key={index} className="py-3">
          <Skeleton className="h-4 w-24" />
        </TableCell>
      ))}
    </TableRow>
  );
}

// Mask API key for display: show start + asterisks
function maskApiKey(start: string | null | undefined): string {
  if (!start) return '••••••••••••••••';
  return `${start}••••••••••••`;
}

interface ApiKeysTableProps {
  data: ApiKey[];
  total: number;
  pageIndex: number;
  pageSize: number;
  loading?: boolean;
  creating?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onDelete: (keyId: string) => void;
  onCreate: (name: string) => Promise<{ key: string } | undefined>;
}

export function ApiKeysTable({
  data,
  total,
  pageIndex,
  pageSize,
  loading,
  creating,
  onPageChange,
  onPageSizeChange,
  onDelete,
  onCreate,
}: ApiKeysTableProps) {
  const t = useTranslations('Dashboard.settings.apiKeys');
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyDialogOpen, setNewKeyDialogOpen] = useState(false);
  const [newKeyValue, setNewKeyValue] = useState('');
  const [copied, setCopied] = useState(false);

  // Table columns definition
  const columns: ColumnDef<ApiKey>[] = useMemo(
    () => [
      {
        id: 'name',
        accessorKey: 'name',
        header: t('columns.name'),
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2">
              <span className="font-medium">{row.original.name}</span>
            </div>
          );
        },
        meta: {
          label: t('columns.name'),
        },
        minSize: 120,
        size: 140,
        enableSorting: false,
      },
      {
        id: 'key',
        accessorKey: 'start',
        header: t('columns.key'),
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2">
              <span className="font-mono">
                {maskApiKey(row.original.start)}
              </span>
            </div>
          );
        },
        meta: {
          label: t('columns.key'),
        },
        minSize: 180,
        size: 220,
        enableSorting: false,
      },
      {
        id: 'createdAt',
        accessorKey: 'createdAt',
        header: t('columns.createdAt'),
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2">
              {formatDate(row.original.createdAt)}
            </div>
          );
        },
        meta: {
          label: t('columns.createdAt'),
        },
        minSize: 140,
        size: 160,
        enableSorting: false,
      },
      {
        id: 'expiresAt',
        accessorKey: 'expiresAt',
        header: t('columns.expiresAt'),
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2">
              {row.original.expiresAt
                ? formatDate(row.original.expiresAt)
                : t('never')}
            </div>
          );
        },
        meta: {
          label: t('columns.expiresAt'),
        },
        minSize: 140,
        size: 160,
        enableSorting: false,
      },
      {
        id: 'actions',
        header: t('columns.actions'),
        cell: ({ row }) => {
          const keyId = row.original.id;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontalIcon className="size-4" />
                  <span className="sr-only">{t('columns.actions')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onDelete(keyId)}>
                  <TrashIcon className="mr-2 size-4" />
                  {t('delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        meta: {
          label: t('columns.actions'),
        },
        minSize: 80,
        size: 100,
        enableSorting: false,
      },
    ],
    [t, onDelete]
  );

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(total / pageSize),
    state: {
      columnFilters: [],
      columnVisibility,
      pagination: { pageIndex, pageSize },
    },
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      const next =
        typeof updater === 'function'
          ? updater({ pageIndex, pageSize })
          : updater;
      if (next.pageSize !== pageSize) {
        onPageSizeChange(next.pageSize);
        if (pageIndex !== 0) onPageChange(0);
      } else if (next.pageIndex !== pageIndex) {
        onPageChange(next.pageIndex);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualFiltering: true,
    enableMultiSort: false,
  });

  const handleCreate = async () => {
    if (!newKeyName.trim()) return;
    const result = await onCreate(newKeyName.trim());
    setNewKeyName('');
    setCreateDialogOpen(false);

    // Show the new key dialog if creation was successful
    if (result?.key) {
      setNewKeyValue(result.key);
      setNewKeyDialogOpen(true);
    }
  };

  const handleCopyKey = async () => {
    await navigator.clipboard.writeText(newKeyValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCloseNewKeyDialog = () => {
    setNewKeyDialogOpen(false);
    setNewKeyValue('');
    setCopied(false);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-start">
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="size-4" />
              {t('createButton')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('createDialogTitle')}</DialogTitle>
              <DialogDescription>
                {t('createDialogDescription')}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="key-name" className="shrink-0">
                  {t('keyNameLabel')}
                </Label>
                <Input
                  id="key-name"
                  placeholder={t('keyNamePlaceholder')}
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !creating) {
                      handleCreate();
                    }
                  }}
                  disabled={creating}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
                disabled={creating}
              >
                {t('cancel')}
              </Button>
              <Button onClick={handleCreate} disabled={creating}>
                {creating ? t('creating') : t('create')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* New API Key Dialog - shows after successful creation */}
      <Dialog open={newKeyDialogOpen} onOpenChange={handleCloseNewKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('newKeyDialogTitle')}</DialogTitle>
            <DialogDescription>
              {t('newKeyDialogDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={newKeyValue}
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyKey}
                className="shrink-0"
              >
                {copied ? (
                  <CheckIcon className="size-4 text-green-500" />
                ) : (
                  <CopyIcon className="size-4" />
                )}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCloseNewKeyDialog}>{t('done')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                // show skeleton rows while loading
                Array.from({ length: pageSize }).map((_, index) => (
                  <TableRowSkeleton key={index} columns={columns.length} />
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className="h-14"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {t('noResults')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={table} className="px-0" />
      </div>
    </div>
  );
}
