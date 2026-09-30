import type { SiteContent } from "@/content";

export const sv: SiteContent = {
  brand: {
    initials: "M&M",
    name: "M&M Property",
    title: "Bostäder till salu och uthyrning på Costa del Sol",
    phone: "+34 653 223 015",
    phoneHref: "tel:+34653223015",
    phoneAria: "Ring +34 653 223 015",
  },
  nav: [
    { label: "Bostäder", href: "/homes" },
    { label: "Områden", href: "/areas" },
    { label: "Så arbetar vi", href: "/sell" },
    { label: "Om oss", href: "/about" },
    { label: "Kontakt", href: "/contact" },
  ],
  hero: {
    titleBefore: "Bostäder på",
    titleItalic: "Costa del Sol.",
    description:
      "Lägenheter, hus och villor till salu och uthyrning, från Benalmádena till Marbella.",
    cta: "Se utbudet",
    ctaHref: "https://www.mmproperty.es/en",
    scrollLabel: "SCROLLA FÖR ATT SE",
    stats: [
      { value: "29+", label: "År vid kusten", href: "/about" },
      { value: "Köpa · Sälja · Hyra", label: "Kontakta kontoret", href: "/contact" },
      { value: "Benalmádena", label: "Kontor vid kusten", href: "" },
    ],
  },
  media: {
    src: "/hero-bg.mp4?v=2",
    poster: "/hero-poster.jpg?v=3",
    logo: "/mm-property-logo.png?v=3",
    places: [
      { src: "/media/costa-marbella.jpg?v=2", label: "Marbella" },
      { src: "/media/costa-fuengirola.jpg?v=2", label: "Fuengirola" },
      { src: "/media/costa-mijas.jpg?v=2", label: "Mijas Pueblo" },
    ],
  },
  experience: {
    index: "01",
    eyebrow: "BYRÅN",
    headline: [
      [
        { text: "M&M Property", tone: "strong" },
        { text: " hittar rätt hem", tone: "muted" },
      ],
      [
        { text: "och stannar med er till", tone: "muted" },
        { text: " notarien.", tone: "strong" },
      ],
      [{ text: "Villor, lägenheter och nyproduktion", tone: "strong" }],
      [{ text: "i Marbella, Fuengirola,", tone: "muted" }],
      [{ text: "Benalmádena och Mijas.", tone: "strong" }],
    ],
    body: "En mäklarbyrå på Costa del Sol med mer än 29 års erfarenhet av att sälja alla typer av bostäder. Sök, rådgivning och köp sköts tillsammans, oavsett om ni flyttar hit eller investerar.",
    cta: "Så arbetar vi",
    ctaHref: "/sell",
    images: [
      {
        src: "/listings/mijas-pueblo.jpg?v=2",
        alt: "Villa med pool i Mijas Pueblo",
        label: "Mijas Pueblo",
        caption: "Villa till salu",
      },
      {
        src: "/media/costa-marbella.jpg?v=2",
        alt: "Playa de la Fontanilla, Marbella",
        label: "Marbella",
        caption: "Playa de la Fontanilla",
      },
    ],
  },
  paths: {
    index: "02",
    eyebrow: "SÖKNINGEN",
    title: "Ert nästa hem börjar här",
    description:
      "Upptäck ett urval nyproduktion, lyxvillor och inflyttningsklara lägenheter på Costa del Sol.",
    items: [
      {
        title: "Nyproduktion",
        text: "Ett urval av Costa del Sols bästa nyproduktionsprojekt.",
        image: "/listings/development.jpg?v=1",
        alt: "Vardagsrum i ett nyproduktionsprojekt på Costa del Sol",
        href: "https://www.mmproperty.es/en/flat-for-sale-in-el-higueron-fuengirola/279799/s2",
        points: ["Märkesresidens", "Investeringspotential", "Hög avkastning vid inflyttning"],
      },
      {
        title: "Exklusiva villor",
        text: "De finaste villorna i Costa del Sols mest prestigefyllda lägen.",
        image: "/listings/villas.webp?v=1",
        alt: "Villa i sluttningen med pool på Costa del Sol",
        href: "https://www.mmproperty.es/en/villa-for-sale-in-mijas-pueblo-pena-blanquilla/273381/s2",
        points: ["Prime-lägen", "Prestigehem", "Brett villautbud"],
      },
      {
        title: "Begagnade bostäder",
        text: "Lägenheter redo att flytta in i, i de bästa områdena på Costa del Sol.",
        image: "/listings/Resale.webp?v=1",
        alt: "Sovrum i en begagnad lägenhet på Costa del Sol",
        href: "https://www.mmproperty.es/en/flat-for-sale-in-fuengirola/279182/s2",
        points: ["Inflyttningsklart", "Inhägnade områden", "Bästa lägena"],
      },
      {
        title: "Hyresbostäder",
        text: "Ett urval hyreslägenheter i Costa del Sols främsta områden.",
        image: "/listings/rental.jpg?v=1",
        alt: "Vardagsrum i en hyreslägenhet på Costa del Sol",
        href: "https://www.mmproperty.es/en",
        points: ["Lyxbostäder", "Kort- och långtidshyra", "Exklusiva områden"],
      },
    ],
  },
  processSection: {
    index: "03",
    eyebrow: "Processen",
    title: "Så arbetar vi",
    background: "/section2.png",
  },
  process: [
    {
      number: "01",
      tag: "SÖK",
      title: "Hitta rätt hem",
      description:
        "Lägenheter, hus, lyxvillor och radhus, begagnat eller nyproduktion, valda för hur ni vill bo eller investera.",
    },
    {
      number: "02",
      tag: "RÅD",
      title: "Pris och nästa steg",
      description:
        "Säljer ni? Vi råder om marknadspriset och stegen för att annonsera, och tar fram foto och video.",
    },
    {
      number: "03",
      tag: "AVSLUT",
      title: "Ända till notarien",
      description:
        "Samma team följer köpet eller försäljningen tills kontraktet är underskrivet.",
    },
  ],
  report: {
    index: "04",
    eyebrow: "ER BOSTAD",
    title: "Ett hem att bo i, eller ett hem att investera i.",
    description:
      "Permanentboende eller en investering på Costa del Sol. Utbudet går från Benalmádena Pueblo till El Higuerón, inklusive bostäder under uppförande.",
    sample: {
      brand: "M&M Property",
      docLabel: "Till salu nu",
      property: "El Higuerón, Fuengirola",
      propertyType: "Lägenhet · 2 sov · 116 m²",
      rangeLow: "€495 000",
      rangeHigh: "",
      rangeLabel: "Utgångspris",
      strengthsLabel: "Styrkor",
      strengths: [
        "Privat trädgård och en 36 m² terrass",
        "Pool, solarium och gemensamma trädgårdar",
        "El Higuerón, med spa, sportklubb och beach club i närheten",
      ],
      limitation:
        "Priserna tas från det aktuella utbudet och kan ändras. Bekräfta den aktuella annonsen på mmproperty.es.",
    },
    floaters: [
      { label: "ÅR", value: "29+", position: "left-top" },
      { label: "KONTOR", value: "Benalmádena", position: "right-top" },
      { label: "NY", value: "Produktion", position: "left-bottom" },
      { label: "BEGAGNAT", value: "Utbud", position: "right-bottom" },
    ],
    cta: "Se alla bostäder",
    ctaHref: "https://www.mmproperty.es/en",
  },
  feature: {
    index: "05",
    eyebrow: "ETT HEM",
    place: "Mijas Pueblo",
    title: "En villa med pool, ovanför kusten.",
    text: "Fyra sovrum i Mijas Pueblo. Samma kontor som annonserar den följer köparen genom pris, visning och kontrakt.",
    image: "/listings/mijas-pueblo.jpg?v=2",
    imageAlt: "Villa med pool i Mijas Pueblo",
    facts: [
      { label: "Sovrum", value: "4" },
      { label: "Ute", value: "Pool" },
      { label: "Pris", value: "1.965.000 €" },
    ],
    cta: "Se denna bostad",
    ctaHref:
      "https://www.mmproperty.es/en/villa-for-sale-in-mijas-pueblo-pena-blanquilla/273381/s2",
  },
  listings: {
    index: "06",
    eyebrow: "UTBUD",
    title: "Lägenheter, villor och nyproduktion längs kusten.",
    description:
      "Ett urval från det aktuella utbudet. Priserna ska bekräftas på mmproperty.es.",
    items: [
      {
        id: "higueron",
        area: "fuengirola",
        title: "Lägenhet till salu i El Higuerón (Fuengirola)",
        meta: "116 m² · 2 sov · 495.000 €",
        image: "/listings/higueron.jpg?v=2",
        href: "https://www.mmproperty.es/en/flat-for-sale-in-el-higueron-fuengirola/279799/s2",
      },
      {
        id: "fuengirola",
        area: "fuengirola",
        title: "Lägenhet till salu i Fuengirola",
        meta: "123 m² · 3 sov · 1.051.500 €",
        image: "/listings/fuengirola.jpg?v=2",
        href: "https://www.mmproperty.es/en/flat-for-sale-in-fuengirola/279182/s2",
      },
      {
        id: "mijas-pueblo",
        area: "mijas",
        title: "Villa till salu i Mijas Pueblo",
        meta: "4 sov · 1.965.000 €",
        image: "/listings/mijas-pueblo.jpg?v=2",
        href: "https://www.mmproperty.es/en/villa-for-sale-in-mijas-pueblo-pena-blanquilla/273381/s2",
      },
      {
        id: "monteros",
        area: "marbella",
        title: "Lägenhet till salu i Alto de los Monteros",
        meta: "125 m² · 3 sov · 835.000 €",
        image: "/listings/monteros.jpg?v=2",
        href: "https://www.mmproperty.es/en/flat-for-sale-in-alto-de-los-monteros-marbella/273145/s2",
      },
      {
        id: "monteros-two",
        area: "marbella",
        title: "Lägenhet till salu i Alto de los Monteros",
        meta: "98 m² · 2 sov · 530.000 €",
        image: "/listings/monteros-2.jpg?v=2",
        href: "https://www.mmproperty.es/en/flat-for-sale-in-alto-de-los-monteros-marbella/273116/s2",
      },
      {
        id: "mijas-hipodromo",
        area: "mijas",
        title: "Lägenhet till salu i Cerrado del Águila",
        meta: "117 m² · 3 sov · 425.000 €",
        image: "/listings/mijas-aguila.jpg?v=2",
        href: "https://www.mmproperty.es/en/flat-for-sale-in-hipodromo-cerrado-del-aguila-mijas/273062/s2",
      },
    ],
  },
  testimonials: {
    index: "07",
    eyebrow: "KUSTEN",
    titleBefore: "Orter vi",
    titleItalic: "arbetar i",
    description:
      "Marbella, Fuengirola, Benalmádena, Mijas, och även Torremolinos och Estepona.",
    moreLabel: "Varje ort",
    moreHref: "/areas",
    image: "/media/costa-marbella.jpg?v=2",
    imageAlt: "Playa de la Fontanilla, Marbella",
    items: [
      {
        id: "t1",
        slug: "marbella",
        quote:
          "Lyxvillor till salu, bland annat Alto de los Monteros och den bredare Marbellamarknaden.",
        name: "Marbella",
        role: "Villor och lägenheter",
        rating: 5,
      },
      {
        id: "t2",
        slug: "fuengirola",
        quote:
          "El Higuerón, strandnära hem och nyproduktion cirka 150 meter från havet.",
        name: "Fuengirola",
        role: "Nyproduktion och begagnat",
        rating: 5,
      },
      {
        id: "t3",
        slug: "benalmadena",
        quote:
          "Pueblo och Costa, inklusive nya hem en kort promenad från stranden. Kontoret ligger här.",
        name: "Benalmádena",
        role: "Byråns hemort",
        rating: 5,
      },
      {
        id: "t4",
        slug: "mijas",
        quote:
          "Mijas Costa, La Cala och Mijas Pueblo, från radhus vid golfen till villor i sluttningen.",
        name: "Mijas",
        role: "Costa och pueblo",
        rating: 5,
      },
      {
        id: "t5",
        slug: "torremolinos",
        quote: "Fler bostäder längs bukten, mellan Málaga och Benalmádena.",
        name: "Torremolinos",
        role: "På samma kust",
        rating: 5,
      },
      {
        id: "t6",
        slug: "estepona",
        quote: "Bostäder längre västerut, när sökningen går förbi Marbella.",
        name: "Estepona",
        role: "Väster om Marbella",
        rating: 5,
      },
    ],
  },
  advisor: {
    eyebrow: "KONTORET",
    name: "M&M Property",
    title: "Mäklare på Costa del Sol",
    description:
      "Kontoret ligger i Benalmádena. Samma team råder köpare och säljare från första visningen till notarien.",
    cta: "Prata med kontoret",
  },
  faq: {
    index: "08",
    eyebrow: "FAQ",
    title: "Vanliga frågor",
    subtitle: "Köp, försäljning eller en fråga om en bostad.",
    cta: "Kontakta kontoret",
    ctaHref: "/contact",
    footerNote: "Benalmádena · Costa del Sol",
    image: "/media/costa-mijas.jpg?v=2",
    imageAlt: "Mijas Pueblo, i sluttningen ovanför kusten",
    items: [
      {
        question: "Vad gör M&M Property?",
        answer:
          "Köp och försäljning av lägenheter, hus, lyxvillor och radhus på Costa del Sol, både begagnat och nyproduktion. Hyresbostäder finns också på mmproperty.es.",
      },
      {
        question: "Var ligger kontoret?",
        answer:
          "Avd. de Tívoli, Centro Comercial Las Ventas, Local 48A, 29630 Benalmádena, Málaga.",
      },
      {
        question: "Vilka orter täcker ni?",
        answer:
          "Marbella, Fuengirola, Benalmádena och Mijas Costa, plus bostäder i Torremolinos och Estepona.",
      },
      {
        question: "Jag vill sälja mitt hem. Vad händer?",
        answer:
          "Vi råder om marknadspriset och stegen för att sälja, tar sedan foto och video och annonserar bostaden.",
      },
      {
        question: "Hur frågar jag om en bostad?",
        answer:
          "Ring +34 653 223 015, +34 951 542 193 eller +34 648 766 318, eller skriv till info@mmproperty.es. Priser på den här sidan ska bekräftas på den live sajten.",
      },
    ],
  },
  contact: {
    index: "09",
    eyebrow: "KONTAKT",
    tagline: "Köp och försäljning · Costa del Sol",
    line1Light: "Prata med kontoret i",
    line1Muted: "Benalmádena",
    line2Before: "redan",
    line2After: "idag",
    cta: "Mejla oss",
    ctaHref: "mailto:info@mmproperty.es",
    body: "Avd. de Tívoli, C.C. Las Ventas, Local 48A, 29630 Benalmádena. +34 653 223 015.",
    pageTitle: "Kontoret i Benalmádena.",
    pageText:
      "Ring, skriv eller lämna era uppgifter. Samma team stannar med er från första frågan till notarien.",
    writeLabel: "Skriv till kontoret",
    address: ["Avd. de Tívoli, C.C. Las Ventas", "Local 48A", "29630 Benalmádena, Málaga"],
    image: "/section2.png",
    imageAlt: "Terrass på kvällen med utsikt över kusten",
    email: "info@mmproperty.es",
    whatsapp: {
      phone: "34653223015",
      label: "WhatsApp",
      message: "Hej, jag vill veta mer om en bostad hos M&M Property.",
    },
    socials: [
      { label: "WhatsApp", handle: "+34 653 223 015", href: "https://wa.me/34653223015" },
      { label: "Instagram", handle: "@mmpropertyrealestate", href: "https://www.instagram.com/mmpropertyrealestate/" },
      { label: "Facebook", handle: "M&M Property", href: "https://www.facebook.com/share/19nwa7Rp6i/?mibextid=wwXIfr" },
      { label: "TikTok", handle: "@mmproperty.io", href: "https://www.tiktok.com/@mmproperty.io" },
      { label: "LinkedIn", handle: "M&M Property", href: "https://www.linkedin.com/in/mm-property-7b792843b/" },
    ],
    chips: ["Köp & försäljning", "Costa del Sol"],
    footerNav: [
      { label: "Bostäder", href: "/homes" },
      { label: "Områden", href: "/areas" },
      { label: "Så arbetar vi", href: "/sell" },
      { label: "Om oss", href: "/about" },
      { label: "FAQ", href: "/faq" },
      { label: "Kontakt", href: "/contact" },
    ],
    footerNote: "M&M Property · Benalmádena",
    photoCredit:
      "Kustfoton: Los Boliches, Fuengirola · Playa de la Fontanilla, Marbella · Mijas Pueblo · Linbanan i Benalmádena (robbie jim, CC BY 2.0) · Playamar, Torremolinos (Hans Olav Lien, CC BY-SA 3.0) · Estepona (kallerna, CC BY-SA 4.0). Wikimedia Commons.",
  },
  pages: {
    homeLabel: "Hem",
    backHome: "Tillbaka till startsidan",
    backToAreas: "Alla orter",
    emptyHomes:
      "Fråga kontoret om aktuella bostäder på den här orten. Den live listan finns på mmproperty.es.",
    portfolio: "Öppna det live utbudet",
    homes: {
      eyebrow: "BOSTÄDER",
      title: "Bostäder till salu på Costa del Sol.",
      description:
        "Lägenheter, villor och nyproduktion från kontoret i Benalmádena. Detta är ett urval. Bekräfta priset i den live annonsen.",
      seoTitle: "Bostäder till salu på Costa del Sol | M&M Property",
      seoDescription:
        "Lägenheter, villor och nyproduktion till salu i Marbella, Fuengirola, Benalmádena och Mijas. M&M Property, kontor i Benalmádena.",
      viewListing: "Se på mmproperty.es",
      links: [
        { label: "Alla bostäder", href: "https://www.mmproperty.es/en/properties/s1/1907" },
        { label: "Till salu", href: "https://www.mmproperty.es/en/browser/s1?quick_search[tof]=1" },
        { label: "Till hyra", href: "https://www.mmproperty.es/en/browser/s1?quick_search[tof]=2" },
      ],
    },
    areas: {
      eyebrow: "KUSTEN",
      title: "Orter vi arbetar i.",
      description:
        "Kontoret ligger i Benalmádena. Sökningen går från Torremolinos till Estepona.",
      seoTitle: "Orter på Costa del Sol | M&M Property",
      seoDescription:
        "M&M Property arbetar i Marbella, Fuengirola, Benalmádena, Mijas, Torremolinos och Estepona. Kontor i Benalmádena.",
      towns: [
        {
          slug: "marbella",
          name: "Marbella",
          role: "Villor och lägenheter",
          text: "Lyxvillor till salu, bland annat Alto de los Monteros och den bredare Marbellamarknaden.",
          image: "/media/costa-marbella.jpg?v=2",
          imageAlt: "Playa de la Fontanilla, Marbella",
          seoTitle: "Bostäder till salu i Marbella | M&M Property",
          seoDescription:
            "Villor och lägenheter till salu i Marbella, inklusive Alto de los Monteros. M&M Property, Benalmádena.",
        },
        {
          slug: "fuengirola",
          name: "Fuengirola",
          role: "Nyproduktion och begagnat",
          text: "El Higuerón, strandnära hem och nyproduktion cirka 150 meter från havet.",
          image: "/media/costa-fuengirola.jpg?v=2",
          imageAlt: "Los Boliches, Fuengirola",
          seoTitle: "Bostäder till salu i Fuengirola | M&M Property",
          seoDescription:
            "Lägenheter och nyproduktion till salu i Fuengirola och El Higuerón. M&M Property, Benalmádena.",
        },
        {
          slug: "benalmadena",
          name: "Benalmádena",
          role: "Byråns hemort",
          text: "Pueblo och Costa, inklusive nya hem en kort promenad från stranden. Kontoret ligger här, i C.C. Las Ventas på Avenida de Tívoli.",
          image: "/media/costa-benalmadena.jpg?v=1",
          imageAlt: "Linbanan i Benalmádena ovanför kusten",
          seoTitle: "Bostäder till salu i Benalmádena | M&M Property",
          seoDescription:
            "M&M Propertys kontor ligger i Benalmádena. Bostäder till salu i Benalmádena Pueblo och Benalmádena Costa.",
        },
        {
          slug: "mijas",
          name: "Mijas",
          role: "Costa och pueblo",
          text: "Mijas Costa, La Cala och Mijas Pueblo, från radhus vid golfen till villor i sluttningen.",
          image: "/media/costa-mijas.jpg?v=2",
          imageAlt: "Mijas Pueblo",
          seoTitle: "Bostäder till salu i Mijas | M&M Property",
          seoDescription:
            "Villor och lägenheter till salu i Mijas Pueblo, Mijas Costa och La Cala. M&M Property, Benalmádena.",
        },
        {
          slug: "torremolinos",
          name: "Torremolinos",
          role: "På samma kust",
          text: "Fler bostäder längs bukten, mellan Málaga och Benalmádena.",
          image: "/media/costa-torremolinos.jpg?v=1",
          imageAlt: "Playamar-stranden i Torremolinos",
          seoTitle: "Bostäder till salu i Torremolinos | M&M Property",
          seoDescription:
            "Bostäder till salu i Torremolinos, mellan Málaga och Benalmádena. Fråga M&M Propertys kontor.",
        },
        {
          slug: "estepona",
          name: "Estepona",
          role: "Väster om Marbella",
          text: "Bostäder längre västerut, när sökningen går förbi Marbella.",
          image: "/media/costa-estepona.jpg?v=1",
          imageAlt: "Flygvy över Estepona och hamnen",
          seoTitle: "Bostäder till salu i Estepona | M&M Property",
          seoDescription:
            "Bostäder till salu i Estepona, väster om Marbella. M&M Property, kontor i Benalmádena.",
        },
      ],
    },
    sell: {
      eyebrow: "SÅ ARBETAR VI",
      title: "Från första visningen till notarien.",
      description:
        "Samma team i Benalmádena sköter sökningen, priset och underskriften, oavsett om ni köper eller säljer.",
      seoTitle: "Hur vi köper och säljer bostäder | M&M Property",
      seoDescription:
        "M&M Property råder om priset, tar fram fotona och följer köpet eller försäljningen till notarien. Kontor i Benalmádena.",
      imageAlt: "Terrass på kvällen med utsikt över kusten",
    },
    contact: {
      seoTitle: "Kontakta kontoret i Benalmádena | M&M Property",
      seoDescription:
        "Ring +34 653 223 015 eller mejla info@mmproperty.es. M&M Property, Avenida de Tívoli, C.C. Las Ventas, Benalmádena.",
    },
    faq: {
      seoTitle: "Frågor om att köpa eller sälja | M&M Property",
      seoDescription:
        "Vad M&M Property gör, var kontoret ligger, och vilka orter på Costa del Sol byrån täcker.",
    },
    about: {
      eyebrow: "FÖRETAG",
      title: "En mäklarbyrå på Costa del Sol.",
      seoTitle: "Om M&M Property | Costa del Sol",
      seoDescription:
        "M&M Property är en mäklarbyrå på Costa del Sol med mer än 29 års erfarenhet av att sälja alla typer av bostäder, från sökningen till undertecknandet hos notarien.",
      image: "/section2.png",
      imageAlt: "Terrass på kvällen med utsikt över Costa del Sol",
      paragraphs: [
        "M&M Property är en fastighetsmäklare specialiserad på Costa del Sol, med mer än 29 års erfarenhet av att sälja bostäder av alla slag. Tjänsten går från att hitta rätt hem för varje kund, via rådgivning, till avslut av köpet genom undertecknande av köpebrevet hos notarien.",
        "Kontoret erbjuder lägenheter, hus, lyxvillor, radhus och parhus, både begagnat och ett brett utbud av nyproduktion.",
        "Oavsett om ni söker en bostad att bo i eller att investera i på Costa del Sol hjälper kontoret er att hitta rätt. Utbudet omfattar lyxvillor till salu i Marbella, lägenheter i Benalmádena, nyproduktion i Fuengirola, bostäder i Mijas Costa och andra objekt i Torremolinos och Estepona.",
        "Äger ni en bostad och vill anlita en pålitlig byrå för försäljningen ger vi råd om marknadspriset och alla steg i försäljningen, och tar fram foton och video som används för att annonsera bostaden.",
      ],
      close: "Tveka inte att kontakta oss. Vi ser fram emot att träffa er.",
      phones: [
        { label: "+34 653 223 015", href: "tel:+34653223015" },
        { label: "+34 951 542 193", href: "tel:+34951542193" },
        { label: "+34 648 766 318", href: "tel:+34648766318" },
      ],
      email: "info@mmproperty.es",
      address: ["Avd. de Tívoli", "Centro comercial Las Ventas, Local 48A", "29630 Benalmádena"],
      contactLabel: "Kontoret",
    },
    notFound: {
      title: "Den här sidan finns inte på sajten.",
      description: "Startsidan, bostäderna och orterna finns kvar.",
      cta: "Tillbaka till startsidan",
    },
  },
  offer: {
    eyebrow: "TIDIG ÅTKOMST",
    title: "Bostäder på Costa del Sol.",
    text: "Lämna er e-post och gå till det live utbudet. Vi använder den bara för att berätta om nya bostäder.",
    formIntro:
      "Skicka era uppgifter så kan kontoret ringa eller mejla om bostäder ni är intresserade av.",
    error: "Vi kunde inte spara uppgifterna. Försök igen.",
    sent: "Sparat. Kontoret kan nå er på det här numret eller mejlet.",
    nameLabel: "Namn",
    namePlaceholder: "Ert namn",
    phoneLabel: "Telefon",
    phonePlaceholder: "+34 …",
    emailLabel: "E-post",
    placeholder: "ni@email.com",
    noteLabel: "Vad letar ni efter?",
    notePlaceholder: "En lägenhet i Fuengirola, en villa i Mijas…",
    submit: "Se bostäder",
    send: "Skicka",
    href: "https://www.mmproperty.es/en",
    close: "Stäng",
  },
};
