/**
 * Attach room labels from Inmoenter property pages (en + es) onto image URLs.
 */
import fs from "node:fs";

const dataPath = "public/Data/properties.json";
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const LOCALES = ["en", "es"];

function imageUrl(item) {
  if (!item) return "";
  if (typeof item === "string") return item;
  return String(item.url || "");
}

function extractLabels(html) {
  return [...html.matchAll(/class="label price"[^>]*>([^<]+)</gi)]
    .map((m) => m[1].replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function pageUrlForLocale(url, locale) {
  try {
    const u = new URL(url);
    u.pathname = u.pathname.replace(/^\/(en|es|de|nl|sv|fr|it)\//, `/${locale}/`);
    if (!/^\/(en|es|de|nl|sv)\//.test(u.pathname)) {
      u.pathname = `/${locale}${u.pathname.startsWith("/") ? "" : "/"}${u.pathname}`;
    }
    return u.href;
  } catch {
    return url;
  }
}

async function fetchLabels(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; MMPropertyBot/1.0)" },
  });
  if (!res.ok) return [];
  return extractLabels(await res.text());
}

async function enrichOne(property, index, total) {
  const urls = (property.images || []).map(imageUrl).filter(Boolean);
  if (!property.url || !urls.length) return property;

  process.stdout.write(`[${index + 1}/${total}] ${property.ref || property.id}… `);
  try {
    const byLocale = {};
    for (const locale of LOCALES) {
      byLocale[locale] = await fetchLabels(pageUrlForLocale(property.url, locale));
      await new Promise((r) => setTimeout(r, 80));
    }

    const best = LOCALES.map((l) => byLocale[l]?.filter(Boolean).length || 0);
    const max = Math.max(...best);
    console.log(`imgs ${urls.length}, labels en=${byLocale.en.length} es=${byLocale.es.length}`);

    if (max === 0) return property;

    const images = urls.map((url, i) => {
      const labels = {};
      for (const locale of LOCALES) {
        const value = byLocale[locale]?.[i];
        if (value) labels[locale] = value;
      }
      const label = labels.en || labels.es || Object.values(labels)[0] || "";
      return label ? { url, label, labels } : { url, label: "", labels };
    });

    return {
      ...property,
      images,
      image: imageUrl(images[0]) || property.image,
    };
  } catch (err) {
    console.log(`error: ${err.message}`);
    return property;
  }
}

const props = data.properties || [];
const out = [];
for (let i = 0; i < props.length; i++) {
  out.push(await enrichOne(props[i], i, props.length));
}

const next = {
  ...data,
  exportedAt: new Date().toISOString(),
  count: out.length,
  properties: out,
};
fs.writeFileSync(dataPath, JSON.stringify(next, null, 2));
console.log(`\nDone. Saved ${out.length} properties.`);
