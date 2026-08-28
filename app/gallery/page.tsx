import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/app/components/site-header';

export const metadata: Metadata = { title: 'Gallery', description: 'The future visual archive for WikiTefsir.', openGraph: { images: [] }, twitter: { images: [] } };

export default function GalleryPage() {
  return <main><SiteHeader /><div className="reader-index-page gallery-page">
    <nav className="breadcrumbs"><Link href="/">Home</Link><span>›</span>Gallery</nav>
    <header className="reader-page-header"><span className="reader-overline">Visual archive</span><h1>Gallery</h1><p>This space is reserved for source-cleared maps, manuscripts, places, objects, and explanatory visuals. It is intentionally empty while the visual policy and licensing workflow are prepared.</p></header>
    <section className="gallery-empty" aria-label="Empty gallery"><span aria-hidden="true">□</span><h2>No items yet</h2><p>Future additions will preserve the project’s source-first method and will not depict prophets.</p></section>
  </div></main>;
}
