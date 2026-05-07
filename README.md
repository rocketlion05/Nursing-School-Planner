# Nursing School Planner

Nursing School Planner is a self-contained web app for pre-nursing students to estimate nursing program fit and plan next steps.

Production domain: `nursingschoolplanner.com`

## What It Includes

- Applicant profile inputs for GPA, science GPA, TEAS/HESI score, prerequisites, healthcare hours, volunteer hours, degree goal, and state residency
- Estimated admissions odds for each program in the catalog
- Factor-by-factor explanation of why an estimate changed
- Searchable and filterable nursing program dashboard
- GPA planner for target GPA scenarios
- Prerequisite checklist that updates the applicant profile
- Curated TEAS, HESI A2, and CASPer study resources
- SEO guide pages for TEAS requirements, nursing school GPA, admissions strategy, and application checklists
- Action plan with program-specific improvement suggestions and timeline reminders
- CSV import/export for adding or editing program data
- Saved-program compare list with local browser persistence
- Printable report view for advising meetings or application planning
- Static deployment config for Netlify and Vercel

## Program Data

`data/programs.json` powers the calculator, saved-program compare list, CSV export, and the US nursing program dashboard for all restored nursing programs.

Restoration note: `data/programs.json` was restored from the old `starterPrograms` list in `app.js` at commit `20be31d10b73c2c51af2cbd19fa54b532a34d07d`, then expanded with major Delaware nursing programs from official school sources. Current catalog count: 152 programs. Represented states and districts: AK, AL, AR, AZ, CA, CO, CT, DC, DE, FL, GA, HI, IA, ID, IL, IN, KS, KY, LA, MA, MD, ME, MI, MN, MO, MS, MT, NC, ND, NE, NH, NJ, NM, NV, NY, OH, OK, OR, PA, RI, SC, SD, TN, TX, UT, VA, VT, WA, WI, WV, WY.

The `/schools` and `/states` SEO pages are static programmatic SEO pages that can be generated gradually by state. The current Arkansas school pages stay in the sitemap because those files exist; restored national programs should not be added to `sitemap.xml` until their matching HTML pages are generated.

## Disclaimer

This is an estimate of your odds. The ultimate decisions are up to the universities you apply to.

## Run Locally

Open `index.html` in a browser. No build step is required.

For a local preview server:

```powershell
node server.js
```

Then open `http://localhost:4173`.

## Deploy

This is a static app. Deploy the folder directly to Netlify, Vercel, GitHub Pages, Cloudflare Pages, or any static host. `netlify.toml`, `vercel.json`, `robots.txt`, `sitemap.xml`, and `manifest.webmanifest` are included.

## CSV Columns

`slug,schoolName,city,state,degreeType,minimumGpa,competitiveGpa,scienceGpa,entranceExam,minimumScore,prerequisites,deadline,seats,estimatedApplicants,accreditation,sourceUrl,lastVerified,disclaimer`
