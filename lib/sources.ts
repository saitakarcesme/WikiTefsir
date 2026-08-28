import quranPdfPagesJson from '@/data/quran/pdf-pages.json';

interface QuranPdfPageCatalog {
  source: string;
  sourceVersion: string;
  records: number[];
}

const quranPdfPages = quranPdfPagesJson as QuranPdfPageCatalog;

export function getQuranPdfSource(offset: number) {
  const page = quranPdfPages.records[offset];
  if (!page) return undefined;
  return { pdfUrl: quranPdfPages.source, page, version: quranPdfPages.sourceVersion };
}
