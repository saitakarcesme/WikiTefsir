import { getSurahByNumber } from '@/lib/quran';
import { getTafsirsForVerse, tafsirMetadata } from '@/lib/tafsir';

export async function GET(request: Request) {
  const parameters = new URL(request.url).searchParams;
  const surahNumber = Number(parameters.get('surah'));
  const ayahNumber = Number(parameters.get('ayah'));
  const surah = getSurahByNumber(surahNumber);

  if (!surah || !Number.isInteger(ayahNumber) || ayahNumber < 1 || ayahNumber > surah.ayahCount) {
    return Response.json({ error: 'Geçersiz sure veya ayet numarası.' }, { status: 400 });
  }

  try {
    const verseKey = `${surahNumber}:${ayahNumber}`;
    const records = await getTafsirsForVerse(verseKey, surah.startOffset + ayahNumber - 1);
    return Response.json(
      { verseKey, release: tafsirMetadata.release, revision: tafsirMetadata.revision, records },
      { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800' } },
    );
  } catch (error) {
    console.error('Tafsir source request failed', error);
    return Response.json({ error: 'Tefsir kaynağı şu anda doğrulanamadı.' }, { status: 502 });
  }
}
