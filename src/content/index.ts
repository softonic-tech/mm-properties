/**
 * English site content — default locale.
 */

export const content = {
  brand: {
    initials: "M&M",
    name: "M&M Property",
    title: "Homes for sale and rent on the Costa del Sol",
    phone: "+34 653 223 015",
    phoneHref: "tel:+34653223015",
    phoneAria: "Call +34 653 223 015",
  },

  nav: [
    { label: "Homes", href: "/homes" },
    { label: "Areas", href: "/areas" },
    { label: "How we work", href: "/sell" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],

  hero: {
    titleBefore: "Homes on the",
    titleItalic: "Costa del Sol.",
    description: "Apartments, houses and villas for sale and rent, from Benalmádena to Marbella.",
    cta: "View the portfolio",
    ctaHref: "https://www.mmproperty.es/en",
    scrollLabel: "SCROLL TO EXPLORE",
    stats: [
      { value: "29+", label: "Years on the coast", href: "/about" },
      { value: "Buy · Sell · Rent", label: "Contact the office", href: "/contact" },
      { value: "Benalmádena", label: "Office on the coast", href: "" },
    ],
  },

  /**
   * Hero media — self-hosted in /public/media/
   */
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
    eyebrow: "THE EXPERIENCE",
    /** Alternating emphasis: "strong" = foreground, "muted" = gray */
    headline: [
      [
        { text: "M&M Property", tone: "strong" },
        { text: " finds the right home", tone: "muted" },
      ],
      [
        { text: "and stays with you until", tone: "muted" },
        { text: " the notary.", tone: "strong" },
      ],
      [
        { text: "Villas, apartments and new builds", tone: "strong" },
      ],
      [
        { text: "in Marbella, Fuengirola,", tone: "muted" },
      ],
      [
        { text: "Benalmádena and Mijas.", tone: "strong" },
      ],
    ],
    body: "A Costa del Sol agency with more than 29 years in the sale of every kind of home. The search, the advice and the purchase are handled together, whether you are moving here or buying to invest.",
    cta: "How we work",
    ctaHref: "/sell",
    images: [
      {
        src: "/listings/mijas-pueblo.jpg?v=2",
        alt: "Villa with a pool in Mijas Pueblo",
        label: "Mijas Pueblo",
        caption: "Villa for sale",
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
    eyebrow: "THE SEARCH",
    title: "Your next home starts here",
    description:
      "Explore our curated selection of new developments, luxury villas, and turnkey apartments across the Costa del Sol.",
    items: [
      {
        title: "New Developments",
        text: "Explore a curated selection of the Costa del Sol's finest new developments.",
        image: "/listings/development.jpg?v=1",
        alt: "Living room in a new development on the Costa del Sol",
        href: "https://www.mmproperty.es/en/flat-for-sale-in-el-higueron-fuengirola/279799/s2",
        points: ["Branded Residences", "Investment potential", "High ROI upon completion"],
      },
      {
        title: "Exclusive Villas",
        text: "Discover the finest villas in Costa del Sol's most prestigious locations.",
        image: "/listings/villas.webp?v=1",
        alt: "Hillside villa with a pool on the Costa del Sol",
        href: "https://www.mmproperty.es/en/villa-for-sale-in-mijas-pueblo-pena-blanquilla/273381/s2",
        points: ["Prime locations", "Prestige homes", "Extensive villa portfolio"],
      },
      {
        title: "Resale Properties",
        text: "A curated selection of ready-to-move-in apartments in the best areas of the Costa del Sol.",
        image: "/listings/Resale.webp?v=1",
        alt: "Bedroom in a resale apartment on the Costa del Sol",
        href: "https://www.mmproperty.es/en/flat-for-sale-in-fuengirola/279182/s2",
        points: ["Move-in ready", "Gated communities", "Top locations"],
      },
      {
        title: "Rental Properties",
        text: "A curated portfolio of rental apartments located in the Costa del Sol's premier areas.",
        image: "/listings/rental.jpg?v=1",
        alt: "Living room in a rental apartment on the Costa del Sol",
        href: "https://www.mmproperty.es/en",
        points: ["Luxury Properties", "Short and long-term rentals", "Exclusive communities"],
      },
    ],
  },

  processSection: {
    index: "03",
    eyebrow: "The process",
    title: "How we work",
    background: "/section2.png",
  },

  process: [
    {
      number: "01",
      tag: "SEARCH",
      title: "Find the right home",
      description:
        "Apartments, houses, luxury villas and townhouses, resale or new build, chosen for how you want to live or invest.",
    },
    {
      number: "02",
      tag: "ADVICE",
      title: "Price and next steps",
      description:
        "Selling? We advise on the market price and the steps to list, then prepare the photos and video.",
    },
    {
      number: "03",
      tag: "CLOSE",
      title: "Through to the notary",
      description:
        "The same team stays with the purchase or the sale until the deed is signed.",
    },
  ],

  report: {
    index: "04",
    eyebrow: "YOUR REPORT",
    title: "A home to live in, or a home to invest in.",
    description:
      "Permanent living or a Costa del Sol investment. The portfolio runs from Benalmádena Pueblo to El Higuerón, including homes still under construction.",
    sample: {
      brand: "M&M Property",
      docLabel: "For sale now",
      property: "El Higuerón, Fuengirola",
      propertyType: "Apartment · 2 bed · 116 m²",
      rangeLow: "€495,000",
      rangeHigh: "",
      rangeLabel: "Asking price",
      strengthsLabel: "Property strengths",
      strengths: [
        "Private garden and a 36 m² terrace",
        "Pool, solarium and gardens in the community",
        "El Higuerón, with spa, sport club and beach club nearby",
      ],
      limitation:
        "Prices are taken from the live portfolio and can change. Confirm the current listing on mmproperty.es.",
    },
    floaters: [
      { label: "YEARS", value: "29+", position: "left-top" },
      { label: "OFFICE", value: "Benalmádena", position: "right-top" },
      { label: "NEW", value: "Build", position: "left-bottom" },
      { label: "RESALE", value: "Homes", position: "right-bottom" },
    ],
    cta: "See all homes",
    ctaHref: "https://www.mmproperty.es/en",
  },

  feature: {
    index: "05",
    eyebrow: "ONE HOME",
    place: "Mijas Pueblo",
    title: "A villa with a pool, above the coast.",
    text: "Four bedrooms in Mijas Pueblo. The same office that lists it walks the buyer through the price, the viewing and the deed.",
    image: "/listings/mijas-pueblo.jpg?v=2",
    imageAlt: "Villa with a pool in Mijas Pueblo",
    facts: [
      { label: "Bedrooms", value: "4" },
      { label: "Outside", value: "Pool" },
      { label: "Asking", value: "1.965.000 €" },
    ],
    cta: "View this home",
    ctaHref:
      "https://www.mmproperty.es/en/villa-for-sale-in-mijas-pueblo-pena-blanquilla/273381/s2",
  },

  listings: {
    index: "06",
    eyebrow: "LISTINGS",
    title:
      "Apartments, villas and new homes along the coast.",
    description:
      "A selection from the live portfolio. Prices should be confirmed on mmproperty.es.",
    items: [
      {
        id: "higueron",
        area: "fuengirola",
        title: "Flat for sale in El Higuerón (Fuengirola)",
        meta: "116 m² · 2 bed · 495.000 €",
        image: "/listings/higueron.jpg?v=2",
        href: "https://www.mmproperty.es/en/flat-for-sale-in-el-higueron-fuengirola/279799/s2",
      },
      {
        id: "fuengirola",
        area: "fuengirola",
        title: "Flat for sale in Fuengirola",
        meta: "123 m² · 3 bed · 1.051.500 €",
        image: "/listings/fuengirola.jpg?v=2",
        href: "https://www.mmproperty.es/en/flat-for-sale-in-fuengirola/279182/s2",
      },
      {
        id: "mijas-pueblo",
        area: "mijas",
        title: "Villa for sale in Mijas Pueblo",
        meta: "4 bed · 1.965.000 €",
        image: "/listings/mijas-pueblo.jpg?v=2",
        href: "https://www.mmproperty.es/en/villa-for-sale-in-mijas-pueblo-pena-blanquilla/273381/s2",
      },
      {
        id: "monteros",
        area: "marbella",
        title: "Flat for sale in Alto de los Monteros",
        meta: "125 m² · 3 bed · 835.000 €",
        image: "/listings/monteros.jpg?v=2",
        href: "https://www.mmproperty.es/en/flat-for-sale-in-alto-de-los-monteros-marbella/273145/s2",
      },
      {
        id: "monteros-two",
        area: "marbella",
        title: "Flat for sale in Alto de los Monteros",
        meta: "98 m² · 2 bed · 530.000 €",
        image: "/listings/monteros-2.jpg?v=2",
        href: "https://www.mmproperty.es/en/flat-for-sale-in-alto-de-los-monteros-marbella/273116/s2",
      },
      {
        id: "mijas-hipodromo",
        area: "mijas",
        title: "Flat for sale in Cerrado del Águila",
        meta: "117 m² · 3 bed · 425.000 €",
        image: "/listings/mijas-aguila.jpg?v=2",
        href: "https://www.mmproperty.es/en/flat-for-sale-in-hipodromo-cerrado-del-aguila-mijas/273062/s2",
      },
    ],
  },

  testimonials: {
    index: "07",
    eyebrow: "THE COAST",
    titleBefore: "Towns we",
    titleItalic: "work in",
    description:
      "Marbella, Fuengirola, Benalmádena, Mijas, and also Torremolinos and Estepona.",
    moreLabel: "Each town",
    moreHref: "/areas",
    image: "/media/costa-marbella.jpg?v=2",
    imageAlt: "Playa de la Fontanilla, Marbella",
    items: [
      {
        id: "t1",
        slug: "marbella",
        quote:
          "Luxury villas for sale, including Alto de los Monteros and the wider Marbella market.",
        name: "Marbella",
        role: "Villas and apartments",
        rating: 5,
      },
      {
        id: "t2",
        slug: "fuengirola",
        quote:
          "El Higuerón, beachfront homes and new builds about 150 metres from the sea.",
        name: "Fuengirola",
        role: "New build and resale",
        rating: 5,
      },
      {
        id: "t3",
        slug: "benalmadena",
        quote:
          "Pueblo and Costa, including new homes a short walk from the beach. The office is here.",
        name: "Benalmádena",
        role: "Home of the agency",
        rating: 5,
      },
      {
        id: "t4",
        slug: "mijas",
        quote:
          "Mijas Costa, La Cala and Mijas Pueblo, from golf-side townhouses to hillside villas.",
        name: "Mijas",
        role: "Costa and pueblo",
        rating: 5,
      },
      {
        id: "t5",
        slug: "torremolinos",
        quote:
          "Further listings along the bay, between Málaga and Benalmádena.",
        name: "Torremolinos",
        role: "On the same coast",
        rating: 5,
      },
      {
        id: "t6",
        slug: "estepona",
        quote:
          "Homes further west, when the search reaches past Marbella.",
        name: "Estepona",
        role: "West of Marbella",
        rating: 5,
      },
    ],
  },

  advisor: {
    eyebrow: "PERSONAL PERSPECTIVE",
    name: "M&M Property",
    title: "Costa del Sol agency",
    description:
      "The office is in Benalmádena. The same team advises buyers and sellers from the first viewing to the notary.",
    cta: "Talk to the office",
  },

  faq: {
    index: "08",
    eyebrow: "FAQ",
    title: "Frequently asked questions",
    subtitle: "Purchase, sale, or a question about a listing.",
    cta: "Contact the office",
    ctaHref: "/contact",
    footerNote: "Benalmádena · Costa del Sol",
    image: "/media/costa-mijas.jpg?v=2",
    imageAlt: "Mijas Pueblo, on the hillside above the coast",
    items: [
      {
        question: "What does M&M Property handle?",
        answer:
          "Purchase and sale of apartments, houses, luxury villas and townhouses on the Costa del Sol, both resale and new build. Rentals are listed on mmproperty.es as well.",
      },
      {
        question: "Where is the office?",
        answer:
          "Avd. de Tívoli, Centro Comercial Las Ventas, Local 48A, 29630 Benalmádena, Málaga.",
      },
      {
        question: "Which towns do you cover?",
        answer:
          "Marbella, Fuengirola, Benalmádena and Mijas Costa, plus other homes in Torremolinos and Estepona.",
      },
      {
        question: "I want to sell my home. What happens?",
        answer:
          "We advise on the market price and the steps to sell, then take the photos and video and advertise the property.",
      },
      {
        question: "How do I ask about a listing?",
        answer:
          "Call +34 653 223 015, +34 951 542 193 or +34 648 766 318, or write to info@mmproperty.es. Prices on this page should be confirmed on the live site.",
      },
    ],
  },

  contact: {
    index: "09",
    eyebrow: "CONTACT",
    tagline: "Purchase and sale · Costa del Sol",
    line1Light: "Talk to the",
    line1Muted: "Benalmádena",
    line2Before: "office",
    line2After: "today",
    cta: "Email us",
    ctaHref: "mailto:info@mmproperty.es",
    body: "Avd. de Tívoli, C.C. Las Ventas, Local 48A, 29630 Benalmádena. +34 653 223 015.",
    pageTitle: "The Benalmádena office.",
    pageText: "Call, write, or leave your details. The same team stays with you from the first question to the notary.",
    writeLabel: "Write to the office",
    address: ["Avd. de Tívoli, C.C. Las Ventas", "Local 48A", "29630 Benalmádena, Málaga"],
    image: "/section2.png",
    imageAlt: "Evening terrace overlooking the coast",
    email: "info@mmproperty.es",
    whatsapp: {
      phone: "34653223015",
      label: "WhatsApp",
      message: "Hello, I would like to know more about a property with M&M Property.",
    },
    socials: [
      { label: "WhatsApp", handle: "+34 653 223 015", href: "https://wa.me/34653223015" },
      { label: "Instagram", handle: "@mmpropertyrealestate", href: "https://www.instagram.com/mmpropertyrealestate/" },
      { label: "Facebook", handle: "M&M Property", href: "https://www.facebook.com/share/19nwa7Rp6i/?mibextid=wwXIfr" },
      { label: "TikTok", handle: "@mmproperty.io", href: "https://www.tiktok.com/@mmproperty.io" },
      { label: "LinkedIn", handle: "M&M Property", href: "https://www.linkedin.com/in/mm-property-7b792843b/" },
    ],
    chips: ["Purchase & sale", "Costa del Sol"],
    footerNav: [
      { label: "Homes", href: "/homes" },
      { label: "Areas", href: "/areas" },
      { label: "How we work", href: "/sell" },
      { label: "About", href: "/about" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
    footerNote: "M&M Property · Benalmádena",
    photoCredit:
      "Coast photos: Los Boliches, Fuengirola · Playa de la Fontanilla, Marbella · Mijas Pueblo · Benalmádena cable car (robbie jim, CC BY 2.0) · Playamar, Torremolinos (Hans Olav Lien, CC BY-SA 3.0) · Estepona (kallerna, CC BY-SA 4.0). Wikimedia Commons.",
  },

  pages: {
    homeLabel: "Home",
    backHome: "Back to the home page",
    backToAreas: "All towns",
    emptyHomes: "Ask the office for current homes in this town. The live list is on mmproperty.es.",
    portfolio: "Open the live portfolio",
    homes: {
      eyebrow: "HOMES",
      title: "Homes for sale on the Costa del Sol.",
      description:
        "Apartments, villas and new builds from the Benalmádena office. This is a selection. Confirm the price on the live listing.",
      seoTitle: "Homes for sale on the Costa del Sol | M&M Property",
      seoDescription:
        "Apartments, villas and new builds for sale in Marbella, Fuengirola, Benalmádena and Mijas. M&M Property, office in Benalmádena.",
      viewListing: "View on mmproperty.es",
      links: [
        { label: "All homes", href: "https://www.mmproperty.es/en/properties/s1/1907" },
        { label: "For sale", href: "https://www.mmproperty.es/en/browser/s1?quick_search[tof]=1" },
        { label: "For rent", href: "https://www.mmproperty.es/en/browser/s1?quick_search[tof]=2" },
      ],
    },
    areas: {
      eyebrow: "THE COAST",
      title: "Towns we work in.",
      description:
        "The office is in Benalmádena. The search runs from Torremolinos to Estepona.",
      seoTitle: "Costa del Sol towns | M&M Property",
      seoDescription:
        "M&M Property works in Marbella, Fuengirola, Benalmádena, Mijas, Torremolinos and Estepona. Office in Benalmádena.",
      towns: [
        {
          slug: "marbella",
          name: "Marbella",
          role: "Villas and apartments",
          text: "Luxury villas for sale, including Alto de los Monteros and the wider Marbella market.",
          image: "/media/costa-marbella.jpg?v=2",
          imageAlt: "Playa de la Fontanilla, Marbella",
          seoTitle: "Homes for sale in Marbella | M&M Property",
          seoDescription:
            "Villas and apartments for sale in Marbella, including Alto de los Monteros. M&M Property, Benalmádena.",
        },
        {
          slug: "fuengirola",
          name: "Fuengirola",
          role: "New build and resale",
          text: "El Higuerón, beachfront homes and new builds about 150 metres from the sea.",
          image: "/media/costa-fuengirola.jpg?v=2",
          imageAlt: "Los Boliches, Fuengirola",
          seoTitle: "Homes for sale in Fuengirola | M&M Property",
          seoDescription:
            "Apartments and new builds for sale in Fuengirola and El Higuerón. M&M Property, Benalmádena.",
        },
        {
          slug: "benalmadena",
          name: "Benalmádena",
          role: "Home of the agency",
          text: "Pueblo and Costa, including new homes a short walk from the beach. The office is here, at C.C. Las Ventas on Avenida de Tívoli.",
          image: "/media/costa-benalmadena.jpg?v=1",
          imageAlt: "Benalmádena cable car above the coast",
          seoTitle: "Homes for sale in Benalmádena | M&M Property",
          seoDescription:
            "The M&M Property office is in Benalmádena. Homes for sale in Benalmádena Pueblo and Benalmádena Costa.",
        },
        {
          slug: "mijas",
          name: "Mijas",
          role: "Costa and pueblo",
          text: "Mijas Costa, La Cala and Mijas Pueblo, from golf-side townhouses to hillside villas.",
          image: "/media/costa-mijas.jpg?v=2",
          imageAlt: "Mijas Pueblo",
          seoTitle: "Homes for sale in Mijas | M&M Property",
          seoDescription:
            "Villas and apartments for sale in Mijas Pueblo, Mijas Costa and La Cala. M&M Property, Benalmádena.",
        },
        {
          slug: "torremolinos",
          name: "Torremolinos",
          role: "On the same coast",
          text: "Further listings along the bay, between Málaga and Benalmádena.",
          image: "/media/costa-torremolinos.jpg?v=1",
          imageAlt: "Playamar beach in Torremolinos",
          seoTitle: "Homes for sale in Torremolinos | M&M Property",
          seoDescription:
            "Homes for sale in Torremolinos, between Málaga and Benalmádena. Ask the M&M Property office.",
        },
        {
          slug: "estepona",
          name: "Estepona",
          role: "West of Marbella",
          text: "Homes further west, when the search reaches past Marbella.",
          image: "/media/costa-estepona.jpg?v=1",
          imageAlt: "Aerial view of Estepona and the marina",
          seoTitle: "Homes for sale in Estepona | M&M Property",
          seoDescription:
            "Homes for sale in Estepona, west of Marbella. M&M Property, office in Benalmádena.",
        },
      ],
    },
    sell: {
      eyebrow: "HOW WE WORK",
      title: "From the first viewing to the notary.",
      description:
        "The same Benalmádena team handles the search, the price and the signing, whether you are buying or selling.",
      seoTitle: "How we sell and buy homes | M&M Property",
      seoDescription:
        "M&M Property advises on the price, prepares the photos and stays with the sale or purchase until the notary. Office in Benalmádena.",
      imageAlt: "Evening terrace overlooking the coast",
    },
    contact: {
      seoTitle: "Contact the Benalmádena office | M&M Property",
      seoDescription:
        "Call +34 653 223 015 or email info@mmproperty.es. M&M Property, Avenida de Tívoli, C.C. Las Ventas, Benalmádena.",
    },
    faq: {
      seoTitle: "Questions about buying or selling | M&M Property",
      seoDescription:
        "What M&M Property handles, where the office is, and which Costa del Sol towns the agency covers.",
    },
    about: {
      eyebrow: "COMPANY",
      title: "A Costa del Sol agency.",
      seoTitle: "About M&M Property | Costa del Sol agency",
      seoDescription:
        "M&M Property is a Costa del Sol agency with more than 29 years selling homes of every kind, from the search through to the deed before a notary.",
      image: "/section2.png",
      imageAlt: "Evening terrace overlooking the Costa del Sol",
      paragraphs: [
        "M&M Property is a real estate agency specialising in the Costa del Sol, with more than 29 years of experience selling homes of every kind. The service runs from finding the right home for each client, through the advice, to closing the purchase by signing the deed before a notary.",
        "The office offers apartments, houses, luxury villas, townhouses and semi-detached homes, both resale and a wide range of new builds.",
        "Whether you want a home to live in, or a property to invest in on the Costa del Sol, the office will look for the right one. The portfolio includes luxury villas for sale in Marbella, apartments in Benalmádena, new developments in Fuengirola, homes in Mijas Costa, and other properties in Torremolinos and Estepona.",
        "If you own a home and want a trusted agency to sell it, the office advises on the market price and every step of the sale, then takes the photos and video used to advertise the property.",
      ],
      close: "Do not hesitate to get in touch. The team will be glad to meet you.",
      phones: [
        { label: "+34 653 223 015", href: "tel:+34653223015" },
        { label: "+34 951 542 193", href: "tel:+34951542193" },
        { label: "+34 648 766 318", href: "tel:+34648766318" },
      ],
      email: "info@mmproperty.es",
      address: ["Avd. de Tívoli", "Centro comercial Las Ventas, Local 48A", "29630 Benalmádena"],
      contactLabel: "The office",
    },
    notFound: {
      title: "This page is not on the site.",
      description: "The home page, the homes and the towns are still here.",
      cta: "Back to the home page",
    },
  },

  offer: {
    eyebrow: "EARLY ACCESS",
    title: "Homes on the Costa del Sol.",
    text: "Leave your email and go to the live portfolio. We use it only to tell you about new listings.",
    formIntro: "Send your details and the office can call or email you about homes you are interested in.",
    error: "We could not save those details. Please try again.",
    sent: "Saved. The office can reach you on this phone or email.",
    nameLabel: "Name",
    namePlaceholder: "Your name",
    phoneLabel: "Phone",
    phonePlaceholder: "+34 …",
    emailLabel: "Email",
    placeholder: "you@email.com",
    noteLabel: "What are you looking for?",
    notePlaceholder: "A flat in Fuengirola, a villa in Mijas…",
    submit: "View properties",
    send: "Send",
    href: "https://www.mmproperty.es/en",
    close: "Close",
  },
} as const;

/** Widen string literals so FR/EN content share one structural type. */
type DeepStringify<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? DeepStringify<U>[]
        : T extends object
          ? { [K in keyof T]: DeepStringify<T[K]> }
          : T;

export type SiteContent = DeepStringify<typeof content>;
