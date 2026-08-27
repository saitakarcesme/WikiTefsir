# WikiTefsir Veri Modeli

WikiTefsir bir belge arşivinden çok, sürümlü bir bilgi grafiği olarak modellenir.

## Temel varlıklar

| Varlık | Kimlik örneği | Temel alanlar |
|---|---|---|
| `surah` | `quran:1` | sıra, adlar, nüzul görüşleri |
| `verse` | `quran:1:5` | Arapça metin, sure, ayet no., metin sürümü |
| `collection` | `hadith:bukhari` | eser, müellif, neşir ve numaralandırma sistemi |
| `hadith` | `hadith:bukhari:<edition>:<number>` | metin, isnad, kitap, bab ve değerlendirmeler |
| `tafsir_excerpt` | `tafsir:tabari:<edition>:<location>` | asıl metin, ayet bağı ve kesin konum |
| `person` | `person:tabari` | ad varyantları, dönem, roller ve eserler |
| `concept` | `concept:ibadah` | tercih edilen ad, eş anlamlılar ve tanım |
| `source_edition` | `edition:<isbn-or-local-id>` | yayıncı, tahkik, tarih, ciltler ve hak durumu |

## Bağlantı modeli

Her bağlantı ayrı bir `relation` kaydıdır:

```text
relation
├── subject_id
├── predicate
├── object_id
├── evidence_source_id
├── evidence_location
├── editorial_status
├── confidence_note
└── revision_id
```

İzin verilen temel ilişki türleri:

- `verse EXPLAINED_BY tafsir_excerpt`
- `hadith RELATED_TO verse`
- `person NARRATED hadith`
- `person AUTHORED work`
- `verse MENTIONS concept`
- `verse REVEALED_AROUND event`
- `claim SUPPORTED_BY source_edition`

## Metin ve tercüme ayrımı

Asıl metin değişmez bir `text_witness` kaydıdır. Her meal veya tercüme ayrı `translation` kaydı olarak mütercim, dil, baskı ve lisansla bağlanır. Editör özeti hiçbir zaman tercüme alanında tutulmaz.

## Sürüm ve inceleme

Her düzenleme yeni `revision` üretir. Yayındaki sürüm yalnız `yayıma-hazır` durumundaki revizyona işaret eder. Düzeltme geçmişi silinmez; geri çekilen içerik kamu görünümünden kaldırılır fakat denetim kaydı korunur.

## Arama indeksi

Arama, kaynak metinden türetilen fakat kaynağın yerine geçmeyen ayrı bir indekstir. Türkçe ve Arapça ad varyantları, harekesiz Arapça biçimler, eser adları, hadis numaraları ve kavram eş anlamlıları indekslenir.
