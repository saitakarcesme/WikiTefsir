import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/site-header';
import { getAllConcepts, getConceptHref } from '@/lib/concepts';

export const metadata: Metadata = {
  title: 'Kavramlar',
  description: 'WikiTefsir’de ayet ve kaynak kayıtlarıyla ilişkilendirilen İslâmî kavramlar dizini.',
  openGraph: { images: [] },
  twitter: { images: [] },
};

export default function ConceptsPage() {
  const concepts = getAllConcepts();

  return (
    <main>
      <SiteHeader />
      <div className="encyclopedia-index-page">
        <nav className="breadcrumbs" aria-label="İçerik yolu"><Link href="/">Ana sayfa</Link><span>›</span>Kavramlar</nav>
        <header className="index-article-header">
          <h1>Kavramlar</h1>
          <p>WikiTefsir’de Kur’an ayetleri ve doğrulanmış kaynak kayıtlarıyla ilişkilendirilen kavram maddeleri.</p>
        </header>
        <nav className="page-tabs compact" aria-label="Kavram dizini araçları"><span className="active">Madde dizini</span><Link href="/sureler">Sureler</Link><Link href="/hadis">Hadisler</Link></nav>
        <section className="concept-index" aria-labelledby="concept-index-title">
          <h2 id="concept-index-title">Kavram maddeleri</h2>
          <div>
            {concepts.map((concept) => (
              <article key={concept.slug}>
                <h3><Link href={getConceptHref(concept)}>{concept.title}</Link></h3>
                <p className="concept-arabic" lang="ar" dir="rtl">{concept.arabic}</p>
                <p>{concept.scope}</p>
                <small>{concept.verseRefs.length} seçilmiş ayet kaydı</small>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
