# WikiTefsir Çalışma Bulguları

## 2026-08-27 — Alfa sürümü

- Ana sayfa, canlı arama, Fâtiha sure sayfası, hadis kütüphanesi, müfessir profilleri ve ilişki diyagramı tamamlandı.
- Kaynak kabul politikası ve bilgi grafiği veri modeli belgelendi.
- Public depo: https://github.com/saitakarcesme/WikiTefsir
- Production: https://wikitafsir.vercel.app
- Next.js üretim derlemesi, ESLint ve production bağımlılık güvenlik taraması başarılı.
- Ana rota, Fâtiha, hadis, üç müfessir profili ve sosyal paylaşım görseli production üzerinde HTTP 200 ile doğrulandı.
- İki dakikalık yerel mikro commit scripti yazıldı ve Codex zamanlamasıyla etkinleştirildi; push otomatik değildir.

## Açık kapsam

- Alfa arayüzündeki hadis, meal ve tefsir içeriklerinin bir bölümü açıkça örnek/ilmî kontrolde olarak işaretlidir.
- Kütüb-i Sitte hadis metinlerinin tamamı ve klasik tefsir külliyatı henüz içe aktarılmadı.
- Toplu veri aktarımından önce her neşir ve tercüme için lisans/kullanım hakkı ile kesin baskı künyesi belirlenmelidir.
- Editör onay iş akışı, kalıcı veri tabanı ve gerçek kaynak revizyon sistemi sonraki ana aşamadır.

## 2026-08-27 — Eksiksiz Kur’an külliyatı

- Tanzil Uthmani 1.1 metni, CC BY 3.0 şartlarına uygun biçimde ve değiştirilmeden depoya alındı.
- 114 sure, 6.236 ayet, kaynak metni ve metadata dosyaları SHA-256 özetleriyle doğrulandı.
- Taşınabilir ayet kataloğundaki her metin, kaynak dosyasındaki Unicode dizesiyle birebir karşılaştırılıyor.
- Bütün sureler kalıcı URL, bilgi kutusu, ayet çapaları ve komşu sure navigasyonuyla yayıma hazırlandı.
- Ana arama; sure adı, Arapça ayet metni ve `2:255` biçimindeki doğrudan referanslarda tam külliyatı tarıyor.
- Türkçe meal, kullanım lisansı ve baskı künyesi doğrulanana kadar Kur’an maddelerine eklenmedi.
- Yerel doğrulamada ESLint, TypeScript, veri bütünlüğü, 123 sayfalık production build ve temsili HTTP rotaları başarılıdır.
- Production dağıtımında ana sayfa, sure dizini, temsili sureler, hadis ve âlim sayfaları HTTP 200; `2:255` API araması ve Tanzil kaynak atfı içerik düzeyinde doğrulandı.

## 2026-08-28 — Eksiksiz Türkçe meal

- QuranEnc Rowwad Tercüme Merkezi Türkçe tercümesinin 1.0.4 sürümü kabul edildi.
- QuranEnc yeniden yayımlama şartları; içeriği değiştirmeme, kaynak/yayıncı/sürüm belirtme ve güncellemeleri takip etme koşullarıyla kaynak siciline kaydedildi.
- Kaynak SQLite veritabanındaki 6.236 meal ve dipnot kaydı taşınabilir kataloğa aktarıldı.
- Her meal ve dipnot dizesi, kaynak SQLite alanıyla birebir karşılaştıran ayrı doğrulayıcıdan geçiyor.
- Bütün sure maddeleri Arapça ayetle birlikte Türkçe meal, varsa meal dipnotu ve sürüm künyesini gösteriyor.
- Tam külliyat araması Türkçe meal ve dipnot metinlerini de kapsıyor; `yalnız sana ibadet` sorgusu yerel API ve tarayıcıda Fâtiha 1:5 kaydına bağlandı.
- Masaüstü ve 390 px mobil tarayıcı kontrollerinde kaynak atfı, meal, dipnot, hata katmanı ve yatay taşma doğrulandı.
- Production ortamında Türkçe meal araması, Fâtiha meal metni, Bakara meal dipnotu, kaynak atfı ve temsili rotalar içerik/HTTP düzeyinde doğrulandı; Vercel hata taramasında hata kaydı bulunmadı.

## 2026-08-28 — Doğrulanmış sahih hadis başlangıç külliyatı

- HadeethEnc 1.67.0 sürümünün resmî Türkçe API kayıtları ve yeniden yayımlama şartları kaynak siciline alındı.
- Yedi kök kategorideki 2.150 benzersiz kayıt incelendi; derece alanında açıkça “sahih” geçen 1.993 kayıt yayıma alındı, diğer 157 kayıt kapsam dışında bırakıldı.
- Arapça metin, Türkçe tercüme, tahric/nispet, derece, açıklama, faydalar ve 433 konu başlığı değiştirilmeden taşınabilir kataloğa aktarıldı.
- Katalog SHA-256 özeti, kayıt tekilliği, zorunlu alanlar, kategori bağlantıları ve sahih yayın filtresi bağımsız doğrulayıcıyla denetleniyor.
- Aranabilir hadis dizini, kalıcı hadis detay rotaları ve Arapça/Türkçe birleşik külliyat araması uygulamaya bağlandı.
- Production ortamında hadis dizini, #1751 detay maddesi, Arapça metin, kaynak künyesi ve `h:1751` API araması doğrulandı; Vercel hata günlüklerinde hata kaydı bulunmadı.
- Bu veri seti Kütüb-i Sitte’nin tamamı değildir; altı eserin neşir, isnad, kitap/bab ve numaralandırma kaynağı hâlâ doğrulama aşamasındadır.

## 2026-08-28 — Üç klasik Arapça tefsir

- Quran Lab `quranlab/quran-tafsir` release 1.40.0, `86e676b432463b100254d63309bf62b0c6578b53` revizyonunda sabitlendi.
- İbn Kesîr, Taberî ve Kurtubî tefsirlerinin her biri 6.236 ayet satırı taşır; Kurtubî kaynağındaki iki yorum sunulmayan ayet açık boş kayıt olarak korunur.
- Üç Parquet kaynağının dosya boyutu ve LFS SHA-256 özetleri çevrimiçi HEAD denetimiyle doğrulandı; toplam satır kapsamı 18.708’dir.
- Her sure maddesindeki her ayet, üç tefsirin Arapça kaynak metnini isteğe bağlı olarak açabilir. Kaynak satırının `verse_key` ve `tafsir_id` alanları API’de kapalı-hata denetlenir.
- Uygulama çalışma anında upstream revizyonu manifestteki SHA ile eşleşmezse tefsir metni yayımlamaz; böylece sessiz kaynak değişimi engellenir.
- Tefsir içindeki nakiller otomatik olarak sahih hadis kabul edilmez; arayüz bunları müfessirin eserinden alıntı olarak açıkça ayırır.
- Üretim ortamında Fâtiha 1:1 tefsir API'si, üç müfessir profili ve sabit kaynak sürümü içerik düzeyinde doğrulandı.

## 2026-08-28 — Wikipedia tipi arayüz ve bağlantılı kavram maddeleri

- Açılış sayfasındaki ortalanmış ürün/landing düzeni kaldırılarak Wikipedia benzeri sol gezinme, madde sekmeleri, külliyat panelleri ve kaynak durumu tablosu kuruldu.
- Sure, hadis, âlim ve kavram sayfaları aynı tipografi, çizgi, renk, içerik sütunu ve bilgi kutusu sisteminde birleştirildi; eski yuvarlak kart ve gölge farklılıkları giderildi.
- Tevhid, ibadet, dua, hidayet, rahmet, ahiret, vahiy ve nübüvvet için tarafsız kapsam notu, kaynaklı ayetler ve ilişkili madde bağlantıları bulunan kalıcı sayfalar eklendi.
- Ayetlerin kavram etiketleri, hadis konu başlıkları, birleşik arama ve bilgi grafiği gerçek madde URL'lerine bağlandı. Tıklanamayan konu etiketleri bağlantılardan ayrı görselleştirildi.
- Marka işaretindeki düşey hizalama, içerik kutularındaki merkezleme, uzun hadis başlıklarının satır kırılımı ve mobil sütun taşmaları kontrol edilip düzeltildi.
- Ana sayfa, Fâtiha, hadis dizini, hadis #1751, Taberî, kavram dizini ve Tevhid maddesi 1.440 px masaüstü ile 390 px mobil görünümde yatay taşma ve hata katmanı olmadan doğrulandı.
- Doğrulanmış sürüm GitHub `main` dalına gönderildi ve `wikitafsir.vercel.app` üzerinde yayımlandı; canlı ana sayfa, Tevhid, Fâtiha, hadis #1751, Taberî ve `tevhid` arama API'si HTTP 200 döndürdü. Son on dakikalık Vercel hata günlüğü boştu.

## 2026-08-28 — Complete English edition and scholar directory

- The user-facing interface, metadata, search labels, API errors, concept taxonomy and social preview were converted to English.
- QuranEnc Rowwad English 1.0.19 was imported from its official SQLite release; all 6,236 translations and footnotes are checked verbatim against the source database.
- HadeethEnc English 1.25.0 contains 2,328 source records. The 2,120 records whose English grade begins with “Authentic” are published; 208 other records remain excluded.
- The English hadith catalog includes 452 topic categories and preserves Arabic text, English translation, attribution, grade, explanation and benefits verbatim.
- English canonical routes now cover `/surahs`, `/surah/*`, `/hadith/*`, `/concepts`, `/concept/*`, `/scholars` and `/scholars/*`; previous URLs remain available for compatibility.
- A visible scholar directory now links al-Tabari, Ibn Kathir and al-Qurtubi to the 18,708 pinned Arabic tafsir records already present in WikiTefsir.
- Data integrity, ESLint, TypeScript, dependency audit, 262-route Next.js production build and the Sites-compatible build completed successfully.
- The English release was deployed to `https://wikitafsir.vercel.app` and to the owner-only Sites URL `https://wikitafsir.ibrahimsait.chatgpt.site`. The main page, surah index, Al-Fatihah, hadith index, hadith #1751, Tawhid, scholar index, Ibn Kathir and English search API all passed live HTTP/content checks; recent Vercel error logs were empty.

## 2026-08-28 — Minimal reader, exact-source drawer and Quranic narratives

- The Wikipedia-style shell was replaced by a restrained black, white and blue reading system with narrower article measure, larger body text, fewer boxes and a shorter-path home page.
- The decorative logo mark was removed. The text name remains as the minimal home link.
- Every one of the 6,236 English Quran records was aligned to a physical page in QuranEnc's official Rowwad mushaf PDF. A right-side source drawer opens the verified page without leaving the article.
- The older eight-part HadeethEnc English PDF set was compared with the current 1.25.0 dataset. Exact full-title alignment is exposed for 537 records; the remaining records link to the verified digital record rather than guessing a PDF page.
- Quran-first person articles were added for Moses and Muhammad. The Moses article joins eight narrative stages across multiple surahs; it explicitly stops short of narrating his death because the Quran does not do so.
- A canvas-based, draggable knowledge graph connects people, concepts, surahs, scholars and hadith. A visible link list provides the same navigation without pointer interaction.
- Concept articles now include at-a-glance scope, source-panel actions and connected people.
- Visual-source research prioritizes public-domain manuscripts and maps from The Met, Library of Congress and individually licensed Wikimedia Commons files. Prophet depictions and invented sacred scenes are excluded.
- ESLint, TypeScript, the 266-route Next.js production build and representative local route requests completed successfully.
- The validated reader release was published to Vercel production and to the owner-only Sites URL. The home page, people index, Moses article, graph, Al-Fatihah, hadith #1751 and Revelation concept returned HTTP 200 in production.

## 2026-08-28 — Complete prophet paths, expanded figures and interface precision

- All 25 prophets named in the Quran now have individual Quran-first articles and event-ordered reading paths. Brief Quranic mentions such as Idris, Elisha and Dhul-Kifl remain explicitly brief instead of being expanded with unsourced biography.
- The people directory now contains 33 additional Quranic people, rulers, adversaries, angels, groups and unnamed figures. Traditional names absent from the Quran—such as Eve/Hawwa, Bilqis, Asiya, Zulaykha and al-Khidr—are clearly distinguished from Quranic wording.
- The relationship diagram was rebuilt as an overflow-safe grid, while the interactive knowledge graph now uses collision-aware, text-sized nodes with multiline labels and vertically aligned link tags.
- The source drawer now has compact top and bottom chrome, a wider default reading area, and an accessible expand/restore control.
- A black-and-white dark theme was added while preserving blue links, and the header navigation, Source policy action and theme control share one vertical alignment.
- An intentionally empty Gallery route was added for future source-cleared visual material.
- ESLint, TypeScript and the 323-route Next.js production build passed. Desktop browser checks covered the people directory, dark theme, graph, Moses diagram, PDF source panel and expanded PDF view.

## 2026-08-29 — Responsive reader, fuzzy navigation and stable knowledge maps

- The header is now mathematically centered, reduces its right side to one larger theme icon, and preserves every navigation item in a horizontally scrollable mobile row.
- Combined search accepts tolerant Latin spelling and direct coordinates: `bkara 50`, `2:255`, `musaa` and `tabri` resolve to the expected verse, person or scholar.
- The concept index now contains 31 reading paths; the scholar index contains 13 Sunni exegetes and exposes al-Tabari's Jami al-Bayan in the split source viewer.
- Quran pages place the English Rowwad translation and live English Ibn Kathir commentary before the existing pinned Arabic Tabari, Ibn Kathir and Qurtubi records.
- Hadiths are filterable across 13 reader-facing life situations, and long result titles no longer extend beyond the article measure.
- Person stories render their Quran passages continuously instead of hiding them behind disclosure controls. The main and person-level graphs use fixed, responsive linked boxes without moving or colliding labels.
- The source viewer now splits the viewport, has a draggable desktop divider and a single close control; mobile uses the entire viewport.
- A source-coordinate list of 100 face-free Quran and authentic-hadith visual scenes is recorded in `GALLERY_SCENE_PROMPTS.md`; the public gallery remains intentionally empty.
- Desktop and iPhone 15 Pro Max visual checks found and fixed a hidden mobile menu, system-dark-theme white cards, low-contrast explanatory copy and concatenated index tabs.
- ESLint, TypeScript and the 389-page Next.js production build passed. Search and tafsir APIs were also checked locally, including English Ibn Kathir plus all three Arabic records for Al-Ikhlas 112:1.

## 2026-08-29 — Source-first art gallery and full reader QA

- All 100 Quran and authentic-hadith scene briefs now have original 4:5 gallery artwork. Revered figures remain rear-view, distant, obscured or represented through the environment; angels and unseen matters are not literalized.
- The Gallery uses a responsive art-wall flow with Quran/Hadith filters. Every card turns in place to show its exact Quran coordinate or HadeethEnc record and the source-bounded visual brief.
- Knowledge maps now read vertically from a hub into stable linked branches. Every Quranic person article receives the same responsive relationship map, not only the Moses article.
- The source PDF is a true right-side split: opening it reflows the article, its divider supports pointer and keyboard resizing, and the viewer keeps only one close control.
- A synchronous theme bootstrap prevents an initial system-dark flash when a saved light theme is active. Thirteen representative routes returned identical light and dark surface values with zero horizontal overflow.
- Desktop Chrome checks covered the 100-card gallery, card flip, vertical graph, Jesus relationship map and exact HadeethEnc page 380. Mobile checks at 390 × 844 covered the same 13 routes with zero page overflow.
- ESLint and the Sites production build passed in a clean dependency environment. A four-sheet visual review covered all 100 generated works.
