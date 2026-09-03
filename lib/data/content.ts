import { seasonShort, server } from './site';

export const principles = [
  {
    eyebrow: '01 / KARAKTER',
    title: 'Jedan lik. Jedna priča.',
    text: 'Igraš ono što tvoj karakter zna i ono što može da uradi. Discord, stream i OOC informacije ostaju van grada.',
  },
  {
    eyebrow: '02 / POSLEDICE',
    title: 'Scene imaju težinu.',
    text: 'Kazna se odleži, dug ostaje, a smrt u poštenoj i odobrenoj sceni može da bude kraj karaktera.',
  },
  {
    eyebrow: '03 / TEMPO',
    title: 'Priča pre pobede.',
    text: 'Ne jurimo pucnjavu na svaka tri minuta. Istrage, poslovi, odnosi i kriminal mogu da se razvijaju danima.',
  },
];

export const specs = [
  {
    label: 'ŠTA SE OČEKUJE',
    text: 'Mikrofon, pročitana pravila i spremnost da scenu odigraš do kraja i kada ti ne ide u korist.',
  },
  {
    label: 'ŠTA SE NE TOLERIŠE',
    text: 'RDM, VDM, metagaming, stream sniping i prekidanje scene čim postane neprijatna. Prijave se rešavaju na osnovu snimka i konteksta.',
  },
  {
    label: 'KAKO SE SUDI',
    text: 'Pravila su javna i važe i za igrače i za staff. Odluke ostaju u evidenciji, pa ista priča ne počinje od nule svakog vikenda.',
  },
];

export const serverFacts = [
  { label: 'Platforma', value: 'FiveM · ESX Legacy' },
  { label: 'Region', value: 'Srbija / Balkan' },
  { label: 'Kapacitet', value: `${server.maxPlayers} igrača` },
  { label: 'Pristup', value: 'Otvoren' },
  { label: 'Sezona', value: seasonShort },
];

export const seasons = [
  {
    id: 'S1',
    name: 'Prvi grad',
    text: 'Počelo je kao privatna grupa od desetak ljudi i ekonomija pisana rukom. Mala zajednica, puno improvizacije i prvi standardi koji su kasnije ostali.',
    status: 'closed' as const,
  },
  {
    id: 'S2',
    name: 'Rat za dokove',
    text: 'Dve strane su se mesecima lomile oko istog terena. Ova sezona je praktično definisala pravila kriminalnog RP-a koja se koriste i danas.',
    status: 'closed' as const,
  },
  {
    id: 'S3',
    name: 'Sezona suđenja',
    text: 'Uvedeni su sud, advokati i presude koje imaju stvarnu težinu. Delovalo je komplikovano dok nije postalo jedan od glavnih identiteta servera.',
    status: 'closed' as const,
  },
  {
    id: 'S4',
    name: 'New Beginning',
    text: 'Nova mapa, čistija ekonomija i otvoren ulaz. Trenutna sezona se još piše, pa arhiva ovde namerno nema poslednju rečenicu.',
    status: 'live' as const,
  },
];
