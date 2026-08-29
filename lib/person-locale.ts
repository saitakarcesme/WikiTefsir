import type { Locale } from '@/lib/locale';
import type { PersonRecord } from '@/lib/people';

const turkishNames: Record<string, string> = {
  adam:'Âdem', idris:'İdris', nuh:'Nuh', hud:'Hûd', salih:'Sâlih', ibrahim:'İbrahim', lut:'Lût', ismail:'İsmail', ishaq:'İshak', yaqub:'Yakup', yusuf:'Yusuf', ayyub:'Eyyûb', shuayb:'Şuayb', musa:'Musa', harun:'Hârûn', 'dhul-kifl':'Zülkifl', dawud:'Dâvûd', sulayman:'Süleyman', ilyas:'İlyas', 'al-yasa':'Elyesa', yunus:'Yunus', zakariyya:'Zekeriyyâ', yahya:'Yahyâ', isa:'Îsâ', muhammad:'Muhammed', pharaoh:'Firavun', maryam:'Meryem', satan:'Şeytan', jibril:'Cebrail', mikail:'Mikâil', malik:'Mâlik', 'abu-lahab':'Ebû Leheb', 'queen-of-sheba':'Sebe Melikesi', 'mother-of-moses':'Musa’nın annesi', 'sister-of-moses':'Musa’nın kız kardeşi', 'wife-of-pharaoh':'Firavun’un eşi', 'companions-of-the-cave':'Ashâb-ı Kehf', 'learned-servant':'İlim verilen kul', 'sons-of-adam':'Âdem’in iki oğlu', 'brothers-of-joseph':'Yusuf’un kardeşleri', 'pharaohs-magicians':'Firavun’un sihirbazları', 'children-of-israel':'İsrailoğulları', 'people-of-the-elephant':'Fil ordusu', 'harut-and-marut':'Hârût ve Mârût', 'wife-of-aziz':'Aziz’in eşi', zayd:'Zeyd', 'ali-imran':'Âl-i İmrân'
};
const kinds: Record<PersonRecord['kind'], string> = { Prophet:'Peygamber', Person:'Kişi', Ruler:'Hükümdar', Adversary:'Karşıt', Angel:'Melek', Group:'Topluluk', 'Unnamed figure':'Adı verilmeyen kişi' };
export function getPersonName(person: PersonRecord, locale: Locale) { return locale === 'tr' ? (turkishNames[person.slug] ?? person.name) : person.name; }
export function getPersonKind(person: PersonRecord, locale: Locale) { return locale === 'tr' ? kinds[person.kind] : person.kind; }
export function getPersonIntro(person: PersonRecord, locale: Locale) { return locale === 'tr' ? `${getPersonName(person, locale)} hakkındaki Kur’an kayıtlarını, farklı surelerdeki ayetlere bağlı anlatı sırasıyla okuyun.` : person.introduction; }
