import type { SiteContent } from "@/content";

export const es: SiteContent = {
  brand: {
    initials: "M&M",
    name: "M&M Property",
    title: "Viviendas en venta y alquiler en la Costa del Sol",
  },
  nav: [
    { label: "La agencia", href: "#experience" },
    { label: "Viviendas", href: "#listings" },
    { label: "Contacto", href: "#contact" },
  ],
  hero: {
    titleBefore: "Viviendas en la",
    titleItalic: "Costa del Sol.",
    description:
      "Pisos, casas y villas en venta y alquiler, de Benalmádena a Marbella.",
    cta: "Ver la cartera",
    ctaHref: "https://www.mmproperty.es/es",
    scrollLabel: "DESLIZA PARA VER",
    stats: [
      { value: "15+", label: "Años en la costa" },
      { value: "Venta y alquiler", label: "Obra nueva y segunda mano" },
      { value: "Benalmádena", label: "Oficina en la costa" },
    ],
  },
  media: {
    src: "/hero-bg.mp4?v=2",
    poster: "/hero-poster.jpg?v=3",
    logo: "/mm-property-logo.png?v=3",
    places: [
      { src: "/media/costa-marbella.jpg?v=1", label: "Marbella" },
      { src: "/media/costa-fuengirola.jpg?v=1", label: "Fuengirola" },
      { src: "/media/costa-mijas.jpg?v=1", label: "Mijas Pueblo" },
    ],
  },
  experience: {
    index: "01",
    eyebrow: "LA AGENCIA",
    headline: [
      [
        { text: "M&M Property", tone: "strong" },
        { text: " encuentra la vivienda", tone: "muted" },
      ],
      [
        { text: "y le acompaña hasta", tone: "muted" },
        { text: " la notaría.", tone: "strong" },
      ],
      [{ text: "Villas, pisos y obra nueva", tone: "strong" }],
      [{ text: "en Marbella, Fuengirola,", tone: "muted" }],
      [{ text: "Benalmádena y Mijas.", tone: "strong" }],
    ],
    body: "Agencia de la Costa del Sol con más de 15 años en la venta de todo tipo de viviendas. La búsqueda, el asesoramiento y la compra se hacen juntos, tanto si se muda como si compra para invertir.",
    cta: "Cómo trabajamos",
    ctaHref: "#process",
  },
  processSection: {
    index: "02",
    title: "Cómo trabajamos",
    background: "/media/costa-fuengirola.jpg?v=1",
  },
  process: [
    {
      number: "01",
      tag: "BÚSQUEDA",
      title: "Encontrar la vivienda",
      description:
        "Pisos, casas, villas de lujo y adosados, de segunda mano o de obra nueva, según quiera vivir o invertir.",
    },
    {
      number: "02",
      tag: "ASESORÍA",
      title: "Precio y siguientes pasos",
      description:
        "¿Vende? Asesoramos sobre el precio de mercado y los pasos para anunciarla, y preparamos las fotos y el vídeo.",
    },
    {
      number: "03",
      tag: "CIERRE",
      title: "Hasta la notaría",
      description:
        "El mismo equipo acompaña la compra o la venta hasta la firma de la escritura.",
    },
  ],
  report: {
    index: "03",
    eyebrow: "UNA VIVIENDA",
    title: "Una casa para vivir, o una casa para invertir.",
    description:
      "Residencia habitual o inversión en la Costa del Sol. La cartera va de Benalmádena Pueblo a El Higuerón, incluidas viviendas en construcción.",
    sample: {
      brand: "M&M Property",
      docLabel: "En venta",
      property: "El Higuerón, Fuengirola",
      propertyType: "Piso · 2 dorm. · 116 m²",
      rangeLow: "495.000 €",
      rangeHigh: "",
      rangeLabel: "Precio",
      strengthsLabel: "Puntos de la vivienda",
      strengths: [
        "Jardín privado y terraza de 36 m²",
        "Piscina, solárium y jardines comunitarios",
        "El Higuerón, con spa, sport club y beach club",
      ],
      limitation:
        "Los precios salen de la cartera en vivo y pueden cambiar. Confirme el anuncio en mmproperty.es.",
    },
    floaters: [
      { label: "AÑOS", value: "15+", position: "left-top" },
      { label: "OFICINA", value: "Benalmádena", position: "right-top" },
      { label: "OBRA", value: "Nueva", position: "left-bottom" },
      { label: "SEGUNDA", value: "Mano", position: "right-bottom" },
    ],
    cta: "Ver viviendas",
    ctaHref: "https://www.mmproperty.es/es",
  },
  listings: {
    index: "04",
    eyebrow: "VIVIENDAS",
    title: "Pisos, villas y obra nueva a lo largo de la costa.",
    description:
      "Una selección de la cartera en vivo. Los precios deben confirmarse en mmproperty.es.",
    items: [
      {
        id: "higueron",
        title: "Piso en venta en El Higuerón (Fuengirola)",
        meta: "116 m² · 2 dorm. · 495.000 €",
        image: "/listings/higueron.jpg",
        href: "https://www.mmproperty.es/es/piso-en-venta-en-el-higueron-fuengirola/279799/s2",
      },
      {
        id: "fuengirola",
        title: "Piso en venta en Fuengirola",
        meta: "123 m² · 3 dorm. · 1.051.500 €",
        image: "/listings/fuengirola.jpg",
        href: "https://www.mmproperty.es/es/piso-en-venta-en-fuengirola/279182/s2",
      },
      {
        id: "mijas-pueblo",
        title: "Villa en venta en Mijas Pueblo",
        meta: "4 dorm. · 1.965.000 €",
        image: "/listings/mijas-pueblo.jpg",
        href: "https://www.mmproperty.es/es/villa-en-venta-en-mijas-pueblo-pena-blanquilla/273381/s2",
      },
      {
        id: "monteros",
        title: "Piso en venta en Alto de los Monteros",
        meta: "125 m² · 3 dorm. · 835.000 €",
        image: "/listings/monteros.jpg",
        href: "https://www.mmproperty.es/es/piso-en-venta-en-alto-de-los-monteros-marbella/273145/s2",
      },
      {
        id: "monteros-two",
        title: "Piso en venta en Alto de los Monteros",
        meta: "98 m² · 2 dorm. · 530.000 €",
        image: "/listings/monteros-2.jpg",
        href: "https://www.mmproperty.es/es/piso-en-venta-en-alto-de-los-monteros-marbella/273116/s2",
      },
      {
        id: "mijas-hipodromo",
        title: "Piso en venta en Cerrado del Águila",
        meta: "117 m² · 3 dorm. · 425.000 €",
        image: "/listings/mijas-aguila.jpg",
        href: "https://www.mmproperty.es/es/piso-en-venta-en-hipodromo-cerrado-del-aguila-mijas/273062/s2",
      },
    ],
  },
  testimonials: {
    index: "05",
    eyebrow: "ZONAS",
    titleBefore: "Municipios en los",
    titleItalic: "que trabajamos",
    description:
      "Marbella, Fuengirola, Benalmádena, Mijas, y también Torremolinos y Estepona.",
    image: "/media/costa-marbella.jpg?v=1",
    imageAlt: "Playa de la Fontanilla, Marbella",
    items: [
      {
        id: "t1",
        quote:
          "Villas de lujo en venta, incluido Alto de los Monteros y el resto del mercado de Marbella.",
        name: "Marbella",
        role: "Villas y pisos",
        rating: 5,
      },
      {
        id: "t2",
        quote:
          "El Higuerón, viviendas junto al mar y obra nueva a unos 150 metros del mar.",
        name: "Fuengirola",
        role: "Obra nueva y segunda mano",
        rating: 5,
      },
      {
        id: "t3",
        quote:
          "Pueblo y Costa, incluidas viviendas nuevas a un paso de la playa. La oficina está aquí.",
        name: "Benalmádena",
        role: "Sede de la agencia",
        rating: 5,
      },
      {
        id: "t4",
        quote:
          "Mijas Costa, La Cala y Mijas Pueblo, de adosados junto al golf a villas en la ladera.",
        name: "Mijas",
        role: "Costa y pueblo",
        rating: 5,
      },
      {
        id: "t5",
        quote: "Más viviendas en la bahía, entre Málaga y Benalmádena.",
        name: "Torremolinos",
        role: "En la misma costa",
        rating: 5,
      },
      {
        id: "t6",
        quote: "Viviendas más al oeste, cuando la búsqueda pasa de Marbella.",
        name: "Estepona",
        role: "Al oeste de Marbella",
        rating: 5,
      },
    ],
  },
  advisor: {
    eyebrow: "LA OFICINA",
    name: "M&M Property",
    title: "Agencia de la Costa del Sol",
    description:
      "La oficina está en Benalmádena. El mismo equipo asesora a compradores y vendedores desde la primera visita hasta la notaría.",
    cta: "Hablar con la oficina",
  },
  faq: {
    index: "06",
    eyebrow: "FAQ",
    title: "Preguntas frecuentes",
    subtitle: "Compra, venta o una duda sobre un anuncio.",
    cta: "Contactar con la oficina",
    ctaHref: "#contact",
    footerNote: "Benalmádena · Costa del Sol",
    image: "/media/costa-mijas.jpg?v=1",
    imageAlt: "Mijas Pueblo, en la ladera sobre la costa",
    items: [
      {
        question: "¿Qué gestiona M&M Property?",
        answer:
          "Compra y venta de pisos, casas, villas de lujo y adosados en la Costa del Sol, de segunda mano y de obra nueva. Los alquileres también están en mmproperty.es.",
      },
      {
        question: "¿Dónde está la oficina?",
        answer:
          "Avd. de Tívoli, Centro Comercial Las Ventas, Local 48A, 29630 Benalmádena, Málaga.",
      },
      {
        question: "¿Qué municipios cubren?",
        answer:
          "Marbella, Fuengirola, Benalmádena y Mijas Costa, además de otras viviendas en Torremolinos y Estepona.",
      },
      {
        question: "Quiero vender mi vivienda. ¿Qué ocurre?",
        answer:
          "Asesoramos sobre el precio de mercado y los pasos para vender, y después hacemos las fotos y el vídeo y anunciamos la vivienda.",
      },
      {
        question: "¿Cómo pregunto por un anuncio?",
        answer:
          "Llame al +34 653 223 015, +34 951 542 193 o +34 648 766 318, o escriba a info@mmproperty.es. Los precios de esta página deben confirmarse en la web.",
      },
    ],
  },
  contact: {
    index: "07",
    eyebrow: "CONTACTO",
    tagline: "Compra y venta · Costa del Sol",
    line1Light: "Hable con la oficina de",
    line1Muted: "Benalmádena",
    line2Before: "hoy",
    line2After: "mismo",
    cta: "Escríbanos",
    ctaHref: "mailto:info@mmproperty.es",
    body: "Avd. de Tívoli, C.C. Las Ventas, Local 48A, 29630 Benalmádena. +34 653 223 015.",
    email: "info@mmproperty.es",
    whatsapp: {
      phone: "34653223015",
      label: "WhatsApp",
      message: "Hola, me gustaría saber más sobre una vivienda de M&M Property.",
    },
    socials: [
      { label: "Instagram", handle: "@mmpropertyrealestate", href: "https://www.instagram.com/mmpropertyrealestate/" },
      { label: "Facebook", handle: "M&M Property", href: "https://www.facebook.com/share/19nwa7Rp6i/?mibextid=wwXIfr" },
    ],
    chips: ["Compra y venta", "Costa del Sol"],
    footerNav: [
      { label: "La agencia", href: "#experience" },
      { label: "Viviendas", href: "#listings" },
      { label: "Cómo trabajamos", href: "#process" },
      { label: "FAQ", href: "#faq" },
    ],
    footerNote: "M&M Property · Benalmádena",
    photoCredit:
      "Fotos de la costa: Los Boliches, Fuengirola · Playa de la Fontanilla, Marbella · Mijas Pueblo. Wikimedia Commons, CC BY-SA.",
  },
  offer: {
    eyebrow: "ACCESO ANTICIPADO",
    title: "Viviendas en la Costa del Sol.",
    text: "Deje su email y vaya a la cartera en vivo. Solo lo usamos para avisarle de nuevos anuncios.",
    error: "No hemos podido guardar el email. Inténtelo de nuevo.",
    emailLabel: "Email",
    placeholder: "usted@email.com",
    submit: "Ver viviendas",
    href: "https://www.mmproperty.es/es",
    close: "Cerrar",
  },
};
