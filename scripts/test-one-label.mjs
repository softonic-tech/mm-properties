const pageUrl = "https://mmproperty.inmoenter.com/es/property/57297/s2";
const html = await (await fetch(pageUrl)).text();
const re =
  /<[^>]*class="[^"]*property-thumb[^"]*"[^>]*>[\s\S]*?<img[^>]+src=["']([^"']+)["'][\s\S]*?class="label price"[^>]*>([^<]*)</gi;
const items = [];
let m;
while ((m = re.exec(html))) {
  items.push({ url: m[1].slice(-40), label: m[2].trim() });
}
console.log("thumb matches", items.length, items.slice(0, 8));

const labels = [...html.matchAll(/class="label price"[^>]*>([^<]+)</gi)].map((x) => x[1].trim());
const urls = [...new Set([...html.matchAll(/https?:\/\/[^"' ]+\/properties\/57297\/[^"' ]+\.(?:jpe?g|png)/gi)].map((x) => x[0]))];
console.log("labels", labels);
console.log("urls", urls.length, urls.slice(0, 3).map((u) => u.slice(-40)));
