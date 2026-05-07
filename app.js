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

// data/programs.json powers the calculator and US program dashboard for all programs.
// Static /schools and /states SEO pages can be generated gradually by state from that catalog.
const PROGRAM_DATA_VERSION = "2026-05-07-major-programs-152";
const PROGRAM_DATA_URL = `data/programs.json?v=${PROGRAM_DATA_VERSION}`;
const SCHOOL_PAGE_SLUGS = new Set([
  "uark-bsn",
  "uams-bsn",
  "astate-bsn",
  "atu-bsn",
  "uca-bsn",
  "ualr-adn",
  "harding-bsn",
  "henderson-bsn",
  "sau-bsn",
]);

// Manual national baseline used by the calculator when the deployed JSON is incomplete.
// Entries from data/programs.json override matching slugs, so verified state/school data can improve gradually.
// BEGIN MANUAL_MAJOR_PROGRAMS
const MANUAL_MAJOR_PROGRAMS =   [
    {
      "slug": "uaa-bsn",
      "schoolName": "University of Alaska Anchorage",
      "city": "Anchorage",
      "state": "AK",
      "degreeType": "BSN",
      "minimumGpa": 2.75,
      "competitiveGpa": 3.3,
      "scienceGpa": 2.75,
      "entranceExam": "TEAS",
      "minimumScore": 70,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 80,
      "estimatedApplicants": 260,
      "accreditation": "ACEN",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "auburn-bsn",
      "schoolName": "Auburn University",
      "city": "Auburn",
      "state": "AL",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.55,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 75,
      "prerequisites": 8,
      "deadline": "Jan 15",
      "seats": 160,
      "estimatedApplicants": 720,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "uab-bsn",
      "schoolName": "University of Alabama at Birmingham",
      "city": "Birmingham",
      "state": "AL",
      "degreeType": "BSN",
      "minimumGpa": 2.75,
      "competitiveGpa": 3.35,
      "scienceGpa": 2.75,
      "entranceExam": "TEAS",
      "minimumScore": 75,
      "prerequisites": 9,
      "deadline": "Jan 15",
      "seats": 150,
      "estimatedApplicants": 620,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "south-alabama-bsn",
      "schoolName": "University of South Alabama",
      "city": "Mobile",
      "state": "AL",
      "degreeType": "BSN",
      "minimumGpa": 2.75,
      "competitiveGpa": 3.35,
      "scienceGpa": 2.75,
      "entranceExam": "TEAS",
      "minimumScore": 70,
      "prerequisites": 8,
      "deadline": "Feb 15",
      "seats": 160,
      "estimatedApplicants": 520,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "astate-bsn",
      "schoolName": "Arkansas State University",
      "city": "Jonesboro",
      "state": "AR",
      "degreeType": "BSN",
      "minimumGpa": 2.75,
      "competitiveGpa": 3.3,
      "scienceGpa": 2.75,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 9,
      "deadline": "Jun 7 / Oct 1",
      "seats": 140,
      "estimatedApplicants": 520,
      "accreditation": "ACEN",
      "sourceUrl": "https://www.astate.edu/programs/bsn-in-nursing.html",
      "lastVerified": "2026-05-07",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "atu-bsn",
      "schoolName": "Arkansas Tech University",
      "city": "Russellville",
      "state": "AR",
      "degreeType": "BSN",
      "minimumGpa": 2.75,
      "competitiveGpa": 3.25,
      "scienceGpa": 2.75,
      "entranceExam": "TEAS - Proficient",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Feb 15 / Sep 15",
      "seats": 96,
      "estimatedApplicants": 360,
      "accreditation": "ACEN",
      "sourceUrl": "https://www.atu.edu/ceh/nursing/admission.php",
      "lastVerified": "2026-05-07",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "harding-bsn",
      "schoolName": "Harding University Carr College of Nursing",
      "city": "Searcy",
      "state": "AR",
      "degreeType": "BSN",
      "minimumGpa": 2.78,
      "competitiveGpa": 3.35,
      "scienceGpa": 2.78,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 9,
      "deadline": "Mar 1 / Oct 1",
      "seats": 96,
      "estimatedApplicants": 330,
      "accreditation": "CCNE",
      "sourceUrl": "https://www.harding.edu/nursing/undergraduate-program/admission",
      "lastVerified": "2026-05-07",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "henderson-bsn",
      "schoolName": "Henderson State University",
      "city": "Arkadelphia",
      "state": "AR",
      "degreeType": "BSN",
      "minimumGpa": 2.7,
      "competitiveGpa": 3.25,
      "scienceGpa": 2.7,
      "entranceExam": "TEAS (recommended)",
      "minimumScore": 60,
      "prerequisites": 8,
      "deadline": "Feb 28",
      "seats": 80,
      "estimatedApplicants": 300,
      "accreditation": "CCNE",
      "sourceUrl": "https://www.hsu.edu/academics/aviation-science-and-nursing/nursing/bsn-on-campus/prelicensure-bsn-admission-policy-and-procedures/",
      "lastVerified": "2026-05-07",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "sau-bsn",
      "schoolName": "Southern Arkansas University",
      "city": "Magnolia",
      "state": "AR",
      "degreeType": "BSN",
      "minimumGpa": 2.85,
      "competitiveGpa": 3.35,
      "scienceGpa": 2.85,
      "entranceExam": "HESI",
      "minimumScore": 75,
      "prerequisites": 8,
      "deadline": "Mar 1",
      "seats": 80,
      "estimatedApplicants": 320,
      "accreditation": "ACEN",
      "sourceUrl": "https://web.saumag.edu/academics/program/nursing-bsn/",
      "lastVerified": "2026-05-07",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "ualr-adn",
      "schoolName": "University of Arkansas at Little Rock",
      "city": "Little Rock",
      "state": "AR",
      "degreeType": "ADN",
      "minimumGpa": 2.6,
      "competitiveGpa": 3.15,
      "scienceGpa": 2.6,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 7,
      "deadline": "Jan 31",
      "seats": 160,
      "estimatedApplicants": 540,
      "accreditation": "ACEN",
      "sourceUrl": "https://ualr.edu/nursing/become-a-nurse/admissions/",
      "lastVerified": "2026-05-07",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "uark-bsn",
      "schoolName": "University of Arkansas Eleanor Mann School of Nursing",
      "city": "Fayetteville",
      "state": "AR",
      "degreeType": "BSN",
      "minimumGpa": 3.5,
      "competitiveGpa": 3.75,
      "scienceGpa": 3.5,
      "entranceExam": "TEAS + Casper",
      "minimumScore": 70,
      "prerequisites": 10,
      "deadline": "Jan 15 / Jul 15",
      "seats": 120,
      "estimatedApplicants": 680,
      "accreditation": "CCNE",
      "sourceUrl": "https://nursing.uark.edu/programs/bsn-options/prelicensure-bsn/admission-requirements.php",
      "lastVerified": "2026-05-07",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "uams-bsn",
      "schoolName": "University of Arkansas for Medical Sciences",
      "city": "Little Rock",
      "state": "AR",
      "degreeType": "BSN",
      "minimumGpa": 2.5,
      "competitiveGpa": 3.3,
      "scienceGpa": 2.5,
      "entranceExam": "TEAS (waivers possible)",
      "minimumScore": 60,
      "prerequisites": 10,
      "deadline": "Mar 1",
      "seats": 160,
      "estimatedApplicants": 620,
      "accreditation": "CCNE",
      "sourceUrl": "https://nursing.uams.edu/programs/bsn/admissions/requirements/",
      "lastVerified": "2026-05-07",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "uca-bsn",
      "schoolName": "University of Central Arkansas",
      "city": "Conway",
      "state": "AR",
      "degreeType": "BSN",
      "minimumGpa": 2.75,
      "competitiveGpa": 3.35,
      "scienceGpa": 2.75,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 10,
      "deadline": "Spring application cycle",
      "seats": 110,
      "estimatedApplicants": 460,
      "accreditation": "CCNE",
      "sourceUrl": "https://uca.edu/nursing/bsn-general-information-pre-reqs/",
      "lastVerified": "2026-05-07",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "asu-bsn",
      "schoolName": "Arizona State University",
      "city": "Phoenix",
      "state": "AZ",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.65,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 80,
      "prerequisites": 10,
      "deadline": "Feb 15",
      "seats": 176,
      "estimatedApplicants": 940,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "gcu-bsn",
      "schoolName": "Grand Canyon University",
      "city": "Phoenix",
      "state": "AZ",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.35,
      "scienceGpa": 3,
      "entranceExam": "HESI",
      "minimumScore": 80,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 220,
      "estimatedApplicants": 760,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "nau-bsn",
      "schoolName": "Northern Arizona University",
      "city": "Flagstaff",
      "state": "AZ",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.45,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 76,
      "prerequisites": 9,
      "deadline": "Jan 15",
      "seats": 150,
      "estimatedApplicants": 560,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "ua-bsn",
      "schoolName": "University of Arizona",
      "city": "Tucson",
      "state": "AZ",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.55,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 78,
      "prerequisites": 10,
      "deadline": "Feb 1",
      "seats": 168,
      "estimatedApplicants": 780,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "csulb-bsn",
      "schoolName": "California State University Long Beach",
      "city": "Long Beach",
      "state": "CA",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.75,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 80,
      "prerequisites": 9,
      "deadline": "Feb 10",
      "seats": 80,
      "estimatedApplicants": 1000,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "sac-state-bsn",
      "schoolName": "Sacramento State",
      "city": "Sacramento",
      "state": "CA",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.65,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 78,
      "prerequisites": 9,
      "deadline": "Jan 31",
      "seats": 80,
      "estimatedApplicants": 760,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "samuel-merritt-absn",
      "schoolName": "Samuel Merritt University",
      "city": "Oakland",
      "state": "CA",
      "degreeType": "ABSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.45,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 78,
      "prerequisites": 8,
      "deadline": "Apr 1",
      "seats": 96,
      "estimatedApplicants": 540,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "sdsu-bsn",
      "schoolName": "San Diego State University",
      "city": "San Diego",
      "state": "CA",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.8,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 80,
      "prerequisites": 9,
      "deadline": "Dec 15",
      "seats": 120,
      "estimatedApplicants": 1200,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "ucla-bsn",
      "schoolName": "UCLA School of Nursing",
      "city": "Los Angeles",
      "state": "CA",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.85,
      "scienceGpa": 3.2,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 9,
      "deadline": "Nov 30",
      "seats": 50,
      "estimatedApplicants": 1150,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "uci-bsn",
      "schoolName": "University of California Irvine",
      "city": "Irvine",
      "state": "CA",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.85,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Nov 30",
      "seats": 50,
      "estimatedApplicants": 950,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "usfca-bsn",
      "schoolName": "University of San Francisco",
      "city": "San Francisco",
      "state": "CA",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.55,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Jan 15",
      "seats": 120,
      "estimatedApplicants": 540,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "colorado-mesa-bsn",
      "schoolName": "Colorado Mesa University",
      "city": "Grand Junction",
      "state": "CO",
      "degreeType": "BSN",
      "minimumGpa": 2.75,
      "competitiveGpa": 3.3,
      "scienceGpa": 2.75,
      "entranceExam": "TEAS",
      "minimumScore": 70,
      "prerequisites": 8,
      "deadline": "Jan 31",
      "seats": 90,
      "estimatedApplicants": 320,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "front-range-adn",
      "schoolName": "Front Range Community College",
      "city": "Westminster",
      "state": "CO",
      "degreeType": "ADN",
      "minimumGpa": 2.5,
      "competitiveGpa": 3.2,
      "scienceGpa": 2.5,
      "entranceExam": "HESI",
      "minimumScore": 80,
      "prerequisites": 7,
      "deadline": "Mar 1",
      "seats": 120,
      "estimatedApplicants": 470,
      "accreditation": "ACEN",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "regis-bsn",
      "schoolName": "Regis University",
      "city": "Denver",
      "state": "CO",
      "degreeType": "BSN",
      "minimumGpa": 2.75,
      "competitiveGpa": 3.35,
      "scienceGpa": 2.75,
      "entranceExam": "TEAS",
      "minimumScore": 70,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 96,
      "estimatedApplicants": 340,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "cu-bsn",
      "schoolName": "University of Colorado College of Nursing",
      "city": "Aurora",
      "state": "CO",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.55,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 75,
      "prerequisites": 9,
      "deadline": "Jan 15",
      "seats": 96,
      "estimatedApplicants": 520,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "fairfield-bsn",
      "schoolName": "Fairfield University",
      "city": "Fairfield",
      "state": "CT",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.5,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Jan 15",
      "seats": 80,
      "estimatedApplicants": 320,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "quinnipiac-bsn",
      "schoolName": "Quinnipiac University",
      "city": "Hamden",
      "state": "CT",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.45,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 110,
      "estimatedApplicants": 360,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "uconn-bsn",
      "schoolName": "University of Connecticut",
      "city": "Storrs",
      "state": "CT",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.6,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 9,
      "deadline": "Feb 1",
      "seats": 110,
      "estimatedApplicants": 550,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "georgetown-bsn",
      "schoolName": "Georgetown University",
      "city": "Washington",
      "state": "DC",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.7,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Jan 10",
      "seats": 72,
      "estimatedApplicants": 520,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "howard-bsn",
      "schoolName": "Howard University",
      "city": "Washington",
      "state": "DC",
      "degreeType": "BSN",
      "minimumGpa": 2.75,
      "competitiveGpa": 3.3,
      "scienceGpa": 2.75,
      "entranceExam": "TEAS",
      "minimumScore": 70,
      "prerequisites": 8,
      "deadline": "Feb 15",
      "seats": 90,
      "estimatedApplicants": 360,
      "accreditation": "ACEN",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "delaware-state-bsn",
      "schoolName": "Delaware State University Department of Nursing",
      "city": "Dover",
      "state": "DE",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.4,
      "scienceGpa": 3,
      "entranceExam": "Not listed",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "End of spring sophomore year",
      "seats": 80,
      "estimatedApplicants": 320,
      "accreditation": "ACEN",
      "sourceUrl": "https://wchbs.desu.edu/departments/nursing/nursing-bs/admission-progression-policies",
      "lastVerified": "2026-05-07",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying.",
      "requirementsNote": "Official admission/progression policy lists a 3.0 minimum GPA and prerequisite completion for admission to the professional nursing phase."
    },
    {
      "slug": "delaware-tech-adn",
      "schoolName": "Delaware Technical Community College",
      "city": "Dover / Georgetown / Newark",
      "state": "DE",
      "degreeType": "ADN",
      "minimumGpa": 2.5,
      "competitiveGpa": 3.2,
      "scienceGpa": 2.5,
      "entranceExam": "TEAS",
      "minimumScore": 58.7,
      "prerequisites": 7,
      "deadline": "Mar 15 / Aug 15",
      "seats": 180,
      "estimatedApplicants": 650,
      "accreditation": "ACEN",
      "sourceUrl": "https://www.dtcc.edu/media/dtcc-website/content-assets/documents/nursing_competitive_admissions_process.pdf",
      "lastVerified": "2026-05-07",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying.",
      "requirementsNote": "Official nursing admission handbook lists a 2.5 minimum cumulative GPA for ADN and a 58.7 minimum ATI TEAS total score."
    },
    {
      "slug": "udel-bsn",
      "schoolName": "University of Delaware School of Nursing",
      "city": "Newark",
      "state": "DE",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.7,
      "scienceGpa": 3,
      "entranceExam": "Not required/published",
      "minimumScore": 0,
      "prerequisites": 0,
      "deadline": "Dec 1",
      "seats": 140,
      "estimatedApplicants": 900,
      "accreditation": "CCNE",
      "sourceUrl": "https://www.udel.edu/academics/colleges/chs/departments/son/undergraduate-programs/traditional-bsn/",
      "lastVerified": "2026-05-07",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying.",
      "requirementsNote": "Direct freshman admission; official program page lists the December 1 nursing application deadline and does not publish a TEAS/HESI requirement."
    },
    {
      "slug": "fau-bsn",
      "schoolName": "Florida Atlantic University",
      "city": "Boca Raton",
      "state": "FL",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.5,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 73,
      "prerequisites": 8,
      "deadline": "Jan 15",
      "seats": 120,
      "estimatedApplicants": 540,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "fiu-bsn",
      "schoolName": "Florida International University",
      "city": "Miami",
      "state": "FL",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.55,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 70,
      "prerequisites": 8,
      "deadline": "Feb 15",
      "seats": 160,
      "estimatedApplicants": 680,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "fsu-bsn",
      "schoolName": "Florida State University",
      "city": "Tallahassee",
      "state": "FL",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.6,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 75,
      "prerequisites": 8,
      "deadline": "Jan 15",
      "seats": 120,
      "estimatedApplicants": 650,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "miami-dade-adn",
      "schoolName": "Miami Dade College",
      "city": "Miami",
      "state": "FL",
      "degreeType": "ADN",
      "minimumGpa": 2.5,
      "competitiveGpa": 3.15,
      "scienceGpa": 2.5,
      "entranceExam": "TEAS",
      "minimumScore": 65,
      "prerequisites": 7,
      "deadline": "May 1",
      "seats": 180,
      "estimatedApplicants": 600,
      "accreditation": "ACEN",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "ucf-bsn",
      "schoolName": "University of Central Florida",
      "city": "Orlando",
      "state": "FL",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.65,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 78,
      "prerequisites": 9,
      "deadline": "Feb 1",
      "seats": 180,
      "estimatedApplicants": 1000,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "uf-bsn",
      "schoolName": "University of Florida",
      "city": "Gainesville",
      "state": "FL",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.75,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 78,
      "prerequisites": 9,
      "deadline": "Mar 1",
      "seats": 140,
      "estimatedApplicants": 980,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "usf-bsn",
      "schoolName": "University of South Florida",
      "city": "Tampa",
      "state": "FL",
      "degreeType": "BSN",
      "minimumGpa": 3.2,
      "competitiveGpa": 3.7,
      "scienceGpa": 3.2,
      "entranceExam": "TEAS",
      "minimumScore": 78,
      "prerequisites": 9,
      "deadline": "Jan 15",
      "seats": 160,
      "estimatedApplicants": 930,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "augusta-bsn",
      "schoolName": "Augusta University",
      "city": "Augusta",
      "state": "GA",
      "degreeType": "BSN",
      "minimumGpa": 2.8,
      "competitiveGpa": 3.35,
      "scienceGpa": 2.8,
      "entranceExam": "TEAS",
      "minimumScore": 70,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 120,
      "estimatedApplicants": 480,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "emory-bsn",
      "schoolName": "Emory University",
      "city": "Atlanta",
      "state": "GA",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.65,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Jan 15",
      "seats": 130,
      "estimatedApplicants": 620,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "georgia-southern-bsn",
      "schoolName": "Georgia Southern University",
      "city": "Statesboro",
      "state": "GA",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.4,
      "scienceGpa": 3,
      "entranceExam": "HESI",
      "minimumScore": 75,
      "prerequisites": 8,
      "deadline": "Jan 15",
      "seats": 130,
      "estimatedApplicants": 500,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "gsu-bsn",
      "schoolName": "Georgia State University",
      "city": "Atlanta",
      "state": "GA",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.45,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 75,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 110,
      "estimatedApplicants": 570,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "kennesaw-bsn",
      "schoolName": "Kennesaw State University",
      "city": "Kennesaw",
      "state": "GA",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.45,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 78,
      "prerequisites": 8,
      "deadline": "Jan 31",
      "seats": 120,
      "estimatedApplicants": 620,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "hawaii-manoa-bsn",
      "schoolName": "University of Hawaii at Manoa",
      "city": "Honolulu",
      "state": "HI",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.55,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 78,
      "prerequisites": 9,
      "deadline": "Jan 5",
      "seats": 80,
      "estimatedApplicants": 390,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "iowa-state-bsn",
      "schoolName": "Iowa State University",
      "city": "Ames",
      "state": "IA",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.45,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 80,
      "estimatedApplicants": 320,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "uiowa-bsn",
      "schoolName": "University of Iowa",
      "city": "Iowa City",
      "state": "IA",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.55,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 76,
      "prerequisites": 9,
      "deadline": "Feb 1",
      "seats": 112,
      "estimatedApplicants": 430,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "boise-state-bsn",
      "schoolName": "Boise State University",
      "city": "Boise",
      "state": "ID",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.5,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 75,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 96,
      "estimatedApplicants": 460,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "depaul-menp",
      "schoolName": "DePaul University",
      "city": "Chicago",
      "state": "IL",
      "degreeType": "ABSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.35,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Mar 1",
      "seats": 96,
      "estimatedApplicants": 380,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "illinois-state-bsn",
      "schoolName": "Illinois State University",
      "city": "Normal",
      "state": "IL",
      "degreeType": "BSN",
      "minimumGpa": 2.8,
      "competitiveGpa": 3.4,
      "scienceGpa": 2.8,
      "entranceExam": "TEAS",
      "minimumScore": 70,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 140,
      "estimatedApplicants": 560,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "loyola-absn",
      "schoolName": "Loyola University Chicago",
      "city": "Maywood",
      "state": "IL",
      "degreeType": "ABSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.35,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Feb 15",
      "seats": 88,
      "estimatedApplicants": 360,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "uic-bsn",
      "schoolName": "University of Illinois Chicago",
      "city": "Chicago",
      "state": "IL",
      "degreeType": "BSN",
      "minimumGpa": 2.75,
      "competitiveGpa": 3.5,
      "scienceGpa": 2.75,
      "entranceExam": "TEAS",
      "minimumScore": 75,
      "prerequisites": 9,
      "deadline": "Jan 15",
      "seats": 96,
      "estimatedApplicants": 610,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "ball-state-bsn",
      "schoolName": "Ball State University",
      "city": "Muncie",
      "state": "IN",
      "degreeType": "BSN",
      "minimumGpa": 2.75,
      "competitiveGpa": 3.3,
      "scienceGpa": 2.75,
      "entranceExam": "TEAS",
      "minimumScore": 70,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 120,
      "estimatedApplicants": 440,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "iu-bsn",
      "schoolName": "Indiana University Bloomington",
      "city": "Bloomington",
      "state": "IN",
      "degreeType": "BSN",
      "minimumGpa": 2.7,
      "competitiveGpa": 3.35,
      "scienceGpa": 2.7,
      "entranceExam": "TEAS",
      "minimumScore": 72,
      "prerequisites": 8,
      "deadline": "Jan 31",
      "seats": 120,
      "estimatedApplicants": 520,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "purdue-bsn",
      "schoolName": "Purdue University",
      "city": "West Lafayette",
      "state": "IN",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.55,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 76,
      "prerequisites": 9,
      "deadline": "Feb 1",
      "seats": 112,
      "estimatedApplicants": 500,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "ku-bsn",
      "schoolName": "University of Kansas",
      "city": "Kansas City",
      "state": "KS",
      "degreeType": "BSN",
      "minimumGpa": 2.5,
      "competitiveGpa": 3.3,
      "scienceGpa": 2.5,
      "entranceExam": "TEAS",
      "minimumScore": 70,
      "prerequisites": 8,
      "deadline": "Jan 10",
      "seats": 140,
      "estimatedApplicants": 500,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "wichita-state-bsn",
      "schoolName": "Wichita State University",
      "city": "Wichita",
      "state": "KS",
      "degreeType": "BSN",
      "minimumGpa": 2.75,
      "competitiveGpa": 3.3,
      "scienceGpa": 2.75,
      "entranceExam": "TEAS",
      "minimumScore": 70,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 112,
      "estimatedApplicants": 420,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "uk-bsn",
      "schoolName": "University of Kentucky",
      "city": "Lexington",
      "state": "KY",
      "degreeType": "BSN",
      "minimumGpa": 2.75,
      "competitiveGpa": 3.45,
      "scienceGpa": 2.75,
      "entranceExam": "TEAS",
      "minimumScore": 74,
      "prerequisites": 9,
      "deadline": "Mar 1",
      "seats": 150,
      "estimatedApplicants": 620,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "louisville-bsn",
      "schoolName": "University of Louisville",
      "city": "Louisville",
      "state": "KY",
      "degreeType": "BSN",
      "minimumGpa": 2.8,
      "competitiveGpa": 3.4,
      "scienceGpa": 2.8,
      "entranceExam": "TEAS",
      "minimumScore": 75,
      "prerequisites": 9,
      "deadline": "Feb 1",
      "seats": 140,
      "estimatedApplicants": 560,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "lsuhno-bsn",
      "schoolName": "LSU Health New Orleans",
      "city": "New Orleans",
      "state": "LA",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.45,
      "scienceGpa": 3,
      "entranceExam": "HESI",
      "minimumScore": 80,
      "prerequisites": 9,
      "deadline": "Jan 15",
      "seats": 120,
      "estimatedApplicants": 520,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "southeastern-la-bsn",
      "schoolName": "Southeastern Louisiana University",
      "city": "Hammond",
      "state": "LA",
      "degreeType": "BSN",
      "minimumGpa": 2.7,
      "competitiveGpa": 3.25,
      "scienceGpa": 2.7,
      "entranceExam": "HESI",
      "minimumScore": 75,
      "prerequisites": 8,
      "deadline": "Jan 31",
      "seats": 120,
      "estimatedApplicants": 430,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "ul-lafayette-bsn",
      "schoolName": "University of Louisiana at Lafayette",
      "city": "Lafayette",
      "state": "LA",
      "degreeType": "BSN",
      "minimumGpa": 2.8,
      "competitiveGpa": 3.35,
      "scienceGpa": 2.8,
      "entranceExam": "HESI",
      "minimumScore": 75,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 120,
      "estimatedApplicants": 440,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "bc-bsn",
      "schoolName": "Boston College",
      "city": "Chestnut Hill",
      "state": "MA",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.7,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Jan 1",
      "seats": 100,
      "estimatedApplicants": 680,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "mgh-absn",
      "schoolName": "MGH Institute of Health Professions",
      "city": "Boston",
      "state": "MA",
      "degreeType": "ABSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.35,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 96,
      "estimatedApplicants": 420,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "northeastern-bsn",
      "schoolName": "Northeastern University",
      "city": "Boston",
      "state": "MA",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.7,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Jan 1",
      "seats": 120,
      "estimatedApplicants": 720,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "umass-amherst-bsn",
      "schoolName": "University of Massachusetts Amherst",
      "city": "Amherst",
      "state": "MA",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.65,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Jan 15",
      "seats": 120,
      "estimatedApplicants": 680,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "johns-hopkins-msn",
      "schoolName": "Johns Hopkins University",
      "city": "Baltimore",
      "state": "MD",
      "degreeType": "ABSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.55,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Jan 1",
      "seats": 140,
      "estimatedApplicants": 780,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "towson-bsn",
      "schoolName": "Towson University",
      "city": "Towson",
      "state": "MD",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.45,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 70,
      "prerequisites": 8,
      "deadline": "Jan 15",
      "seats": 120,
      "estimatedApplicants": 520,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "umb-bsn",
      "schoolName": "University of Maryland Baltimore",
      "city": "Baltimore",
      "state": "MD",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.55,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 76,
      "prerequisites": 9,
      "deadline": "Feb 1",
      "seats": 160,
      "estimatedApplicants": 760,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "maine-bsn",
      "schoolName": "University of Maine",
      "city": "Orono",
      "state": "ME",
      "degreeType": "BSN",
      "minimumGpa": 2.75,
      "competitiveGpa": 3.35,
      "scienceGpa": 2.75,
      "entranceExam": "TEAS",
      "minimumScore": 70,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 90,
      "estimatedApplicants": 300,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "gvsu-bsn",
      "schoolName": "Grand Valley State University",
      "city": "Grand Rapids",
      "state": "MI",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.45,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 75,
      "prerequisites": 8,
      "deadline": "Jan 15",
      "seats": 120,
      "estimatedApplicants": 520,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "msu-bsn",
      "schoolName": "Michigan State University",
      "city": "East Lansing",
      "state": "MI",
      "degreeType": "BSN",
      "minimumGpa": 2.75,
      "competitiveGpa": 3.45,
      "scienceGpa": 2.75,
      "entranceExam": "TEAS",
      "minimumScore": 75,
      "prerequisites": 8,
      "deadline": "Jan 15",
      "seats": 120,
      "estimatedApplicants": 540,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "umich-bsn",
      "schoolName": "University of Michigan",
      "city": "Ann Arbor",
      "state": "MI",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.8,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 120,
      "estimatedApplicants": 980,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "wayne-state-bsn",
      "schoolName": "Wayne State University",
      "city": "Detroit",
      "state": "MI",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.5,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 75,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 96,
      "estimatedApplicants": 460,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "st-catherine-bsn",
      "schoolName": "St. Catherine University",
      "city": "St. Paul",
      "state": "MN",
      "degreeType": "BSN",
      "minimumGpa": 2.75,
      "competitiveGpa": 3.3,
      "scienceGpa": 2.75,
      "entranceExam": "TEAS",
      "minimumScore": 70,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 100,
      "estimatedApplicants": 360,
      "accreditation": "ACEN",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "umn-bsn",
      "schoolName": "University of Minnesota",
      "city": "Minneapolis",
      "state": "MN",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.65,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 76,
      "prerequisites": 9,
      "deadline": "Jan 15",
      "seats": 128,
      "estimatedApplicants": 690,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "slu-bsn",
      "schoolName": "Saint Louis University",
      "city": "St. Louis",
      "state": "MO",
      "degreeType": "BSN",
      "minimumGpa": 2.75,
      "competitiveGpa": 3.35,
      "scienceGpa": 2.75,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 120,
      "estimatedApplicants": 390,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "mizzou-bsn",
      "schoolName": "University of Missouri",
      "city": "Columbia",
      "state": "MO",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.45,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 75,
      "prerequisites": 8,
      "deadline": "Jan 31",
      "seats": 120,
      "estimatedApplicants": 540,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "umkc-bsn",
      "schoolName": "University of Missouri Kansas City",
      "city": "Kansas City",
      "state": "MO",
      "degreeType": "BSN",
      "minimumGpa": 2.75,
      "competitiveGpa": 3.3,
      "scienceGpa": 2.75,
      "entranceExam": "TEAS",
      "minimumScore": 70,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 100,
      "estimatedApplicants": 380,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "ummc-bsn",
      "schoolName": "University of Mississippi Medical Center",
      "city": "Jackson",
      "state": "MS",
      "degreeType": "BSN",
      "minimumGpa": 2.75,
      "competitiveGpa": 3.35,
      "scienceGpa": 2.75,
      "entranceExam": "TEAS",
      "minimumScore": 72,
      "prerequisites": 8,
      "deadline": "Jan 31",
      "seats": 150,
      "estimatedApplicants": 520,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "southern-miss-bsn",
      "schoolName": "University of Southern Mississippi",
      "city": "Hattiesburg",
      "state": "MS",
      "degreeType": "BSN",
      "minimumGpa": 2.8,
      "competitiveGpa": 3.35,
      "scienceGpa": 2.8,
      "entranceExam": "TEAS",
      "minimumScore": 70,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 120,
      "estimatedApplicants": 420,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "montana-state-bsn",
      "schoolName": "Montana State University",
      "city": "Bozeman",
      "state": "MT",
      "degreeType": "BSN",
      "minimumGpa": 2.75,
      "competitiveGpa": 3.35,
      "scienceGpa": 2.75,
      "entranceExam": "TEAS",
      "minimumScore": 70,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 100,
      "estimatedApplicants": 360,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "duke-absn",
      "schoolName": "Duke University",
      "city": "Durham",
      "state": "NC",
      "degreeType": "ABSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.55,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Jan 5",
      "seats": 90,
      "estimatedApplicants": 620,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "ecu-bsn",
      "schoolName": "East Carolina University",
      "city": "Greenville",
      "state": "NC",
      "degreeType": "BSN",
      "minimumGpa": 2.75,
      "competitiveGpa": 3.35,
      "scienceGpa": 2.75,
      "entranceExam": "TEAS",
      "minimumScore": 70,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 130,
      "estimatedApplicants": 520,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "unc-bsn",
      "schoolName": "UNC Chapel Hill",
      "city": "Chapel Hill",
      "state": "NC",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.75,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 78,
      "prerequisites": 9,
      "deadline": "Dec 22",
      "seats": 104,
      "estimatedApplicants": 840,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "unc-charlotte-bsn",
      "schoolName": "UNC Charlotte",
      "city": "Charlotte",
      "state": "NC",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.45,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 70,
      "prerequisites": 8,
      "deadline": "Jan 15",
      "seats": 120,
      "estimatedApplicants": 560,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "ndsu-bsn",
      "schoolName": "North Dakota State University",
      "city": "Fargo",
      "state": "ND",
      "degreeType": "BSN",
      "minimumGpa": 2.75,
      "competitiveGpa": 3.3,
      "scienceGpa": 2.75,
      "entranceExam": "TEAS",
      "minimumScore": 70,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 80,
      "estimatedApplicants": 260,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "creighton-bsn",
      "schoolName": "Creighton University",
      "city": "Omaha",
      "state": "NE",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.4,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 120,
      "estimatedApplicants": 360,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "unh-bsn",
      "schoolName": "University of New Hampshire",
      "city": "Durham",
      "state": "NH",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.45,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 80,
      "estimatedApplicants": 340,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "rutgers-bsn",
      "schoolName": "Rutgers University",
      "city": "Newark",
      "state": "NJ",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.6,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 75,
      "prerequisites": 9,
      "deadline": "Feb 1",
      "seats": 180,
      "estimatedApplicants": 900,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "seton-hall-bsn",
      "schoolName": "Seton Hall University",
      "city": "Nutley",
      "state": "NJ",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.45,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 70,
      "prerequisites": 8,
      "deadline": "Jan 15",
      "seats": 100,
      "estimatedApplicants": 420,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "unm-bsn",
      "schoolName": "University of New Mexico",
      "city": "Albuquerque",
      "state": "NM",
      "degreeType": "BSN",
      "minimumGpa": 2.75,
      "competitiveGpa": 3.35,
      "scienceGpa": 2.75,
      "entranceExam": "HESI",
      "minimumScore": 75,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 120,
      "estimatedApplicants": 460,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "unlv-bsn",
      "schoolName": "University of Nevada Las Vegas",
      "city": "Las Vegas",
      "state": "NV",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.55,
      "scienceGpa": 3,
      "entranceExam": "HESI",
      "minimumScore": 75,
      "prerequisites": 9,
      "deadline": "Feb 1",
      "seats": 72,
      "estimatedApplicants": 420,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "binghamton-bsn",
      "schoolName": "Binghamton University",
      "city": "Binghamton",
      "state": "NY",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.65,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Jan 15",
      "seats": 80,
      "estimatedApplicants": 620,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "hunter-bsn",
      "schoolName": "CUNY Hunter College",
      "city": "New York",
      "state": "NY",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.65,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 78,
      "prerequisites": 9,
      "deadline": "Feb 1",
      "seats": 100,
      "estimatedApplicants": 900,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "nyu-bsn",
      "schoolName": "NYU Rory Meyers College of Nursing",
      "city": "New York",
      "state": "NY",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.6,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Feb 15",
      "seats": 260,
      "estimatedApplicants": 1200,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "stony-brook-bsn",
      "schoolName": "Stony Brook University",
      "city": "Stony Brook",
      "state": "NY",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.6,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 75,
      "prerequisites": 8,
      "deadline": "Jan 15",
      "seats": 120,
      "estimatedApplicants": 700,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "case-bsn",
      "schoolName": "Case Western Reserve University",
      "city": "Cleveland",
      "state": "OH",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.55,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Jan 15",
      "seats": 120,
      "estimatedApplicants": 460,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "kent-state-bsn",
      "schoolName": "Kent State University",
      "city": "Kent",
      "state": "OH",
      "degreeType": "BSN",
      "minimumGpa": 2.75,
      "competitiveGpa": 3.3,
      "scienceGpa": 2.75,
      "entranceExam": "TEAS",
      "minimumScore": 70,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 180,
      "estimatedApplicants": 620,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "osu-bsn",
      "schoolName": "Ohio State University",
      "city": "Columbus",
      "state": "OH",
      "degreeType": "BSN",
      "minimumGpa": 3.2,
      "competitiveGpa": 3.7,
      "scienceGpa": 3.2,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Jan 15",
      "seats": 160,
      "estimatedApplicants": 900,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "cincinnati-bsn",
      "schoolName": "University of Cincinnati",
      "city": "Cincinnati",
      "state": "OH",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.5,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 74,
      "prerequisites": 8,
      "deadline": "Jan 15",
      "seats": 160,
      "estimatedApplicants": 720,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "oklahoma-state-bsn",
      "schoolName": "Oklahoma State University",
      "city": "Stillwater",
      "state": "OK",
      "degreeType": "BSN",
      "minimumGpa": 2.75,
      "competitiveGpa": 3.25,
      "scienceGpa": 2.75,
      "entranceExam": "TEAS",
      "minimumScore": 70,
      "prerequisites": 8,
      "deadline": "Feb 15",
      "seats": 80,
      "estimatedApplicants": 320,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "oklahoma-bsn",
      "schoolName": "University of Oklahoma Health Sciences Center",
      "city": "Oklahoma City",
      "state": "OK",
      "degreeType": "BSN",
      "minimumGpa": 2.5,
      "competitiveGpa": 3.3,
      "scienceGpa": 2.5,
      "entranceExam": "TEAS",
      "minimumScore": 70,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 160,
      "estimatedApplicants": 600,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "linfield-bsn",
      "schoolName": "Linfield University",
      "city": "Portland",
      "state": "OR",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.45,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 70,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 120,
      "estimatedApplicants": 420,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "ohsu-bsn",
      "schoolName": "Oregon Health & Science University",
      "city": "Portland",
      "state": "OR",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.65,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 75,
      "prerequisites": 9,
      "deadline": "Jan 5",
      "seats": 160,
      "estimatedApplicants": 970,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "pcc-adn",
      "schoolName": "Portland Community College",
      "city": "Portland",
      "state": "OR",
      "degreeType": "ADN",
      "minimumGpa": 2.5,
      "competitiveGpa": 3.25,
      "scienceGpa": 2.5,
      "entranceExam": "TEAS",
      "minimumScore": 67,
      "prerequisites": 7,
      "deadline": "Feb 15",
      "seats": 96,
      "estimatedApplicants": 430,
      "accreditation": "ACEN",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "ccp-adn",
      "schoolName": "Community College of Philadelphia",
      "city": "Philadelphia",
      "state": "PA",
      "degreeType": "ADN",
      "minimumGpa": 2.75,
      "competitiveGpa": 3.25,
      "scienceGpa": 2.75,
      "entranceExam": "TEAS",
      "minimumScore": 65,
      "prerequisites": 7,
      "deadline": "Feb 1",
      "seats": 128,
      "estimatedApplicants": 520,
      "accreditation": "ACEN",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "drexel-bsn",
      "schoolName": "Drexel University",
      "city": "Philadelphia",
      "state": "PA",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.45,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 180,
      "estimatedApplicants": 620,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "penn-state-bsn",
      "schoolName": "Penn State University",
      "city": "University Park",
      "state": "PA",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.55,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Jan 31",
      "seats": 160,
      "estimatedApplicants": 700,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "upenn-bsn",
      "schoolName": "University of Pennsylvania",
      "city": "Philadelphia",
      "state": "PA",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.85,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Jan 5",
      "seats": 110,
      "estimatedApplicants": 1200,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "pitt-bsn",
      "schoolName": "University of Pittsburgh",
      "city": "Pittsburgh",
      "state": "PA",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.7,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Jan 15",
      "seats": 140,
      "estimatedApplicants": 780,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "villanova-bsn",
      "schoolName": "Villanova University",
      "city": "Villanova",
      "state": "PA",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.6,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Jan 15",
      "seats": 140,
      "estimatedApplicants": 620,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "uri-bsn",
      "schoolName": "University of Rhode Island",
      "city": "Kingston",
      "state": "RI",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.55,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Jan 15",
      "seats": 130,
      "estimatedApplicants": 540,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "clemson-bsn",
      "schoolName": "Clemson University",
      "city": "Clemson",
      "state": "SC",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.65,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 75,
      "prerequisites": 8,
      "deadline": "Jan 15",
      "seats": 160,
      "estimatedApplicants": 760,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "south-carolina-bsn",
      "schoolName": "University of South Carolina",
      "city": "Columbia",
      "state": "SC",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.55,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 75,
      "prerequisites": 8,
      "deadline": "Jan 15",
      "seats": 180,
      "estimatedApplicants": 820,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "south-dakota-state-bsn",
      "schoolName": "South Dakota State University",
      "city": "Brookings",
      "state": "SD",
      "degreeType": "BSN",
      "minimumGpa": 2.7,
      "competitiveGpa": 3.25,
      "scienceGpa": 2.7,
      "entranceExam": "TEAS",
      "minimumScore": 70,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 120,
      "estimatedApplicants": 340,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "belmont-bsn",
      "schoolName": "Belmont University",
      "city": "Nashville",
      "state": "TN",
      "degreeType": "BSN",
      "minimumGpa": 2.75,
      "competitiveGpa": 3.35,
      "scienceGpa": 2.75,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 120,
      "estimatedApplicants": 420,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "memphis-bsn",
      "schoolName": "University of Memphis",
      "city": "Memphis",
      "state": "TN",
      "degreeType": "BSN",
      "minimumGpa": 2.7,
      "competitiveGpa": 3.25,
      "scienceGpa": 2.7,
      "entranceExam": "TEAS",
      "minimumScore": 70,
      "prerequisites": 8,
      "deadline": "Feb 15",
      "seats": 130,
      "estimatedApplicants": 460,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "utk-bsn",
      "schoolName": "University of Tennessee Knoxville",
      "city": "Knoxville",
      "state": "TN",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.55,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 75,
      "prerequisites": 9,
      "deadline": "Jan 15",
      "seats": 160,
      "estimatedApplicants": 760,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "acc-adn",
      "schoolName": "Austin Community College",
      "city": "Austin",
      "state": "TX",
      "degreeType": "ADN",
      "minimumGpa": 2.7,
      "competitiveGpa": 3.2,
      "scienceGpa": 2.7,
      "entranceExam": "TEAS",
      "minimumScore": 65,
      "prerequisites": 7,
      "deadline": "Jan 31",
      "seats": 130,
      "estimatedApplicants": 520,
      "accreditation": "ACEN",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "baylor-bsn",
      "schoolName": "Baylor University",
      "city": "Dallas",
      "state": "TX",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.55,
      "scienceGpa": 3,
      "entranceExam": "HESI",
      "minimumScore": 80,
      "prerequisites": 8,
      "deadline": "Feb 15",
      "seats": 110,
      "estimatedApplicants": 510,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "texas-am-bsn",
      "schoolName": "Texas A&M University College of Nursing",
      "city": "Bryan",
      "state": "TX",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.55,
      "scienceGpa": 3,
      "entranceExam": "HESI",
      "minimumScore": 75,
      "prerequisites": 10,
      "deadline": "Jan 15",
      "seats": 120,
      "estimatedApplicants": 680,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "tcu-bsn",
      "schoolName": "Texas Christian University",
      "city": "Fort Worth",
      "state": "TX",
      "degreeType": "BSN",
      "minimumGpa": 2.5,
      "competitiveGpa": 3.35,
      "scienceGpa": 2.5,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 120,
      "estimatedApplicants": 500,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "texas-state-bsn",
      "schoolName": "Texas State University",
      "city": "Round Rock",
      "state": "TX",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.45,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 75,
      "prerequisites": 8,
      "deadline": "Jan 15",
      "seats": 100,
      "estimatedApplicants": 560,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "texas-tech-bsn",
      "schoolName": "Texas Tech University Health Sciences Center",
      "city": "Lubbock",
      "state": "TX",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.5,
      "scienceGpa": 3,
      "entranceExam": "HESI",
      "minimumScore": 80,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 180,
      "estimatedApplicants": 820,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "twU-bsn",
      "schoolName": "Texas Woman's University",
      "city": "Denton",
      "state": "TX",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.45,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 75,
      "prerequisites": 9,
      "deadline": "Feb 1",
      "seats": 200,
      "estimatedApplicants": 820,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "ut-arlington-bsn",
      "schoolName": "University of Texas at Arlington",
      "city": "Arlington",
      "state": "TX",
      "degreeType": "BSN",
      "minimumGpa": 2.75,
      "competitiveGpa": 3.45,
      "scienceGpa": 2.75,
      "entranceExam": "TEAS",
      "minimumScore": 70,
      "prerequisites": 8,
      "deadline": "Jan 15",
      "seats": 220,
      "estimatedApplicants": 1100,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "ut-austin-bsn",
      "schoolName": "University of Texas at Austin",
      "city": "Austin",
      "state": "TX",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.75,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Mar 1",
      "seats": 120,
      "estimatedApplicants": 980,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "utmb-bsn",
      "schoolName": "University of Texas Medical Branch",
      "city": "Galveston",
      "state": "TX",
      "degreeType": "BSN",
      "minimumGpa": 2.75,
      "competitiveGpa": 3.45,
      "scienceGpa": 2.75,
      "entranceExam": "TEAS",
      "minimumScore": 70,
      "prerequisites": 8,
      "deadline": "Jan 15",
      "seats": 180,
      "estimatedApplicants": 760,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "uthouston-bsn",
      "schoolName": "UTHealth Houston Cizik School of Nursing",
      "city": "Houston",
      "state": "TX",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.6,
      "scienceGpa": 3,
      "entranceExam": "HESI",
      "minimumScore": 80,
      "prerequisites": 9,
      "deadline": "Mar 15",
      "seats": 180,
      "estimatedApplicants": 900,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "byu-bsn",
      "schoolName": "Brigham Young University",
      "city": "Provo",
      "state": "UT",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.65,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Jan 15",
      "seats": 80,
      "estimatedApplicants": 520,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "utah-bsn",
      "schoolName": "University of Utah",
      "city": "Salt Lake City",
      "state": "UT",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.55,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 76,
      "prerequisites": 9,
      "deadline": "Jan 15",
      "seats": 128,
      "estimatedApplicants": 540,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "george-mason-bsn",
      "schoolName": "George Mason University",
      "city": "Fairfax",
      "state": "VA",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.45,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 70,
      "prerequisites": 8,
      "deadline": "Jan 15",
      "seats": 120,
      "estimatedApplicants": 540,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "gw-absn",
      "schoolName": "George Washington University",
      "city": "Ashburn",
      "state": "VA",
      "degreeType": "ABSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.35,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Mar 15",
      "seats": 96,
      "estimatedApplicants": 390,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "jmu-bsn",
      "schoolName": "James Madison University",
      "city": "Harrisonburg",
      "state": "VA",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.55,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 75,
      "prerequisites": 8,
      "deadline": "Jan 15",
      "seats": 120,
      "estimatedApplicants": 620,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "uva-bsn",
      "schoolName": "University of Virginia",
      "city": "Charlottesville",
      "state": "VA",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.75,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Jan 5",
      "seats": 90,
      "estimatedApplicants": 720,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "vcu-bsn",
      "schoolName": "Virginia Commonwealth University",
      "city": "Richmond",
      "state": "VA",
      "degreeType": "BSN",
      "minimumGpa": 2.8,
      "competitiveGpa": 3.45,
      "scienceGpa": 2.8,
      "entranceExam": "TEAS",
      "minimumScore": 75,
      "prerequisites": 9,
      "deadline": "Feb 1",
      "seats": 120,
      "estimatedApplicants": 590,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "uvm-bsn",
      "schoolName": "University of Vermont",
      "city": "Burlington",
      "state": "VT",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.55,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Jan 15",
      "seats": 90,
      "estimatedApplicants": 360,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "gonzaga-bsn",
      "schoolName": "Gonzaga University",
      "city": "Spokane",
      "state": "WA",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.5,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 96,
      "estimatedApplicants": 420,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "seattle-central-adn",
      "schoolName": "Seattle Central College",
      "city": "Seattle",
      "state": "WA",
      "degreeType": "ADN",
      "minimumGpa": 2.75,
      "competitiveGpa": 3.3,
      "scienceGpa": 2.75,
      "entranceExam": "TEAS",
      "minimumScore": 70,
      "prerequisites": 7,
      "deadline": "Apr 15",
      "seats": 80,
      "estimatedApplicants": 350,
      "accreditation": "ACEN",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "seattle-u-bsn",
      "schoolName": "Seattle University",
      "city": "Seattle",
      "state": "WA",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.55,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Jan 15",
      "seats": 100,
      "estimatedApplicants": 460,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "uw-bsn",
      "schoolName": "University of Washington",
      "city": "Seattle",
      "state": "WA",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.8,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 78,
      "prerequisites": 9,
      "deadline": "Jan 15",
      "seats": 96,
      "estimatedApplicants": 900,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "wsu-bsn",
      "schoolName": "Washington State University",
      "city": "Spokane",
      "state": "WA",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.45,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 74,
      "prerequisites": 8,
      "deadline": "Jan 31",
      "seats": 160,
      "estimatedApplicants": 620,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "marquette-bsn",
      "schoolName": "Marquette University",
      "city": "Milwaukee",
      "state": "WI",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.5,
      "scienceGpa": 3,
      "entranceExam": "Optional",
      "minimumScore": 0,
      "prerequisites": 8,
      "deadline": "Jan 15",
      "seats": 130,
      "estimatedApplicants": 500,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "matc-adn",
      "schoolName": "Milwaukee Area Technical College",
      "city": "Milwaukee",
      "state": "WI",
      "degreeType": "ADN",
      "minimumGpa": 2.5,
      "competitiveGpa": 3.15,
      "scienceGpa": 2.5,
      "entranceExam": "HESI",
      "minimumScore": 75,
      "prerequisites": 7,
      "deadline": "Feb 1",
      "seats": 120,
      "estimatedApplicants": 420,
      "accreditation": "ACEN",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "uw-madison-bsn",
      "schoolName": "University of Wisconsin Madison",
      "city": "Madison",
      "state": "WI",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.65,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 76,
      "prerequisites": 9,
      "deadline": "Jan 15",
      "seats": 120,
      "estimatedApplicants": 700,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "west-virginia-bsn",
      "schoolName": "West Virginia University",
      "city": "Morgantown",
      "state": "WV",
      "degreeType": "BSN",
      "minimumGpa": 3,
      "competitiveGpa": 3.45,
      "scienceGpa": 3,
      "entranceExam": "TEAS",
      "minimumScore": 70,
      "prerequisites": 8,
      "deadline": "Jan 15",
      "seats": 120,
      "estimatedApplicants": 430,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    },
    {
      "slug": "wyoming-bsn",
      "schoolName": "University of Wyoming",
      "city": "Laramie",
      "state": "WY",
      "degreeType": "BSN",
      "minimumGpa": 2.75,
      "competitiveGpa": 3.35,
      "scienceGpa": 2.75,
      "entranceExam": "TEAS",
      "minimumScore": 70,
      "prerequisites": 8,
      "deadline": "Feb 1",
      "seats": 80,
      "estimatedApplicants": 260,
      "accreditation": "CCNE",
      "sourceUrl": "",
      "lastVerified": "",
      "disclaimer": "Admissions requirements, deadlines, and estimated odds are for planning only. Confirm current requirements, application windows, and admissions decisions directly with the nursing program before applying."
    }
  ];
// END MANUAL_MAJOR_PROGRAMS

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

function mergeProgramCatalog(basePrograms, overridePrograms) {
  const merged = new Map();
  [...basePrograms, ...overridePrograms].forEach((program, index) => {
    const slug = slugify(program.slug || program.id || `${program.schoolName || program.name || "program"}-${index}`);
    merged.set(slug, { ...program, slug });
  });
  return [...merged.values()];
}

function programPageUrl(program) {
  return SCHOOL_PAGE_SLUGS.has(program.slug) ? `schools/${program.slug}.html` : "";
}

async function loadProgramData() {
  let data = [];
  try {
    const response = await fetch(PROGRAM_DATA_URL);
    if (!response.ok) throw new Error(`Unable to load ${PROGRAM_DATA_URL}`);
    data = await response.json();
  } catch (error) {
    console.warn(error);
  }
  const merged = mergeProgramCatalog(MANUAL_MAJOR_PROGRAMS, Array.isArray(data) ? data : []);
  starterPrograms = merged.map((program, index) => normalizeProgram(program, index));
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
  const pageUrl = programPageUrl(program);
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
      ${pageUrl ? `<a href="${pageUrl}">View the ${program.name} planning page</a>` : "Static planning page coming in a future state expansion."}
      ${program.sourceUrl ? ` · <a href="${program.sourceUrl}" target="_blank" rel="noopener noreferrer">Official program source</a>` : ""}
      ${program.requirementsNote ? `<br /><small>${program.requirementsNote}</small>` : ""}
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
