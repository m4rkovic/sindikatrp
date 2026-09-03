/**
 * Server rules. The wording is the staff's to change; the numbering is what
 * the ticket replies and the audit trail refer to, so renumbering a clause
 * breaks every past reference to it.
 */

export interface Clause {
  no: string;
  title: string;
  paragraphs: string[];
  list?: string[];
}

export interface RuleGroup {
  label: string;
  meta: string;
  clauses: Clause[];
}

export const ruleGroups: RuleGroup[] = [
  {
    label: 'A / POJMOVI',
    meta: 'OVO MORAŠ DA ZNAŠ',
    clauses: [
      {
        no: 'A-01',
        title: 'Roleplay (RP)',
        paragraphs: [
          'Igraš čoveka, ne lik iz igrice. Sve što bi radio u stvarnom životu prenosiš na svog karaktera i ponašaš se onako kako bi se on stvarno poneo u toj situaciji.',
        ],
      },
      {
        no: 'A-02',
        title: 'IC i OOC',
        paragraphs: [
          'IC (In Character) je sve što se tiče tvog lika u gradu. OOC (Out Of Character) je sve van toga: ti za tastaturom, Discord, poziv sa drugom.',
          'Te dve stvari se ne mešaju. Ono što ti znaš i ono što tvoj lik zna su dva različita spiska.',
        ],
      },
      {
        no: 'A-03',
        title: 'Komande /me i /do',
        paragraphs: [
          '/me opisuje radnju koju tvoj lik izvodi. /do prikazuje ishod te radnje ili stanje nečega u sceni.',
          'Laganje na /do je RP2WIN i tako ga i tretiramo. Ako napišeš da je nešto tu, mora da bude tu.',
        ],
      },
      {
        no: 'A-04',
        title: 'Fear RP (FRP)',
        paragraphs: [
          'Ceniš svoj život u igri isto kao u stvarnom. Kad ti je pištolj uperen u glavu, ne praviš se hrabar i ne bežiš.',
          'Kidnapovan si, opkoljen ili razoružan? Onda se tako i ponašaš. Hrabrost bez ijedne šanse za preživljavanje nije hrabrost, nego prekršaj.',
        ],
      },
      {
        no: 'A-05',
        title: 'New Life Rule (NLR)',
        paragraphs: [
          'Kad umreš i respawnuješ se, tvoj lik se ne seća situacije koja ga je dovela do smrti. Ne znaš ko je pucao, ne znaš zašto, i ne vraćaš se na to mesto da nastaviš.',
        ],
      },
    ],
  },
  {
    label: 'B / RP PREKRŠAJI',
    meta: 'OD OPOMENE DO TRAJNOG BAN-A',
    clauses: [
      {
        no: 'B-01',
        title: 'Meta gaming (MG)',
        paragraphs: [
          'Korišćenje OOC informacije za IC korist. Ono što si saznao van igre ne postoji za tvog lika.',
        ],
        list: [
          'Znaš sa Discorda da je neko u policiji ili mafiji, ali ga lik nikad nije upoznao u gradu',
          'Policajac zna da si mafijaš, a nikad to nije saznao kroz RP',
          'Gledaš tuđi stream pa znaš gde su svi',
        ],
      },
      {
        no: 'B-02',
        title: 'Power gaming (PG)',
        paragraphs: [
          'Radnja koja je u igri moguća, a u stvarnom životu nije. Uglavnom se svede na to da nametneš ishod drugoj strani.',
        ],
        list: [
          'Imaš krpu u ustima, a pričaš razgovetno',
          'Ostao si bez komunikacije, ali se javljaš na telefon',
          'Udario te auto, a ti ustaneš i nastaviš kao da ništa nije bilo',
        ],
      },
      {
        no: 'B-03',
        title: 'RDM (Random Deathmatch)',
        paragraphs: [
          'Ubijanje ljudi bez ijednog RP razloga. Ne umeš da ispričaš šta je dovelo do pucnjave? Onda ga nisi ni imao.',
        ],
      },
      {
        no: 'B-04',
        title: 'VDM (Vehicle Deathmatch)',
        paragraphs: [
          'Gaženje igrača vozilom. Kola umesto pištolja i vožnja kao da lik nema kosti spadaju tačno ovde.',
        ],
      },
      {
        no: 'B-05',
        title: 'Revenge Kill (RK)',
        paragraphs: [
          'Neko te je ranio ili ti uradio PD, a ti napraviš novog lika i odmah kreneš da ga tražiš. Stari lik je mrtav i njegovi računi su umrli sa njim.',
        ],
      },
      {
        no: 'B-06',
        title: 'Random Loot (RL)',
        paragraphs: [
          'Pretresanje mrtvog lika bez ikakvog saznanja o tome kako je taj čovek završio na zemlji. Naiđeš na telo i uzmeš sve sa njega, a nemaš pojma ko je on ni šta se desilo.',
        ],
      },
      {
        no: 'B-07',
        title: 'Log To Avoid (LTA)',
        paragraphs: [
          'Izlazak sa servera dok RP situacija traje. Pukla ti je struja ili igra? Vrati se i javi u ticket, pa se scena završava tamo gde je stala.',
        ],
      },
      {
        no: 'B-08',
        title: 'Death To Avoid (DTA)',
        paragraphs: [
          'Namerno umiranje da bi izbegao ono što te čeka. Skok sa zgrade dok te vode u pritvor je isto što i logout, samo krvaviji.',
        ],
      },
      {
        no: 'B-09',
        title: 'Cop Baiting (CB)',
        paragraphs: [
          'Namerno izazivanje policije samo da bi krenula potera.',
        ],
        list: [
          'Paljenje guma ispred stanice',
          'Pucanje bez razloga da bi te neko primetio',
        ],
      },
      {
        no: 'B-10',
        title: 'RP2WIN',
        paragraphs: [
          'Želja da pobediš u svakoj sceni po svaku cenu, i onda kad je to nemoguće.',
        ],
        list: [
          'Policija te hapsi, a ti tvrdiš da ti je neko drugi podmetnuo ilegalnu robu',
          'Tražiš pare od lika koji nema, pa ga na kraju ubiješ zato što ti nije dao',
        ],
      },
      {
        no: 'B-11',
        title: 'RP Superman (RPS)',
        paragraphs: [
          'Ponašanje kao da tvoj lik ne može da bude povređen. Sam kreneš na policiju ili na deset naoružanih ljudi i očekuješ da to prođe.',
        ],
      },
      {
        no: 'B-12',
        title: 'Kill RP (KRP)',
        paragraphs: [
          'Prekidanje tuđe scene. Mešanje OOC priča u IC, pominjanje stvari koje nemaju veze sa likom, dozivanje admina usred situacije umesto da je odigraš do kraja.',
        ],
      },
      {
        no: 'B-13',
        title: 'NonRP',
        paragraphs: [
          'Ometanje RP radnji bez ikakve namere da i sam igraš. Vrtiš se oko tuđe scene, upadaš u nju i kvariš je zato što ti je dosadno.',
        ],
      },
      {
        no: 'B-14',
        title: 'Safe Zone Kill (SZK)',
        paragraphs: [
          'Ubijanje, pljačka i krađa vozila u zonama gde je to zabranjeno. Bolnica, stanica i mesta označena kao sigurna nisu teren za obračun.',
        ],
      },
    ],
  },
  {
    label: 'C / ZLOUPOTREBA MEHANIKE',
    meta: 'BAGOVI, KOMANDE, MARKERI',
    clauses: [
      {
        no: 'C-01',
        title: 'Bug Abuse (BA)',
        paragraphs: [
          'Iskorišćavanje bagova za bilo kakvu korist. Našao si bag? Prijavi ga u ticket. Prvi put kad ga upotrebiš prestaje da bude greška servera i postaje tvoja.',
        ],
      },
      {
        no: 'C-02',
        title: 'Chicken Running (CR)',
        paragraphs: [
          'Trčanje levo desno u pucnjavi da bi izbegao metke. Čovek koji beži od pucnjave trči u zaklon, a ne u cik-cak po sred ulice.',
        ],
      },
      {
        no: 'C-03',
        title: 'Bunny Hop (BH)',
        paragraphs: ['Skakutanje da bi se kretao brže. U gradu se hoda i trči kao ljudi.'],
      },
      {
        no: 'C-04',
        title: 'EASA (Exploiting a Spectating Admin)',
        paragraphs: [
          'Korišćenje komandi na admina koji te trenutno spectuje. Ako te gleda, znači da nešto proverava, i tu nema šta da se pipa.',
        ],
      },
      {
        no: 'C-05',
        title: 'ETRC (Exploiting the Red Cycles)',
        paragraphs: [
          'Iskorišćavanje crvenih markera. Oni stoje tu da nešto ograniče i to je jedini razlog zbog kog postoje.',
        ],
      },
      {
        no: 'C-06',
        title: 'Admin Abuse (AA)',
        paragraphs: [
          'Korišćenje admin komandi za sebe ili za svoju ekipu. Ovo se kod nas kažnjava strože nego kad isti prekršaj napravi igrač, jer je taj alat dobio na poverenje.',
        ],
      },
    ],
  },
  {
    label: 'D / PERMADEATH',
    meta: 'KRAJ PRIČE JEDNOG LIKA',
    clauses: [
      {
        no: 'D-01',
        title: 'Kada je PD moguć',
        paragraphs: [
          'PD znači da je tvoj lik ubijen i da je to kraj njegove priče. Za to su potrebna dva uslova: dovoljno jak RP razlog i odobrenje staff tima.',
          'Situacije u kojima PD ima smisla su ozbiljne i vidljive svima u sceni.',
        ],
        list: [
          'Pad sa velike visine',
          'Paljenje tela',
          'Više hitaca u istu osobu',
        ],
      },
      {
        no: 'D-02',
        title: 'Kako se PD zaključuje',
        paragraphs: [
          'Onaj ko izvodi PD mora to da napiše kroz /me. Bez toga PD nije validan, ma koliko scena izgledala jasno.',
        ],
      },
      {
        no: 'D-03',
        title: 'Posle PD-a',
        paragraphs: [
          'Praviš novog lika, sa drugim imenom i drugom pričom. Taj novi čovek ne pamti ništa od starog i nema nikakve račune sa ljudima koji su ga ubili.',
        ],
      },
    ],
  },
  {
    label: 'E / PRIJAVE I STAFF',
    meta: 'KAKO SE OVO REŠAVA',
    clauses: [
      {
        no: 'E-01',
        title: 'Prijave',
        paragraphs: [
          'Prijava ide kroz Discord ticket. Bez snimka ćemo je pogledati, ali ti odmah iskreno kažemo da se teško dokazuje i da većina takvih završi bez ishoda.',
        ],
        list: [
          'Snimak koji počinje bar minut pre spornog trenutka',
          'Imena likova i otprilike kad se desilo',
          'Šta se dogodilo, u par rečenica i bez vređanja',
        ],
      },
      {
        no: 'E-02',
        title: 'Ponašanje van igre',
        paragraphs: [
          'Vređanje po nacionalnoj, verskoj ili bilo kojoj drugoj osnovi, uznemiravanje i deljenje tuđih podataka rešavamo odmah. To nema veze sa scenom i ne brani se scenom.',
        ],
      },
      {
        no: 'E-03',
        title: 'Pravila važe i za staff',
        paragraphs: [
          'Kad član staff tima igra svog lika, on je samo još jedan igrač. Prijava na njega ide istim putem kao i na bilo koga drugog.',
        ],
      },
    ],
  },
];
