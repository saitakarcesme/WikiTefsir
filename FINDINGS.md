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
- Bu veri seti Kütüb-i Sitte’nin tamamı değildir; altı eserin neşir, isnad, kitap/bab ve numaralandırma kaynağı hâlâ doğrulama aşamasındadır.
