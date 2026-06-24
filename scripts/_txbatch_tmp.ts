import { SEED_PROGRAMS } from "../prisma/programs-data";
const batch = [
  // 10 partials
  "tx-chamberlain-college-of-nursing-houston-houston",
  "tx-chamberlain-college-of-nursing-irving-irving",
  "tx-chamberlain-college-of-nursing-pearland-pearland",
  "tx-hardin-simmons-university-abilene",
  "tx-texas-christian-university-fort-worth",
  "tx-texas-lutheran-university-seguin",
  "tx-university-of-houston-college-of-nursing-sugar-land",
  "tx-university-of-texas-at-austin-austin",
  "tx-university-of-texas-at-el-paso-el-paso",
  "tx-university-of-texas-health-science-center-at-houston-houston",
  // 8 no-URL verified (large publics)
  "tx-university-of-texas-at-arlington-arlington",
  "tx-texas-woman-s-university-denton",
  "tx-texas-state-university-round-rock",
  "tx-university-of-texas-rio-grande-valley-utrgv-edinburg",
  "tx-prairie-view-a-m-university-houston",
  "tx-lamar-university-beaumont",
  "tx-university-of-texas-at-tyler-tyler",
  "tx-university-of-texas-medical-branch-at-galveston-galveston",
];
for (const slug of batch) {
  const p = SEED_PROGRAMS.find(x => x.slug === slug);
  if (!p) { console.log("MISSING:", slug); continue; }
  console.log(JSON.stringify(p));
  console.log("");
}
