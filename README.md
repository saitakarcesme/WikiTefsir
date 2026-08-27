# WikiTefsir

WikiTefsir, Kur’an ayetlerini Kütüb-i Sitte hadisleri ve Ehl-i Sünnet çizgisindeki klasik tefsirlerle kaynak künyeleri üzerinden ilişkilendirmeyi amaçlayan açık bilgi ağıdır.

## Mevcut durum

Bu depo projenin çalışan alfa sürümüdür. Arayüz ve veri ilişkileri Fâtiha Suresi üzerinden gösterilir. “Örnek”, “ilmî kontrolde” veya “veri bekliyor” olarak işaretlenen içerikler nihai dinî kaynak kaydı değildir.

## Temel ilkeler

- Kaynaksız dinî hüküm yayımlanmaz.
- Arapça asıl metin, tercüme, özet ve editör notu ayrı alanlarda tutulur.
- Her alıntı baskı, cilt/sayfa veya kitap/bab/hadis numarasıyla izlenebilir olur.
- Telif veya kullanım izni belirsiz metinler veri tabanına alınmaz.
- Kullanıcı katkıları ilmî editör onayından geçmeden yayımlanmaz.

Kalıcı kapsam ve yol haritası için [WIKITEFSIR_PLAN.md](./WIKITEFSIR_PLAN.md) dosyasına bakın.

## Yerel geliştirme

```bash
npm install
npm run dev
```

Üretim kontrolü:

```bash
npm run build
npm run lint
```

## Mikro commit güvenlik ağı

`scripts/install-micro-commit-agent.sh`, çalışma dizisindeki secrets içermeyen değişiklikleri iki dakikada bir yerel commit olarak kaydeder. Otomasyon hiçbir zaman push yapmaz.

## Lisans ve veri

Uygulama kodu için lisans ayrıca belirlenecektir. Kur’an, meal, hadis ve tefsir metinlerinin her biri kendi kaynak/lisans kaydıyla yönetilmelidir; bu depodaki alfa içerik toplu bir metin veri seti olarak yeniden kullanım izni vermez.
