import type { SiteContent } from "@/content";

export const nl: SiteContent = {
  brand: {
    initials: "M&M",
    name: "M&M Property",
    title: "Woningen te koop en te huur aan de Costa del Sol",
    phone: "+34 653 223 015",
    phoneHref: "tel:+34653223015",
    phoneAria: "Bel +34 653 223 015",
  },
  nav: [
    { label: "Woningen", href: "/homes" },
    { label: "Gebieden", href: "/areas" },
    { label: "Hoe we werken", href: "/sell" },
    { label: "Contact", href: "/contact" },
  ],
  hero: {
    titleBefore: "Woningen aan de",
    titleItalic: "Costa del Sol.",
    description:
      "Appartementen, huizen en villa’s te koop en te huur, van Benalmádena tot Marbella.",
    cta: "Bekijk het aanbod",
    ctaHref: "https://www.mmproperty.es/en",
    scrollLabel: "SCROLL OM TE VERKENNEN",
    stats: [
      { value: "20+", label: "Jaar aan de kust" },
      { value: "Koop & huur", label: "Nieuwbouw en bestaande bouw" },
      { value: "Benalmádena", label: "Kantoor aan de kust" },
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
    eyebrow: "HET KANTOOR",
    headline: [
      [
        { text: "M&M Property", tone: "strong" },
        { text: " vindt de juiste woning", tone: "muted" },
      ],
      [
        { text: "en blijft bij u tot", tone: "muted" },
        { text: " de notaris.", tone: "strong" },
      ],
      [{ text: "Villa’s, appartementen en nieuwbouw", tone: "strong" }],
      [{ text: "in Marbella, Fuengirola,", tone: "muted" }],
      [{ text: "Benalmádena en Mijas.", tone: "strong" }],
    ],
    body: "Een makelaarskantoor aan de Costa del Sol met meer dan 15 jaar ervaring in de verkoop van elk type woning. Zoektocht, advies en aankoop gebeuren samen, of u nu hier komt wonen of investeert.",
    cta: "Hoe we werken",
    ctaHref: "/sell",
    images: [
      {
        src: "/listings/mijas-pueblo.jpg?v=2",
        alt: "Villa met zwembad in Mijas Pueblo",
        label: "Mijas Pueblo",
        caption: "Villa te koop",
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
    eyebrow: "DE ZOEKTOCHT",
    title: "Uw volgende huis begint hier",
    description:
      "Ontdek een selectie nieuwbouw, luxe villa’s en kant-en-klare appartementen aan de Costa del Sol.",
    items: [
      {
        title: "Nieuwbouw",
        text: "Een selectie van de beste nieuwbouwprojecten aan de Costa del Sol.",
        image: "/listings/development.jpg?v=1",
        alt: "Woonkamer in een nieuwbouwproject aan de Costa del Sol",
        href: "https://www.mmproperty.es/en/flat-for-sale-in-el-higueron-fuengirola/279799/s2",
        points: ["Merkresidenties", "Investeringspotentieel", "Hoog rendement bij oplevering"],
      },
      {
        title: "Exclusieve villa’s",
        text: "De mooiste villa’s op de meest prestigieuze locaties van de Costa del Sol.",
        image: "/listings/villas.webp?v=1",
        alt: "Villa op de heuvel met zwembad aan de Costa del Sol",
        href: "https://www.mmproperty.es/en/villa-for-sale-in-mijas-pueblo-pena-blanquilla/273381/s2",
        points: ["Prime locaties", "Prestigewoningen", "Ruim villa-aanbod"],
      },
      {
        title: "Bestaande bouw",
        text: "Appartementen die u meteen kunt betrekken, in de beste zones van de Costa del Sol.",
        image: "/listings/Resale.webp?v=1",
        alt: "Slaapkamer in een bestaande woning aan de Costa del Sol",
        href: "https://www.mmproperty.es/en/flat-for-sale-in-fuengirola/279182/s2",
        points: ["Direct te betrekken", "Afgesloten urbanisaties", "Top locaties"],
      },
      {
        title: "Huurwoningen",
        text: "Een selectie huurappartementen in de belangrijkste gebieden van de Costa del Sol.",
        image: "/listings/rental.jpg?v=1",
        alt: "Woonkamer in een huurappartement aan de Costa del Sol",
        href: "https://www.mmproperty.es/en",
        points: ["Luxe woningen", "Korte en lange termijn", "Exclusieve complexen"],
      },
    ],
  },
  processSection: {
    index: "03",
    eyebrow: "Het proces",
    title: "Hoe we werken",
    background: "/section2.png",
  },
  process: [
    {
      number: "01",
      tag: "ZOEKEN",
      title: "De juiste woning vinden",
      description:
        "Appartementen, huizen, luxe villa’s en rijwoningen, bestaande bouw of nieuwbouw, gekozen voor wonen of beleggen.",
    },
    {
      number: "02",
      tag: "ADVIES",
      title: "Prijs en volgende stappen",
      description:
        "Verkopen? Wij adviseren over de marktprijs en de stappen om te adverteren, en maken foto’s en video.",
    },
    {
      number: "03",
      tag: "AFRONDEN",
      title: "Tot bij de notaris",
      description:
        "Hetzelfde team blijft bij de aankoop of verkoop tot de akte is getekend.",
    },
  ],
  report: {
    index: "04",
    eyebrow: "UW WONING",
    title: "Een huis om in te wonen, of om in te investeren.",
    description:
      "Permanente bewoning of een investering aan de Costa del Sol. Het aanbod loopt van Benalmádena Pueblo tot El Higuerón, inclusief woningen in aanbouw.",
    sample: {
      brand: "M&M Property",
      docLabel: "Nu te koop",
      property: "El Higuerón, Fuengirola",
      propertyType: "Appartement · 2 slk · 116 m²",
      rangeLow: "€495.000",
      rangeHigh: "",
      rangeLabel: "Vraagprijs",
      strengthsLabel: "Sterke punten",
      strengths: [
        "Privétuin en een terras van 36 m²",
        "Zwembad, solarium en gemeenschappelijke tuinen",
        "El Higuerón, met spa, sportclub en beachclub in de buurt",
      ],
      limitation:
        "Prijzen komen uit het actuele aanbod en kunnen wijzigen. Bevestig de huidige advertentie op mmproperty.es.",
    },
    floaters: [
      { label: "JAAR", value: "20+", position: "left-top" },
      { label: "KANTOOR", value: "Benalmádena", position: "right-top" },
      { label: "NIEUW", value: "Bouw", position: "left-bottom" },
      { label: "BESTAAND", value: "Aanbod", position: "right-bottom" },
    ],
    cta: "Alle woningen",
    ctaHref: "https://www.mmproperty.es/en",
  },
  feature: {
    index: "05",
    eyebrow: "ÉÉN WONING",
    place: "Mijas Pueblo",
    title: "Een villa met zwembad, boven de kust.",
    text: "Vier slaapkamers in Mijas Pueblo. Hetzelfde kantoor dat de woning aanbiedt, begeleidt de koper bij prijs, bezichtiging en akte.",
    image: "/listings/mijas-pueblo.jpg?v=2",
    imageAlt: "Villa met zwembad in Mijas Pueblo",
    facts: [
      { label: "Slaapkamers", value: "4" },
      { label: "Buiten", value: "Zwembad" },
      { label: "Prijs", value: "1.965.000 €" },
    ],
    cta: "Bekijk deze woning",
    ctaHref:
      "https://www.mmproperty.es/en/villa-for-sale-in-mijas-pueblo-pena-blanquilla/273381/s2",
  },
  listings: {
    index: "06",
    eyebrow: "AANBOD",
    title: "Appartementen, villa’s en nieuwbouw langs de kust.",
    description:
      "Een selectie uit het actuele aanbod. Prijzen bevestigt u op mmproperty.es.",
    items: [
      {
        id: "higueron",
        area: "fuengirola",
        title: "Appartement te koop in El Higuerón (Fuengirola)",
        meta: "116 m² · 2 slk · 495.000 €",
        image: "/listings/higueron.jpg?v=2",
        href: "https://www.mmproperty.es/en/flat-for-sale-in-el-higueron-fuengirola/279799/s2",
      },
      {
        id: "fuengirola",
        area: "fuengirola",
        title: "Appartement te koop in Fuengirola",
        meta: "123 m² · 3 slk · 1.051.500 €",
        image: "/listings/fuengirola.jpg?v=2",
        href: "https://www.mmproperty.es/en/flat-for-sale-in-fuengirola/279182/s2",
      },
      {
        id: "mijas-pueblo",
        area: "mijas",
        title: "Villa te koop in Mijas Pueblo",
        meta: "4 slk · 1.965.000 €",
        image: "/listings/mijas-pueblo.jpg?v=2",
        href: "https://www.mmproperty.es/en/villa-for-sale-in-mijas-pueblo-pena-blanquilla/273381/s2",
      },
      {
        id: "monteros",
        area: "marbella",
        title: "Appartement te koop in Alto de los Monteros",
        meta: "125 m² · 3 slk · 835.000 €",
        image: "/listings/monteros.jpg?v=2",
        href: "https://www.mmproperty.es/en/flat-for-sale-in-alto-de-los-monteros-marbella/273145/s2",
      },
      {
        id: "monteros-two",
        area: "marbella",
        title: "Appartement te koop in Alto de los Monteros",
        meta: "98 m² · 2 slk · 530.000 €",
        image: "/listings/monteros-2.jpg?v=2",
        href: "https://www.mmproperty.es/en/flat-for-sale-in-alto-de-los-monteros-marbella/273116/s2",
      },
      {
        id: "mijas-hipodromo",
        area: "mijas",
        title: "Appartement te koop in Cerrado del Águila",
        meta: "117 m² · 3 slk · 425.000 €",
        image: "/listings/mijas-aguila.jpg?v=2",
        href: "https://www.mmproperty.es/en/flat-for-sale-in-hipodromo-cerrado-del-aguila-mijas/273062/s2",
      },
    ],
  },
  testimonials: {
    index: "07",
    eyebrow: "DE KUST",
    titleBefore: "Plaatsen waar",
    titleItalic: "we werken",
    description:
      "Marbella, Fuengirola, Benalmádena, Mijas, en ook Torremolinos en Estepona.",
    moreLabel: "Elke plaats",
    moreHref: "/areas",
    image: "/media/costa-marbella.jpg?v=2",
    imageAlt: "Playa de la Fontanilla, Marbella",
    items: [
      {
        id: "t1",
        slug: "marbella",
        quote:
          "Luxe villa’s te koop, onder meer Alto de los Monteros en de bredere markt van Marbella.",
        name: "Marbella",
        role: "Villa’s en appartementen",
        rating: 5,
      },
      {
        id: "t2",
        slug: "fuengirola",
        quote:
          "El Higuerón, woningen aan het strand en nieuwbouw op ongeveer 150 meter van de zee.",
        name: "Fuengirola",
        role: "Nieuwbouw en bestaande bouw",
        rating: 5,
      },
      {
        id: "t3",
        slug: "benalmadena",
        quote:
          "Pueblo en Costa, inclusief nieuwe woningen op loopafstand van het strand. Het kantoor is hier.",
        name: "Benalmádena",
        role: "Thuisbasis van het kantoor",
        rating: 5,
      },
      {
        id: "t4",
        slug: "mijas",
        quote:
          "Mijas Costa, La Cala en Mijas Pueblo, van rijwoningen bij de golf tot villa’s op de heuvel.",
        name: "Mijas",
        role: "Costa en pueblo",
        rating: 5,
      },
      {
        id: "t5",
        slug: "torremolinos",
        quote: "Meer woningen langs de baai, tussen Málaga en Benalmádena.",
        name: "Torremolinos",
        role: "Aan dezelfde kust",
        rating: 5,
      },
      {
        id: "t6",
        slug: "estepona",
        quote: "Woningen verder naar het westen, als de zoektocht voorbij Marbella gaat.",
        name: "Estepona",
        role: "Ten westen van Marbella",
        rating: 5,
      },
    ],
  },
  advisor: {
    eyebrow: "HET KANTOOR",
    name: "M&M Property",
    title: "Makelaar Costa del Sol",
    description:
      "Het kantoor is in Benalmádena. Hetzelfde team adviseert kopers en verkopers van de eerste bezichtiging tot de notaris.",
    cta: "Neem contact op",
  },
  faq: {
    index: "08",
    eyebrow: "FAQ",
    title: "Veelgestelde vragen",
    subtitle: "Aankoop, verkoop of een vraag over een woning.",
    cta: "Contact met het kantoor",
    ctaHref: "/contact",
    footerNote: "Benalmádena · Costa del Sol",
    image: "/media/costa-mijas.jpg?v=2",
    imageAlt: "Mijas Pueblo, op de heuvel boven de kust",
    items: [
      {
        question: "Wat doet M&M Property?",
        answer:
          "Aankoop en verkoop van appartementen, huizen, luxe villa’s en rijwoningen aan de Costa del Sol, zowel bestaande bouw als nieuwbouw. Huurwoningen staan ook op mmproperty.es.",
      },
      {
        question: "Waar is het kantoor?",
        answer:
          "Avd. de Tívoli, Centro Comercial Las Ventas, Local 48A, 29630 Benalmádena, Málaga.",
      },
      {
        question: "In welke plaatsen werken jullie?",
        answer:
          "Marbella, Fuengirola, Benalmádena en Mijas Costa, plus woningen in Torremolinos en Estepona.",
      },
      {
        question: "Ik wil mijn huis verkopen. Hoe gaat dat?",
        answer:
          "Wij adviseren over de marktprijs en de stappen om te verkopen, maken daarna foto’s en video en adverteren de woning.",
      },
      {
        question: "Hoe vraag ik naar een woning?",
        answer:
          "Bel +34 653 223 015, +34 951 542 193 of +34 648 766 318, of mail naar info@mmproperty.es. Prijzen op deze pagina bevestigt u op de live site.",
      },
    ],
  },
  contact: {
    index: "09",
    eyebrow: "CONTACT",
    tagline: "Koop en verkoop · Costa del Sol",
    line1Light: "Spreek het kantoor in",
    line1Muted: "Benalmádena",
    line2Before: "vandaag",
    line2After: "nog",
    cta: "Mail ons",
    ctaHref: "mailto:info@mmproperty.es",
    body: "Avd. de Tívoli, C.C. Las Ventas, Local 48A, 29630 Benalmádena. +34 653 223 015.",
    pageTitle: "Het kantoor in Benalmádena.",
    pageText:
      "Bel, mail of laat uw gegevens achter. Hetzelfde team blijft bij u van de eerste vraag tot de notaris.",
    writeLabel: "Schrijf naar het kantoor",
    address: ["Avd. de Tívoli, C.C. Las Ventas", "Local 48A", "29630 Benalmádena, Málaga"],
    image: "/section2.png",
    imageAlt: "Terras in de avond met uitzicht op de kust",
    email: "info@mmproperty.es",
    whatsapp: {
      phone: "34653223015",
      label: "WhatsApp",
      message: "Hallo, ik wil meer weten over een woning van M&M Property.",
    },
    socials: [
      { label: "Instagram", handle: "@mmpropertyrealestate", href: "https://www.instagram.com/mmpropertyrealestate/" },
      { label: "Facebook", handle: "M&M Property", href: "https://www.facebook.com/share/19nwa7Rp6i/?mibextid=wwXIfr" },
    ],
    chips: ["Koop & verkoop", "Costa del Sol"],
    footerNav: [
      { label: "Woningen", href: "/homes" },
      { label: "Gebieden", href: "/areas" },
      { label: "Hoe we werken", href: "/sell" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
    footerNote: "M&M Property · Benalmádena",
    photoCredit:
      "Kustfoto’s: Los Boliches, Fuengirola · Playa de la Fontanilla, Marbella · Mijas Pueblo · Kabelbaan Benalmádena (robbie jim, CC BY 2.0) · Playamar, Torremolinos (Hans Olav Lien, CC BY-SA 3.0) · Estepona (kallerna, CC BY-SA 4.0). Wikimedia Commons.",
  },
  pages: {
    homeLabel: "Home",
    backHome: "Terug naar de homepage",
    backToAreas: "Alle plaatsen",
    emptyHomes:
      "Vraag het kantoor naar actuele woningen in deze plaats. De live lijst staat op mmproperty.es.",
    portfolio: "Open het live aanbod",
    homes: {
      eyebrow: "WONINGEN",
      title: "Woningen te koop aan de Costa del Sol.",
      description:
        "Appartementen, villa’s en nieuwbouw vanuit het kantoor in Benalmádena. Dit is een selectie. Bevestig de prijs in de live advertentie.",
      seoTitle: "Woningen te koop aan de Costa del Sol | M&M Property",
      seoDescription:
        "Appartementen, villa’s en nieuwbouw te koop in Marbella, Fuengirola, Benalmádena en Mijas. M&M Property, kantoor in Benalmádena.",
      viewListing: "Bekijk op mmproperty.es",
      links: [
        { label: "Alle woningen", href: "https://www.mmproperty.es/en/properties/s1/1907" },
        { label: "Te koop", href: "https://www.mmproperty.es/en/browser/s1?quick_search[tof]=1" },
        { label: "Te huur", href: "https://www.mmproperty.es/en/browser/s1?quick_search[tof]=2" },
      ],
    },
    areas: {
      eyebrow: "DE KUST",
      title: "Plaatsen waar we werken.",
      description:
        "Het kantoor is in Benalmádena. De zoektocht loopt van Torremolinos tot Estepona.",
      seoTitle: "Plaatsen aan de Costa del Sol | M&M Property",
      seoDescription:
        "M&M Property werkt in Marbella, Fuengirola, Benalmádena, Mijas, Torremolinos en Estepona. Kantoor in Benalmádena.",
      towns: [
        {
          slug: "marbella",
          name: "Marbella",
          role: "Villa’s en appartementen",
          text: "Luxe villa’s te koop, onder meer Alto de los Monteros en de bredere markt van Marbella.",
          image: "/media/costa-marbella.jpg?v=2",
          imageAlt: "Playa de la Fontanilla, Marbella",
          seoTitle: "Woningen te koop in Marbella | M&M Property",
          seoDescription:
            "Villa’s en appartementen te koop in Marbella, inclusief Alto de los Monteros. M&M Property, Benalmádena.",
        },
        {
          slug: "fuengirola",
          name: "Fuengirola",
          role: "Nieuwbouw en bestaande bouw",
          text: "El Higuerón, woningen aan het strand en nieuwbouw op ongeveer 150 meter van de zee.",
          image: "/media/costa-fuengirola.jpg?v=2",
          imageAlt: "Los Boliches, Fuengirola",
          seoTitle: "Woningen te koop in Fuengirola | M&M Property",
          seoDescription:
            "Appartementen en nieuwbouw te koop in Fuengirola en El Higuerón. M&M Property, Benalmádena.",
        },
        {
          slug: "benalmadena",
          name: "Benalmádena",
          role: "Thuisbasis van het kantoor",
          text: "Pueblo en Costa, inclusief nieuwe woningen op loopafstand van het strand. Het kantoor is hier, in C.C. Las Ventas aan de Avenida de Tívoli.",
          image: "/media/costa-benalmadena.jpg?v=1",
          imageAlt: "Kabelbaan van Benalmádena boven de kust",
          seoTitle: "Woningen te koop in Benalmádena | M&M Property",
          seoDescription:
            "Het kantoor van M&M Property is in Benalmádena. Woningen te koop in Benalmádena Pueblo en Benalmádena Costa.",
        },
        {
          slug: "mijas",
          name: "Mijas",
          role: "Costa en pueblo",
          text: "Mijas Costa, La Cala en Mijas Pueblo, van rijwoningen bij de golf tot villa’s op de heuvel.",
          image: "/media/costa-mijas.jpg?v=2",
          imageAlt: "Mijas Pueblo",
          seoTitle: "Woningen te koop in Mijas | M&M Property",
          seoDescription:
            "Villa’s en appartementen te koop in Mijas Pueblo, Mijas Costa en La Cala. M&M Property, Benalmádena.",
        },
        {
          slug: "torremolinos",
          name: "Torremolinos",
          role: "Aan dezelfde kust",
          text: "Meer woningen langs de baai, tussen Málaga en Benalmádena.",
          image: "/media/costa-torremolinos.jpg?v=1",
          imageAlt: "Strand van Playamar, Torremolinos",
          seoTitle: "Woningen te koop in Torremolinos | M&M Property",
          seoDescription:
            "Woningen te koop in Torremolinos, tussen Málaga en Benalmádena. Vraag het kantoor van M&M Property.",
        },
        {
          slug: "estepona",
          name: "Estepona",
          role: "Ten westen van Marbella",
          text: "Woningen verder naar het westen, als de zoektocht voorbij Marbella gaat.",
          image: "/media/costa-estepona.jpg?v=1",
          imageAlt: "Luchtfoto van Estepona en de jachthaven",
          seoTitle: "Woningen te koop in Estepona | M&M Property",
          seoDescription:
            "Woningen te koop in Estepona, ten westen van Marbella. M&M Property, kantoor in Benalmádena.",
        },
      ],
    },
    sell: {
      eyebrow: "HOE WE WERKEN",
      title: "Van de eerste bezichtiging tot de notaris.",
      description:
        "Hetzelfde team in Benalmádena begeleidt de zoektocht, de prijs en de ondertekening, of u nu koopt of verkoopt.",
      seoTitle: "Hoe we woningen kopen en verkopen | M&M Property",
      seoDescription:
        "M&M Property adviseert over de prijs, maakt de foto’s en blijft bij de koop of verkoop tot de notaris. Kantoor in Benalmádena.",
      imageAlt: "Terras in de avond met uitzicht op de kust",
    },
    contact: {
      seoTitle: "Contact met het kantoor in Benalmádena | M&M Property",
      seoDescription:
        "Bel +34 653 223 015 of mail info@mmproperty.es. M&M Property, Avenida de Tívoli, C.C. Las Ventas, Benalmádena.",
    },
    faq: {
      seoTitle: "Vragen over kopen of verkopen | M&M Property",
      seoDescription:
        "Wat M&M Property doet, waar het kantoor is, en welke plaatsen aan de Costa del Sol het kantoor dekt.",
    },
    notFound: {
      title: "Deze pagina staat niet op de site.",
      description: "De homepage, de woningen en de plaatsen zijn er nog.",
      cta: "Terug naar de homepage",
    },
  },
  offer: {
    eyebrow: "VROEGE TOEGANG",
    title: "Woningen aan de Costa del Sol.",
    text: "Laat uw e-mail achter en ga naar het live aanbod. We gebruiken het alleen om u te informeren over nieuwe woningen.",
    formIntro:
      "Stuur uw gegevens en het kantoor kan u bellen of mailen over woningen die u interesseren.",
    error: "We konden die gegevens niet opslaan. Probeer het opnieuw.",
    sent: "Opgeslagen. Het kantoor kan u op dit nummer of e-mailadres bereiken.",
    nameLabel: "Naam",
    namePlaceholder: "Uw naam",
    phoneLabel: "Telefoon",
    phonePlaceholder: "+34 …",
    emailLabel: "E-mail",
    placeholder: "u@email.com",
    noteLabel: "Waar zoekt u naar?",
    notePlaceholder: "Een appartement in Fuengirola, een villa in Mijas…",
    submit: "Woningen bekijken",
    send: "Versturen",
    href: "https://www.mmproperty.es/en",
    close: "Sluiten",
  },
};
