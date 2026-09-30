import type { SiteContent } from "@/content";

export const de: SiteContent = {
  brand: {
    initials: "M&M",
    name: "M&M Property",
    title: "Wohnungen zum Kauf und zur Miete an der Costa del Sol",
    phone: "+34 653 223 015",
    phoneHref: "tel:+34653223015",
    phoneAria: "Anrufen unter +34 653 223 015",
  },
  nav: [
    { label: "Wohnungen", href: "/homes" },
    { label: "Gebiete", href: "/areas" },
    { label: "So arbeiten wir", href: "/sell" },
    { label: "Über uns", href: "/about" },
    { label: "Kontakt", href: "/contact" },
  ],
  hero: {
    titleBefore: "Wohnungen an der",
    titleItalic: "Costa del Sol.",
    description:
      "Apartments, Häuser und Villen zum Kauf und zur Miete, von Benalmádena bis Marbella.",
    cta: "Angebot ansehen",
    ctaHref: "https://www.mmproperty.es/en",
    scrollLabel: "SCROLLEN ZUM ENTDECKEN",
    stats: [
      { value: "29+", label: "Jahre an der Küste", href: "/about" },
      { value: "Kaufen · Verkaufen · Mieten", label: "Büro kontaktieren", href: "/contact" },
      { value: "Benalmádena", label: "Büro an der Küste", href: "" },
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
    eyebrow: "DAS BÜRO",
    headline: [
      [
        { text: "M&M Property", tone: "strong" },
        { text: " findet das richtige Zuhause", tone: "muted" },
      ],
      [
        { text: "und bleibt bei Ihnen bis", tone: "muted" },
        { text: " zum Notar.", tone: "strong" },
      ],
      [{ text: "Villen, Apartments und Neubau", tone: "strong" }],
      [{ text: "in Marbella, Fuengirola,", tone: "muted" }],
      [{ text: "Benalmádena und Mijas.", tone: "strong" }],
    ],
    body: "Ein Maklerbüro an der Costa del Sol mit mehr als 29 Jahren Erfahrung im Verkauf jeder Art von Immobilie. Suche, Beratung und Kauf laufen zusammen, ob Sie hierherziehen oder investieren.",
    cta: "So arbeiten wir",
    ctaHref: "/sell",
    images: [
      {
        src: "/listings/mijas-pueblo.jpg?v=2",
        alt: "Villa mit Pool in Mijas Pueblo",
        label: "Mijas Pueblo",
        caption: "Villa zum Verkauf",
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
    eyebrow: "DIE SUCHE",
    title: "Ihr nächstes Zuhause beginnt hier",
    description:
      "Entdecken Sie eine Auswahl an Neubau, Luxusvillen und bezugsfertigen Apartments an der Costa del Sol.",
    items: [
      {
        title: "Neubau",
        text: "Eine Auswahl der besten Neubauprojekte an der Costa del Sol.",
        image: "/listings/development.jpg?v=1",
        alt: "Wohnzimmer in einem Neubauprojekt an der Costa del Sol",
        href: "https://www.mmproperty.es/en/flat-for-sale-in-el-higueron-fuengirola/279799/s2",
        points: ["Markenresidenzen", "Investitionspotenzial", "Hohe Rendite bei Fertigstellung"],
      },
      {
        title: "Exklusive Villen",
        text: "Die schönsten Villen in den prestigeträchtigsten Lagen der Costa del Sol.",
        image: "/listings/villas.webp?v=1",
        alt: "Hangvilla mit Pool an der Costa del Sol",
        href: "https://www.mmproperty.es/en/villa-for-sale-in-mijas-pueblo-pena-blanquilla/273381/s2",
        points: ["Toplagen", "Prestigeimmobilien", "Großes Villenangebot"],
      },
      {
        title: "Bestandsimmobilien",
        text: "Apartments zum direkten Einzug in den besten Lagen der Costa del Sol.",
        image: "/listings/Resale.webp?v=1",
        alt: "Schlafzimmer in einer Bestandsimmobilie an der Costa del Sol",
        href: "https://www.mmproperty.es/en/flat-for-sale-in-fuengirola/279182/s2",
        points: ["Sofort bezugsfertig", "Geschlossene Anlagen", "Toplagen"],
      },
      {
        title: "Mietwohnungen",
        text: "Eine Auswahl an Mietapartments in den wichtigsten Gebieten der Costa del Sol.",
        image: "/listings/rental.jpg?v=1",
        alt: "Wohnzimmer in einem Mietapartment an der Costa del Sol",
        href: "https://www.mmproperty.es/en",
        points: ["Luxusimmobilien", "Kurz- und Langzeit", "Exklusive Anlagen"],
      },
    ],
  },
  processSection: {
    index: "03",
    eyebrow: "Der Ablauf",
    title: "So arbeiten wir",
    background: "/section2.png",
  },
  process: [
    {
      number: "01",
      tag: "SUCHE",
      title: "Die richtige Immobilie finden",
      description:
        "Apartments, Häuser, Luxusvillen und Reihenhäuser, Bestand oder Neubau, ausgewählt zum Wohnen oder Investieren.",
    },
    {
      number: "02",
      tag: "BERATUNG",
      title: "Preis und nächste Schritte",
      description:
        "Verkaufen? Wir beraten zum Marktpreis und zu den Schritten für die Inserierung und erstellen Fotos und Video.",
    },
    {
      number: "03",
      tag: "ABSCHLUSS",
      title: "Bis zum Notar",
      description:
        "Dasselbe Team bleibt beim Kauf oder Verkauf, bis die Urkunde unterschrieben ist.",
    },
  ],
  report: {
    index: "04",
    eyebrow: "IHRE IMMOBILIE",
    title: "Ein Zuhause zum Wohnen oder zum Investieren.",
    description:
      "Hauptwohnsitz oder eine Investition an der Costa del Sol. Das Angebot reicht von Benalmádena Pueblo bis El Higuerón, einschließlich Immobilien im Bau.",
    sample: {
      brand: "M&M Property",
      docLabel: "Jetzt zum Verkauf",
      property: "El Higuerón, Fuengirola",
      propertyType: "Apartment · 2 SZ · 116 m²",
      rangeLow: "€495.000",
      rangeHigh: "",
      rangeLabel: "Kaufpreis",
      strengthsLabel: "Stärken",
      strengths: [
        "Privatgarten und eine 36 m² große Terrasse",
        "Pool, Solarium und Gemeinschaftsgärten",
        "El Higuerón, mit Spa, Sportclub und Beachclub in der Nähe",
      ],
      limitation:
        "Preise stammen aus dem aktuellen Angebot und können sich ändern. Bestätigen Sie die aktuelle Anzeige auf mmproperty.es.",
    },
    floaters: [
      { label: "JAHRE", value: "29+", position: "left-top" },
      { label: "BÜRO", value: "Benalmádena", position: "right-top" },
      { label: "NEU", value: "Bau", position: "left-bottom" },
      { label: "BESTAND", value: "Angebot", position: "right-bottom" },
    ],
    cta: "Alle Wohnungen",
    ctaHref: "https://www.mmproperty.es/en",
  },
  feature: {
    index: "05",
    eyebrow: "EINE IMMOBILIE",
    place: "Mijas Pueblo",
    title: "Eine Villa mit Pool, oberhalb der Küste.",
    text: "Vier Schlafzimmer in Mijas Pueblo. Dasselbe Büro, das die Immobilie anbietet, begleitet den Käufer bei Preis, Besichtigung und Urkunde.",
    image: "/listings/mijas-pueblo.jpg?v=2",
    imageAlt: "Villa mit Pool in Mijas Pueblo",
    facts: [
      { label: "Schlafzimmer", value: "4" },
      { label: "Außenbereich", value: "Pool" },
      { label: "Preis", value: "1.965.000 €" },
    ],
    cta: "Diese Immobilie ansehen",
    ctaHref:
      "https://www.mmproperty.es/en/villa-for-sale-in-mijas-pueblo-pena-blanquilla/273381/s2",
  },
  listings: {
    index: "06",
    eyebrow: "ANGEBOT",
    title: "Apartments, Villen und Neubau entlang der Küste.",
    description:
      "Eine Auswahl aus dem aktuellen Angebot. Preise bestätigen Sie auf mmproperty.es.",
    items: [
      {
        id: "higueron",
        area: "fuengirola",
        title: "Apartment zum Verkauf in El Higuerón (Fuengirola)",
        meta: "116 m² · 2 SZ · 495.000 €",
        image: "/listings/higueron.jpg?v=2",
        href: "https://www.mmproperty.es/en/flat-for-sale-in-el-higueron-fuengirola/279799/s2",
      },
      {
        id: "fuengirola",
        area: "fuengirola",
        title: "Apartment zum Verkauf in Fuengirola",
        meta: "123 m² · 3 SZ · 1.051.500 €",
        image: "/listings/fuengirola.jpg?v=2",
        href: "https://www.mmproperty.es/en/flat-for-sale-in-fuengirola/279182/s2",
      },
      {
        id: "mijas-pueblo",
        area: "mijas",
        title: "Villa zum Verkauf in Mijas Pueblo",
        meta: "4 SZ · 1.965.000 €",
        image: "/listings/mijas-pueblo.jpg?v=2",
        href: "https://www.mmproperty.es/en/villa-for-sale-in-mijas-pueblo-pena-blanquilla/273381/s2",
      },
      {
        id: "monteros",
        area: "marbella",
        title: "Apartment zum Verkauf in Alto de los Monteros",
        meta: "125 m² · 3 SZ · 835.000 €",
        image: "/listings/monteros.jpg?v=2",
        href: "https://www.mmproperty.es/en/flat-for-sale-in-alto-de-los-monteros-marbella/273145/s2",
      },
      {
        id: "monteros-two",
        area: "marbella",
        title: "Apartment zum Verkauf in Alto de los Monteros",
        meta: "98 m² · 2 SZ · 530.000 €",
        image: "/listings/monteros-2.jpg?v=2",
        href: "https://www.mmproperty.es/en/flat-for-sale-in-alto-de-los-monteros-marbella/273116/s2",
      },
      {
        id: "mijas-hipodromo",
        area: "mijas",
        title: "Apartment zum Verkauf in Cerrado del Águila",
        meta: "117 m² · 3 SZ · 425.000 €",
        image: "/listings/mijas-aguila.jpg?v=2",
        href: "https://www.mmproperty.es/en/flat-for-sale-in-hipodromo-cerrado-del-aguila-mijas/273062/s2",
      },
    ],
  },
  testimonials: {
    index: "07",
    eyebrow: "DIE KÜSTE",
    titleBefore: "Orte, in denen",
    titleItalic: "wir arbeiten",
    description:
      "Marbella, Fuengirola, Benalmádena, Mijas, und auch Torremolinos und Estepona.",
    moreLabel: "Jeder Ort",
    moreHref: "/areas",
    image: "/media/costa-marbella.jpg?v=2",
    imageAlt: "Playa de la Fontanilla, Marbella",
    items: [
      {
        id: "t1",
        slug: "marbella",
        quote:
          "Luxusvillen zum Verkauf, unter anderem Alto de los Monteros und der weitere Markt von Marbella.",
        name: "Marbella",
        role: "Villen und Apartments",
        rating: 5,
      },
      {
        id: "t2",
        slug: "fuengirola",
        quote:
          "El Higuerón, Wohnungen am Strand und Neubau etwa 150 Meter vom Meer.",
        name: "Fuengirola",
        role: "Neubau und Bestand",
        rating: 5,
      },
      {
        id: "t3",
        slug: "benalmadena",
        quote:
          "Pueblo und Costa, inklusive neuer Wohnungen zu Fuß zum Strand. Das Büro ist hier.",
        name: "Benalmádena",
        role: "Sitz des Büros",
        rating: 5,
      },
      {
        id: "t4",
        slug: "mijas",
        quote:
          "Mijas Costa, La Cala und Mijas Pueblo, von Reihenhäusern am Golf bis zu Villen am Hang.",
        name: "Mijas",
        role: "Costa und Pueblo",
        rating: 5,
      },
      {
        id: "t5",
        slug: "torremolinos",
        quote: "Weitere Immobilien an der Bucht, zwischen Málaga und Benalmádena.",
        name: "Torremolinos",
        role: "An derselben Küste",
        rating: 5,
      },
      {
        id: "t6",
        slug: "estepona",
        quote: "Immobilien weiter westlich, wenn die Suche über Marbella hinausgeht.",
        name: "Estepona",
        role: "Westlich von Marbella",
        rating: 5,
      },
    ],
  },
  advisor: {
    eyebrow: "DAS BÜRO",
    name: "M&M Property",
    title: "Makler Costa del Sol",
    description:
      "Das Büro ist in Benalmádena. Dasselbe Team berät Käufer und Verkäufer von der ersten Besichtigung bis zum Notar.",
    cta: "Kontakt aufnehmen",
  },
  faq: {
    index: "08",
    eyebrow: "FAQ",
    title: "Häufige Fragen",
    subtitle: "Kauf, Verkauf oder eine Frage zu einer Immobilie.",
    cta: "Das Büro kontaktieren",
    ctaHref: "/contact",
    footerNote: "Benalmádena · Costa del Sol",
    image: "/media/costa-mijas.jpg?v=2",
    imageAlt: "Mijas Pueblo, am Hang über der Küste",
    items: [
      {
        question: "Was macht M&M Property?",
        answer:
          "Kauf und Verkauf von Apartments, Häusern, Luxusvillen und Reihenhäusern an der Costa del Sol, sowohl Bestand als auch Neubau. Mietobjekte stehen ebenfalls auf mmproperty.es.",
      },
      {
        question: "Wo ist das Büro?",
        answer:
          "Avd. de Tívoli, Centro Comercial Las Ventas, Local 48A, 29630 Benalmádena, Málaga.",
      },
      {
        question: "In welchen Orten arbeiten Sie?",
        answer:
          "Marbella, Fuengirola, Benalmádena und Mijas Costa, plus Immobilien in Torremolinos und Estepona.",
      },
      {
        question: "Ich möchte mein Haus verkaufen. Wie läuft das?",
        answer:
          "Wir beraten zum Marktpreis und zu den Schritten für den Verkauf, machen danach Fotos und Video und inserieren die Immobilie.",
      },
      {
        question: "Wie frage ich nach einer Immobilie?",
        answer:
          "Rufen Sie +34 653 223 015, +34 951 542 193 oder +34 648 766 318 an oder schreiben Sie an info@mmproperty.es. Preise auf dieser Seite bestätigen Sie auf der Live-Seite.",
      },
    ],
  },
  contact: {
    index: "09",
    eyebrow: "KONTAKT",
    tagline: "Kauf und Verkauf · Costa del Sol",
    line1Light: "Sprechen Sie das Büro in",
    line1Muted: "Benalmádena",
    line2Before: "noch",
    line2After: "heute",
    cta: "Mail schreiben",
    ctaHref: "mailto:info@mmproperty.es",
    body: "Avd. de Tívoli, C.C. Las Ventas, Local 48A, 29630 Benalmádena. +34 653 223 015.",
    pageTitle: "Das Büro in Benalmádena.",
    pageText:
      "Rufen Sie an, schreiben Sie oder hinterlassen Sie Ihre Daten. Dasselbe Team bleibt bei Ihnen von der ersten Frage bis zum Notar.",
    writeLabel: "An das Büro schreiben",
    address: ["Avd. de Tívoli, C.C. Las Ventas", "Local 48A", "29630 Benalmádena, Málaga"],
    image: "/section2.png",
    imageAlt: "Terrasse am Abend mit Blick auf die Küste",
    email: "info@mmproperty.es",
    whatsapp: {
      phone: "34653223015",
      label: "WhatsApp",
      message: "Hallo, ich möchte mehr über eine Immobilie von M&M Property erfahren.",
    },
    socials: [
      { label: "WhatsApp", handle: "+34 653 223 015", href: "https://wa.me/34653223015" },
      { label: "Instagram", handle: "@mmpropertyrealestate", href: "https://www.instagram.com/mmpropertyrealestate/" },
      { label: "Facebook", handle: "M&M Property", href: "https://www.facebook.com/share/19nwa7Rp6i/?mibextid=wwXIfr" },
      { label: "TikTok", handle: "@mmproperty.io", href: "https://www.tiktok.com/@mmproperty.io" },
      { label: "LinkedIn", handle: "M&M Property", href: "https://www.linkedin.com/in/mm-property-7b792843b/" },
    ],
    chips: ["Kauf & Verkauf", "Costa del Sol"],
    footerNav: [
      { label: "Wohnungen", href: "/homes" },
      { label: "Gebiete", href: "/areas" },
      { label: "So arbeiten wir", href: "/sell" },
      { label: "Über uns", href: "/about" },
      { label: "FAQ", href: "/faq" },
      { label: "Kontakt", href: "/contact" },
    ],
    footerNote: "M&M Property · Benalmádena",
    photoCredit:
      "Küstenfotos: Los Boliches, Fuengirola · Playa de la Fontanilla, Marbella · Mijas Pueblo · Seilbahn Benalmádena (robbie jim, CC BY 2.0) · Playamar, Torremolinos (Hans Olav Lien, CC BY-SA 3.0) · Estepona (kallerna, CC BY-SA 4.0). Wikimedia Commons.",
  },
  pages: {
    homeLabel: "Startseite",
    backHome: "Zurück zur Startseite",
    backToAreas: "Alle Orte",
    emptyHomes:
      "Fragen Sie das Büro nach aktuellen Immobilien in diesem Ort. Die Live-Liste steht auf mmproperty.es.",
    portfolio: "Live-Angebot öffnen",
    homes: {
      eyebrow: "WOHNUNGEN",
      title: "Immobilien zum Verkauf an der Costa del Sol.",
      description:
        "Apartments, Villen und Neubau vom Büro in Benalmádena. Dies ist eine Auswahl. Bestätigen Sie den Preis in der Live-Anzeige.",
      seoTitle: "Immobilien zum Verkauf an der Costa del Sol | M&M Property",
      seoDescription:
        "Apartments, Villen und Neubau zum Verkauf in Marbella, Fuengirola, Benalmádena und Mijas. M&M Property, Büro in Benalmádena.",
      viewListing: "Auf mmproperty.es ansehen",
      links: [
        { label: "Alle Immobilien", href: "https://www.mmproperty.es/en/properties/s1/1907" },
        { label: "Zum Verkauf", href: "https://www.mmproperty.es/en/browser/s1?quick_search[tof]=1" },
        { label: "Zur Miete", href: "https://www.mmproperty.es/en/browser/s1?quick_search[tof]=2" },
      ],
    },
    areas: {
      eyebrow: "DIE KÜSTE",
      title: "Orte, in denen wir arbeiten.",
      description:
        "Das Büro ist in Benalmádena. Die Suche reicht von Torremolinos bis Estepona.",
      seoTitle: "Orte an der Costa del Sol | M&M Property",
      seoDescription:
        "M&M Property arbeitet in Marbella, Fuengirola, Benalmádena, Mijas, Torremolinos und Estepona. Büro in Benalmádena.",
      towns: [
        {
          slug: "marbella",
          name: "Marbella",
          role: "Villen und Apartments",
          text: "Luxusvillen zum Verkauf, unter anderem Alto de los Monteros und der weitere Markt von Marbella.",
          image: "/media/costa-marbella.jpg?v=2",
          imageAlt: "Playa de la Fontanilla, Marbella",
          seoTitle: "Immobilien zum Verkauf in Marbella | M&M Property",
          seoDescription:
            "Villen und Apartments zum Verkauf in Marbella, inklusive Alto de los Monteros. M&M Property, Benalmádena.",
        },
        {
          slug: "fuengirola",
          name: "Fuengirola",
          role: "Neubau und Bestand",
          text: "El Higuerón, Wohnungen am Strand und Neubau etwa 150 Meter vom Meer.",
          image: "/media/costa-fuengirola.jpg?v=2",
          imageAlt: "Los Boliches, Fuengirola",
          seoTitle: "Immobilien zum Verkauf in Fuengirola | M&M Property",
          seoDescription:
            "Apartments und Neubau zum Verkauf in Fuengirola und El Higuerón. M&M Property, Benalmádena.",
        },
        {
          slug: "benalmadena",
          name: "Benalmádena",
          role: "Sitz des Büros",
          text: "Pueblo und Costa, inklusive neuer Wohnungen zu Fuß zum Strand. Das Büro ist hier, im C.C. Las Ventas an der Avenida de Tívoli.",
          image: "/media/costa-benalmadena.jpg?v=1",
          imageAlt: "Seilbahn von Benalmádena über der Küste",
          seoTitle: "Immobilien zum Verkauf in Benalmádena | M&M Property",
          seoDescription:
            "Das Büro von M&M Property ist in Benalmádena. Immobilien zum Verkauf in Benalmádena Pueblo und Benalmádena Costa.",
        },
        {
          slug: "mijas",
          name: "Mijas",
          role: "Costa und Pueblo",
          text: "Mijas Costa, La Cala und Mijas Pueblo, von Reihenhäusern am Golf bis zu Villen am Hang.",
          image: "/media/costa-mijas.jpg?v=2",
          imageAlt: "Mijas Pueblo",
          seoTitle: "Immobilien zum Verkauf in Mijas | M&M Property",
          seoDescription:
            "Villen und Apartments zum Verkauf in Mijas Pueblo, Mijas Costa und La Cala. M&M Property, Benalmádena.",
        },
        {
          slug: "torremolinos",
          name: "Torremolinos",
          role: "An derselben Küste",
          text: "Weitere Immobilien an der Bucht, zwischen Málaga und Benalmádena.",
          image: "/media/costa-torremolinos.jpg?v=1",
          imageAlt: "Strand von Playamar, Torremolinos",
          seoTitle: "Immobilien zum Verkauf in Torremolinos | M&M Property",
          seoDescription:
            "Immobilien zum Verkauf in Torremolinos, zwischen Málaga und Benalmádena. Fragen Sie das Büro von M&M Property.",
        },
        {
          slug: "estepona",
          name: "Estepona",
          role: "Westlich von Marbella",
          text: "Immobilien weiter westlich, wenn die Suche über Marbella hinausgeht.",
          image: "/media/costa-estepona.jpg?v=1",
          imageAlt: "Luftaufnahme von Estepona und dem Yachthafen",
          seoTitle: "Immobilien zum Verkauf in Estepona | M&M Property",
          seoDescription:
            "Immobilien zum Verkauf in Estepona, westlich von Marbella. M&M Property, Büro in Benalmádena.",
        },
      ],
    },
    sell: {
      eyebrow: "SO ARBEITEN WIR",
      title: "Von der ersten Besichtigung bis zum Notar.",
      description:
        "Dasselbe Team in Benalmádena begleitet die Suche, den Preis und die Unterzeichnung, ob Sie kaufen oder verkaufen.",
      seoTitle: "So kaufen und verkaufen wir Immobilien | M&M Property",
      seoDescription:
        "M&M Property berät zum Preis, erstellt die Fotos und bleibt beim Kauf oder Verkauf bis zum Notar. Büro in Benalmádena.",
      imageAlt: "Terrasse am Abend mit Blick auf die Küste",
    },
    contact: {
      seoTitle: "Kontakt zum Büro in Benalmádena | M&M Property",
      seoDescription:
        "Rufen Sie +34 653 223 015 an oder schreiben Sie an info@mmproperty.es. M&M Property, Avenida de Tívoli, C.C. Las Ventas, Benalmádena.",
    },
    faq: {
      seoTitle: "Fragen zu Kauf oder Verkauf | M&M Property",
      seoDescription:
        "Was M&M Property macht, wo das Büro ist, und welche Orte an der Costa del Sol das Büro abdeckt.",
    },
    about: {
      eyebrow: "UNTERNEHMEN",
      title: "Ein Maklerbüro an der Costa del Sol.",
      seoTitle: "Über M&M Property | Costa del Sol",
      seoDescription:
        "M&M Property ist ein Maklerbüro an der Costa del Sol mit mehr als 29 Jahren Erfahrung im Verkauf jeder Art von Immobilie, von der Suche bis zur notariellen Urkunde.",
      image: "/section2.png",
      imageAlt: "Terrasse am Abend mit Blick auf die Costa del Sol",
      paragraphs: [
        "M&M Property ist ein auf die Costa del Sol spezialisiertes Immobilienbüro mit mehr als 29 Jahren Erfahrung im Verkauf von Immobilien jeder Art. Der Service reicht von der Suche nach dem richtigen Zuhause für jeden Kunden über die Beratung bis zum Abschluss des Kaufs mit Unterzeichnung der Urkunde vor dem Notar.",
        "Das Büro bietet Apartments, Häuser, Luxusvillen, Reihenhäuser und Doppelhaushälften, sowohl Bestandsimmobilien als auch ein breites Angebot an Neubauten.",
        "Ob Sie eine Immobilie zum Wohnen oder zur Investition an der Costa del Sol suchen: Das Büro findet die passende. Das Portfolio umfasst Luxusvillen zum Verkauf in Marbella, Apartments in Benalmádena, Neubauvorhaben in Fuengirola, Immobilien in Mijas Costa sowie weitere Objekte in Torremolinos und Estepona.",
        "Wenn Sie Eigentümer sind und den Verkauf Ihrer Immobilie einem vertrauenswürdigen Büro anvertrauen möchten, beraten wir Sie zum Marktpreis und zu allen Schritten des Verkaufs und erstellen die Fotos und Videos, mit denen die Immobilie beworben wird.",
      ],
      close: "Zögern Sie nicht und nehmen Sie Kontakt mit uns auf. Wir freuen uns, Sie kennenzulernen.",
      phones: [
        { label: "+34 653 223 015", href: "tel:+34653223015" },
        { label: "+34 951 542 193", href: "tel:+34951542193" },
        { label: "+34 648 766 318", href: "tel:+34648766318" },
      ],
      email: "info@mmproperty.es",
      address: ["Avd. de Tívoli", "Centro comercial Las Ventas, Local 48A", "29630 Benalmádena"],
      contactLabel: "Das Büro",
    },
    notFound: {
      title: "Diese Seite gibt es auf der Website nicht.",
      description: "Die Startseite, die Wohnungen und die Orte sind weiterhin da.",
      cta: "Zurück zur Startseite",
    },
  },
  offer: {
    eyebrow: "FRÜHER ZUGANG",
    title: "Immobilien an der Costa del Sol.",
    text: "Hinterlassen Sie Ihre E-Mail und gehen Sie zum Live-Angebot. Wir nutzen sie nur, um Sie über neue Immobilien zu informieren.",
    formIntro:
      "Senden Sie Ihre Daten, und das Büro kann Sie anrufen oder anschreiben zu Immobilien, die Sie interessieren.",
    error: "Wir konnten diese Daten nicht speichern. Bitte versuchen Sie es erneut.",
    sent: "Gespeichert. Das Büro kann Sie unter dieser Nummer oder E-Mail erreichen.",
    nameLabel: "Name",
    namePlaceholder: "Ihr Name",
    phoneLabel: "Telefon",
    phonePlaceholder: "+34 …",
    emailLabel: "E-Mail",
    placeholder: "sie@email.com",
    noteLabel: "Wonach suchen Sie?",
    notePlaceholder: "Ein Apartment in Fuengirola, eine Villa in Mijas…",
    submit: "Immobilien ansehen",
    send: "Senden",
    href: "https://www.mmproperty.es/en",
    close: "Schließen",
  },
};
