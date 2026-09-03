export interface Faction {
  file: string;
  name: string;
  text: string;
  stamp: string;
  tone?: 'danger' | 'default';
  image: string;
  alt: string;
}

export const factions: Faction[] = [
  {
    file: 'F-01',
    name: 'Policija',
    text: 'Istraga pre sirene. Nalog za pretres, dokazi i sud nisu dekoracija nego deo igre. Ako tražiš samo potere, ovo nije najkraći put do njih.',
    stamp: 'DRŽAVNA SLUŽBA',
    image: '/images/frakcija-policija.jpg',
    alt: 'Policijska patrola',
  },
  {
    file: 'F-02',
    name: 'EMS',
    text: 'Povreda ne nestaje kada se završi animacija. Medicinari vode oporavak, dokumentuju stanje i često znaju više o gradu nego što bi trebalo.',
    stamp: 'DRŽAVNA SLUŽBA',
    image: '/images/frakcija-ems.jpg',
    alt: 'Ekipa hitne pomoći',
  },
  {
    file: 'F-03',
    name: 'Kriminal',
    text: 'Ime se gradi kroz veze, posao i rizik. Organizacija nije Discord rola, a teritorija ne pripada nikome samo zato što je tako napisao u ticketu.',
    stamp: 'POD NADZOROM',
    tone: 'danger',
    image: '/images/frakcija-kriminal.jpg',
    alt: 'Noćni sastanak kriminalne organizacije',
  },
  {
    file: 'F-04',
    name: 'Mehaničari',
    text: 'Radionice su legalan posao i prirodno raskršće grada. Prepravke, kontakti i dogovori nastaju kroz razgovor, ne kroz bezličan meni.',
    stamp: 'PRIVATNI SEKTOR',
    image: '/images/frakcija-mehanicari.jpg',
    alt: 'Automehaničarska radionica',
  },
  {
    file: 'F-05',
    name: 'Mediji',
    text: 'Suđenja, skandali, intervjui i sve ono što bi neko najradije sklonio iz javnosti. Mala frakcija sa neprijatno velikim uticajem.',
    stamp: 'ČETVRTA VLAST',
    image: '/images/frakcija-mediji.jpg',
    alt: 'Reporter na terenu',
  },
];
