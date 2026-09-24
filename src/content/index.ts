/**
 * English site content — secondary locale.
 */

export const content = {
  brand: {
    initials: "M&M",
    name: "M&M Property",
    title: "Homes for sale and rent on the Costa del Sol",
  },

  nav: [
    { label: "The agency", href: "#experience" },
    { label: "Homes", href: "#listings" },
    { label: "Contact", href: "#contact" },
  ],

  hero: {
    titleBefore: "Homes on the",
    titleItalic: "Costa del Sol.",
    description: "Apartments, houses and villas for sale and rent, from Benalmádena to Marbella.",
    cta: "View the portfolio",
    ctaHref: "https://www.mmproperty.es/en",
    scrollLabel: "SCROLL TO EXPLORE",
    stats: [
      { value: "15+", label: "Years on the coast" },
      { value: "Sale & rent", label: "New build and resale" },
      { value: "Benalmádena", label: "Office on the coast" },
    ],
  },

  /**
   * Hero media — self-hosted in /public/media/
   */
  media: {
    src: "/hero-bg.mp4",
    poster: "/hero-poster.jpg",
    logo: "/mm-property-logo.png?v=3",
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
    body: "A Costa del Sol agency with more than 15 years in the sale of every kind of home. The search, the advice and the purchase are handled together, whether you are moving here or buying to invest.",
    cta: "How we work",
    ctaHref: "#process",
  },

  processSection: {
    index: "02",
    title: "How we work",
    background: "/media/background_image.jpg?v=2",
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
    index: "03",
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
      { label: "YEARS", value: "15+", position: "left-top" },
      { label: "OFFICE", value: "Benalmádena", position: "right-top" },
      { label: "NEW", value: "Build", position: "left-bottom" },
      { label: "RESALE", value: "Homes", position: "right-bottom" },
    ],
    cta: "See all homes",
    ctaHref: "https://www.mmproperty.es/en",
  },

  listings: {
    index: "04",
    eyebrow: "LISTINGS",
    title:
      "Apartments, villas and new homes along the coast.",
    description:
      "A selection from the live portfolio. Prices should be confirmed on mmproperty.es.",
    items: [
      {
        id: "higueron",
        title: "Flat for sale in El Higuerón (Fuengirola)",
        meta: "116 m² · 2 bed · 495.000 €",
        image: "/listings/higueron.jpg",
        href: "https://www.mmproperty.es/en/flat-for-sale-in-el-higueron-fuengirola/279799/s2",
      },
      {
        id: "fuengirola",
        title: "Flat for sale in Fuengirola",
        meta: "123 m² · 3 bed · 1.051.500 €",
        image: "/listings/fuengirola.jpg",
        href: "https://www.mmproperty.es/en/flat-for-sale-in-fuengirola/279182/s2",
      },
      {
        id: "mijas-pueblo",
        title: "Villa for sale in Mijas Pueblo",
        meta: "4 bed · 1.965.000 €",
        image: "/listings/mijas-pueblo.jpg",
        href: "https://www.mmproperty.es/en/villa-for-sale-in-mijas-pueblo-pena-blanquilla/273381/s2",
      },
      {
        id: "monteros",
        title: "Flat for sale in Alto de los Monteros",
        meta: "125 m² · 3 bed · 835.000 €",
        image: "/listings/monteros.jpg",
        href: "https://www.mmproperty.es/en/flat-for-sale-in-alto-de-los-monteros-marbella/273145/s2",
      },
      {
        id: "monteros-two",
        title: "Flat for sale in Alto de los Monteros",
        meta: "98 m² · 2 bed · 530.000 €",
        image: "/listings/monteros-2.jpg",
        href: "https://www.mmproperty.es/en/flat-for-sale-in-alto-de-los-monteros-marbella/273116/s2",
      },
      {
        id: "mijas-hipodromo",
        title: "Flat for sale in Cerrado del Águila",
        meta: "117 m² · 3 bed · 425.000 €",
        image: "/listings/mijas-aguila.jpg",
        href: "https://www.mmproperty.es/en/flat-for-sale-in-hipodromo-cerrado-del-aguila-mijas/273062/s2",
      },
    ],
  },

  testimonials: {
    index: "05",
    eyebrow: "VOICES",
    titleBefore: "Towns we",
    titleItalic: "work in",
    description:
      "Marbella, Fuengirola, Benalmádena, Mijas, and also Torremolinos and Estepona.",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Advisor meeting with homeowners",
    items: [
      {
        id: "t1",
        quote:
          "Luxury villas for sale, including Alto de los Monteros and the wider Marbella market.",
        name: "Marbella",
        role: "Villas and apartments",
        rating: 5,
      },
      {
        id: "t2",
        quote:
          "El Higuerón, beachfront homes and new builds about 150 metres from the sea.",
        name: "Fuengirola",
        role: "New build and resale",
        rating: 5,
      },
      {
        id: "t3",
        quote:
          "Pueblo and Costa, including new homes a short walk from the beach. The office is here.",
        name: "Benalmádena",
        role: "Home of the agency",
        rating: 5,
      },
      {
        id: "t4",
        quote:
          "Mijas Costa, La Cala and Mijas Pueblo, from golf-side townhouses to hillside villas.",
        name: "Mijas",
        role: "Costa and pueblo",
        rating: 5,
      },
      {
        id: "t5",
        quote:
          "Further listings along the bay, between Málaga and Benalmádena.",
        name: "Torremolinos",
        role: "On the same coast",
        rating: 5,
      },
      {
        id: "t6",
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
    index: "06",
    eyebrow: "FAQ",
    title: "Frequently asked questions",
    subtitle: "Purchase, sale, or a question about a listing.",
    cta: "Contact the office",
    ctaHref: "#contact",
    footerNote: "Benalmádena · Costa del Sol",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Modern luxury villa exterior at dusk",
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
    index: "07",
    eyebrow: "CONTACT",
    tagline: "Purchase and sale · Costa del Sol",
    line1Light: "Talk to the",
    line1Muted: "Benalmádena",
    line2Before: "office",
    line2After: "today",
    cta: "Email us",
    ctaHref: "mailto:info@mmproperty.es",
    body: "Avd. de Tívoli, C.C. Las Ventas, Local 48A, 29630 Benalmádena. +34 653 223 015.",
    email: "info@mmproperty.es",
    whatsapp: {
      phone: "34653223015",
      label: "WhatsApp",
      message: "Hello, I would like to know more about a property with M&M Property.",
    },
    socials: [
      { label: "Instagram", handle: "@mmpropertyrealestate", href: "https://www.instagram.com/mmpropertyrealestate/" },
      { label: "Facebook", handle: "M&M Property", href: "https://www.facebook.com/share/19nwa7Rp6i/?mibextid=wwXIfr" },
    ],
    chips: ["Purchase & sale", "Costa del Sol"],
    footerNav: [
      { label: "The agency", href: "#experience" },
      { label: "Homes", href: "#listings" },
      { label: "How we work", href: "#process" },
      { label: "FAQ", href: "#faq" },
    ],
    footerNote: "M&M Property · Benalmádena",
  },

  offer: {
    eyebrow: "EARLY ACCESS",
    title: "Homes on the Costa del Sol.",
    text: "Leave your email and go to the live portfolio. We use it only to tell you about new listings.",
    error: "We could not save that email. Please try again.",
    emailLabel: "Email",
    placeholder: "you@email.com",
    submit: "View properties",
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
