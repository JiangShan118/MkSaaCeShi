import { websiteConfig } from '@/config/website';
import { storageConfig } from './config/storage-config';
import { S3Provider } from './provider/s3';
import type {
  StorageConfig,
  StorageProvider,
  StorageProviderName,
  UploadFileResult,
} from './types';

/**
 * Default storage configuration
 */
export const defaultStorageConfig: StorageConfig = storageConfig;

type StorageProviderFactory = () => StorageProvider;

const providerRegistry: Partial<
  Record<StorageProviderName, StorageProviderFactory>
> = {
  s3: () => new S3Provider(),
};

let storageProvider: StorageProvider | null = null;

function createStorageProvider(): StorageProvider {
  const name = websiteConfig.storage.provider;
  if (!name) throw new Error('storage.provider is required in websiteConfig.');
  const factory = providerRegistry[name];
  if (!factory) throw new Error(`Unsupported storage provider: ${name}.`);
  return factory();
}

/**
 * Get the storage provider
 * @returns current storage provider instance
 * @throws Error if provider is not initialized
 */
export const getStorageProvider = (): StorageProvider => {
  if (!storageProvider) storageProvider = createStorageProvider();
  return storageProvider;
};

/**
 * Uploads a file to the configured storage provider
 *
 * @param file - The file to upload (Buffer or Blob)
 * @param filename - Original filename with extension
 * @param contentType - MIME type of the file
 * @param folder - Optional folder path to store the file in
 * @returns Promise with the URL of the uploaded file and its storage key
 */
export const uploadFile = async (
  file: Buffer | Blob,
  filename: string,
  contentType: string,
  folder?: string
): Promise<UploadFileResult> => {
  const provider = getStorageProvider();
  return provider.uploadFile({ file, filename, contentType, folder });
};

/**
 * Deletes a file from the storage provider
 *
 * @param key - The storage key of the file to delete
 * @returns Promise that resolves when the file is deleted
 */
export const deleteFile = async (key: string): Promise<void> => {
  const provider = getStorageProvider();
  return provider.deleteFile(key);
};
