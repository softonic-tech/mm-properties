import type { SiteContent } from "@/content";

export const es: SiteContent = {
  brand: {
    initials: "M&M",
    name: "M&M Property",
    title: "Viviendas en venta y alquiler en la Costa del Sol",
    phone: "+34 653 223 015",
    phoneHref: "tel:+34653223015",
    phoneAria: "Llamar al +34 653 223 015",
  },
  nav: [
    { label: "Viviendas", href: "/homes" },
    { label: "Zonas", href: "/areas" },
    { label: "Cómo trabajamos", href: "/sell" },
    { label: "Contacto", href: "/contact" },
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
      { src: "/media/costa-marbella.jpg?v=2", label: "Marbella" },
      { src: "/media/costa-fuengirola.jpg?v=2", label: "Fuengirola" },
      { src: "/media/costa-mijas.jpg?v=2", label: "Mijas Pueblo" },
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
    ctaHref: "/sell",
    images: [
      {
        src: "/listings/mijas-pueblo.jpg?v=2",
        alt: "Villa con piscina en Mijas Pueblo",
        label: "Mijas Pueblo",
        caption: "Villa en venta",
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
    eyebrow: "LA BÚSQUEDA",
    title: "Tu próxima casa empieza aquí",
    description:
      "Explora una selección de obra nueva, villas de lujo y pisos listos para entrar en la Costa del Sol.",
    items: [
      {
        title: "Obra nueva",
        text: "Una selección de las mejores promociones de obra nueva de la Costa del Sol.",
        image: "/listings/development.jpg?v=1",
        alt: "Salón de una vivienda de obra nueva en la Costa del Sol",
        href: "https://www.mmproperty.es/es/piso-en-venta-en-el-higueron-fuengirola/279799/s2",
        points: ["Residencias de marca", "Potencial de inversión", "Alta rentabilidad al entregar"],
      },
      {
        title: "Villas exclusivas",
        text: "Las mejores villas en las zonas más prestigiosas de la Costa del Sol.",
        image: "/listings/villas.webp?v=1",
        alt: "Villa en la ladera con piscina en la Costa del Sol",
        href: "https://www.mmproperty.es/es/villa-en-venta-en-mijas-pueblo-pena-blanquilla/273381/s2",
        points: ["Ubicaciones prime", "Viviendas de prestigio", "Amplia cartera de villas"],
      },
      {
        title: "Segunda mano",
        text: "Pisos listos para entrar en las mejores zonas de la Costa del Sol.",
        image: "/listings/Resale.webp?v=1",
        alt: "Dormitorio de un piso de segunda mano en la Costa del Sol",
        href: "https://www.mmproperty.es/es/piso-en-venta-en-fuengirola/279182/s2",
        points: ["Listos para entrar", "Urbanizaciones cerradas", "Mejores ubicaciones"],
      },
      {
        title: "Alquiler",
        text: "Una cartera de pisos en alquiler en las zonas principales de la Costa del Sol.",
        image: "/listings/rental.jpg?v=1",
        alt: "Salón de un piso en alquiler en la Costa del Sol",
        href: "https://www.mmproperty.es/es",
        points: ["Propiedades de lujo", "Alquiler de corta y larga duración", "Comunidades exclusivas"],
      },
    ],
  },
  processSection: {
    index: "03",
    eyebrow: "El proceso",
    title: "Cómo trabajamos",
    background: "/section2.png",
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
    index: "04",
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
  feature: {
    index: "05",
    eyebrow: "UNA CASA",
    place: "Mijas Pueblo",
    title: "Una villa con piscina, sobre la costa.",
    text: "Cuatro dormitorios en Mijas Pueblo. La misma oficina que la anuncia acompaña al comprador en el precio, la visita y la escritura.",
    image: "/listings/mijas-pueblo.jpg?v=2",
    imageAlt: "Villa con piscina en Mijas Pueblo",
    facts: [
      { label: "Dormitorios", value: "4" },
      { label: "Exterior", value: "Piscina" },
      { label: "Precio", value: "1.965.000 €" },
    ],
    cta: "Ver esta vivienda",
    ctaHref:
      "https://www.mmproperty.es/es/villa-en-venta-en-mijas-pueblo-pena-blanquilla/273381/s2",
  },
  listings: {
    index: "06",
    eyebrow: "VIVIENDAS",
    title: "Pisos, villas y obra nueva a lo largo de la costa.",
    description:
      "Una selección de la cartera en vivo. Los precios deben confirmarse en mmproperty.es.",
    items: [
      {
        id: "higueron",
        area: "fuengirola",
        title: "Piso en venta en El Higuerón (Fuengirola)",
        meta: "116 m² · 2 dorm. · 495.000 €",
        image: "/listings/higueron.jpg?v=2",
        href: "https://www.mmproperty.es/es/piso-en-venta-en-el-higueron-fuengirola/279799/s2",
      },
      {
        id: "fuengirola",
        area: "fuengirola",
        title: "Piso en venta en Fuengirola",
        meta: "123 m² · 3 dorm. · 1.051.500 €",
        image: "/listings/fuengirola.jpg?v=2",
        href: "https://www.mmproperty.es/es/piso-en-venta-en-fuengirola/279182/s2",
      },
      {
        id: "mijas-pueblo",
        area: "mijas",
        title: "Villa en venta en Mijas Pueblo",
        meta: "4 dorm. · 1.965.000 €",
        image: "/listings/mijas-pueblo.jpg?v=2",
        href: "https://www.mmproperty.es/es/villa-en-venta-en-mijas-pueblo-pena-blanquilla/273381/s2",
      },
      {
        id: "monteros",
        area: "marbella",
        title: "Piso en venta en Alto de los Monteros",
        meta: "125 m² · 3 dorm. · 835.000 €",
        image: "/listings/monteros.jpg?v=2",
        href: "https://www.mmproperty.es/es/piso-en-venta-en-alto-de-los-monteros-marbella/273145/s2",
      },
      {
        id: "monteros-two",
        area: "marbella",
        title: "Piso en venta en Alto de los Monteros",
        meta: "98 m² · 2 dorm. · 530.000 €",
        image: "/listings/monteros-2.jpg?v=2",
        href: "https://www.mmproperty.es/es/piso-en-venta-en-alto-de-los-monteros-marbella/273116/s2",
      },
      {
        id: "mijas-hipodromo",
        area: "mijas",
        title: "Piso en venta en Cerrado del Águila",
        meta: "117 m² · 3 dorm. · 425.000 €",
        image: "/listings/mijas-aguila.jpg?v=2",
        href: "https://www.mmproperty.es/es/piso-en-venta-en-hipodromo-cerrado-del-aguila-mijas/273062/s2",
      },
    ],
  },
  testimonials: {
    index: "07",
    eyebrow: "ZONAS",
    titleBefore: "Municipios en los",
    titleItalic: "que trabajamos",
    description:
      "Marbella, Fuengirola, Benalmádena, Mijas, y también Torremolinos y Estepona.",
    moreLabel: "Cada municipio",
    moreHref: "/areas",
    image: "/media/costa-marbella.jpg?v=2",
    imageAlt: "Playa de la Fontanilla, Marbella",
    items: [
      {
        id: "t1",
        slug: "marbella",
        quote:
          "Villas de lujo en venta, incluido Alto de los Monteros y el resto del mercado de Marbella.",
        name: "Marbella",
        role: "Villas y pisos",
        rating: 5,
      },
      {
        id: "t2",
        slug: "fuengirola",
        quote:
          "El Higuerón, viviendas junto al mar y obra nueva a unos 150 metros del mar.",
        name: "Fuengirola",
        role: "Obra nueva y segunda mano",
        rating: 5,
      },
      {
        id: "t3",
        slug: "benalmadena",
        quote:
          "Pueblo y Costa, incluidas viviendas nuevas a un paso de la playa. La oficina está aquí.",
        name: "Benalmádena",
        role: "Sede de la agencia",
        rating: 5,
      },
      {
        id: "t4",
        slug: "mijas",
        quote:
          "Mijas Costa, La Cala y Mijas Pueblo, de adosados junto al golf a villas en la ladera.",
        name: "Mijas",
        role: "Costa y pueblo",
        rating: 5,
      },
      {
        id: "t5",
        slug: "torremolinos",
        quote: "Más viviendas en la bahía, entre Málaga y Benalmádena.",
        name: "Torremolinos",
        role: "En la misma costa",
        rating: 5,
      },
      {
        id: "t6",
        slug: "estepona",
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
    index: "08",
    eyebrow: "FAQ",
    title: "Preguntas frecuentes",
    subtitle: "Compra, venta o una duda sobre un anuncio.",
    cta: "Contactar con la oficina",
    ctaHref: "/contact",
    footerNote: "Benalmádena · Costa del Sol",
    image: "/media/costa-mijas.jpg?v=2",
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
    index: "09",
    eyebrow: "CONTACTO",
    tagline: "Compra y venta · Costa del Sol",
    line1Light: "Hable con la oficina de",
    line1Muted: "Benalmádena",
    line2Before: "hoy",
    line2After: "mismo",
    cta: "Escríbanos",
    ctaHref: "mailto:info@mmproperty.es",
    body: "Avd. de Tívoli, C.C. Las Ventas, Local 48A, 29630 Benalmádena. +34 653 223 015.",
    pageTitle: "La oficina de Benalmádena.",
    pageText: "Llame, escriba o deje sus datos. El mismo equipo le acompaña desde la primera pregunta hasta el notario.",
    writeLabel: "Escriba a la oficina",
    address: ["Avd. de Tívoli, C.C. Las Ventas", "Local 48A", "29630 Benalmádena, Málaga"],
    image: "/section2.png",
    imageAlt: "Terraza al atardecer con vistas a la costa",
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
      { label: "Viviendas", href: "/homes" },
      { label: "Zonas", href: "/areas" },
      { label: "Cómo trabajamos", href: "/sell" },
      { label: "FAQ", href: "/faq" },
      { label: "Contacto", href: "/contact" },
    ],
    footerNote: "M&M Property · Benalmádena",
    photoCredit:
      "Fotos de la costa: Los Boliches, Fuengirola · Playa de la Fontanilla, Marbella · Mijas Pueblo · Teleférico de Benalmádena (robbie jim, CC BY 2.0) · Playamar, Torremolinos (Hans Olav Lien, CC BY-SA 3.0) · Estepona (kallerna, CC BY-SA 4.0). Wikimedia Commons.",
  },
  pages: {
    homeLabel: "Inicio",
    backHome: "Volver al inicio",
    backToAreas: "Todos los municipios",
    emptyHomes:
      "Pregunte en la oficina por las viviendas actuales de este municipio. La lista en vivo está en mmproperty.es.",
    portfolio: "Abrir la cartera en vivo",
    homes: {
      eyebrow: "VIVIENDAS",
      title: "Viviendas en venta en la Costa del Sol.",
      description:
        "Pisos, villas y obra nueva desde la oficina de Benalmádena. Es una selección. Confirme el precio en el anuncio.",
      seoTitle: "Viviendas en venta en la Costa del Sol | M&M Property",
      seoDescription:
        "Pisos, villas y obra nueva en venta en Marbella, Fuengirola, Benalmádena y Mijas. M&M Property, oficina en Benalmádena.",
      viewListing: "Ver en mmproperty.es",
      links: [
        { label: "Todas las viviendas", href: "https://www.mmproperty.es/es/propiedades/s1/1907" },
        { label: "En venta", href: "https://www.mmproperty.es/es/browser/s1?quick_search[tof]=1" },
        { label: "En alquiler", href: "https://www.mmproperty.es/es/browser/s1?quick_search[tof]=2" },
      ],
    },
    areas: {
      eyebrow: "LA COSTA",
      title: "Municipios en los que trabajamos.",
      description:
        "La oficina está en Benalmádena. La búsqueda va de Torremolinos a Estepona.",
      seoTitle: "Municipios de la Costa del Sol | M&M Property",
      seoDescription:
        "M&M Property trabaja en Marbella, Fuengirola, Benalmádena, Mijas, Torremolinos y Estepona. Oficina en Benalmádena.",
      towns: [
        {
          slug: "marbella",
          name: "Marbella",
          role: "Villas y pisos",
          text: "Villas de lujo en venta, incluido Alto de los Monteros y el resto del mercado de Marbella.",
          image: "/media/costa-marbella.jpg?v=2",
          imageAlt: "Playa de la Fontanilla, Marbella",
          seoTitle: "Viviendas en venta en Marbella | M&M Property",
          seoDescription:
            "Villas y pisos en venta en Marbella, incluido Alto de los Monteros. M&M Property, Benalmádena.",
        },
        {
          slug: "fuengirola",
          name: "Fuengirola",
          role: "Obra nueva y segunda mano",
          text: "El Higuerón, viviendas junto al mar y obra nueva a unos 150 metros del mar.",
          image: "/media/costa-fuengirola.jpg?v=2",
          imageAlt: "Los Boliches, Fuengirola",
          seoTitle: "Viviendas en venta en Fuengirola | M&M Property",
          seoDescription:
            "Pisos y obra nueva en venta en Fuengirola y El Higuerón. M&M Property, Benalmádena.",
        },
        {
          slug: "benalmadena",
          name: "Benalmádena",
          role: "Sede de la agencia",
          text: "Pueblo y Costa, incluidas viviendas nuevas a un paso de la playa. La oficina está aquí, en el C.C. Las Ventas de la Avenida de Tívoli.",
          image: "/media/costa-benalmadena.jpg?v=1",
          imageAlt: "Teleférico de Benalmádena sobre la costa",
          seoTitle: "Viviendas en venta en Benalmádena | M&M Property",
          seoDescription:
            "La oficina de M&M Property está en Benalmádena. Viviendas en venta en Benalmádena Pueblo y Benalmádena Costa.",
        },
        {
          slug: "mijas",
          name: "Mijas",
          role: "Costa y pueblo",
          text: "Mijas Costa, La Cala y Mijas Pueblo, de adosados junto al golf a villas en la ladera.",
          image: "/media/costa-mijas.jpg?v=2",
          imageAlt: "Mijas Pueblo",
          seoTitle: "Viviendas en venta en Mijas | M&M Property",
          seoDescription:
            "Villas y pisos en venta en Mijas Pueblo, Mijas Costa y La Cala. M&M Property, Benalmádena.",
        },
        {
          slug: "torremolinos",
          name: "Torremolinos",
          role: "En la misma costa",
          text: "Más viviendas en la bahía, entre Málaga y Benalmádena.",
          image: "/media/costa-torremolinos.jpg?v=1",
          imageAlt: "Playa de Playamar, Torremolinos",
          seoTitle: "Viviendas en venta en Torremolinos | M&M Property",
          seoDescription:
            "Viviendas en venta en Torremolinos, entre Málaga y Benalmádena. Consulte la oficina de M&M Property.",
        },
        {
          slug: "estepona",
          name: "Estepona",
          role: "Al oeste de Marbella",
          text: "Viviendas más al oeste, cuando la búsqueda pasa de Marbella.",
          image: "/media/costa-estepona.jpg?v=1",
          imageAlt: "Vista aérea de Estepona y el puerto",
          seoTitle: "Viviendas en venta en Estepona | M&M Property",
          seoDescription:
            "Viviendas en venta en Estepona, al oeste de Marbella. M&M Property, oficina en Benalmádena.",
        },
      ],
    },
    sell: {
      eyebrow: "CÓMO TRABAJAMOS",
      title: "De la primera visita a la notaría.",
      description:
        "El mismo equipo de Benalmádena lleva la búsqueda, el precio y la firma, tanto si compra como si vende.",
      seoTitle: "Cómo compramos y vendemos | M&M Property",
      seoDescription:
        "M&M Property asesora sobre el precio, prepara las fotos y acompaña la compra o la venta hasta la notaría. Oficina en Benalmádena.",
      imageAlt: "Terraza al atardecer con vistas a la costa",
    },
    contact: {
      seoTitle: "Contacto con la oficina de Benalmádena | M&M Property",
      seoDescription:
        "Llame al +34 653 223 015 o escriba a info@mmproperty.es. M&M Property, Avenida de Tívoli, C.C. Las Ventas, Benalmádena.",
    },
    faq: {
      seoTitle: "Preguntas sobre comprar o vender | M&M Property",
      seoDescription:
        "Qué gestiona M&M Property, dónde está la oficina y qué municipios de la Costa del Sol cubre.",
    },
    notFound: {
      title: "Esta página no está en el sitio.",
      description: "El inicio, las viviendas y los municipios siguen aquí.",
      cta: "Volver al inicio",
    },
  },
  offer: {
    eyebrow: "ACCESO ANTICIPADO",
    title: "Viviendas en la Costa del Sol.",
    text: "Deje su email y vaya a la cartera en vivo. Solo lo usamos para avisarle de nuevos anuncios.",
    formIntro: "Envíe sus datos y la oficina puede llamarle o escribirle sobre las viviendas que le interesan.",
    error: "No hemos podido guardar los datos. Inténtelo de nuevo.",
    sent: "Guardado. La oficina puede localizarle en este teléfono o email.",
    nameLabel: "Nombre",
    namePlaceholder: "Su nombre",
    phoneLabel: "Teléfono",
    phonePlaceholder: "+34 …",
    emailLabel: "Email",
    placeholder: "usted@email.com",
    noteLabel: "¿Qué está buscando?",
    notePlaceholder: "Un piso en Fuengirola, una villa en Mijas…",
    submit: "Ver viviendas",
    send: "Enviar",
    href: "https://www.mmproperty.es/es",
    close: "Cerrar",
  },
};
