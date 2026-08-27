# WikiTefsir — Kalıcı Proje Planı

Bu belge, konuşma bağlamı değişse bile projenin hedefini ve çalışma ilkelerini korur.

## Ana hedef

WikiTefsir; Kur'an ayetlerini, Kütüb-i Sitte hadislerini ve Ehl-i Sünnet çizgisindeki güvenilir klasik tefsirleri kaynak künyeleriyle birbirine bağlayan, Wikipedia benzeri açık bir bilgi ağıdır.

## Değişmez ilkeler

- Dinî içerik model tarafından kaynak gösterilmeden üretilmez.
- Arapça asıl metin, tercüme, özet ve editör açıklaması birbirinden açıkça ayrılır.
- Her alıntı eser, müellif, kitap/bab, cilt/sayfa veya hadis numarasıyla izlenebilir olur.
- Sahihlik derecesi kaynakta geçtiği biçimiyle gösterilir; ihtilaflar tek hükme indirgenmez.
- Yalnızca lisansı veya kullanım izni uygun metinler yayımlanır.
- Kullanıcı katkıları doğrudan yayına girmez; ilmî editör incelemesi gerekir.
- Gizli anahtarlar, `.env` dosyaları ve kişisel veriler asla git geçmişine eklenmez.

## Ürün yüzeyleri

1. Ana sayfa ve birleşik arama
2. Sure ve ayet sayfaları
3. Hadis, eser ve bab sayfaları
4. Müfessir, muhaddis, râvi ve sahabe sayfaları
5. Kavram, olay, mekân ve zaman çizelgesi sayfaları
6. Ayet-hadis-tefsir-râvi ilişki diyagramları
7. Kaynak yönetimi, sürümleme ve editör inceleme sistemi

## İlk teslim kapsamı

- WikiTefsir marka ve ana sayfa deneyimi
- Fâtiha Suresi için temsili, açıkça işaretlenmiş örnek veri
- Ayet, hadis, tefsir ve şahıs bağlantılarını gösteren etkileşimli kartlar
- Arama, filtreleme, mobil uyumluluk ve erişilebilirlik
- Veri şeması ve kaynak kabul politikasının dokümantasyonu

## Veri modeli

- `Surah` → `Verse`
- `Verse` ↔ `Hadith`
- `Verse` ↔ `TafsirExcerpt`
- `Hadith` → `Collection` / `Book` / `Chapter` / `NarratorChain`
- `Scholar` / `Companion` / `Narrator` ↔ eserler ve rivayetler
- Her bağ: ilişki türü, kaynak, doğrulama durumu ve editör notu taşır.

## Uygulama sırası

- [x] Proje iskeleti
- [x] Marka, ana navigasyon ve ana sayfa
- [x] Temsili Fâtiha ayet deneyimi
- [x] Arama ve filtreleme
- [x] İlişki diyagramı
- [x] Veri şeması ve kaynak politikası
- [x] Test, erişilebilirlik ve üretim derlemesi kontrolü
- [x] Public GitHub deposu
- [ ] Vercel prod dağıtımı ve doğrulama

## Mikro commit protokolü

- Her anlamlı ve küçük değişiklik ayrı commit edilir.
- Otomatik güvenlik ağı iki dakikada bir çalışır; yalnızca izin verilen proje dosyalarını, gizli bilgi taramasından sonra commit eder.
- Otomatik commit başarısız olduğunda çalışma durmaz; hata `.git/micro-commit.log` içinde tutulur.
- Push otomatik yapılmaz. Public repo ve deploy yalnızca doğrulanmış commitlerden gerçekleştirilir.

## Tamamlanma ölçütü

Proje; üretim derlemesi başarılı, temel sayfalar kullanılabilir, kaynak/örnek veri ayrımı görünür, public repo erişilebilir ve Vercel URL'si gerçek tarayıcı isteğiyle doğrulanmış olduğunda ilk sürüm tamamlanmış sayılır.
