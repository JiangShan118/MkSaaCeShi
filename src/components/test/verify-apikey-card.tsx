'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  CheckCircleIcon,
  KeyIcon,
  Loader2Icon,
  XCircleIcon,
} from 'lucide-react';
import { useState } from 'react';

type VerifyResult = {
  valid: boolean;
  error: { message: string; code: string } | null;
  key: {
    id: string;
    name: string | null;
    start: string | null;
    userId: string;
    createdAt: Date;
    expiresAt: Date | null;
  } | null;
};

export function VerifyApiKeyCard() {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);

  const handleVerify = async () => {
    if (!apiKey.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test/apikey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: apiKey.trim() }),
      });

      const data = (await response.json()) as VerifyResult;
      setResult(data);
    } catch (error) {
      setResult({
        valid: false,
        error: { message: 'Network error', code: 'NETWORK_ERROR' },
        key: null,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="text-lg font-semibold">API Key Verification Test</h3>

      <div className="flex items-center gap-4">
        <Label htmlFor="api-key-input" className="shrink-0">
          API Key
        </Label>
        <Input
          id="api-key-input"
          type="text"
          placeholder="Enter your API key..."
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !loading) {
              handleVerify();
            }
          }}
          disabled={loading}
          className="font-mono text-sm"
        />
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleVerify}
          disabled={loading || !apiKey.trim()}
          size="sm"
        >
          {loading ? (
            <Loader2Icon className="mr-2 size-4 animate-spin" />
          ) : (
            <KeyIcon className="mr-2 size-4" />
          )}
          Verify API Key
        </Button>
      </div>

      {result && (
        <div
          className={`rounded-md p-4 ${
            result.valid
              ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
              : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
          }`}
        >
          <div className="flex items-center gap-2">
            {result.valid ? (
              <CheckCircleIcon className="size-5 text-green-600 dark:text-green-400" />
            ) : (
              <XCircleIcon className="size-5 text-red-600 dark:text-red-400" />
            )}
            <span
              className={`font-medium ${
                result.valid
                  ? 'text-green-700 dark:text-green-300'
                  : 'text-red-700 dark:text-red-300'
              }`}
            >
              {result.valid ? 'Valid API Key' : 'Invalid API Key'}
            </span>
          </div>

          {result.error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              Error: {result.error.message} ({result.error.code})
            </p>
          )}

          {result.key && (
            <div className="mt-3 space-y-1 text-sm">
              <p>
                <strong>Key ID:</strong> {result.key.id}
              </p>
              <p>
                <strong>Name:</strong> {result.key.name || 'N/A'}
              </p>
              <p>
                <strong>Created:</strong>{' '}
                {new Date(result.key.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Expires:</strong>{' '}
                {result.key.expiresAt
                  ? new Date(result.key.expiresAt).toLocaleString()
                  : 'Never'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
