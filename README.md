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

`id,name,city,state,degree,minGpa,competitiveGpa,minScience,test,minTest,prereqs,deadline,seats,applicants,accreditation`
