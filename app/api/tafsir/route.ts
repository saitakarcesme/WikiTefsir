import { getSurahByNumber } from '@/lib/quran';
import { getEnglishIbnKathirForVerse, getTafsirsForVerse, tafsirMetadata } from '@/lib/tafsir';

export async function GET(request: Request) {
  const parameters = new URL(request.url).searchParams;
  const surahNumber = Number(parameters.get('surah'));
  const ayahNumber = Number(parameters.get('ayah'));
  const surah = getSurahByNumber(surahNumber);

  if (!surah || !Number.isInteger(ayahNumber) || ayahNumber < 1 || ayahNumber > surah.ayahCount) {
    return Response.json({ error: 'Invalid surah or verse number.' }, { status: 400 });
  }

  try {
    const verseKey = `${surahNumber}:${ayahNumber}`;
    const [arabicResult, englishResult] = await Promise.allSettled([
      getTafsirsForVerse(verseKey, surah.startOffset + ayahNumber - 1),
      getEnglishIbnKathirForVerse(verseKey),
    ]);
    if (arabicResult.status === 'rejected' && englishResult.status === 'rejected') throw new Error('All tafsir sources failed');
    return Response.json(
      {
        verseKey,
        release: tafsirMetadata.release,
        revision: tafsirMetadata.revision,
        records: arabicResult.status === 'fulfilled' ? arabicResult.value : [],
        englishTafsir: englishResult.status === 'fulfilled' ? englishResult.value : null,
      },
      { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800' } },
    );
  } catch (error) {
    console.error('Tafsir source request failed', error);
    return Response.json({ error: 'The tafsir source could not be verified.' }, { status: 502 });
  }
}
