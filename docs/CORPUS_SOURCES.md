# WikiTefsir Külliyat Kaynak Sicili

Bu sicil, WikiTefsir’e alınan veya değerlendirmeye alınan her toplu veri kaynağının sürümünü, lisansını ve kullanım kararını kaydeder.

## Kabul edildi: Kur’an Arapça metni

| Alan | Değer |
|---|---|
| Kaynak | Tanzil Project |
| Metin türü | Uthmani |
| Sürüm | 1.1, Şubat 2021 |
| Lisans | Creative Commons Attribution 3.0 |
| Resmî metin adresi | `https://tanzil.net/pub/download/index.php?quranType=uthmani&outType=txt-2&marks=true&sajdah=true&tatweel=true&agree=true` |
| Resmî metadata | `https://tanzil.net/res/text/metadata/quran-data.xml` |
| Lisans metni | `https://tanzil.net/docs/Text_License` |
| Karar | Metin değiştirilmeden, açık atıf ve kaynak bağlantısıyla kullanılabilir |

Tanzil şartları Kur’an metninin aynen dağıtılmasına izin verir; metnin değiştirilmesini yasaklar. Bu nedenle içe aktarma süreci Arapça metni dönüştürmez. Sure ve ayet numaraları ayrı yapısal alanlara ayrılır, metin alanı kaynaktaki Unicode dizesi olarak korunur. Üretilen veri dosyaları kaynak lisans bildirimini ve SHA-256 özetlerini taşır.

## Kabul edilmedi: uzun süreli Quran Foundation API önbelleği

Quran Foundation Content API, uygulama içinde gösterime izin verse de API içeriğinin bir haftadan uzun saklanmasını yazılı izin olmadan yasaklar. WikiTefsir’in public repoda kalıcı külliyat tutma hedefiyle uyuşmadığından bu API, mevcut aşamada statik kaynak olarak kullanılmaz.

## Kabul edildi: Türkçe meal

| Alan | Değer |
|---|---|
| Kaynak | QuranEnc — Kur’an-ı Kerîm Meâlleri Ansiklopedisi |
| Çeviri | Rowwad Tercüme Merkezi Türkçe tercümesi |
| Sürüm | 1.0.4 |
| Son güncelleme | 28 Eylül 2025 |
| Yayınlayan ekip | Rowwad Tercüme Merkezi; Rabwah Davet Derneği, Dillerde İslami İçerik Hizmet Derneği ve IslamHouse iş birliği |
| Metadata API | `https://quranenc.com/api/v1/translations/list/tr` |
| Kaynak veritabanı | `https://quranenc.com/downloads/sqlite/turkish_rwwad.sqlite` |
| Kullanım şartları | `https://quranenc.com/en/home/api` sayfasındaki “Terms and Policies” bölümü |
| Karar | İçerik değiştirilmeden; kaynak, yayınlayan ve sürüm açıkça belirtilerek yeniden yayımlanabilir |

QuranEnc koşulları çeviri içeriğinin indirilip yeniden yayımlanmasına izin verir. İçerikte değişiklik, ekleme veya silme yapılamaz; kaynak/yayınlayan ve sürüm belirtilmeli, belge içindeki künye korunmalı ve yeni sürümler takip edilmelidir. WikiTefsir içe aktarıcısı meal ile dipnotları kaynak SQLite alanlarındaki Unicode dizeleri olarak aynen saklar; biçimsel sunum veri alanını değiştirmez.

## İncelemede: Kütüb-i Sitte

Altı hadis külliyatı için Arapça metin, isnad, kitap/bab ayrımı, numaralandırma sistemi ve yeniden dağıtım hakkı aynı kaynaktan doğrulanmalıdır. Kaynak seçimi kesinleşmeden üçüncü taraf sitelerden scraping yapılmaz ve hadis metni depoya eklenmez.

## Kabul edildi: doğrulanmış hadis başlangıç külliyatı

| Alan | Değer |
|---|---|
| Kaynak | HadeethEnc — Tercüme Edilmiş Nebevî Hadisler Ansiklopedisi |
| Dil | Arapça asıl alanlar ve Türkçe tercüme/açıklama |
| Sürüm | 1.67.0 |
| Resmî API | `https://hadeethenc.com/api/v1/` |
| Sürüm dosyası | `https://hadeethenc.com/browse/download/tr` |
| Kullanım şartları | `https://hadeethenc.com/en/home` sayfasındaki “Terms and Policies” bölümü |
| Karar | İçerik değiştirilmeden; kaynak, yayınlayan ve sürüm belirtilerek yeniden yayımlanabilir |

HadeethEnc kayıtları Arapça hadis metni, Türkçe tercüme, tahric/nispet, derece, açıklama ve konu başlıklarını birlikte sunar. 1.67.0 sürümündeki 2.150 benzersiz Türkçe kayıt taranmış; projenin “yalnız sahih hadis” ilkesi gereği derece alanında büyük/küçük harf ayrımı olmadan açıkça “sahih” geçen 1.993 kayıt yayıma alınmıştır. Yalnız hasen, zayıf veya açık hüküm bulunmayan 157 kayıt yayımlanmamıştır. Yeniden yayımlama şartları içeriğin değiştirilmemesini, HadeethEnc kaynağı ile sürümün açıkça belirtilmesini ve güncel sürümün takip edilmesini gerektirir. Bu külliyat Kütüb-i Sitte’nin eksiksiz neşri değildir; güvenilir hadis maddeleri için ilk doğrulanmış katmandır ve Kütüb-i Sitte kaynak kapısının yerine geçmez.

## Kabul edildi: üç klasik Arapça tefsir

| Alan | Değer |
|---|---|
| Veri yayımcısı | Quran Lab — `quranlab/quran-tafsir` |
| Sabit kaynak revizyonu | `86e676b432463b100254d63309bf62b0c6578b53` (release 1.40.0) |
| Dijital metin kaynağı | `spa5k/tafsir_api@5bbe0895543219f9ec3fe4ee808acce701a7bb4a`, QUL/quran.com üzerinden |
| Eserler | İbn Kesîr, Taberî ve Kurtubî tefsirlerinin Arapça metinleri |
| Kapsam | Her config için 6.236 sıralı ayet kaydı |
| Kullanım şartı | Alttaki klasik eserler kamu malı; dijital paketleme MIT; metinler verbatim |
| Yayın biçimi | Ayet anahtarına göre kaynak satırı; olmayan yorumlar açıkça boş |

Üç config sırasıyla `tafsir-ibnkathir-ar`, `tafsir-tabari-ar` ve `tafsir-qurtubi-ar` adlarını taşır. İbn Kesîr ve Taberî için 6.236 yorum satırı, Kurtubî için iki açık `source-unavailable` satır dışında 6.234 yorum satırı beklenir. Parquet dosyalarının kaynak LFS SHA-256 değerleri manifestte sabitlenmiştir. Metinler yaklaşık 209 MB açıldığı için uygulama paketine kopyalanmaz; ayet sıra numarasıyla Dataset Viewer üzerinden okunur ve dönen `verse_key` kapalı-hata biçiminde doğrulanır.

Bu eserlerin Ehl-i Sünnet kapsamına alınması, içlerinde aktarılan her rivayetin sahih olduğu anlamına gelmez. Özellikle Taberî rivayet ve isrâiliyyât malzemesi aktarabilir. Tefsir metni “müfessirin eserinden alıntı” olarak gösterilir; içindeki rivayetler ayrıca sahih hadis etiketi almaz ve bağımsız hadis kaydı sayılmaz.

## Kabul kapısı

Yeni bir külliyat ancak şu kanıtlarla `kabul edildi` durumuna geçebilir:

1. Resmî veya güvenilir kaynak URL’si
2. Sabit sürüm veya yayın tarihi
3. Açık lisans ya da yazılı kullanım izni
4. Dosya özeti ve satır/kayıt sayısı
5. Metin bütünlüğü doğrulaması
6. Editör inceleme durumu
