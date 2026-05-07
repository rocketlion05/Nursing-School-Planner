const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://nursingschoolplanner.com';
const LASTMOD = '2026-05-07';
const programs = JSON.parse(fs.readFileSync(path.join('data', 'programs.json'), 'utf8'));
const arkansasPrograms = programs.filter((program) => program.state === 'AR');

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function canonical(pagePath) {
  return `${SITE_URL}/${pagePath}`;
}

function relPrefix(pagePath) {
  return pagePath.includes('/') ? '../' : '';
}

function head(pagePath, title, description) {
  const prefix = relPrefix(pagePath);
  return `
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="${esc(description)}" />
    <meta name="robots" content="index, follow" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical(pagePath)}" />
    <meta property="og:site_name" content="Nursing School Planner" />
    <meta property="og:image" content="${SITE_URL}/favicon.png" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <link rel="canonical" href="${canonical(pagePath)}" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="stylesheet" href="${prefix}styles.css" />
    <title>${esc(title)}</title>`;
}

function schema(pagePath, name, description, extra = []) {
  return `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical(pagePath)}#webpage`,
        url: canonical(pagePath),
        name,
        description,
        isPartOf: { '@type': 'WebSite', name: 'Nursing School Planner', url: SITE_URL }
      },
      ...extra
    ]
  })}</script>`;
}

function topbar(prefix) {
  return `<header class="guide-topbar"><a class="brand" href="${prefix}index.html"><span class="brand-mark">NSP</span><span><strong>Nursing School Planner</strong><span>nursingschoolplanner.com</span></span></a><nav class="guide-nav"><a href="${prefix}index.html#estimator">Calculator</a><a href="${prefix}states/arkansas-nursing-schools.html">Arkansas schools</a><a href="${prefix}methodology.html">Methodology</a></nav></header>`;
}

function footer(prefix) {
  return `<footer class="guide-footer"><nav class="related-links"><a href="${prefix}index.html">Calculator</a><a href="${prefix}states/arkansas-nursing-schools.html">Arkansas schools</a><a href="${prefix}privacy.html">Privacy</a></nav><p>This website provides planning estimates only. Admissions decisions, requirements, deadlines, and final eligibility are determined by the schools you apply to.</p></footer>`;
}

function schoolPage(program) {
  const pagePath = `schools/${program.slug}.html`;
  const title = `${program.schoolName} Requirements & Odds | Nursing School Planner`;
  const description = `Review ${program.schoolName} ${program.degreeType} nursing requirements, GPA targets, entrance exam details, deadlines, and admissions planning factors.`;
  const prefix = '../';
  const schoolSchema = { '@type': 'CollegeOrUniversity', name: program.schoolName, url: program.sourceUrl || canonical(pagePath), address: { '@type': 'PostalAddress', addressLocality: program.city, addressRegion: program.state, addressCountry: 'US' } };
  return `<!doctype html><html lang="en"><head>${head(pagePath, title, description)}${schema(pagePath, title, description, [schoolSchema])}</head><body class="guide-page"><a class="skip-link" href="#main">Skip to content</a><div class="guide-shell">${topbar(prefix)}<main id="main"><article class="guide-article"><section class="guide-hero"><p class="section-label">Nursing program profile</p><h1>${esc(program.schoolName)} Requirements and Admissions Odds</h1><p>${esc(description)}</p></section><div class="guide-layout"><div class="guide-article"><section class="guide-section"><h2>School requirement summary</h2><div class="requirements-list"><div class="requirement-row met"><span>Degree</span><strong>${esc(program.degreeType)}</strong></div><div class="requirement-row met"><span>Minimum GPA</span><strong>${program.minimumGpa.toFixed(2)}</strong></div><div class="requirement-row met"><span>Competitive GPA</span><strong>${program.competitiveGpa.toFixed(2)}</strong></div><div class="requirement-row met"><span>Science GPA</span><strong>${program.scienceGpa.toFixed(2)}</strong></div><div class="requirement-row met"><span>Entrance exam</span><strong>${esc(program.entranceExam)}</strong></div><div class="requirement-row met"><span>Minimum score</span><strong>${program.minimumScore || 'Verify'}</strong></div><div class="requirement-row met"><span>Prerequisites</span><strong>${program.prerequisites}</strong></div><div class="requirement-row met"><span>Deadline</span><strong>${esc(program.deadline)}</strong></div><div class="requirement-row met"><span>Accreditation</span><strong>${esc(program.accreditation)}</strong></div></div>${program.sourceUrl ? `<p><a href="${esc(program.sourceUrl)}" target="_blank" rel="noopener noreferrer">Official program source</a></p>` : ''}</section><section class="guide-section"><h2>Admissions planning note</h2><p>The calculator compares your GPA, science GPA, entrance exam score, prerequisites, experience, and degree goal against this program profile.</p><div class="guide-callout"><strong>Disclaimer</strong><p>${esc(program.disclaimer)}</p></div></section><section class="guide-section"><h2>Next steps</h2><p><a class="button" href="../index.html#estimator">Use the calculator</a></p><p><a href="../states/arkansas-nursing-schools.html">Back to Arkansas nursing schools</a></p></section></div><aside class="guide-sidebar"><h2>Program facts</h2><ul><li>${esc(program.city)}, ${esc(program.state)}</li><li>${esc(program.degreeType)}</li><li>Last reviewed: ${esc(program.lastVerified)}</li></ul></aside></div></article></main>${footer(prefix)}</div></body></html>`;
}

function statePage() {
  const pagePath = 'states/arkansas-nursing-schools.html';
  const title = 'Arkansas Nursing Schools & Program Requirements | Nursing School Planner';
  const description = 'Compare Arkansas nursing schools, GPA requirements, entrance exams, deadlines, accreditation, and admissions planning factors.';
  const cards = arkansasPrograms.map((program) => `<a class="guide-card" href="../schools/${program.slug}.html"><span>${esc(program.city)}, ${esc(program.state)}</span><strong>${esc(program.schoolName)}</strong><p>${esc(program.degreeType)} &middot; GPA ${program.minimumGpa.toFixed(2)} minimum &middot; ${esc(program.entranceExam)}</p></a>`).join('');
  return `<!doctype html><html lang="en"><head>${head(pagePath, title, description)}${schema(pagePath, title, description)}</head><body class="guide-page"><a class="skip-link" href="#main">Skip to content</a><div class="guide-shell">${topbar('../')}<main id="main"><article class="guide-article"><section class="guide-hero"><p class="section-label">State guide</p><h1>Arkansas Nursing Schools and Program Requirements</h1><p>${description}</p></section><section class="guide-section"><h2>Compare Arkansas nursing programs</h2><div class="guide-card-grid">${cards}</div></section><section class="guide-section"><h2>How to use this list</h2><p>Open each school page, review requirements, then return to the <a href="../index.html#estimator">nursing school odds calculator</a> to compare your profile.</p><div class="guide-callout"><strong>Disclaimer</strong><p>Admissions decisions are made by schools. These pages are planning estimates only and are not a guarantee.</p></div></section></article></main>${footer('../')}</div></body></html>`;
}

function write(filePath, html) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${html}\n`);
}

for (const program of arkansasPrograms) write(`schools/${program.slug}.html`, schoolPage(program));
write('states/arkansas-nursing-schools.html', statePage());
console.log(`Generated ${arkansasPrograms.length} Arkansas school pages and one state page.`);
