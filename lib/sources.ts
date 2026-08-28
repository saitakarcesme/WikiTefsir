import quranPdfPagesJson from '@/data/quran/pdf-pages.json';
import hadithPdfPagesJson from '@/data/hadith/pdf-pages.json';

interface QuranPdfPageCatalog {
  source: string;
  sourceVersion: string;
  records: number[];
}

const quranPdfPages = quranPdfPagesJson as QuranPdfPageCatalog;
const hadithPdfPages = hadithPdfPagesJson as {
  source: string;
  sourceVersion: string;
  records: Record<string, { part: number; page: number }>;
};

export function getQuranPdfSource(offset: number) {
  const page = quranPdfPages.records[offset];
  if (!page) return undefined;
  return { pdfUrl: quranPdfPages.source, page, version: quranPdfPages.sourceVersion };
}

export function getHadithPdfSource(id: string) {
  const location = hadithPdfPages.records[id];
  if (!location) return undefined;
  return {
    pdfUrl: hadithPdfPages.source.replace('{part}', String(location.part)),
    page: location.page,
    part: location.part,
    version: hadithPdfPages.sourceVersion,
  };
}
