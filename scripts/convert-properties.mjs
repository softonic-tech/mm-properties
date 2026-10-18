import fs from "node:fs";
import path from "node:path";

const csvPath = path.resolve("public/M&M PROPERTY_Property_20261008101516.csv");
const outPath = path.resolve("public/properties.json");

function parseCSV(text) {
  const rows = [];
  let row = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const n = text[i + 1];
    if (q) {
      if (c === '"' && n === '"') {
        cur += '"';
        i++;
      } else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === ",") {
      row.push(cur);
      cur = "";
    } else if (c === "\n" || (c === "\r" && n === "\n")) {
      if (c === "\r") i++;
      row.push(cur);
      rows.push(row);
      row = [];
      cur = "";
    } else if (c === "\r") {
      row.push(cur);
      rows.push(row);
      row = [];
      cur = "";
    } else cur += c;
  }
  if (cur.length || row.length) {
    row.push(cur);
    rows.push(row);
  }
  return rows;
}

function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function citySlug(city) {
  const map = {
    marbella: "marbella",
    fuengirola: "fuengirola",
    "benalmadena": "benalmadena",
    "benalmádena": "benalmadena",
    mijas: "mijas",
    "mijas costa": "mijas",
    torremolinos: "torremolinos",
    estepona: "estepona",
    malaga: "torremolinos",
    "málaga": "torremolinos",
  };
  const key = String(city || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  if (map[key]) return map[key];
  if (key.includes("marbella")) return "marbella";
  if (key.includes("fuengirola")) return "fuengirola";
  if (key.includes("benalmadena")) return "benalmadena";
  if (key.includes("mijas")) return "mijas";
  if (key.includes("torremolinos")) return "torremolinos";
  if (key.includes("estepona")) return "estepona";
  return "costa-del-sol";
}

function imageFor(type, area) {
  const byArea = {
    marbella: "/media/costa-marbella.jpg?v=2",
    fuengirola: "/media/costa-fuengirola.jpg?v=2",
    benalmadena: "/media/costa-benalmadena.jpg?v=1",
    mijas: "/media/costa-mijas.jpg?v=2",
    torremolinos: "/media/costa-torremolinos.jpg?v=1",
    estepona: "/media/costa-estepona.jpg?v=1",
  };
  const byType = {
    villa: "/listings/villas.webp?v=1",
    piso: "/listings/Resale.webp?v=1",
    apartamento: "/listings/Resale.webp?v=1",
    atico: "/listings/higueron.jpg?v=2",
    "ático": "/listings/higueron.jpg?v=2",
    adosado: "/listings/mijas-aguila.jpg?v=2",
    duplex: "/listings/fuengirola.jpg?v=2",
    "dúplex": "/listings/fuengirola.jpg?v=2",
    local: "/listings/development.jpg?v=1",
    parcela: "/media/costa-mijas.jpg?v=2",
    terreno: "/media/costa-mijas.jpg?v=2",
  };
  const t = String(type || "").toLowerCase();
  for (const [key, src] of Object.entries(byType)) {
    if (t.includes(key)) return src;
  }
  return byArea[area] || "/media/costa-marbella.jpg?v=2";
}

function money(value) {
  const n = Number(String(value || "").replace(/[^\d.,]/g, "").replace(/\./g, "").replace(",", "."));
  if (!Number.isFinite(n) || n <= 0) return "";
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

function num(value) {
  const n = Number(String(value || "").replace(/[^\d]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** Areas come as "149.00 m2" — strip units before parsing so trailing "2" is not kept. */
function areaNum(value) {
  const cleaned = String(value || "")
    .replace(/m[²2]/gi, "")
    .replace(/[^\d.,]/g, "")
    .trim();
  if (!cleaned) return 0;
  const n = Number(cleaned.includes(",") ? cleaned.replace(/\./g, "").replace(",", ".") : cleaned);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : 0;
}

const text = fs.readFileSync(csvPath, "utf8");
const rows = parseCSV(text);
const headers = rows[0].map((h) => h.trim().replace(/^"|"$/g, ""));
const seen = new Set();
const properties = [];

for (let i = 1; i < rows.length; i++) {
  const raw = Object.fromEntries(headers.map((h, j) => [h, (rows[i][j] ?? "").trim()]));
  const ref = raw["Referencia"] || raw.Referencia || "";
  if (!ref || seen.has(ref)) continue;
  seen.add(ref);

  const title = raw["Título"] || raw.Titulo || `${raw["Propiedad"] || "Property"} ${ref}`;
  const city = raw["Ciudad"] || "";
  const area = citySlug(city);
  const offer = (raw["Oferta"] || "venta").toLowerCase();
  const type = raw["Propiedad"] || "";
  const beds = num(raw["Dormitorios"]);
  const baths = num(raw["Baños"] || raw.Banos);
  const built = areaNum(raw["Sup. Construida"]);
  const plot = areaNum(raw["Sup. Parcela"] || raw[" Sup. Parcela"]);
  const priceLabel = money(raw["Precio"]);
  const slug = `${slugify(ref)}-${slugify(title)}`.replace(/-+/g, "-");

  const specs = [
    built ? `${built} m²` : "",
    beds ? `${beds} bed` : "",
    baths ? `${baths} bath` : "",
    priceLabel,
  ]
    .filter(Boolean)
    .join(" · ");

  properties.push({
    id: ref,
    slug,
    ref,
    offer: offer.includes("alquiler") || offer.includes("rent") ? "rent" : "sale",
    type,
    title,
    description: raw["Descripción"] || raw.Descripcion || "",
    address: raw["Dirección"] || raw.Direccion || "",
    postalCode: raw["Código Postal"] || raw["Codigo Postal"] || "",
    city,
    province: raw["Provincia"] || "",
    country: raw["Pais"] || "España",
    price: num(raw["Precio"]),
    priceLabel,
    built,
    plot,
    floor: raw["Planta"] || "",
    beds,
    baths,
    features: (raw["Características"] || raw.Caracteristicas || "")
      .split(/[|,;]/)
      .map((s) => s.trim())
      .filter(Boolean),
    tags: (raw["Etiquetas"] || "")
      .split(/[|,;]/)
      .map((s) => s.trim())
      .filter(Boolean),
    status: raw["Estado"] || "",
    created: raw["Creada"] || "",
    updated: raw["Modificada"] || "",
    area,
    image: imageFor(type, area),
    meta: specs,
  });
}

properties.sort((a, b) => (b.updated || "").localeCompare(a.updated || "") || b.price - a.price);

fs.writeFileSync(outPath, JSON.stringify(properties));
console.log(
  JSON.stringify(
    {
      records: properties.length,
      out: outPath,
      sample: properties[0],
      offers: properties.reduce((acc, p) => ((acc[p.offer] = (acc[p.offer] || 0) + 1), acc), {}),
    },
    null,
    2,
  ),
);
