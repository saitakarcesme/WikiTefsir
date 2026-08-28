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
- [x] Vercel prod dağıtımı ve doğrulama

## Tam külliyat ilerlemesi

- [x] Lisanslı Tanzil Uthmani 1.1 Kur’an metnini kaynak dosyasıyla içe aktar
- [x] 114 sure ve 6.236 ayeti SHA-256 ve satır-kayıt eşitliğiyle doğrula
- [x] Bütün sureleri kalıcı URL ve Wikipedia tipi madde görünümünde yayımla
- [x] Sure adı, Arapça metin ve `sure:ayet` referansında külliyat araması
- [x] QuranEnc Rowwad English 1.0.19 içinden 6.236 İngilizce tercümeyi kaynakla birebir doğrula
- [x] HadeethEnc English 1.25.0 içinden derecesi “Authentic” başlayan 2.120 kaydı doğrula ve yayımla
- [ ] Kütüb-i Sitte için neşir/lisans sicilini kesinleştir
- [ ] Kütüb-i Sitte metinlerini kitap, bab, isnad ve numaralarıyla içe aktar
- [x] Taberî, İbn Kesîr ve Kurtubî Arapça tefsir kaynaklarını sabit sürüm ve SHA-256 ile doğrula
- [x] Üç klasik tefsirin toplam 18.708 ayet satırını bütün sure maddelerinden erişilebilir kıl
- [ ] Ayet-hadis-tefsir bağlarını editör onayıyla yayımla
- [ ] Sahabe, râvi, âlim, kavram, mekân ve olay maddelerini gerçek veriye bağla

## Mikro commit protokolü

- Her anlamlı ve küçük değişiklik ayrı commit edilir.
- İki dakikalık otomatik güvenlik ağı kullanıcının isteğiyle şimdilik durdurulmuştur.
- Otomatik commit başarısız olduğunda çalışma durmaz; hata `.git/micro-commit.log` içinde tutulur.
- Push otomatik yapılmaz. Public repo ve deploy yalnızca doğrulanmış commitlerden gerçekleştirilir.

## Wikipedia tipi madde deneyimi

- [x] Ortak üst menü, ansiklopedi tipografisi ve üç sütunlu madde düzeni
- [x] Ana sayfayı kaynak durumu ve külliyatlara açılan Wikipedia tipi portala dönüştürme
- [x] Kaynaklı sekiz kavram maddesi ve kavram dizini
- [x] Ayet, hadis, âlim ve bilgi grafiği kayıtlarından gerçek madde bağlantıları
- [x] Birleşik aramada kavram sonuçları
- [x] Masaüstü ve 390 px mobil görünümde hizalama ve yatay taşma denetimi

## English edition

- [x] Tüm kullanıcı arayüzü, metadata, arama ve hata metinleri İngilizce
- [x] Kaynaklı İngilizce Kur’an tercümesi ve sahih hadis külliyatı
- [x] İngilizce canonical sure, hadis, kavram ve âlim rotaları
- [x] Al-Tabari, Ibn Kathir ve al-Qurtubi için görünür âlim dizini
- [x] İngilizce sosyal paylaşım kartı

## Modern reader and connected stories

- [x] Wikipedia kabuğunu siyah-beyaz-mavi minimal okuma sistemine dönüştür
- [x] Logo işaretini kaldır ve metin tabanlı başlık kullan
- [x] 6.236 ayeti resmî QuranEnc PDF sayfasına doğrulanmış biçimde bağla
- [x] Kaynak tıklamasında sağ panel ve doğrudan PDF görünümü
- [x] HadeethEnc PDF eşleşmelerini yalnızca kesin başlık hizalamasında yayımla
- [x] Musa ve Muhammed için Kur’an’la sınırlı kişi maddeleri
- [x] Musa kıssasını sureler arası, Kur’an referanslı kronolojik okuma yoluna dönüştür
- [x] Sürüklenebilir Obsidian tipi bağlantı grafiği ve klavye erişimli bağlantı listesi
- [x] Kavram maddelerini kaynak paneli, kısa özet ve kişi bağlantılarıyla genişlet
- [x] Görsel kaynak ve peygamber tasviri kullanmama politikasını belgele

## Alfa tamamlanma ölçütü

Proje; üretim derlemesi başarılı, temel sayfalar kullanılabilir, kaynak/örnek veri ayrımı görünür, public repo erişilebilir ve Vercel URL'si gerçek tarayıcı isteğiyle doğrulanmış olduğunda ilk sürüm tamamlanmış sayılır.

## Nihai tamamlanma ölçütü

Kur’an, seçilen İngilizce tercüme, Kütüb-i Sitte ve kabul edilen klasik tefsir neşirleri lisans ve sürüm sicilleriyle eksiksiz içe aktarılmış; kayıt sayıları kaynak nüshalarla karşılaştırılmış; ayet-hadis-tefsir ilişkileri ilmî editör onayından geçmiş ve üretim ortamında aranabilir olduğunda ana hedef tamamlanmış sayılır.
