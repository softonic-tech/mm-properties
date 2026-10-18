const html = await (await fetch("https://mmproperty.inmoenter.com/en/property/57297/s2")).text();
const labels = [...html.matchAll(/class="label price"[^>]*>([^<]+)</gi)].map((m) => m[1].trim());
console.log(labels.slice(0, 12).join(" | "));
