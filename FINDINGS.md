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
