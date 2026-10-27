/**
 * Download the Kyero and XCP feeds and refresh public/Data/properties.json.
 * Photo labels already on a listing are kept. Dutch titles missing from the
 * agency feed are filled with OPENAI_API_KEY when that key is set.
 *
 * Run: npm run update:properties
 */
import fs from "node:fs";
import path from "node:path";
import { DOMParser, Node } from "@xmldom/xmldom";

const FEEDS = {
  kyero: "https://mmproperty.inmoenter.com/export/all/kml3.xml",
  xcp: "https://mmproperty.inmoenter.com/export/all/xcp.xml",
};
const DATA_PATH = path.resolve("public/Data/properties.json");
const SITE_TITLE_LOCALES = ["en", "es", "de", "nl", "sv"];
const FETCH_TIMEOUT_MS = 4 * 60 * 1000;

loadEnvFile();

if (!Node.prototype.contains) {
  Node.prototype.contains = function (other) {
    let current = other;
    while (current) {
      if (current === this) return true;
      current = current.parentNode;
    }
    return false;
  };
}

function loadEnvFile() {
  const file = path.resolve(".env");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const eq = trimmed.indexOf("=");
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] == null) process.env[key] = value;
  }
}

function makeIterable(list) {
  const proto = list && Object.getPrototypeOf(list);
  if (proto && !proto[Symbol.iterator]) {
    proto[Symbol.iterator] = function* () {
      for (let i = 0; i < this.length; i++) yield this.item(i);
    };
  }
}

const textOf = (el) => el?.textContent?.trim() || "";

function descendants(el, name) {
  if (!el?.getElementsByTagName) return [];
  makeIterable(el.getElementsByTagName("*"));
  return [...el.getElementsByTagName("*")].filter((node) => node.localName.toLowerCase() === name.toLowerCase());
}

function firstText(el, names) {
  if (!el) return "";
  for (const name of names) {
    const hit = descendants(el, name)[0];
    if (hit && textOf(hit)) return textOf(hit);
  }
  return "";
}

function directText(el, names) {
  if (!el?.children) return "";
  makeIterable(el.children);
  for (const name of names) {
    const hit = [...el.children].find((node) => node.localName.toLowerCase() === name.toLowerCase());
    if (hit && textOf(hit)) return textOf(hit);
  }
  return "";
}

function labeled(el, names) {
  for (const name of names) {
    const hit = descendants(el, name)[0];
    if (!hit) continue;
    const label = hit.getAttribute("text")?.trim();
    if (label) return label;
    if (textOf(hit)) return textOf(hit);
  }
  return "";
}

function records(doc, tagName) {
  makeIterable(doc.getElementsByTagName("*"));
  const targets = [...doc.getElementsByTagName("*")].filter((node) => node.localName.toLowerCase() === tagName);
  return targets.filter((node) => !targets.some((other) => other !== node && other.contains(node)));
}

function numberOrNull(value) {
  if (value == null || value === "") return null;
  const parsed = Number(String(value).replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function flag(value) {
  if (value == null || value === "") return null;
  const normalized = String(value).toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}

function prefer(map) {
  return map.en || map.es || Object.values(map)[0] || "";
}

function childLangMap(el) {
  const map = {};
  if (!el?.children) return map;
  makeIterable(el.children);
  for (const child of [...el.children]) {
    const lang = child.localName.toLowerCase();
    const value = textOf(child);
    if (value && lang.length <= 5 && ![...child.children].length) map[lang] = value;
  }
  return map;
}

function collectLangMap(nodes) {
  const map = {};
  for (const node of nodes) {
    for (const [lang, value] of Object.entries(pairedLangMap(node))) {
      if (value && !map[lang]) map[lang] = value;
    }
  }
  return map;
}

function pairedLangMap(el) {
  const map = {};
  let lang = "";
  makeIterable(el.getElementsByTagName("*"));
  for (const node of [...el.getElementsByTagName("*")]) {
    const name = node.localName.toLowerCase();
    if (name === "idioma") lang = textOf(node).toLowerCase();
    if (name === "texto" && lang) {
      const value = textOf(node);
      if (value && !map[lang]) map[lang] = value;
      lang = "";
    }
  }
  return map;
}

function operation(value) {
  const normalized = (value || "").toLowerCase();
  if (["sale", "venta"].includes(normalized)) return "sale";
  if (["month", "week", "rental", "rent", "alquiler"].includes(normalized)) return "rent";
  return value || null;
}

function coordsFromPair(value) {
  const parts = (value || "").split(",").map((part) => Number(part.trim()));
  if (parts.length === 2 && parts.every(Number.isFinite)) return { latitude: parts[0], longitude: parts[1] };
  return { latitude: null, longitude: null };
}

function imageRecord(url, labels = {}, previous) {
  const merged = { ...(previous?.labels || {}) };
  for (const [lang, value] of Object.entries(labels)) {
    if (value) merged[lang] = value;
  }
  const label = merged.en || merged.es || previous?.label || "";
  const record = { url, label };
  if (Object.keys(merged).length) record.labels = merged;
  return record;
}

function parseKyero(el) {
  const location = descendants(el, "location")[0];
  const descriptions = childLangMap(descendants(el, "desc")[0]);
  const images = descendants(el, "image")
    .map((node) => directText(node, ["url"]) || firstText(node, ["url"]))
    .filter(Boolean)
    .map((url) => imageRecord(url));
  return {
    id: firstText(el, ["id"]) || null,
    ref: firstText(el, ["ref", "id"]) || null,
    title: firstText(el, ["title"]) || firstText(el, ["type"]) || null,
    titles: {},
    type: firstText(el, ["type"]) || null,
    operation: operation(firstText(el, ["price_freq"])),
    operationLabel: firstText(el, ["price_freq"]) || null,
    price: numberOrNull(firstText(el, ["price"])),
    currency: firstText(el, ["currency"]) || null,
    beds: numberOrNull(firstText(el, ["beds"])),
    baths: numberOrNull(firstText(el, ["baths"])),
    builtArea: numberOrNull(directText(descendants(el, "surface_area")[0], ["built"]) || firstText(el, ["built"])),
    plotArea: numberOrNull(directText(descendants(el, "surface_area")[0], ["plot"])),
    town: firstText(el, ["town"]) || null,
    province: firstText(el, ["province"]) || null,
    country: firstText(el, ["country"]) || null,
    latitude: numberOrNull(firstText(location, ["latitude"])),
    longitude: numberOrNull(firstText(location, ["longitude"])),
    description: prefer(descriptions) || firstText(el, ["desc"]) || null,
    descriptions,
    url: directText(el, ["url"]) || null,
    images,
    pool: flag(firstText(el, ["pool"])),
    newBuild: flag(firstText(el, ["new_build"])),
    year: numberOrNull(firstText(el, ["year"])),
    date: firstText(el, ["date"]) || null,
  };
}

function parseXcp(el) {
  const titles = collectLangMap(descendants(el, "titulo"));
  const descriptions = collectLangMap(descendants(el, "descripcion"));
  const coords = coordsFromPair(firstText(el, ["geoLocalizacion"]));
  const images = descendants(el, "imagen")
    .map((node) => {
      const url = directText(node, ["url"]);
      if (!url) return null;
      return imageRecord(url, pairedLangMap(node));
    })
    .filter(Boolean);
  return {
    id: null,
    ref: firstText(el, ["referencia", "ref", "id"]) || null,
    title: prefer(titles) || labeled(el, ["tipoInmueble", "tipo"]) || null,
    titles,
    type: labeled(el, ["tipoInmueble", "tipo"]) || null,
    operation: operation(labeled(el, ["tipoOferta", "tipoOperacion", "operacion"])),
    operationLabel: labeled(el, ["tipoOferta", "tipoOperacion", "operacion"]) || null,
    price: numberOrNull(firstText(el, ["precio"])),
    currency: firstText(el, ["moneda"]) || "EUR",
    beds: numberOrNull(firstText(el, ["habitaciones", "dormitorios"])),
    baths: numberOrNull(firstText(el, ["baños", "banos"])),
    builtArea: numberOrNull(firstText(el, ["superficieConstruida"])),
    plotArea: numberOrNull(firstText(el, ["superficieParcela"])),
    usableArea: numberOrNull(firstText(el, ["superficieUtil"])),
    terraceArea: numberOrNull(firstText(el, ["superficieTerrazas"])),
    town: firstText(el, ["poblacion", "municipio", "localidad"]) || null,
    province: firstText(el, ["provincia"]) || null,
    country: firstText(el, ["pais"]) || null,
    latitude: coords.latitude,
    longitude: coords.longitude,
    description: prefer(descriptions) || null,
    descriptions,
    url: directText(el, ["url"]) || null,
    images,
    pool: flag(firstText(el, ["piscina"])),
    newBuild: /estrenar|new/i.test(labeled(el, ["tipoConservacion"])),
    year: numberOrNull(firstText(el, ["antiguedad"])),
    date: firstText(el, ["fecha"]) || null,
    parkingSpaces: numberOrNull(firstText(el, ["plazasGaraje"])),
    postalCode: firstText(el, ["codigoPostal"]) || null,
  };
}

async function loadXml(format) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(FEEDS[format], {
      headers: { Accept: "application/xml,text/xml;q=0.9,*/*;q=0.5", "User-Agent": "MMPropertiesFeed/1.0" },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`${format} feed responded with HTTP ${response.status}`);
    return await response.text();
  } catch (error) {
    if (error.name === "AbortError") throw new Error(`${format} feed download exceeded 4 minutes`);
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

function previousImages(property) {
  const images = new Map();
  for (const image of property?.images || []) {
    const url = typeof image === "string" ? image : image?.url;
    if (url) images.set(url, typeof image === "string" ? { url, label: "" } : image);
  }
  return images;
}

function mergeImages(kyeroImages, xcpImages, previous) {
  const base = xcpImages.length >= kyeroImages.length ? xcpImages : kyeroImages;
  const byUrl = new Map([...kyeroImages, ...xcpImages].map((image) => [image.url, image]));
  return base.map((image) => imageRecord(image.url, byUrl.get(image.url)?.labels || {}, previous.get(image.url)));
}

function mergeProperty(kyero, xcp) {
  if (!kyero) return { ...xcp, sources: ["xcp"] };
  if (!xcp) return { ...kyero, sources: ["kyero"] };
  return {
    ...kyero,
    ...xcp,
    id: kyero.id || xcp.id,
    title: xcp.title || kyero.title,
    type: kyero.type || xcp.type,
    typeEs: xcp.type,
    operation: kyero.operation || xcp.operation,
    operationLabel: xcp.operationLabel || kyero.operationLabel,
    currency: kyero.currency || xcp.currency,
    country: kyero.country || xcp.country,
    latitude: kyero.latitude ?? xcp.latitude,
    longitude: kyero.longitude ?? xcp.longitude,
    plotArea: xcp.plotArea ?? kyero.plotArea,
    titles: Object.keys(xcp.titles || {}).length ? { ...xcp.titles } : { ...kyero.titles },
    descriptions: Object.keys(xcp.descriptions || {}).length ? xcp.descriptions : kyero.descriptions,
    description: xcp.description || kyero.description,
    images: mergeImages(kyero.images, xcp.images, new Map()),
    pool: Boolean(xcp.pool || kyero.pool),
    newBuild: Boolean(xcp.newBuild || kyero.newBuild),
    sources: ["kyero", "xcp"],
  };
}

function keepSavedTranslations(property, previous) {
  if (!previous) return property;
  const images = mergeImages(property.images, property.images, previousImages(previous));
  const titles = { ...property.titles };
  const descriptions = { ...(property.descriptions || {}) };
  const english = titles.en || property.title || "";
  const previousEnglish = previous.titles?.en || previous.title || "";
  if (previous.titles?.nl && previousEnglish === english) titles.nl = previous.titles.nl;
  for (const locale of SITE_TITLE_LOCALES) {
    if (locale === "nl") continue;
    if (!titles[locale] && previous.titles?.[locale]) titles[locale] = previous.titles[locale];
  }
  for (const [lang, value] of Object.entries(previous.descriptions || {})) {
    if (value && !descriptions[lang]) descriptions[lang] = value;
  }
  return {
    ...property,
    titles,
    descriptions,
    description: descriptions.en || descriptions.es || property.description,
    images,
    image: images[0]?.url || property.image || previous.image || "",
  };
}

async function translateDutchTitles(properties) {
  const key = (process.env.OPENAI_API_KEY || "").trim();
  const missing = properties.filter((property) => {
    const english = property.titles?.en || property.title;
    return english && !property.titles?.nl;
  });
  if (!missing.length) {
    console.log("Dutch titles: none missing");
    return;
  }
  if (!key) {
    console.log(`Dutch titles: ${missing.length} missing, OPENAI_API_KEY is not set`);
    return;
  }

  const model = (process.env.OPENAI_MODEL || "gpt-4o-mini").trim();
  for (let index = 0; index < missing.length; index += 40) {
    const batch = missing.slice(index, index + 40);
    const source = Object.fromEntries(batch.map((property) => [property.ref, property.titles.en || property.title]));
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "Translate real-estate listing titles from English to Dutch. Keep place names. Return JSON only, using the same keys and one Dutch title string per key.",
          },
          { role: "user", content: JSON.stringify(source) },
        ],
      }),
    });
    if (!response.ok) {
      console.log(`Dutch titles: OpenAI responded HTTP ${response.status}; keeping the titles already saved`);
      return;
    }
    const payload = await response.json();
    let translated = {};
    try {
      translated = JSON.parse(payload.choices?.[0]?.message?.content || "{}");
    } catch {
      console.log("Dutch titles: OpenAI returned invalid JSON; keeping the titles already saved");
      return;
    }
    for (const property of batch) {
      const dutch = String(translated[property.ref] || "").trim();
      if (dutch) property.titles.nl = dutch.slice(0, 300);
    }
  }
  const filled = missing.filter((property) => property.titles.nl).length;
  console.log(`Dutch titles: filled ${filled} of ${missing.length}`);
}

function readExisting() {
  if (!fs.existsSync(DATA_PATH)) return { properties: [] };
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
}

(async () => {
  const existing = readExisting();
  const previousByRef = new Map((existing.properties || []).map((property) => [String(property.ref), property]));
  const parsed = {};

  for (const format of ["kyero", "xcp"]) {
    const xml = await loadXml(format);
    const doc = new DOMParser().parseFromString(xml, "text/xml");
    if (!doc.documentElement || doc.documentElement.localName.toLowerCase() === "parsererror") {
      throw new Error(`${format} feed was not valid XML`);
    }
    const tag = format === "kyero" ? "property" : "propiedad";
    const parse = format === "kyero" ? parseKyero : parseXcp;
    parsed[format] = records(doc, tag).map(parse).filter((property) => property.ref);
    console.log(`${format}: ${parsed[format].length} properties`);
  }

  const byRef = new Map();
  for (const property of parsed.kyero) byRef.set(property.ref, property);
  for (const property of parsed.xcp) byRef.set(property.ref, mergeProperty(byRef.get(property.ref), property));

  let properties = [...byRef.values()].map((property) => {
    const saved = keepSavedTranslations(property, previousByRef.get(property.ref));
    saved.image = saved.images[0]?.url || saved.image || "";
    if (!saved.titles.en && saved.title) saved.titles.en = saved.title;
    return saved;
  });

  if (!properties.length) throw new Error("The feed returned no properties");
  if (previousByRef.size && properties.length < previousByRef.size * 0.5) {
    throw new Error(`Refusing to replace ${previousByRef.size} properties with ${properties.length}`);
  }

  await translateDutchTitles(properties);

  const added = properties.filter((property) => !previousByRef.has(property.ref)).map((property) => property.ref);
  const removed = [...previousByRef.keys()].filter((ref) => !byRef.has(ref));
  const payload = {
    exportedAt: new Date().toISOString(),
    count: properties.length,
    properties,
  };
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(payload, null, 2));
  console.log(`saved ${properties.length} properties -> ${DATA_PATH}`);
  if (added.length) console.log(`added: ${added.join(", ")}`);
  if (removed.length) console.log(`removed: ${removed.join(", ")}`);
})().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
