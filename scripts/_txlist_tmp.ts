import { SEED_PROGRAMS } from "../prisma/programs-data";
const tx = SEED_PROGRAMS.filter(p => p.state === "TX");
console.log("Total TX programs:", tx.length);
let noUrl=0, placeholder=0, partial=0, verified=0;
for (const p of tx) {
  if (!p.officialUrl) noUrl++;
  if (p.dataQuality==="placeholder") placeholder++;
  if (p.dataQuality==="partial") partial++;
  if (p.dataQuality==="verified") verified++;
}
console.log(JSON.stringify({noUrl, placeholder, partial, verified}));
console.log("--- PRIORITY (no url OR not verified) ---");
for (const p of tx) {
  const pr = (!p.officialUrl) || p.dataQuality!=="verified";
  if (pr) console.log([(p.officialUrl?"URL ":"NOURL"), p.dataQuality.padEnd(11), p.slug.padEnd(55), "email:"+(p.admissionEmail?"Y":"-"), "est:"+(p.estimatedFields?p.estimatedFields.join(","):"-")].join("  "));
}
console.log("--- VERIFIED+URL (skip) ---");
for (const p of tx) {
  const pr = (!p.officialUrl) || p.dataQuality!=="verified";
  if (!pr) console.log(p.slug, "email:"+(p.admissionEmail?"Y":"-"));
}
