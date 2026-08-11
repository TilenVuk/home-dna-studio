import type { Locale } from "@/lib/i18n";

export type AiSearchArticleId =
  | "home-dna-method"
  | "whole-home-cost"
  | "custom-kitchen"
  | "chipboard-vs-mdf"
  | "storage-planning"
  | "new-build-designer"
  | "nuveli-process"
  | "case-study"
  | "interior-faq"
  | "home-dna-families";

type LocalizedArticle = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  sections: Array<{ heading: string; body: string }>;
  faqs?: Array<{ question: string; answer: string }>;
};

export type AiSearchArticle = {
  id: AiSearchArticleId;
  localized: Record<Locale, LocalizedArticle>;
};

export const aiSearchArticles: AiSearchArticle[] = [
  {
    id: "home-dna-method",
    localized: {
      sl: {
        slug: "kaj-je-home-dna",
        title: "Kaj je Home DNA™ in zakaj začnemo pri načinu življenja",
        description:
          "Home DNA™ je metodologija Nuveli Studio, ki načrtovanje doma začne pri navadah, prioritetah in prihodnjih potrebah ljudi, ne pri katalogu pohištva.",
        intro:
          "Dober interier ni samo lep. Delovati mora v ponedeljek zjutraj, med kuhanjem, ob obisku prijateljev, pri pospravljanju igrač in čez več let, ko se potrebe gospodinjstva spremenijo. Zato Nuveli Studio načrtovanje začne z vprašanjem, kako ljudje dejansko živijo.",
        sections: [
          {
            heading: "Kaj pomeni Home DNA™",
            body: "Home DNA™ združi podatke o gospodinjstvu, dnevnih rutinah, kuhanju, delu od doma, gostih, shranjevanju, otrocih, hišnih ljubljenčkih, slogu in investicijskem okviru. Ti podatki niso cilj sami zase. Uporabimo jih za konkretne odločitve: koliko zaprtega shranjevanja potrebujete, kje mora biti delovna površina, kateri materiali so smiselni in kateri prostori morajo ostati prilagodljivi.",
          },
          {
            heading: "Zakaj ne začnemo samo s stilom",
            body: "Dve družini lahko izbereta enak vizualni slog, vendar potrebujeta povsem drugačen dom. Nekdo kuha vsak dan in želi velik delovni tok, drugi potrebuje več prostora za druženje. Nekdo želi popolnoma skrite površine, drugi odprte police. Stil določa videz, življenjske navade pa določijo, ali bo prostor dolgoročno deloval.",
          },
          {
            heading: "Kaj dobite na koncu Discoveryja",
            body: "Home DNA™ Discovery pripravi osebni povzetek prioritet, smernice za izbrane prostore in okvirno oceno investicije. To ni končna ponudba, saj so zanjo potrebni izmere, materialne odločitve in natančen obseg. Je pa dovolj konkretna osnova, da že pred prvim sestankom razumete smer projekta in realen investicijski okvir.",
          },
        ],
        faqs: [
          {
            question: "Ali je Home DNA™ brezplačen?",
            answer:
              "Da. Digitalni Home DNA™ Discovery in osebni report sta namenjena kot prvi korak pred posvetom z Nuveli Studio.",
          },
          {
            question: "Ali Home DNA™ nadomesti notranjega oblikovalca?",
            answer:
              "Ne. Metodologija pripravi strukturirano izhodišče. Natančen projekt, izmere, materiali, detajli in izvedba zahtevajo nadaljnje načrtovanje.",
          },
        ],
      },
      hr: {
        slug: "sto-je-home-dna",
        title: "Što je Home DNA™ i zašto počinjemo od načina života",
        description:
          "Home DNA™ je metodologija Nuveli Studija koja planiranje doma započinje navikama, prioritetima i budućim potrebama ljudi.",
        intro:
          "Dobar interijer nije samo lijep. Mora funkcionirati u svakodnevnom životu: tijekom kuhanja, rada od kuće, druženja, spremanja i kroz promjene koje dolaze s vremenom. Zato planiranje započinjemo razumijevanjem ljudi koji će u prostoru živjeti.",
        sections: [
          {
            heading: "Što znači Home DNA™",
            body: "Home DNA™ povezuje podatke o kućanstvu, rutinama, kuhanju, radu od kuće, gostima, spremanju, djeci, kućnim ljubimcima, stilu i investicijskom okviru. Iz tih podataka proizlaze konkretne odluke o rasporedu, količini spremišta, materijalima i prilagodljivosti prostora.",
          },
          {
            heading: "Zašto ne počinjemo samo stilom",
            body: "Dvije obitelji mogu odabrati isti vizualni stil, ali trebaju potpuno drugačiji dom. Stil određuje izgled, dok životne navike određuju koliko će prostor biti praktičan, jednostavan za održavanje i dugoročno ugodan.",
          },
          {
            heading: "Što dobivate na kraju",
            body: "Nakon Home DNA™ Discoveryja dobivate osobni izvještaj, smjernice za odabrane prostore i okvirnu procjenu investicije. Konačna ponuda slijedi nakon konzultacija, izmjera i preciznog definiranja materijala i opsega.",
          },
        ],
        faqs: [
          {
            question: "Je li Home DNA™ besplatan?",
            answer:
              "Da. Digitalni Discovery i osobni izvještaj zamišljeni su kao prvi korak prije konzultacija.",
          },
          {
            question: "Zamjenjuje li Home DNA™ dizajnera interijera?",
            answer:
              "Ne. Daje kvalitetnu polaznu osnovu, dok detaljan projekt i izvedba zahtijevaju daljnje stručno planiranje.",
          },
        ],
      },
      en: {
        slug: "what-is-home-dna",
        title: "What is Home DNA™ and why we start with lifestyle",
        description:
          "Home DNA™ is Nuveli Studio's methodology for starting interior planning with habits, priorities and future needs rather than a furniture catalogue.",
        intro:
          "A good interior is not only attractive. It has to work on a Monday morning, while cooking, when friends visit, when toys need to disappear and years later when the household changes. That is why Nuveli Studio starts by understanding how people actually live.",
        sections: [
          {
            heading: "What Home DNA™ means",
            body: "Home DNA™ combines information about the household, routines, cooking, working from home, hosting, storage, children, pets, style and investment range. We turn that information into practical decisions about layout, storage volume, materials and flexibility.",
          },
          {
            heading: "Why style is not enough",
            body: "Two families can prefer the same visual style yet need completely different homes. Style defines appearance. Lifestyle determines whether the layout, surfaces and storage will remain practical in everyday use.",
          },
          {
            heading: "What you receive",
            body: "The Home DNA™ Discovery produces a personal report, recommendations for the selected spaces and an indicative investment estimate. A final quotation follows after consultation, measurements and detailed material and scope decisions.",
          },
        ],
        faqs: [
          {
            question: "Is Home DNA™ free?",
            answer:
              "Yes. The digital Discovery and personal report are designed as the first step before a consultation with Nuveli Studio.",
          },
          {
            question: "Does Home DNA™ replace an interior designer?",
            answer:
              "No. It creates a structured starting point; detailed design, measurements, specifications and execution still require professional planning.",
          },
        ],
      },
    },
  },
  {
    id: "whole-home-cost",
    localized: {
      sl: {
        slug: "koliko-stane-celovita-oprema-hise-stanovanja",
        title: "Koliko stane celovita oprema hiše ali stanovanja",
        description:
          "Kaj najbolj vpliva na ceno celovite notranje opreme po meri in zakaj je smiselno investicijo ocenjevati po prostorih in nivoju izvedbe.",
        intro:
          "Pri celoviti opremi doma enotna cena na kvadratni meter pogosto zavaja. Dve enako veliki hiši imata lahko zelo različen obseg pohištva, materiale, količino shranjevanja in tehnične detajle. Bolj uporabna je ocena po prostorih in nivoju izvedbe.",
        sections: [
          {
            heading: "Kaj najbolj vpliva na investicijo",
            body: "Največji vpliv imajo obseg pohištva po meri, dolžina kuhinje, število visokih elementov, garderobe, kopalniško pohištvo, delovne površine, okovje, posebni materiali, steklo, razsvetljava in zahtevnost montaže. Pri novogradnji je pomembno tudi, ali se projekt uskladi dovolj zgodaj z elektro in vodovodnimi priključki.",
          },
          {
            heading: "Zakaj uporabljamo nivoje izvedbe",
            body: "Osnovni, Premium in Signature nivo niso samo cenovne oznake. Predstavljajo različno raven materialov, detajlov, okovja in vizualne zahtevnosti. Tako lahko najprej določimo smiselno investicijsko območje, nato pa denar usmerimo v elemente, ki so za posamezno gospodinjstvo najbolj pomembni.",
          },
          {
            heading: "Okvirna ocena ni končna ponudba",
            body: "Digitalna ocena je namenjena orientaciji. Končna cena je možna šele po meritvah, razvoju rešitve, potrditvi materialov in natančnem popisu elementov. Dobra zgodnja ocena pa prepreči, da bi projekt razvijali v smeri, ki je bistveno nad realnim proračunom.",
          },
        ],
      },
      hr: {
        slug: "koliko-kosta-opremanje-kuce-stana",
        title: "Koliko košta cjelovito opremanje kuće ili stana",
        description:
          "Glavni faktori cijene namještaja i interijera po mjeri te zašto investiciju treba procjenjivati prema prostorima i razini izvedbe.",
        intro:
          "Jedinstvena cijena po kvadratnom metru često nije dobar pokazatelj. Dvije kuće iste površine mogu imati potpuno različitu količinu namještaja, materijale i tehničku složenost.",
        sections: [
          {
            heading: "Što najviše utječe na cijenu",
            body: "Najveći utjecaj imaju količina namještaja po mjeri, kuhinja, visoki elementi, garderobe, radne plohe, okovi, staklo, rasvjeta, posebni materijali i složenost montaže.",
          },
          {
            heading: "Zašto koristimo razine izvedbe",
            body: "Basic, Premium i Signature predstavljaju različite razine materijala, detalja i okova. Takav pristup daje realniji početni investicijski okvir i olakšava određivanje prioriteta.",
          },
          {
            heading: "Procjena nije konačna ponuda",
            body: "Konačna cijena slijedi nakon izmjera, razvoja rješenja i potvrde materijala. Rana procjena služi tome da se projekt od početka razvija u realnom budžetu.",
          },
        ],
      },
      en: {
        slug: "cost-to-furnish-house-apartment",
        title: "How much does it cost to furnish a house or apartment",
        description:
          "The main cost drivers in a complete custom interior and why room-by-room estimates are more useful than a single price per square metre.",
        intro:
          "A single price per square metre is often misleading for a complete interior. Two homes of the same size can contain very different amounts of cabinetry, materials and technical detailing.",
        sections: [
          {
            heading: "What drives the investment",
            body: "The main variables are the quantity of custom furniture, kitchen length, tall units, wardrobes, bathroom cabinetry, worktops, hardware, glass, lighting, special finishes and installation complexity.",
          },
          {
            heading: "Why execution levels help",
            body: "Basic, Premium and Signature are not just price labels. They represent different material, hardware and detailing levels, making it easier to establish a realistic range before detailed design begins.",
          },
          {
            heading: "An estimate is not a final quote",
            body: "A final quotation requires measurements, a developed design, confirmed materials and a detailed scope. An early estimate is still valuable because it keeps the design direction aligned with a realistic budget.",
          },
        ],
      },
    },
  },
  {
    id: "custom-kitchen",
    localized: {
      sl: {
        slug: "kako-nacrtovati-kuhinjo-po-meri",
        title: "Kako načrtovati kuhinjo po meri",
        description:
          "Praktičen vodič za načrtovanje kuhinje po meri: delovni tok, shranjevanje, aparati, otok, materiali, osvetlitev in priključki.",
        intro:
          "Kuhinja po meri je najuspešnejša, ko je razporeditev podrejena načinu kuhanja in gibanju po prostoru. Lep videz je rezultat dobrih proporcev in materialov, funkcionalnost pa nastane iz pravilnega zaporedja odločitev.",
        sections: [
          {
            heading: "Začnite z uporabo, ne z obliko",
            body: "Najprej določite, kako pogosto kuhate, koliko ljudi kuha hkrati, katere aparate uporabljate vsak dan in koliko hrane shranjujete. Šele nato ima smisel izbrati linearno, L, U postavitev ali otok. Otok je smiseln, če okoli njega ostane dovolj prehoda in če ima jasno funkcijo.",
          },
          {
            heading: "Shranjevanje je treba izračunati",
            body: "Visoki elementi, predali in notranja organizacija so učinkovitejši, ko izhajajo iz dejanskih predmetov. Ločite vsakodnevne posode, zaloge hrane, male aparate, koše, čistila in redkeje uporabljene stvari. Dobra kuhinja zmanjšuje prestavljanje predmetov in prazne globoke police.",
          },
          {
            heading: "Materiali in priključki morajo biti usklajeni zgodaj",
            body: "Vrsta front, delovna plošča in način odpiranja vplivajo na detajle in ceno. Pri novogradnji je idealno kuhinjo razviti pred zaključkom elektro in vodovodnih instalacij, da so vtičnice, odtoki, napa in osvetlitev na pravem mestu.",
          },
        ],
        faqs: [
          {
            question: "Ali je kuhinjski otok vedno boljša rešitev?",
            answer:
              "Ne. Otok zahteva dovolj prostora za prehode in mora imeti jasno funkcijo. V manjšem prostoru je lahko dobra L ali U postavitev učinkovitejša.",
          },
        ],
      },
      hr: {
        slug: "kako-planirati-kuhinju-po-mjeri",
        title: "Kako planirati kuhinju po mjeri",
        description:
          "Vodič kroz radni tok, spremanje, uređaje, otok, materijale, rasvjetu i priključke u kuhinji po mjeri.",
        intro:
          "Najbolja kuhinja po mjeri nastaje kada raspored prati stvarni način kuhanja i kretanja kroz prostor.",
        sections: [
          {
            heading: "Počnite od načina korištenja",
            body: "Najprije odredite koliko često kuhate, koliko osoba koristi kuhinju istovremeno, koje uređaje trebate svaki dan i koliko hrane spremate. Tek tada birajte linearnu, L, U varijantu ili otok.",
          },
          {
            heading: "Spremanje treba planirati prema stvarnim stvarima",
            body: "Visoki elementi, ladice i unutarnja organizacija imaju smisla kada su prilagođeni posuđu, zalihama, malim uređajima i svakodnevnim navikama.",
          },
          {
            heading: "Materijali i instalacije planiraju se rano",
            body: "Fronte, radna ploča i način otvaranja utječu na detalje i cijenu. U novogradnji je kuhinju najbolje definirati prije završetka elektro i vodovodnih instalacija.",
          },
        ],
      },
      en: {
        slug: "how-to-plan-a-custom-kitchen",
        title: "How to plan a custom kitchen",
        description:
          "A practical guide to workflow, storage, appliances, islands, materials, lighting and services in a made-to-measure kitchen.",
        intro:
          "A successful custom kitchen starts with the way people cook and move through the room, not with a fashionable layout.",
        sections: [
          {
            heading: "Start with use, not shape",
            body: "Define cooking frequency, the number of simultaneous users, everyday appliances and food storage first. Only then choose a linear, L-shaped, U-shaped or island layout.",
          },
          {
            heading: "Plan storage around real possessions",
            body: "Tall units, drawers and internal organisers work best when they are designed around cookware, food, small appliances, waste, cleaning products and everyday routines.",
          },
          {
            heading: "Coordinate materials and services early",
            body: "Front materials, worktops and opening systems influence details and cost. In a new build, the kitchen should ideally be developed before electrical and plumbing positions are finalised.",
          },
        ],
      },
    },
  },
  {
    id: "chipboard-vs-mdf",
    localized: {
      sl: {
        slug: "iveral-ali-mdf-kuhinja",
        title: "Iveral ali MDF – kateri material izbrati za kuhinjo",
        description:
          "Primerjava iverala, mat MDF, lakiranega MDF in visokega sijaja za kuhinjske fronte glede videza, vzdrževanja, odpornosti in cene.",
        intro:
          "Pri kuhinjskih frontah ni enega materiala, ki bi bil najboljši za vse. Pomembni so želeni videz, način uporabe, občutljivost na prstne odtise, čiščenje, robovi in investicijski okvir.",
        sections: [
          {
            heading: "Iveral",
            body: "Kakovosten dekorativni iveral je racionalna in zelo uporabna izbira. Na voljo je veliko dekorjev, površine so praviloma odporne in cenovno učinkovite. Omejitev je predvsem videz robov in manj možnosti pri profiliranih ali zahtevnejših oblikah front.",
          },
          {
            heading: "Mat in lakiran MDF",
            body: "MDF omogoča enotnejšo površino in obdelavo robov, zato je primeren za bolj prečiščen ali premium videz. Lakirane površine ponujajo veliko barvnih možnosti, zahtevajo pa več pozornosti pri uporabi in popravilu poškodb.",
          },
          {
            heading: "Visoki sijaj in supermat",
            body: "Visoki sijaj poudari svetlobo in izrazit videz, vendar bolj pokaže prstne odtise in drobne nepravilnosti. Supermat anti-fingerprint površine so prijetne za vsakodnevno uporabo, vendar se kakovost in cena med sistemi razlikujeta. Material izberemo glede na prioritete, ne samo fotografijo vzorca.",
          },
        ],
      },
      hr: {
        slug: "iveral-ili-mdf-kuhinja",
        title: "Iveral ili MDF – koji materijal odabrati za kuhinju",
        description:
          "Usporedba iverala, mat MDF-a, lakiranog MDF-a i visokog sjaja za kuhinjske fronte.",
        intro:
          "Ne postoji jedan materijal koji je najbolji za svaku kuhinju. Odluka ovisi o izgledu, održavanju, otpornosti, rubovima i budžetu.",
        sections: [
          {
            heading: "Iveral",
            body: "Kvalitetan dekorativni iveral racionalan je i izdržljiv izbor s velikim brojem dekora. Ograničenje su vidljiviji rubovi i manja sloboda kod profiliranih fronti.",
          },
          {
            heading: "Mat i lakirani MDF",
            body: "MDF omogućuje ujednačeniju obradu površine i rubova te je dobar izbor za pročišćeniji premium izgled. Lakiranje nudi veliku slobodu boja, ali traži više pažnje kod oštećenja.",
          },
          {
            heading: "Visoki sjaj i supermat",
            body: "Visoki sjaj je izražajan, ali pokazuje više otisaka i sitnih nepravilnosti. Supermat anti-fingerprint površine praktične su za svakodnevicu, uz razlike u kvaliteti i cijeni među sustavima.",
          },
        ],
      },
      en: {
        slug: "chipboard-or-mdf-kitchen",
        title: "Chipboard or MDF – which material should you choose for a kitchen",
        description:
          "A practical comparison of melamine-faced chipboard, matt MDF, lacquered MDF and high-gloss kitchen fronts.",
        intro:
          "There is no single best kitchen-front material. The right choice depends on appearance, maintenance, edge quality, durability and budget.",
        sections: [
          {
            heading: "Melamine-faced chipboard",
            body: "Quality decorative board is a rational, durable and cost-effective choice with a wide range of finishes. Its main limitation is the visible edge treatment and reduced freedom for shaped or profiled doors.",
          },
          {
            heading: "Matt and lacquered MDF",
            body: "MDF allows a more continuous surface and edge treatment, making it suitable for refined premium fronts. Lacquer offers broad colour freedom but requires more care when damaged.",
          },
          {
            heading: "High gloss and supermatt",
            body: "High gloss reflects light and creates a stronger visual effect but shows fingerprints and small imperfections more easily. Supermatt anti-fingerprint surfaces are practical, although quality and price vary significantly.",
          },
        ],
      },
    },
  },
  {
    id: "storage-planning",
    localized: {
      sl: {
        slug: "kako-nacrtovati-dovolj-prostora-za-shranjevanje",
        title: "Kako načrtovati dovolj prostora za shranjevanje",
        description:
          "Kako določiti pravo količino garderob, kuhinjskega, utility in drugega shranjevanja brez nepotrebnega pohištva.",
        intro:
          "Dovolj shranjevanja ne pomeni, da mora biti vsak prosti zid omara. Cilj je, da imajo predmeti logično mesto blizu območja uporabe, da so vsakodnevne stvari hitro dostopne in da je dom mogoče enostavno pospraviti.",
        sections: [
          {
            heading: "Popišite kategorije, ne samo omar",
            body: "Najprej ločite oblačila, čevlje, športno opremo, igrače, dokumente, sesalec, čistila, zaloge hrane, posteljnino in sezonske stvari. Za vsako kategorijo določite količino, pogostost uporabe in idealno lokacijo.",
          },
          {
            heading: "Globina in višina sta pomembnejši od skupne površine",
            body: "Preveč globoke police so lahko manj uporabne kot pravilno dimenzionirani predali. Visoke omare učinkovito izkoristijo volumen, vendar je treba zgornje dele nameniti manj pogosto uporabljenim predmetom.",
          },
          {
            heading: "Načrtujte tudi prihodnost",
            body: "Družina z majhnimi otroki potrebuje drugačno organizacijo kot čez pet let. Dobra rešitev omogoča spremembe polic, obešalnih višinin in funkcije posameznega segmenta brez popolne predelave pohištva.",
          },
        ],
      },
      hr: {
        slug: "kako-planirati-dovolj-prostora-za-spremanje",
        title: "Kako planirati dovoljno prostora za spremanje",
        description:
          "Kako odrediti pravu količinu garderoba, kuhinjskog i pomoćnog spremanja bez nepotrebnog namještaja.",
        intro:
          "Dovolj prostora za spremanje ne znači ispuniti svaki zid ormarima. Važno je da stvari imaju logično mjesto blizu područja u kojem se koriste.",
        sections: [
          {
            heading: "Popišite kategorije stvari",
            body: "Odvojite odjeću, obuću, sportsku opremu, igračke, dokumente, sredstva za čišćenje, hranu, posteljinu i sezonske stvari. Za svaku kategoriju odredite količinu i učestalost korištenja.",
          },
          {
            heading: "Dubina i visina moraju biti funkcionalne",
            body: "Preduboke police često su manje praktične od pravilno dimenzioniranih ladica. Visoki ormari dobro koriste volumen, ali gornje zone treba rezervirati za rjeđe korištene stvari.",
          },
          {
            heading: "Planirajte promjene",
            body: "Dobra organizacija omogućuje promjenu visina polica i funkcije pojedinih segmenata kako se potrebe obitelji mijenjaju.",
          },
        ],
      },
      en: {
        slug: "how-to-plan-enough-storage",
        title: "How to plan enough storage",
        description:
          "How to determine the right amount of wardrobe, kitchen and utility storage without filling every wall with cabinetry.",
        intro:
          "Enough storage does not mean turning every free wall into a cupboard. The goal is to give possessions a logical place close to where they are used.",
        sections: [
          {
            heading: "List categories, not cupboards",
            body: "Separate clothing, shoes, sports equipment, toys, paperwork, cleaning equipment, food, linen and seasonal items. Estimate quantity and frequency of use for each category.",
          },
          {
            heading: "Depth and height matter",
            body: "Overly deep shelves can be less useful than correctly sized drawers. Tall cabinetry uses volume efficiently, while upper zones should hold less frequently used items.",
          },
          {
            heading: "Plan for future change",
            body: "A good system allows shelf positions, hanging heights and individual cabinet functions to change as the household evolves.",
          },
        ],
      },
    },
  },
  {
    id: "new-build-designer",
    localized: {
      sl: {
        slug: "notranje-oblikovanje-novogradnje-kdaj-vkljuciti-oblikovalca",
        title: "Notranje oblikovanje novogradnje – kdaj vključiti oblikovalca",
        description:
          "Zakaj je pri novogradnji smiselno notranjega oblikovalca vključiti pred dokončnimi elektro, vodovodnimi in svetlobnimi načrti.",
        intro:
          "Najdražje spremembe pri novogradnji pogosto niso oblikovalske, ampak tehnične: premik vtičnic, odtokov, svetil, vrat ali predelnih sten po tem, ko so dela že zaključena. Zato je notranji projekt najbolj koristen, če se začne dovolj zgodaj.",
        sections: [
          {
            heading: "Idealni trenutek",
            body: "Oblikovalca je smiselno vključiti, ko so osnovni tlorisi znani, vendar elektro in strojne instalacije še niso dokončno potrjene. Takrat je mogoče preveriti postavitev kuhinje, garderob, TV stene, kopalniškega pohištva in svetil brez dragih naknadnih posegov.",
          },
          {
            heading: "Kaj je treba uskladiti",
            body: "Ključne so pozicije vtičnic, stikal, svetil, priključkov za kuhinjske aparate, vode, odtokov, prezračevanja, višine spuščenih stropov in širine prehodov. Pohištvo po meri mora biti načrtovano kot del prostora, ne kot dodatek po zaključku gradnje.",
          },
          {
            heading: "Kaj če je gradnja že napredovala",
            body: "Projekt je še vedno smiseln, vendar je svoboda odločanja manjša. Takrat najprej določimo, katere instalacije se splača prestaviti in katere je bolje sprejeti ter jim prilagoditi pohištvo.",
          },
        ],
      },
      hr: {
        slug: "interijer-novogradnje-kada-ukljuciti-dizajnera",
        title: "Dizajn interijera novogradnje – kada uključiti dizajnera",
        description:
          "Zašto dizajnera treba uključiti prije konačnih elektro, vodovodnih i rasvjetnih planova.",
        intro:
          "Najskuplje promjene često su tehničke: premještanje utičnica, odvoda, rasvjete ili zidova nakon izvedenih radova.",
        sections: [
          {
            heading: "Idealno vrijeme",
            body: "Dizajnera je najbolje uključiti kada je osnovni tlocrt poznat, ali instalacije još nisu konačne. Tada se mogu uskladiti kuhinja, ormari, kupaonice i rasvjeta.",
          },
          {
            heading: "Što treba uskladiti",
            body: "Važne su pozicije utičnica, prekidača, rasvjete, kuhinjskih priključaka, vode, odvoda, ventilacije i prolaza. Namještaj po mjeri treba biti dio projekta prostora.",
          },
          {
            heading: "Ako je gradnja već napredovala",
            body: "Projekt i dalje ima smisla, ali je manje slobode. Prioritet je odrediti koje instalacije vrijedi premjestiti, a gdje je racionalnije prilagoditi namještaj.",
          },
        ],
      },
      en: {
        slug: "new-build-interior-design-when-to-hire-designer",
        title: "New-build interior design – when should you involve a designer",
        description:
          "Why interior design should begin before electrical, plumbing and lighting plans are fully fixed in a new build.",
        intro:
          "The most expensive late changes in a new build are often technical rather than decorative: moving sockets, drains, lights or walls after work is complete.",
        sections: [
          {
            heading: "The ideal timing",
            body: "Involve the designer once the main floor plan is known but before electrical and mechanical services are final. This allows kitchens, wardrobes, bathrooms and lighting to be coordinated early.",
          },
          {
            heading: "What needs coordination",
            body: "Key items include sockets, switches, lighting, appliance connections, water, drainage, ventilation, ceiling levels and circulation widths. Custom furniture should be treated as part of the space rather than an afterthought.",
          },
          {
            heading: "If construction is already advanced",
            body: "Design is still valuable, but there is less freedom. The priority becomes deciding which service positions are worth changing and which should be accommodated by the furniture design.",
          },
        ],
      },
    },
  },
  {
    id: "nuveli-process",
    localized: {
      sl: {
        slug: "kako-poteka-projekt-nuveli-studio",
        title: "Kako poteka projekt Nuveli Studio od prvega pogovora do montaže",
        description:
          "Pregled procesa Nuveli Studio: Home DNA™, posvet, izmere, zasnova, materiali, ponudba, proizvodnja in montaža.",
        intro:
          "Jasen proces zmanjšuje število nepredvidenih odločitev med izvedbo. Pri Nuveli Studio projekt napreduje od razumevanja ljudi in prostora do natančne tehnične rešitve, nato v proizvodnjo in montažo.",
        sections: [
          {
            heading: "1. Home DNA™ in prvi posvet",
            body: "Pred prvim pogovorom lahko izpolnite Home DNA™ Discovery. Tako že poznamo osnovni obseg, gospodinjstvo, slogovne preference in okvir investicije. Na posvetu preverimo prioritete, časovni plan in ali je projekt primeren za sodelovanje.",
          },
          {
            heading: "2. Izmere in razvoj rešitve",
            body: "Na lokaciji preverimo mere, instalacije in posebnosti prostora. Nato razvijemo postavitev, proporce, količino shranjevanja, materiale in ključne detajle. Pri celovitem projektu uskladimo prostore v eno vizualno in funkcionalno celoto.",
          },
          {
            heading: "3. Ponudba, proizvodnja in montaža",
            body: "Ko so obseg, materiali in detajli potrjeni, pripravimo končno ponudbo. Po potrditvi sledi priprava za proizvodnjo, izdelava in organizirana montaža. Cilj je, da se največ odločitev sprejme pred proizvodnjo, ne na gradbišču.",
          },
        ],
      },
      hr: {
        slug: "kako-izgleda-projekt-nuveli-studio",
        title: "Kako izgleda projekt Nuveli Studio od prvog razgovora do montaže",
        description:
          "Proces Nuveli Studija: Home DNA™, konzultacije, izmjere, dizajn, materijali, ponuda, proizvodnja i montaža.",
        intro:
          "Jasan proces smanjuje nepredviđene odluke tijekom izvedbe i omogućuje da se ključni detalji riješe prije proizvodnje.",
        sections: [
          {
            heading: "1. Home DNA™ i konzultacije",
            body: "Home DNA™ daje početni pregled opsega, kućanstva, stila i investicije. Na konzultacijama provjeravamo prioritete i vremenski plan.",
          },
          {
            heading: "2. Izmjere i razvoj rješenja",
            body: "Na lokaciji provjeravamo dimenzije i instalacije, zatim razvijamo raspored, spremanje, materijale i detalje.",
          },
          {
            heading: "3. Ponuda, proizvodnja i montaža",
            body: "Nakon potvrde rješenja i materijala slijedi konačna ponuda, priprema proizvodnje, izrada i organizirana montaža.",
          },
        ],
      },
      en: {
        slug: "nuveli-studio-project-process",
        title: "How a Nuveli Studio project works from first conversation to installation",
        description:
          "The Nuveli Studio process: Home DNA™, consultation, measurement, design, materials, quotation, production and installation.",
        intro:
          "A clear process reduces unexpected decisions during execution. We move from understanding the people and space to a resolved technical design before production begins.",
        sections: [
          {
            heading: "1. Home DNA™ and consultation",
            body: "Home DNA™ gives us an initial view of scope, household, style and investment. The consultation confirms priorities, timing and project fit.",
          },
          {
            heading: "2. Measurement and design development",
            body: "We verify dimensions and services on site, then develop layout, storage, materials and key details into one coherent solution.",
          },
          {
            heading: "3. Quotation, production and installation",
            body: "Once scope, materials and details are approved, we prepare the final quotation, production documentation, manufacture and organised installation.",
          },
        ],
      },
    },
  },
  {
    id: "case-study",
    localized: {
      sl: {
        slug: "primer-projekta-druzinska-novogradnja",
        title: "Primer projekta: družinska novogradnja z veliko shranjevanja",
        description:
          "Primer, kako bi Nuveli Studio prevedel potrebe družine v kuhinjo, garderobe, predsobo, dnevni prostor in otroške sobe.",
        intro:
          "Primer prikazuje tipičen način razmišljanja pri projektu, ne konkretnega naročnika. Izhodišče je štiričlanska družina v novogradnji, ki želi miren sodoben interier, veliko skritega shranjevanja in materiale, ki prenesejo intenzivno vsakodnevno uporabo.",
        sections: [
          {
            heading: "Izhodišče",
            body: "Dva odrasla in dva otroka, kuhanje vsak dan, pogosti obiski, športna oprema in želja po vizualno mirnem domu. Največji izziv je preprečiti, da bi vsakodnevni predmeti ostajali na delovnih in prehodnih površinah.",
          },
          {
            heading: "Prostorske odločitve",
            body: "Kuhinja dobi več predalov in namensko shrambo za male aparate. Predsoba združi čevlje, jakne, torbe in klop. Utility prevzame čistila, sesalec in zaloge. Otroške sobe dobijo prilagodljive omare in delovne površine, ki se lahko spreminjajo z leti.",
          },
          {
            heading: "Materialna smer",
            body: "Za pogosto dotikane fronte izberemo površine, ki se enostavno čistijo in manj kažejo prstne odtise. Topel lesni dekor uporabimo kot vezni element, delovne površine pa izberemo glede na intenzivnost kuhanja in željeni investicijski nivo.",
          },
        ],
      },
      hr: {
        slug: "primjer-projekta-obiteljska-novogradnja",
        title: "Primjer projekta: obiteljska novogradnja s puno spremišta",
        description:
          "Primjer kako se potrebe obitelji prevode u kuhinju, ormare, predsoblje, dnevni boravak i dječje sobe.",
        intro:
          "Ovaj primjer prikazuje tipičan način razmišljanja, a ne konkretnog klijenta: četveročlana obitelj, novogradnja, miran suvremeni stil i mnogo skrivenog spremišta.",
        sections: [
          {
            heading: "Polazište",
            body: "Dvoje odraslih, dvoje djece, svakodnevno kuhanje, česti gosti i sportska oprema. Cilj je smanjiti vizualni nered u svakodnevici.",
          },
          {
            heading: "Prostorne odluke",
            body: "Kuhinja dobiva više ladica i spremište za male uređaje. Predsoblje spaja cipele, jakne, torbe i klupu, a utility preuzima sredstva za čišćenje i zalihe.",
          },
          {
            heading: "Materijali",
            body: "Na često dodirivanim frontama biraju se površine jednostavne za čišćenje, uz topao drveni dekor kao povezujući element kroz dom.",
          },
        ],
      },
      en: {
        slug: "case-study-family-new-build",
        title: "Case study: a family new build with generous storage",
        description:
          "An example of translating family routines into a kitchen, wardrobes, entry hall, living space and children's rooms.",
        intro:
          "This is an illustrative scenario rather than a specific client project: a family of four in a new build seeking a calm contemporary interior, generous concealed storage and durable everyday materials.",
        sections: [
          {
            heading: "Starting point",
            body: "Two adults, two children, daily cooking, frequent guests and sports equipment. The main objective is to keep everyday items off worktops and circulation zones.",
          },
          {
            heading: "Spatial decisions",
            body: "The kitchen uses more drawers and dedicated small-appliance storage. The entry hall combines shoes, coats, bags and a bench, while the utility room absorbs cleaning equipment and household stock.",
          },
          {
            heading: "Material direction",
            body: "Frequently touched fronts use easy-clean, low-fingerprint surfaces, with a warm timber finish connecting the different rooms.",
          },
        ],
      },
    },
  },
  {
    id: "interior-faq",
    localized: {
      sl: {
        slug: "faq-notranje-oblikovanje-pohistvo-po-meri",
        title: "FAQ o notranjem oblikovanju in pohištvu po meri",
        description:
          "Odgovori na pogosta vprašanja o procesu, cenah, izmerah, materialih, časovnici, kuhinjah, garderobah in montaži.",
        intro:
          "Pred začetkom projekta se največ vprašanj ponavlja okoli cene, časovnice, meritev, materialov in tega, kdaj je pravi trenutek za vključitev oblikovalca. Spodaj so kratki odgovori na najpogostejša vprašanja.",
        sections: [
          {
            heading: "Kako zgodaj začeti",
            body: "Pri novogradnji je najbolje začeti pred dokončnimi elektro in vodovodnimi načrti. Pri prenovi je smiselno oblikovanje začeti, preden se naročijo tlaki, svetila in drugi elementi, ki vplivajo na pohištvo.",
          },
          {
            heading: "Kako nastane cena",
            body: "Cena je odvisna od količine pohištva, materialov, okovja, delovnih površin, posebnih detajlov in montaže. Zato je začetna ocena okvirna, končna ponudba pa sledi po razvoju rešitve in izmerah.",
          },
        ],
        faqs: [
          {
            question: "Ali lahko naročim samo kuhinjo ali garderobo?",
            answer: "Da. Obseg je lahko posamezen prostor ali celoten dom.",
          },
          {
            question: "Ali so izmere obvezne?",
            answer:
              "Za končno proizvodno dokumentacijo da. Tudi pri dobrih arhitekturnih načrtih preverimo dejansko stanje na lokaciji.",
          },
          {
            question: "Ali lahko kombiniramo iveral in MDF?",
            answer:
              "Da. Pogosto je racionalno različne materiale uporabiti tam, kjer njihove lastnosti prinesejo največ vrednosti.",
          },
          {
            question: "Ali okvirna investicija pomeni končno ceno?",
            answer:
              "Ne. Namenjena je zgodnji orientaciji. Končna ponudba zahteva potrjen obseg, materiale in mere.",
          },
        ],
      },
      hr: {
        slug: "faq-dizajn-interijera-namjestaj-po-mjeri",
        title: "FAQ o dizajnu interijera i namještaju po mjeri",
        description:
          "Odgovori na česta pitanja o procesu, cijeni, izmjerama, materijalima, rokovima i montaži.",
        intro:
          "Najčešća pitanja prije početka projekta odnose se na cijenu, rokove, izmjere, materijale i pravi trenutak za uključivanje dizajnera.",
        sections: [
          {
            heading: "Kada početi",
            body: "U novogradnji je najbolje početi prije konačnih elektro i vodovodnih planova. Kod renovacije prije naručivanja elemenata koji utječu na namještaj.",
          },
          {
            heading: "Kako nastaje cijena",
            body: "Cijena ovisi o količini namještaja, materijalima, okovima, radnim plohama, detaljima i montaži. Konačna ponuda slijedi nakon razvijenog rješenja i izmjera.",
          },
        ],
        faqs: [
          {
            question: "Mogu li naručiti samo kuhinju ili ormar?",
            answer: "Da. Opseg može biti jedan prostor ili cijeli dom.",
          },
          {
            question: "Jesu li izmjere obavezne?",
            answer:
              "Da, za konačnu proizvodnu dokumentaciju provjeravamo stvarno stanje na lokaciji.",
          },
          {
            question: "Možemo li kombinirati iveral i MDF?",
            answer:
              "Da. Kombiniranje materijala često daje najbolji odnos funkcije, izgleda i cijene.",
          },
        ],
      },
      en: {
        slug: "interior-design-custom-furniture-faq",
        title: "FAQ about interior design and custom furniture",
        description:
          "Answers to common questions about process, cost, measurements, materials, timing and installation.",
        intro:
          "Most questions before a project concern cost, timing, measurements, materials and the right moment to involve a designer.",
        sections: [
          {
            heading: "When to start",
            body: "For a new build, start before electrical and plumbing layouts are final. For a renovation, begin before ordering finishes and fittings that affect custom furniture.",
          },
          {
            heading: "How pricing is established",
            body: "Cost depends on the amount of furniture, materials, hardware, worktops, special details and installation. The final quotation follows design development and measurement.",
          },
        ],
        faqs: [
          {
            question: "Can I order only a kitchen or wardrobe?",
            answer: "Yes. The project can cover one room or the complete home.",
          },
          {
            question: "Are site measurements required?",
            answer:
              "Yes for final production documentation. We verify actual site conditions even when architectural drawings are available.",
          },
          {
            question: "Can chipboard and MDF be combined?",
            answer:
              "Yes. Combining materials is often the best way to balance function, appearance and investment.",
          },
        ],
      },
    },
  },
  {
    id: "home-dna-families",
    localized: {
      sl: {
        slug: "home-dna-za-druzine",
        title: "Home DNA za družine – kako življenjske navade vplivajo na tloris in pohištvo",
        description:
          "Kako število odraslih in otrok, jutranje rutine, igrače, kuhanje, delo od doma in prihodnje spremembe vplivajo na zasnovo doma.",
        intro:
          "Pri družinskem domu se največ funkcionalnih težav ne začne pri slogu, ampak pri dnevnih prehodih: kdo zjutraj uporablja kopalnico, kje pristanejo šolske torbe, koliko ljudi kuha, kam gre športna oprema in kaj se zgodi, ko otroci zrastejo.",
        sections: [
          {
            heading: "Odrasli in otroci niso ena številka",
            body: "Zato v Home DNA™ ločimo število odraslih in otrok. Štirje odrasli imajo drugačne potrebe kot dva odrasla in dva majhna otroka, čeprav je skupno število oseb enako. Razlika vpliva na višine, dostopnost, shranjevanje, varnost in prihodnje prilagoditve.",
          },
          {
            heading: "Rutine določajo lokacijo shranjevanja",
            body: "Če otroci vsak dan prihajajo skozi isti vhod, morajo biti čevlji, jakne, torbe in športna oprema rešeni v predsobi ali bližnjem utilityju. Če se stvari shranjujejo daleč od mesta uporabe, se bodo v praksi kopičile na prehodnih površinah.",
          },
          {
            heading: "Pohištvo mora dopuščati razvoj",
            body: "Otroška soba, ki danes potrebuje prostor za igro, bo čez nekaj let potrebovala večjo pisalno površino, drugo organizacijo garderobe in drugačno osvetlitev. Modularna notranjost omar in nevtralna osnovna razporeditev podaljšata življenjsko dobo pohištva.",
          },
        ],
      },
      hr: {
        slug: "home-dna-za-obitelji",
        title: "Home DNA za obitelji – kako životne navike utječu na tlocrt i namještaj",
        description:
          "Kako broj odraslih i djece, jutarnje rutine, igračke, kuhanje, rad od kuće i buduće promjene oblikuju dom.",
        intro:
          "Kod obiteljskog doma funkcionalni problemi često nastaju iz svakodnevnih rutina, a ne iz odabranog stila.",
        sections: [
          {
            heading: "Odrasli i djeca nisu isti podatak",
            body: "U Home DNA™ odvojeno pitamo broj odraslih i djece. Dva odrasla i dvoje djece imaju drugačije potrebe od četiri odrasle osobe, iako je ukupan broj isti.",
          },
          {
            heading: "Rutine određuju mjesto spremanja",
            body: "Cipele, jakne, torbe, igračke i sportska oprema trebaju biti spremljeni blizu mjesta na kojem se svakodnevno koriste.",
          },
          {
            heading: "Namještaj treba pratiti razvoj",
            body: "Dječja soba s vremenom prelazi iz prostora za igru u prostor za učenje. Prilagodljive police, ormari i radne površine produžuju vijek rješenja.",
          },
        ],
      },
      en: {
        slug: "home-dna-for-families",
        title: "Home DNA for families – how everyday habits shape layout and furniture",
        description:
          "How the number of adults and children, morning routines, toys, cooking, home working and future changes influence interior planning.",
        intro:
          "In a family home, many functional problems come from everyday routines rather than visual style: who uses the bathroom in the morning, where school bags land and what happens as children grow.",
        sections: [
          {
            heading: "Adults and children are not one number",
            body: "Home DNA™ records adults and children separately. Two adults with two young children need a different home from four adults even though the total number of people is the same.",
          },
          {
            heading: "Routines determine storage location",
            body: "Shoes, coats, school bags, toys and sports equipment should be stored close to where they are used. Otherwise they tend to accumulate on circulation surfaces.",
          },
          {
            heading: "Furniture should adapt over time",
            body: "A child's room evolves from play to study. Adjustable wardrobe interiors, shelves and work surfaces allow the room to change without replacing all of the furniture.",
          },
        ],
      },
    },
  },
];

export function getArticleBySlug(locale: Locale, slug: string) {
  return aiSearchArticles.find((article) => article.localized[locale].slug === slug);
}

export function getArticleById(id: AiSearchArticleId) {
  return aiSearchArticles.find((article) => article.id === id);
}

export function articlePath(article: AiSearchArticle, locale: Locale): string {
  const prefix = locale === "sl" ? "" : `/${locale}`;
  return `${prefix}/vsebine/${article.localized[locale].slug}`;
}
