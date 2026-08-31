import type { QuranReference } from '@/lib/people';

export type StoryArtwork = {
  id: number;
  title: string;
  source: string;
  brief: string;
  kind: 'Quran';
  image: string;
  sourceReference: QuranReference;
};

const generatedStoryArt: Record<string, string> = {
  'adam:creation': '/stories/adam/creation.webp',
  'adam:garden': '/stories/adam/garden.webp',
  'adam:temptation': '/stories/adam/temptation.webp',
  'adam:repentance': '/stories/adam/repentance.webp',
  'nuh:call': '/stories/nuh/call.webp',
  'nuh:ark': '/stories/nuh/ark.webp',
  'nuh:flood': '/stories/nuh/flood.webp',
  'nuh:landing': '/stories/nuh/landing.webp',
  'ibrahim:truth': '/stories/ibrahim/truth.webp',
  'ibrahim:idols': '/stories/ibrahim/idols.webp',
  'ibrahim:migration': '/stories/ibrahim/migration.webp',
  'ibrahim:house': '/stories/ibrahim/house.webp',
  'musa:infancy': '/stories/musa/infancy.webp',
  'musa:maturity': '/stories/musa/maturity.webp',
  'musa:midian': '/stories/musa/midian.webp',
  'musa:calling': '/stories/musa/calling.webp',
  'musa:pharaoh': '/stories/musa/pharaoh.webp',
  'musa:exodus': '/stories/musa/exodus.webp',
  'musa:sinai': '/stories/musa/sinai.webp',
  'musa:journey': '/stories/musa/journey.webp',
  'maryam:dedication': '/stories/maryam/dedication.webp',
  'maryam:chosen': '/stories/maryam/chosen.webp',
  'maryam:announcement': '/stories/maryam/announcement.webp',
  'maryam:birth': '/stories/maryam/birth.webp',
  'maryam:return': '/stories/maryam/return.webp',
  'yusuf:dream': '/stories/yusuf/dream.webp',
  'yusuf:well': '/stories/yusuf/well.webp',
  'yusuf:trial': '/stories/yusuf/trial.webp',
  'yusuf:vindication': '/stories/yusuf/vindication.webp',
  'yusuf:authority': '/stories/yusuf/authority.webp',
  'yusuf:reunion': '/stories/yusuf/reunion.webp',
  'idris:truthful': '/stories/idris/truthful.webp',
  'hud:call': '/stories/hud/call.webp',
  'salih:call': '/stories/salih/call.webp',
  'lut:warning': '/stories/lut/warning.webp',
  'ismail:house': '/stories/ismail/house.webp',
  'ishaq:announcement': '/stories/ishaq/announcement.webp',
  'yaqub:dream': '/stories/yaqub/dream.webp',
  'ayyub:affliction': '/stories/ayyub/affliction.webp',
  'shuayb:call': '/stories/shuayb/call.webp',
  'harun:support': '/stories/harun/support.webp',
  'dhul-kifl:patient': '/stories/dhul-kifl/patient.webp',
  'dawud:victory': '/stories/dawud/victory.webp',
  'sulayman:inheritance': '/stories/sulayman/inheritance.webp',
  'ilyas:mission': '/stories/ilyas/mission.webp',
  'al-yasa:guided': '/stories/al-yasa/guided.webp',
  'yunus:departure': '/stories/yunus/departure.webp',
  'zakariya:mary': '/stories/zakariya/mary.webp',
  'yahya:announcement': '/stories/yahya/announcement.webp',
  'isa:announcement': '/stories/isa/announcement.webp',
  'muhammad:care': '/stories/muhammad/care.webp',
  'imran:family': '/stories/imran/family.webp',
  'wife-of-imran:vow': '/stories/wife-of-imran/vow.webp',
  'adams-spouse:garden': '/stories/adams-spouse/garden.webp',
  'iblis:refusal': '/stories/iblis/refusal.webp',
  'pharaoh:oppression': '/stories/pharaoh/oppression.webp',
  'qarun:wealth': '/stories/qarun/wealth.webp',
  'haman:regime': '/stories/haman/regime.webp',
  'samiri:trial': '/stories/samiri/trial.webp',
  'azar:idols': '/stories/azar/idols.webp',
  'luqman:wisdom': '/stories/luqman/wisdom.webp',
  'dhul-qarnayn:means': '/stories/dhul-qarnayn/means.webp',
  'talut:appointment': '/stories/talut/appointment.webp',
  'jalut:encounter': '/stories/jalut/encounter.webp',
  'zayd:counsel': '/stories/zayd/counsel.webp',
  'abu-lahab:condemnation': '/stories/abu-lahab/condemnation.webp',
  'queen-of-sheba:report': '/stories/queen-of-sheba/report.webp',
  'wife-of-aziz:temptation': '/stories/wife-of-aziz/temptation.webp',
  'mother-of-moses:inspiration': '/stories/mother-of-moses/inspiration.webp',
  'sister-of-moses:watching': '/stories/sister-of-moses/watching.webp',
  'wife-of-pharaoh:infant': '/stories/wife-of-pharaoh/infant.webp',
  'companions-of-the-cave:faith': '/stories/companions-of-the-cave/faith.webp',
  'learned-servant:meeting': '/stories/learned-servant/meeting.webp',
  'sons-of-adam:offerings': '/stories/sons-of-adam/offerings.webp',
  'brothers-of-joseph:jealousy': '/stories/brothers-of-joseph/jealousy.webp',
  'pharaohs-magicians:summoned': '/stories/pharaohs-magicians/summoned.webp',
  'children-of-israel:deliverance': '/stories/children-of-israel/deliverance.webp',
  'jibril:revelation': '/stories/jibril/revelation.webp',
  'harut-and-marut:trial': '/stories/harut-and-marut/trial.webp',
  'people-of-the-elephant:plot': '/stories/people-of-the-elephant/plot.webp',
};

export function getStoryArtwork(slug: string, stageId: string, references: QuranReference[], stageIndex: number): StoryArtwork | undefined {
  const generated = generatedStoryArt[`${slug}:${stageId}`];
  if (generated && references[0]) {
    return { id: -(stageIndex + 1), kind: 'Quran', image: generated, title: stageId.replaceAll('-', ' '), source: `Quran ${references[0].surah}:${references[0].ayah}`, brief: '', sourceReference: references[0] };
  }
  return undefined;
}
