const STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "IA",
  "ID",
  "IL",
  "IN",
  "KS",
  "KY",
  "LA",
  "MA",
  "MD",
  "ME",
  "MI",
  "MN",
  "MO",
  "MS",
  "MT",
  "NC",
  "ND",
  "NE",
  "NH",
  "NJ",
  "NM",
  "NV",
  "NY",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VA",
  "VT",
  "WA",
  "WI",
  "WV",
  "WY",
  "DC",
];

const CORE_COURSES = [
  ["A&P I", "Lab science"],
  ["A&P II", "Lab science"],
  ["Microbiology", "Lab science"],
  ["Chemistry", "Lab science"],
  ["Nutrition", "Health science"],
  ["Statistics", "Math"],
  ["Developmental psychology", "Social science"],
  ["English composition", "Writing"],
  ["Lifespan psychology", "Social science"],
  ["Pathophysiology", "Upper division"],
];

const PROGRAM_DATA_URL = "data/programs.json";

let starterPrograms = [];
let programs = [];
let selectedProgramId = "csulb-bsn";
const STORAGE_KEYS = {
  savedPrograms: "nursingSchoolPlanner.savedPrograms",
  profile: "nursingSchoolPlanner.profile",
  selectedProgramId: "nursingSchoolPlanner.selectedProgramId",
  legacySavedPrograms: "nursepath.savedPrograms",
  legacyProfile: "nursepath.profile",
  legacySelectedProgramId: "nursepath.selectedProgramId",
};
let savedProgramIds = readJson(
  STORAGE_KEYS.savedPrograms,
  readJson(STORAGE_KEYS.legacySavedPrograms, ["texas-am-bsn", "ut-austin-bsn", "uark-bsn"]),
);

const ids = [
  "gpa",
  "scienceGpa",
  "testType",
  "testScore",
  "prereqsCompleted",
  "prereqsTotal",
  "healthcareHours",
  "volunteerHours",
  "homeState",
  "degreeGoal",
  "readiness",
  "readinessValue",
  "searchInput",
  "stateFilter",
  "degreeFilter",
  "oddsFilter",
  "completedCredits",
  "futureCredits",
  "targetGpa",
];

const el = Object.fromEntries(ids.map((id) => [id, document.getElementById(id)]));
const ui = Object.fromEntries(
  ["programDetail", "savedPrograms", "savedCount", "saveSelectedProgram"].map((id) => [id, document.getElementById(id)]),
);

function slugify(value) {
  return String(value || "program").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function numberFrom(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizedExamType(entranceExam) {
  const value = String(entranceExam || "Optional").toUpperCase();
  if (value.includes("TEAS")) return "TEAS";
  if (value.includes("HESI")) return "HESI";
  return "Optional";
}

function normalizeProgram(program, index = 0) {
  const schoolName = program.schoolName || program.name || "Imported nursing program";
  const slug = slugify(program.slug || program.id || `${schoolName}-${index}`);
  const entranceExam = program.entranceExam || program.test || "Optional";
  const minimumGpa = numberFrom(program.minimumGpa ?? program.minGpa, 2.75);
  const competitiveGpa = numberFrom(program.competitiveGpa, minimumGpa + 0.45);
  const scienceGpa = numberFrom(program.scienceGpa ?? program.minScience, minimumGpa);
  const minimumScore = numberFrom(program.minimumScore ?? program.minTest, 0);
  const prerequisites = numberFrom(program.prerequisites ?? program.prereqs, 8);
  const estimatedApplicants = numberFrom(program.estimatedApplicants ?? program.applicants, 400);

  return {
    slug,
    id: slug,
    schoolName,
    name: schoolName,
    city: program.city || "",
    state: String(program.state || "CA").toUpperCase(),
    degreeType: program.degreeType || program.degree || "BSN",
    degree: program.degreeType || program.degree || "BSN",
    minimumGpa,
    minGpa: minimumGpa,
    competitiveGpa,
    scienceGpa,
    minScience: scienceGpa,
    entranceExam,
    test: normalizedExamType(entranceExam),
    minimumScore,
    minTest: minimumScore,
    prerequisites,
    prereqs: prerequisites,
    deadline: program.deadline || "Verify with school",
    seats: numberFrom(program.seats, 80),
    estimatedApplicants,
    applicants: estimatedApplicants,
    accreditation: program.accreditation || "Verify",
    sourceUrl: program.sourceUrl || "",
    lastVerified: program.lastVerified || "",
    disclaimer:
      program.disclaimer ||
      "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements and decisions directly with the school before applying.",
  };
}

function programPageUrl(program) {
  return `schools/${program.slug}.html`;
}

async function loadProgramData() {
  const response = await fetch(PROGRAM_DATA_URL);
  if (!response.ok) throw new Error(`Unable to load ${PROGRAM_DATA_URL}`);
  const data = await response.json();
  starterPrograms = data.map((program, index) => normalizeProgram(program, index));
  programs = starterPrograms.map((program) => ({ ...program }));
}

function readJson(key, fallback) {
  try {
    if (typeof localStorage === "undefined") return fallback;
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // Storage can be blocked in private windows or embedded previews.
  }
}

function persistState() {
  writeJson(STORAGE_KEYS.savedPrograms, savedProgramIds);
  writeJson(STORAGE_KEYS.profile, profile());
  writeJson(STORAGE_KEYS.selectedProgramId, selectedProgramId);
}

function applySavedProfile() {
  const savedProfile = readJson(STORAGE_KEYS.profile, readJson(STORAGE_KEYS.legacyProfile, null));
  const savedSelected = readJson(STORAGE_KEYS.selectedProgramId, readJson(STORAGE_KEYS.legacySelectedProgramId, null));
  if (savedProfile) {
    Object.entries(savedProfile).forEach(([key, value]) => {
      if (el[key]) el[key].value = value;
    });
  }
  if (savedSelected && programs.some((program) => program.id === savedSelected)) {
    selectedProgramId = savedSelected;
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function sigmoid(value) {
  return 1 / (1 + Math.exp(-value));
}

function logit(value) {
  const safe = clamp(value, 0.01, 0.99);
  return Math.log(safe / (1 - safe));
}

function percent(value) {
  return `${Math.round(value * 100)}%`;
}

function profile() {
  const prereqsTotal = Math.max(1, Number(el.prereqsTotal.value) || 1);
  return {
    gpa: Number(el.gpa.value) || 0,
    scienceGpa: Number(el.scienceGpa.value) || 0,
    testType: el.testType.value,
    testScore: Number(el.testScore.value) || 0,
    prereqsCompleted: clamp(Number(el.prereqsCompleted.value) || 0, 0, prereqsTotal),
    prereqsTotal,
    healthcareHours: Number(el.healthcareHours.value) || 0,
    volunteerHours: Number(el.volunteerHours.value) || 0,
    homeState: el.homeState.value,
    degreeGoal: el.degreeGoal.value,
    readiness: Number(el.readiness.value) || 0,
  };
}

function estimate(program, user) {
  const acceptanceRate = clamp(program.seats / program.applicants, 0.03, 0.72);
  let score = logit(acceptanceRate);

  const gpaImpact = clamp((user.gpa - program.minGpa) * 1.05 + (user.gpa - program.competitiveGpa) * 0.45, -1.35, 1.45);
  const scienceImpact = clamp((user.scienceGpa - program.minScience) * 0.95, -1.2, 1.15);
  const prereqRate = clamp(user.prereqsCompleted / Math.max(user.prereqsTotal, program.prereqs), 0, 1);
  const prereqImpact = clamp((prereqRate - 0.72) * 2.0, -0.85, 0.62);
  const experienceImpact = clamp(Math.log1p(user.healthcareHours / 120) * 0.22 + Math.log1p(user.volunteerHours / 80) * 0.1, -0.08, 0.58);
  const readinessImpact = clamp((user.readiness - 50) / 100, -0.35, 0.45);
  const stateImpact = user.homeState === program.state ? 0.2 : -0.04;
  const degreeImpact = user.degreeGoal === program.degree ? 0.18 : user.degreeGoal === "BSN" && program.degree === "ADN" ? -0.05 : -0.24;

  let testImpact = 0;
  let testStatus = "No entrance exam requirement listed";
  if (program.test === "TEAS" || program.test === "HESI") {
    if (user.testType === "None") {
      testImpact = program.minTest > 0 ? -0.75 : -0.45;
      testStatus = `${program.test} expected, but no score entered`;
    } else if (user.testType !== program.test) {
      testImpact = -0.25;
      testStatus = `${program.test} is listed, your score type is ${user.testType}`;
    } else if (program.minTest <= 0) {
      testImpact = user.testScore > 0 ? 0.12 : -0.25;
      testStatus = `${program.test} is required; no minimum score is listed here`;
    } else {
      const pointsOver = user.testScore - program.minTest;
      testImpact = clamp(pointsOver * 0.04, -0.95, 1.05);
      testStatus = `${Math.round(pointsOver)} points versus ${program.test} minimum`;
    }
  } else if (user.testType !== "None" && user.testScore >= 82) {
    testImpact = 0.12;
    testStatus = "Strong optional test score can support the file";
  }

  score += gpaImpact + scienceImpact + prereqImpact + testImpact + experienceImpact + readinessImpact + stateImpact + degreeImpact;
  const probability = clamp(sigmoid(score), 0.02, 0.94);

  const factors = [
    {
      label: "Overall GPA",
      score: clamp(((user.gpa - program.minGpa) / 0.9) * 50 + 50, 0, 100),
      impact: gpaImpact,
      note: `${user.gpa.toFixed(2)} GPA against ${program.minGpa.toFixed(2)} minimum and ${program.competitiveGpa.toFixed(2)} competitive target`,
    },
    {
      label: "Science GPA",
      score: clamp(((user.scienceGpa - program.minScience) / 0.8) * 50 + 50, 0, 100),
      impact: scienceImpact,
      note: `${user.scienceGpa.toFixed(2)} science GPA against ${program.minScience.toFixed(2)} minimum`,
    },
    {
      label: "Entrance test",
      score: program.test === "Optional" ? 70 + Math.min(user.testScore / 8, 15) : clamp(((user.testScore - program.minTest) / 22) * 50 + 50, 0, 100),
      impact: testImpact,
      note: testStatus,
    },
    {
      label: "Prerequisites",
      score: prereqRate * 100,
      impact: prereqImpact,
      note: `${user.prereqsCompleted} of ${Math.max(user.prereqsTotal, program.prereqs)} tracked requirements complete`,
    },
    {
      label: "Experience",
      score: clamp((user.healthcareHours / 500) * 68 + (user.volunteerHours / 150) * 32, 0, 100),
      impact: experienceImpact,
      note: `${user.healthcareHours} healthcare hours and ${user.volunteerHours} volunteer hours entered`,
    },
    {
      label: "Program selectivity",
      score: clamp(acceptanceRate * 150, 0, 100),
      impact: logit(acceptanceRate) / 4,
      note: `${program.seats} seats for about ${program.applicants} applicants in this program profile`,
    },
  ];

  return { probability, factors, impacts: { gpaImpact, scienceImpact, testImpact, prereqImpact, experienceImpact, readinessImpact, stateImpact, degreeImpact }, acceptanceRate };
}

function bandFor(probability) {
  if (probability >= 0.65) return { label: "Likely", className: "likely" };
  if (probability >= 0.4) return { label: "Target", className: "target" };
  return { label: "Reach", className: "reach" };
}

function testRequirement(program) {
  if (program.test === "Optional") return "Optional or not listed";
  if (program.minTest > 0) return `${program.entranceExam} ${program.minTest}+`;
  return `${program.entranceExam} required`;
}

function isSaved(programId) {
  return savedProgramIds.includes(programId);
}

function toggleSaved(programId) {
  savedProgramIds = isSaved(programId) ? savedProgramIds.filter((id) => id !== programId) : [...savedProgramIds, programId];
  persistState();
  renderAll({ keepChecklist: true, skipSave: true });
}

function topRecommendation(program, user, result) {
  const recommendations = [];
  if (user.gpa < program.competitiveGpa) {
    recommendations.push({
      title: "Raise the academic buffer",
      body: `A ${program.competitiveGpa.toFixed(2)}+ overall GPA would move you closer to the competitive range for ${program.name}.`,
    });
  }
  if (user.scienceGpa < program.minScience + 0.25) {
    recommendations.push({
      title: "Protect the science GPA",
      body: "Prioritize A&P, microbiology, chemistry, and statistics retakes or grade replacement where the school allows it.",
    });
  }
  if ((program.test === "TEAS" || program.test === "HESI") && (user.testType !== program.test || user.testScore < program.minTest + 8)) {
    const targetScore = program.minTest > 0 ? program.minTest + 8 : program.test === "TEAS" ? 78 : 82;
    recommendations.push({
      title: `Plan a ${program.test} score cushion`,
      body: `Aim for at least ${targetScore} if retesting is allowed, then check whether the school superscores or averages attempts.`,
    });
  }
  if (user.prereqsCompleted < Math.max(user.prereqsTotal, program.prereqs)) {
    recommendations.push({
      title: "Finish prerequisites before the deadline",
      body: "Programs often rank completed lab sciences more strongly than courses still in progress.",
    });
  }
  if (user.healthcareHours < 250) {
    recommendations.push({
      title: "Add patient-facing experience",
      body: "CNA, medical assistant, hospital volunteer, hospice, EMT, or clinic work can strengthen fit and interview stories.",
    });
  }
  if (result.probability < 0.4) {
    recommendations.push({
      title: "Build a balanced school list",
      body: "Pair this reach with at least three target programs and two likely options that match your GPA, test score, location, and degree goal.",
    });
  }
  recommendations.push({
    title: "Polish the final packet",
    body: "Before applying, make sure your essays, transcripts, recommendation letters, test scores, and prerequisite plan tell one clear story.",
  });
  return recommendations.slice(0, 5);
}

function renderStateOptions() {
  const homeOptions = STATES.map((state) => `<option value="${state}">${state}</option>`).join("");
  el.homeState.innerHTML = homeOptions;
  el.homeState.value = "CA";
  el.stateFilter.innerHTML = `<option value="All">All</option>${homeOptions}`;
}

function renderChecklist() {
  const completed = Number(el.prereqsCompleted.value) || 0;
  document.getElementById("courseChecklist").innerHTML = CORE_COURSES.map(([name, type], index) => {
    const checked = index < completed ? "checked" : "";
    return `
      <label class="check-item">
        <input type="checkbox" data-course-index="${index}" ${checked} />
        <span>${name}</span>
        <span>${type}</span>
      </label>
    `;
  }).join("");

  document.querySelectorAll("[data-course-index]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const count = [...document.querySelectorAll("[data-course-index]")].filter((item) => item.checked).length;
      el.prereqsCompleted.value = count;
      el.prereqsTotal.value = CORE_COURSES.length;
      renderAll();
    });
  });
}

function renderProgramDetail(program, user, result) {
  const band = bandFor(result.probability);
  const requirementRows = [
    ["Minimum GPA", program.minGpa.toFixed(2), user.gpa >= program.minGpa],
    ["Competitive GPA", program.competitiveGpa.toFixed(2), user.gpa >= program.competitiveGpa],
    ["Science GPA", program.minScience.toFixed(2), user.scienceGpa >= program.minScience],
    ["Entrance test", testRequirement(program), program.test === "Optional" || user.testType === program.test],
    ["Prerequisites", `${program.prereqs} tracked`, user.prereqsCompleted >= program.prereqs],
    ["Accreditation", program.accreditation, true],
  ];

  ui.programDetail.innerHTML = `
    <div class="detail-summary">
      <div>
        <strong>${program.name}</strong>
        <span>${program.city}, ${program.state} · ${program.degree}</span>
      </div>
      <span class="status-pill ${band.className}">${band.label} · ${percent(result.probability)}</span>
    </div>
    <div class="requirements-list">
      ${requirementRows
        .map(
          ([label, value, met]) => `
            <div class="requirement-row ${met ? "met" : "gap"}">
              <span>${label}</span>
              <strong>${value}</strong>
            </div>
          `,
        )
        .join("")}
    </div>
    <div class="detail-note">
      <strong>Application focus:</strong>
      ${program.deadline} deadline, about ${program.seats} seats, and ${program.applicants} estimated applicants in this profile.
      <br />
      <a href="${programPageUrl(program)}">View the ${program.name} planning page</a>
      ${program.sourceUrl ? ` · <a href="${program.sourceUrl}" target="_blank" rel="noopener noreferrer">Official program source</a>` : ""}
      ${program.lastVerified ? `<br /><small>Last reviewed: ${program.lastVerified}. ${program.disclaimer}</small>` : ""}
    </div>
  `;

  ui.saveSelectedProgram.textContent = isSaved(program.id) ? "Remove saved" : "Save program";
  ui.saveSelectedProgram.setAttribute("aria-pressed", String(isSaved(program.id)));
}

function renderSavedPrograms() {
  const user = profile();
  const saved = savedProgramIds
    .map((id) => programs.find((program) => program.id === id))
    .filter(Boolean)
    .map((program) => ({ ...program, estimate: estimate(program, user) }))
    .sort((a, b) => b.estimate.probability - a.estimate.probability);

  ui.savedCount.textContent = saved.length;

  if (!saved.length) {
    ui.savedPrograms.innerHTML = `
      <div class="empty-state">
        <strong>No saved programs yet.</strong>
        <span>Use the Save button in the table to compare schools here.</span>
      </div>
    `;
    return;
  }

  ui.savedPrograms.innerHTML = saved
    .map((program) => {
      const band = bandFor(program.estimate.probability);
      return `
        <article class="saved-card" data-saved-card="${program.id}">
          <div>
            <strong>${program.name}</strong>
            <span>${program.state} · ${program.degree} · ${program.deadline}</span>
          </div>
          <div class="saved-card-actions">
            <span class="status-pill ${band.className}">${percent(program.estimate.probability)}</span>
            <button class="text-button" type="button" data-open-saved="${program.id}">Open</button>
            <button class="text-button danger" type="button" data-remove-saved="${program.id}">Remove</button>
          </div>
        </article>
      `;
    })
    .join("");

  ui.savedPrograms.querySelectorAll("[data-open-saved]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedProgramId = button.dataset.openSaved;
      renderAll({ keepChecklist: true });
      document.getElementById("estimator").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  ui.savedPrograms.querySelectorAll("[data-remove-saved]").forEach((button) => {
    button.addEventListener("click", () => toggleSaved(button.dataset.removeSaved));
  });
}

function renderSelectedProgram() {
  const user = profile();
  const program = programs.find((item) => item.id === selectedProgramId) || programs[0];
  if (!program) return;
  selectedProgramId = program.id;
  const result = estimate(program, user);
  const band = bandFor(result.probability);

  document.getElementById("selectedProgramName").textContent = program.name;
  document.getElementById("programBand").textContent = band.label;
  document.getElementById("programBand").className = `status-pill ${band.className}`;
  document.getElementById("oddsPercent").textContent = percent(result.probability);
  document.getElementById("oddsLabel").textContent = `${band.label} estimate for ${program.degree}`;

  const circumference = 389.56;
  const meter = document.getElementById("meterValue");
  meter.style.strokeDashoffset = `${circumference * (1 - result.probability)}`;
  meter.style.stroke = result.probability >= 0.65 ? "var(--success)" : result.probability >= 0.4 ? "var(--teal)" : "var(--danger)";

  const gpaGap = user.gpa - program.minGpa;
  const testGap = program.test === "TEAS" || program.test === "HESI" ? user.testScore - program.minTest : 0;
  document.getElementById("matchStrip").innerHTML = `
    <div class="match-item"><span>GPA buffer</span><strong>${gpaGap >= 0 ? "+" : ""}${gpaGap.toFixed(2)}</strong></div>
    <div class="match-item"><span>${program.test} score</span><strong>${program.test === "Optional" ? "Optional" : `${testGap >= 0 ? "+" : ""}${Math.round(testGap)}`}</strong></div>
    <div class="match-item"><span>Prereqs</span><strong>${user.prereqsCompleted}/${Math.max(user.prereqsTotal, program.prereqs)}</strong></div>
  `;

  document.getElementById("oddsExplanation").textContent =
    `This estimate starts with the seat pressure for ${program.name}, then adjusts for your GPA, science GPA, entrance test, prerequisite progress, experience, degree fit, and state match. It is a planning estimate, not an admissions decision.`;

  document.getElementById("factorList").innerHTML = result.factors
    .map((factor) => {
      const impact = factor.impact >= 0 ? `+${factor.impact.toFixed(2)}` : factor.impact.toFixed(2);
      return `
        <article class="factor">
          <div class="factor-row">
            <span>${factor.label}</span>
            <span>${impact}</span>
          </div>
          <div class="factor-track"><div class="factor-fill" style="width:${factor.score}%"></div></div>
          <small>${factor.note}</small>
        </article>
      `;
    })
    .join("");

  renderRecommendations(program, user, result);
  renderProgramDetail(program, user, result);
  renderGpaPlanner();
}

function filteredPrograms() {
  const user = profile();
  const query = el.searchInput.value.trim().toLowerCase();
  const state = el.stateFilter.value;
  const degree = el.degreeFilter.value;
  const minOdds = Number(el.oddsFilter.value) || 0;

  return programs
    .map((program) => ({ ...program, estimate: estimate(program, user) }))
    .filter((program) => {
      const haystack = `${program.name} ${program.city} ${program.state} ${program.degree} ${program.test} ${program.accreditation}`.toLowerCase();
      return (
        (!query || haystack.includes(query)) &&
        (state === "All" || program.state === state) &&
        (degree === "All" || program.degree === degree) &&
        program.estimate.probability * 100 >= minOdds
      );
    })
    .sort((a, b) => b.estimate.probability - a.estimate.probability || a.name.localeCompare(b.name));
}

function renderProgramTable() {
  const rows = filteredPrograms();
  const body = document.getElementById("programTableBody");
  document.getElementById("programCount").textContent = programs.length;
  if (!rows.length) {
    body.innerHTML = `<tr><td colspan="10">No programs match the current filters. Try lowering the minimum odds or clearing search.</td></tr>`;
    return;
  }
  body.innerHTML = rows
    .map((program) => {
      const odds = Math.round(program.estimate.probability * 100);
      const selected = program.id === selectedProgramId ? "selected" : "";
      const saved = isSaved(program.id);
      return `
        <tr class="${selected}" data-program-id="${program.id}" tabindex="0">
          <td>
            <div class="program-name">
              <strong>${program.name}</strong>
              <span>${program.city}</span>
            </div>
          </td>
          <td>${program.state}</td>
          <td>${program.degree}</td>
          <td>${program.minGpa.toFixed(2)}</td>
          <td>${testRequirement(program)}</td>
          <td>${program.prereqs}</td>
          <td>${program.deadline}</td>
          <td>${program.accreditation}</td>
          <td class="odds-cell">
            <div class="mini-bar">
              <div class="mini-track"><div class="mini-fill" style="width:${odds}%"></div></div>
              <strong>${odds}%</strong>
            </div>
          </td>
          <td>
            <button class="text-button ${saved ? "saved" : ""}" type="button" data-save-program-id="${program.id}" aria-pressed="${saved}">
              ${saved ? "Saved" : "Save"}
            </button>
          </td>
        </tr>
      `;
    })
    .join("");

  body.querySelectorAll("[data-program-id]").forEach((row) => {
    const selectProgram = () => {
      selectedProgramId = row.dataset.programId;
      renderAll({ keepChecklist: true });
      document.getElementById("estimator").scrollIntoView({ behavior: "smooth", block: "start" });
    };
    row.addEventListener("click", selectProgram);
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectProgram();
      }
    });
  });

  body.querySelectorAll("[data-save-program-id]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleSaved(button.dataset.saveProgramId);
    });
  });
}

function renderGpaPlanner() {
  const currentGpa = Number(el.gpa.value) || 0;
  const completedCredits = Math.max(1, Number(el.completedCredits.value) || 1);
  const futureCredits = Math.max(1, Number(el.futureCredits.value) || 1);
  const targetGpa = Number(el.targetGpa.value) || 0;
  const needed = ((targetGpa * (completedCredits + futureCredits)) - currentGpa * completedCredits) / futureCredits;
  const result = document.getElementById("gpaPlannerResult");

  if (needed > 4) {
    result.innerHTML = `<strong>${targetGpa.toFixed(2)} is not reachable with ${futureCredits} future credits alone.</strong><br />Add credits, retake eligible courses, or set a stepped target.`;
  } else if (needed < 0) {
    result.innerHTML = `<strong>You are already above that target.</strong><br />Protect your current average and focus on science prerequisites.`;
  } else {
    result.innerHTML = `<strong>You need about a ${needed.toFixed(2)} average</strong> across your next ${futureCredits} credits to reach a ${targetGpa.toFixed(2)} cumulative GPA.`;
  }
}

function renderRecommendations(program, user, result) {
  const items = topRecommendation(program, user, result);
  const deadline = nextDeadline(program.deadline);
  const timeline = [
    [`${formatDate(deadline)}`, "Final deadline window to verify and submit"],
    [`${formatDate(addDays(deadline, -45))}`, "Request transcripts and recommendation letters"],
    [`${formatDate(addDays(deadline, -75))}`, "Finalize TEAS/HESI retake plan if needed"],
  ];

  document.getElementById("recommendations").innerHTML = `
    ${items
      .map(
        (item) => `
          <article class="recommendation">
            <strong>${item.title}</strong>
            <span>${item.body}</span>
          </article>
        `,
      )
      .join("")}
    <article class="recommendation">
      <strong>Application timeline for ${program.name}</strong>
      <span>${timeline.map(([date, label]) => `${date}: ${label}`).join(" | ")}</span>
    </article>
  `;
}

function nextDeadline(deadlineText) {
  const [monthText, dayText] = deadlineText.split(" ");
  const month = new Date(`${monthText} 1, 2026`).getMonth();
  const day = Number(dayText) || 1;
  const now = new Date();
  let deadline = new Date(now.getFullYear(), month, day);
  if (deadline < now) deadline = new Date(now.getFullYear() + 1, month, day);
  return deadline;
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function formatDate(date) {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function renderAll(options = {}) {
  el.readinessValue.textContent = el.readiness.value;
  if (!options.keepChecklist) renderChecklist();
  renderSelectedProgram();
  renderProgramTable();
  renderSavedPrograms();
  if (!options.skipSave) persistState();
}

function downloadBlob(filename, content, type = "text/csv") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function csvEscape(value) {
  const text = String(value ?? "");
  return text.includes(",") || text.includes('"') || text.includes("\n") ? `"${text.replaceAll('"', '""')}"` : text;
}

function programsToCsv(data) {
  const columns = [
    "slug",
    "schoolName",
    "city",
    "state",
    "degreeType",
    "minimumGpa",
    "competitiveGpa",
    "scienceGpa",
    "entranceExam",
    "minimumScore",
    "prerequisites",
    "deadline",
    "seats",
    "estimatedApplicants",
    "accreditation",
    "sourceUrl",
    "lastVerified",
    "disclaimer",
  ];
  return [columns.join(","), ...data.map((program) => columns.map((column) => csvEscape(program[column])).join(","))].join("\n");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  row.push(cell);
  if (row.some((value) => value.trim())) rows.push(row);

  const [headers, ...records] = rows;
  if (!headers) return [];
  return records.map((record, index) => {
    const object = Object.fromEntries(headers.map((header, headerIndex) => [header.trim(), record[headerIndex]?.trim() ?? ""]));
    return normalizeProgram(object, index);
  });
}

function attachEvents() {
  ids.forEach((id) => {
    const item = el[id];
    if (item) {
      item.addEventListener("input", () => renderAll({ keepChecklist: id !== "prereqsCompleted" && id !== "prereqsTotal" }));
      item.addEventListener("change", () => renderAll({ keepChecklist: id !== "prereqsCompleted" && id !== "prereqsTotal" }));
    }
  });

  document.getElementById("resetProfile").addEventListener("click", () => {
    el.gpa.value = "3.48";
    el.scienceGpa.value = "3.34";
    el.testType.value = "TEAS";
    el.testScore.value = "82";
    el.prereqsCompleted.value = "7";
    el.prereqsTotal.value = "9";
    el.healthcareHours.value = "180";
    el.volunteerHours.value = "40";
    el.homeState.value = "CA";
    el.degreeGoal.value = "BSN";
    el.readiness.value = "70";
    renderAll();
  });

  document.getElementById("saveSelectedProgram").addEventListener("click", () => toggleSaved(selectedProgramId));
  document.getElementById("clearSaved").addEventListener("click", () => {
    savedProgramIds = [];
    renderAll({ keepChecklist: true });
  });
  document.getElementById("printReport").addEventListener("click", () => window.print());
  document.getElementById("downloadCsv").addEventListener("click", () => downloadBlob("nursing-school-planner-programs.csv", programsToCsv(programs)));
  document.getElementById("downloadTemplate").addEventListener("click", () => downloadBlob("nursing-school-planner-program-template.csv", programsToCsv(starterPrograms.slice(0, 3))));
  document.getElementById("useSampleData").addEventListener("click", () => {
    programs = starterPrograms.map((program) => ({ ...program }));
    selectedProgramId = programs[0].id;
    renderAll();
  });

  document.getElementById("csvImport").addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const imported = parseCsv(text);
    if (imported.length) {
      programs = imported;
      selectedProgramId = programs[0].id;
      renderAll();
    }
    event.target.value = "";
  });
}

function initScrollReveal() {
  const revealItems = document.querySelectorAll("[data-reveal]");
  if (!revealItems.length) return;

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  document.documentElement.classList.add("reveal-ready");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

async function initApp() {
  renderStateOptions();
  attachEvents();
  initScrollReveal();

  try {
    await loadProgramData();
    applySavedProfile();
    renderAll();
  } catch (error) {
    console.error(error);
    document.getElementById("programCount").textContent = "0";
    document.getElementById("programTableBody").innerHTML = `
      <tr>
        <td colspan="10">Program data could not be loaded. Refresh the page or try again after deployment.</td>
      </tr>
    `;
    ui.programDetail.innerHTML = `
      <div class="empty-state">
        <strong>Program data is temporarily unavailable.</strong>
        <span>The calculator needs data/programs.json to load program requirements.</span>
      </div>
    `;
  }
}

initApp();
