'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { generateTaglinesAction } from '@/actions/ai/generate-taglines';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const SAMPLE_PRODUCT =
  'A SaaS boilerplate built with Next.js, Better Auth, Drizzle ORM, and PostgreSQL. Helps indie developers ship a production-ready app over a weekend.';

export function AiTaglineCard() {
  const [product, setProduct] = useState(SAMPLE_PRODUCT);
  const [taglines, setTaglines] = useState<string[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [isPending, setIsPending] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('deepseek');

  async function onGenerate() {
    setError(undefined);
    setTaglines([]);
    setIsPending(true);
    try {
      const result = await generateTaglinesAction({
        product,
        model: selectedModel as 'deepseek' | 'openai',
      });
      if (result.serverError) {
        const errorMsg =
          typeof result.serverError === 'string'
            ? result.serverError
            : 'error' in result.serverError
              ? result.serverError.error
              : String(result.serverError);
        setError(errorMsg);
      } else if (result.validationErrors) {
        const firstError = Object.values(result.validationErrors)[0];
        if (Array.isArray(firstError)) {
          setError(firstError[0] ?? 'Validation error');
        } else if (typeof firstError === 'string') {
          setError(firstError);
        } else if (firstError && '_errors' in firstError) {
          setError(firstError._errors?.[0] ?? 'Validation error');
        } else {
          setError(String(firstError));
        }
      } else if (result.data?.success === false) {
        setError(result.data.error);
      } else if (result.data?.success && result.data.data) {
        setTaglines(result.data.data.taglines);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to generate taglines.'
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          SaaS Tagline Generator
        </CardTitle>
        <CardDescription>
          Generate punchy SaaS taglines from a product description, powered by
          Vercel AI SDK.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ai-tagline-model">Model</Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger id="ai-tagline-model" size="sm">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deepseek">DeepSeek v4 Flash</SelectItem>
                  <SelectItem value="openai">OpenAI GPT 5.5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ai-tagline-input">Product description</Label>
              <Textarea
                id="ai-tagline-input"
                rows={6}
                value={product}
                onChange={(event) => setProduct(event.target.value)}
                placeholder="Describe what your SaaS does in one or two sentences..."
              />
              <p className="text-xs text-muted-foreground">
                {product.length} characters
              </p>
            </div>
            <Button
              type="button"
              onClick={onGenerate}
              disabled={isPending || product.trim().length < 10}
              className=""
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-1 size-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-1 size-4" />
                  Generate Taglines
                </>
              )}
            </Button>
          </div>
          <div className="space-y-2">
            <Label>Suggested taglines</Label>
            <div className="min-h-[200px] rounded-md border bg-muted/30 p-4 text-sm leading-relaxed">
              {error ? (
                <span className="text-destructive">{error}</span>
              ) : taglines.length > 0 ? (
                <ol className="list-decimal space-y-2 pl-5">
                  {taglines.map((tagline, index) => (
                    <li key={index}>{tagline}</li>
                  ))}
                </ol>
              ) : (
                <span className="text-muted-foreground">
                  Five generated taglines will appear here.
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
