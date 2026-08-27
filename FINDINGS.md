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
