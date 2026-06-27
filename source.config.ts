import {
  defineCollections,
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from 'fumadocs-mdx/config';
import { z } from 'zod';

/**
 * https://fumadocs.dev/docs/mdx
 *
 * Disable fetching external image sizes to avoid network errors during local dev.
 * External CDN images (e.g. cdn.mksaas.com) will be handled by next/image at runtime.
 */
export default defineConfig({
  mdxOptions: {
    remarkImageOptions: {
      external: false,
    },
  },
});

/**
 * https://fumadocs.dev/docs/mdx/collections#schema-1
 */
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema.extend({
      preview: z.string().optional(),
      index: z.boolean().default(false),
      premium: z.boolean().optional(),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema.extend({
      description: z.string().optional(),
    }),
  },
});

/**
 * Changelog
 *
 * title is required, but description is optional in frontmatter
 */
export const changelog = defineCollections({
  type: 'doc',
  dir: 'content/changelog',
  schema: frontmatterSchema.extend({
    version: z.string(),
    date: z.string().date(),
    published: z.boolean().default(true),
  }),
});

/**
 * Pages, like privacy policy, terms of service, etc.
 *
 * title is required, but description is optional in frontmatter
 */
export const pages = defineCollections({
  type: 'doc',
  dir: 'content/pages',
  schema: frontmatterSchema.extend({
    date: z.string().date(),
    published: z.boolean().default(true),
  }),
});

/**
 * Blog authors
 *
 * description is optional in frontmatter, but we must add it to the schema
 */
export const author = defineCollections({
  type: 'doc',
  dir: 'content/author',
  schema: z.object({
    name: z.string(),
    avatar: z.string(),
    description: z.string().optional(),
  }),
});

/**
 * Blog categories
 *
 * description is optional in frontmatter, but we must add it to the schema
 */
export const category = defineCollections({
  type: 'doc',
  dir: 'content/category',
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
  }),
});

/**
 * Blog posts
 *
 * title is required, but description is optional in frontmatter
 */
export const blog = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  schema: frontmatterSchema.extend({
    image: z.string(),
    date: z.string().date(),
    published: z.boolean().default(true),
    premium: z.boolean().optional(),
    categories: z.array(z.string()),
    author: z.string(),
  }),
});
