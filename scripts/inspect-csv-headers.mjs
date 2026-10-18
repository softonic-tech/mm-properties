import fs from "node:fs";

const text = fs.readFileSync("public/M&M PROPERTY_Property_20261008101516.csv", "utf8");
const firstLineEnd = text.indexOf("\n");
const headerLine = text.slice(0, firstLineEnd);
const headers = [];
let cur = "";
let q = false;
for (let i = 0; i < headerLine.length; i++) {
  const c = headerLine[i];
  const n = headerLine[i + 1];
  if (q) {
    if (c === '"' && n === '"') {
      cur += '"';
      i++;
    } else if (c === '"') q = false;
    else cur += c;
  } else if (c === '"') q = true;
  else if (c === ",") {
    headers.push(cur.trim());
    cur = "";
  } else cur += c;
}
headers.push(cur.trim());

console.log("column count:", headers.length);
headers.forEach((h, i) => console.log(`${i}\t${h}`));

const sample = JSON.parse(fs.readFileSync("public/properties.json", "utf8"))[0];
console.log("\nJSON keys:", Object.keys(sample));
console.log("sample.image:", sample.image);
