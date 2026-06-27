import { DocsRootProvider } from '@/components/providers/docs-root-provider';
import Container from '@/components/layout/container';
import type { PropsWithChildren } from 'react';

import '@/styles/mdx.css';

export default function LegalLayout({ children }: PropsWithChildren) {
  return (
    <DocsRootProvider>
      <Container className="py-16 px-4">
        <div className="mx-auto">{children}</div>
      </Container>
    </DocsRootProvider>
  );
}
