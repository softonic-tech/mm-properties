const url = "https://mmproperty.inmoenter.com/es/property/57297/s2";
const res = await fetch(url);
const html = await res.text();

// Find gallery-related snippets around known room labels
for (const label of ["Comedor", "Cocina", "Salón", "Dormitorio", "Terraza", "Fachada"]) {
  const idx = html.indexOf(`>${label}<`);
  if (idx === -1) {
    const idx2 = html.indexOf(label);
    console.log("\n===", label, "at", idx2);
    if (idx2 >= 0) console.log(html.slice(Math.max(0, idx2 - 200), idx2 + 120).replace(/\s+/g, " "));
    continue;
  }
  console.log("\n===", label);
  console.log(html.slice(Math.max(0, idx - 250), idx + 80).replace(/\s+/g, " "));
}

// Look for JS arrays with title/url
const m = html.match(/photos\s*[:=]\s*(\[[\s\S]{0,5000}?\])/i) || html.match(/gallery\s*[:=]\s*(\[[\s\S]{0,5000}?\])/i);
if (m) console.log("\nJS array:", m[1].slice(0, 800));

const imgs = [...html.matchAll(/property_57297_\d+\.(?:jpeg|jpg|png)[^\"']*/gi)].slice(0, 5);
console.log("\nimg urls sample:", imgs.map((x) => x[0]));
