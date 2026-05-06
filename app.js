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

const starterPrograms = [
  p("uab-bsn", "University of Alabama at Birmingham", "Birmingham", "AL", "BSN", 2.75, 3.35, 2.75, "TEAS", 75, 9, "Jan 15", 150, 620, "CCNE"),
  p("ua-bsn", "University of Arizona", "Tucson", "AZ", "BSN", 3.00, 3.55, 3.00, "TEAS", 78, 10, "Feb 1", 168, 780, "CCNE"),
  p("asu-bsn", "Arizona State University", "Phoenix", "AZ", "BSN", 3.00, 3.65, 3.00, "TEAS", 80, 10, "Feb 15", 176, 940, "CCNE"),
  p("nau-bsn", "Northern Arizona University", "Flagstaff", "AZ", "BSN", 3.00, 3.45, 3.00, "TEAS", 76, 9, "Jan 15", 150, 560, "CCNE"),
  p("gcu-bsn", "Grand Canyon University", "Phoenix", "AZ", "BSN", 3.00, 3.35, 3.00, "HESI", 80, 8, "Feb 1", 220, 760, "CCNE"),
  p("uark-bsn", "University of Arkansas Eleanor Mann School of Nursing", "Fayetteville", "AR", "BSN", 3.00, 3.55, 3.00, "TEAS", 0, 10, "Feb 15", 120, 680, "CCNE"),
  p("uams-bsn", "University of Arkansas for Medical Sciences", "Little Rock", "AR", "BSN", 2.50, 3.30, 2.50, "Optional", 0, 10, "Mar 1", 160, 620, "CCNE"),
  p("astate-bsn", "Arkansas State University", "Jonesboro", "AR", "BSN", 2.75, 3.30, 2.75, "Optional", 0, 9, "Feb 1", 140, 520, "ACEN"),
  p("atu-bsn", "Arkansas Tech University", "Russellville", "AR", "BSN", 2.75, 3.25, 2.75, "TEAS", 0, 8, "Feb 15", 96, 360, "ACEN"),
  p("uca-bsn", "University of Central Arkansas", "Conway", "AR", "BSN", 2.75, 3.35, 2.75, "Optional", 0, 10, "Mar 15", 110, 460, "CCNE"),
  p("ualr-adn", "University of Arkansas at Little Rock", "Little Rock", "AR", "ADN", 2.60, 3.15, 2.60, "Optional", 0, 7, "Jan 31", 160, 540, "ACEN"),
  p("harding-bsn", "Harding University Carr College of Nursing", "Searcy", "AR", "BSN", 2.78, 3.35, 2.78, "Optional", 0, 9, "Mar 1", 96, 330, "CCNE"),
  p("henderson-bsn", "Henderson State University", "Arkadelphia", "AR", "BSN", 2.70, 3.25, 2.70, "TEAS", 60, 8, "Feb 28", 80, 300, "CCNE"),
  p("sau-bsn", "Southern Arkansas University", "Magnolia", "AR", "BSN", 2.85, 3.35, 2.85, "HESI", 75, 8, "Mar 1", 80, 320, "ACEN"),
  p("ucla-bsn", "UCLA School of Nursing", "Los Angeles", "CA", "BSN", 3.00, 3.85, 3.20, "Optional", 0, 9, "Nov 30", 50, 1150, "CCNE"),
  p("csulb-bsn", "California State University Long Beach", "Long Beach", "CA", "BSN", 3.00, 3.75, 3.00, "TEAS", 80, 9, "Feb 10", 80, 1000, "CCNE"),
  p("sdsu-bsn", "San Diego State University", "San Diego", "CA", "BSN", 3.00, 3.80, 3.00, "TEAS", 80, 9, "Dec 15", 120, 1200, "CCNE"),
  p("uci-bsn", "University of California Irvine", "Irvine", "CA", "BSN", 3.00, 3.85, 3.00, "Optional", 0, 8, "Nov 30", 50, 950, "CCNE"),
  p("usfca-bsn", "University of San Francisco", "San Francisco", "CA", "BSN", 3.00, 3.55, 3.00, "Optional", 0, 8, "Jan 15", 120, 540, "CCNE"),
  p("sac-state-bsn", "Sacramento State", "Sacramento", "CA", "BSN", 3.00, 3.65, 3.00, "TEAS", 78, 9, "Jan 31", 80, 760, "CCNE"),
  p("samuel-merritt-absn", "Samuel Merritt University", "Oakland", "CA", "ABSN", 3.00, 3.45, 3.00, "TEAS", 78, 8, "Apr 1", 96, 540, "CCNE"),
  p("cu-bsn", "University of Colorado College of Nursing", "Aurora", "CO", "BSN", 3.00, 3.55, 3.00, "TEAS", 75, 9, "Jan 15", 96, 520, "CCNE"),
  p("front-range-adn", "Front Range Community College", "Westminster", "CO", "ADN", 2.50, 3.20, 2.50, "HESI", 80, 7, "Mar 1", 120, 470, "ACEN"),
  p("regis-bsn", "Regis University", "Denver", "CO", "BSN", 2.75, 3.35, 2.75, "TEAS", 70, 8, "Feb 1", 96, 340, "CCNE"),
  p("colorado-mesa-bsn", "Colorado Mesa University", "Grand Junction", "CO", "BSN", 2.75, 3.30, 2.75, "TEAS", 70, 8, "Jan 31", 90, 320, "CCNE"),
  p("uconn-bsn", "University of Connecticut", "Storrs", "CT", "BSN", 3.00, 3.60, 3.00, "Optional", 0, 9, "Feb 1", 110, 550, "CCNE"),
  p("quinnipiac-bsn", "Quinnipiac University", "Hamden", "CT", "BSN", 3.00, 3.45, 3.00, "Optional", 0, 8, "Feb 1", 110, 360, "CCNE"),
  p("fairfield-bsn", "Fairfield University", "Fairfield", "CT", "BSN", 3.00, 3.50, 3.00, "Optional", 0, 8, "Jan 15", 80, 320, "CCNE"),
  p("georgetown-bsn", "Georgetown University", "Washington", "DC", "BSN", 3.00, 3.70, 3.00, "Optional", 0, 8, "Jan 10", 72, 520, "CCNE"),
  p("howard-bsn", "Howard University", "Washington", "DC", "BSN", 2.75, 3.30, 2.75, "TEAS", 70, 8, "Feb 15", 90, 360, "ACEN"),
  p("gw-absn", "George Washington University", "Ashburn", "VA", "ABSN", 3.00, 3.35, 3.00, "Optional", 0, 8, "Mar 15", 96, 390, "CCNE"),
  p("uf-bsn", "University of Florida", "Gainesville", "FL", "BSN", 3.00, 3.75, 3.00, "TEAS", 78, 9, "Mar 1", 140, 980, "CCNE"),
  p("fsu-bsn", "Florida State University", "Tallahassee", "FL", "BSN", 3.00, 3.60, 3.00, "TEAS", 75, 8, "Jan 15", 120, 650, "CCNE"),
  p("ucf-bsn", "University of Central Florida", "Orlando", "FL", "BSN", 3.00, 3.65, 3.00, "TEAS", 78, 9, "Feb 1", 180, 1000, "CCNE"),
  p("usf-bsn", "University of South Florida", "Tampa", "FL", "BSN", 3.20, 3.70, 3.20, "TEAS", 78, 9, "Jan 15", 160, 930, "CCNE"),
  p("fiu-bsn", "Florida International University", "Miami", "FL", "BSN", 3.00, 3.55, 3.00, "TEAS", 70, 8, "Feb 15", 160, 680, "CCNE"),
  p("fau-bsn", "Florida Atlantic University", "Boca Raton", "FL", "BSN", 3.00, 3.50, 3.00, "TEAS", 73, 8, "Jan 15", 120, 540, "CCNE"),
  p("miami-dade-adn", "Miami Dade College", "Miami", "FL", "ADN", 2.50, 3.15, 2.50, "TEAS", 65, 7, "May 1", 180, 600, "ACEN"),
  p("emory-bsn", "Emory University", "Atlanta", "GA", "BSN", 3.00, 3.65, 3.00, "Optional", 0, 8, "Jan 15", 130, 620, "CCNE"),
  p("gsu-bsn", "Georgia State University", "Atlanta", "GA", "BSN", 3.00, 3.45, 3.00, "TEAS", 75, 8, "Feb 1", 110, 570, "CCNE"),
  p("kennesaw-bsn", "Kennesaw State University", "Kennesaw", "GA", "BSN", 3.00, 3.45, 3.00, "TEAS", 78, 8, "Jan 31", 120, 620, "CCNE"),
  p("augusta-bsn", "Augusta University", "Augusta", "GA", "BSN", 2.80, 3.35, 2.80, "TEAS", 70, 8, "Feb 1", 120, 480, "CCNE"),
  p("georgia-southern-bsn", "Georgia Southern University", "Statesboro", "GA", "BSN", 3.00, 3.40, 3.00, "HESI", 75, 8, "Jan 15", 130, 500, "CCNE"),
  p("hawaii-manoa-bsn", "University of Hawaii at Manoa", "Honolulu", "HI", "BSN", 3.00, 3.55, 3.00, "TEAS", 78, 9, "Jan 5", 80, 390, "CCNE"),
  p("boise-state-bsn", "Boise State University", "Boise", "ID", "BSN", 3.00, 3.50, 3.00, "TEAS", 75, 8, "Feb 1", 96, 460, "CCNE"),
  p("uiowa-bsn", "University of Iowa", "Iowa City", "IA", "BSN", 3.00, 3.55, 3.00, "TEAS", 76, 9, "Feb 1", 112, 430, "CCNE"),
  p("iowa-state-bsn", "Iowa State University", "Ames", "IA", "BSN", 3.00, 3.45, 3.00, "Optional", 0, 8, "Feb 1", 80, 320, "CCNE"),
  p("uic-bsn", "University of Illinois Chicago", "Chicago", "IL", "BSN", 2.75, 3.50, 2.75, "TEAS", 75, 9, "Jan 15", 96, 610, "CCNE"),
  p("loyola-absn", "Loyola University Chicago", "Maywood", "IL", "ABSN", 3.00, 3.35, 3.00, "Optional", 0, 8, "Feb 15", 88, 360, "CCNE"),
  p("illinois-state-bsn", "Illinois State University", "Normal", "IL", "BSN", 2.80, 3.40, 2.80, "TEAS", 70, 8, "Feb 1", 140, 560, "CCNE"),
  p("depaul-menp", "DePaul University", "Chicago", "IL", "ABSN", 3.00, 3.35, 3.00, "Optional", 0, 8, "Mar 1", 96, 380, "CCNE"),
  p("iu-bsn", "Indiana University Bloomington", "Bloomington", "IN", "BSN", 2.70, 3.35, 2.70, "TEAS", 72, 8, "Jan 31", 120, 520, "CCNE"),
  p("purdue-bsn", "Purdue University", "West Lafayette", "IN", "BSN", 3.00, 3.55, 3.00, "TEAS", 76, 9, "Feb 1", 112, 500, "CCNE"),
  p("ball-state-bsn", "Ball State University", "Muncie", "IN", "BSN", 2.75, 3.30, 2.75, "TEAS", 70, 8, "Feb 1", 120, 440, "CCNE"),
  p("ku-bsn", "University of Kansas", "Kansas City", "KS", "BSN", 2.50, 3.30, 2.50, "TEAS", 70, 8, "Jan 10", 140, 500, "CCNE"),
  p("wichita-state-bsn", "Wichita State University", "Wichita", "KS", "BSN", 2.75, 3.30, 2.75, "TEAS", 70, 8, "Feb 1", 112, 420, "CCNE"),
  p("uk-bsn", "University of Kentucky", "Lexington", "KY", "BSN", 2.75, 3.45, 2.75, "TEAS", 74, 9, "Mar 1", 150, 620, "CCNE"),
  p("louisville-bsn", "University of Louisville", "Louisville", "KY", "BSN", 2.80, 3.40, 2.80, "TEAS", 75, 9, "Feb 1", 140, 560, "CCNE"),
  p("lsuhno-bsn", "LSU Health New Orleans", "New Orleans", "LA", "BSN", 3.00, 3.45, 3.00, "HESI", 80, 9, "Jan 15", 120, 520, "CCNE"),
  p("ul-lafayette-bsn", "University of Louisiana at Lafayette", "Lafayette", "LA", "BSN", 2.80, 3.35, 2.80, "HESI", 75, 8, "Feb 1", 120, 440, "CCNE"),
  p("southeastern-la-bsn", "Southeastern Louisiana University", "Hammond", "LA", "BSN", 2.70, 3.25, 2.70, "HESI", 75, 8, "Jan 31", 120, 430, "CCNE"),
  p("bc-bsn", "Boston College", "Chestnut Hill", "MA", "BSN", 3.00, 3.70, 3.00, "Optional", 0, 8, "Jan 1", 100, 680, "CCNE"),
  p("mgh-absn", "MGH Institute of Health Professions", "Boston", "MA", "ABSN", 3.00, 3.35, 3.00, "Optional", 0, 8, "Feb 1", 96, 420, "CCNE"),
  p("umass-amherst-bsn", "University of Massachusetts Amherst", "Amherst", "MA", "BSN", 3.00, 3.65, 3.00, "Optional", 0, 8, "Jan 15", 120, 680, "CCNE"),
  p("northeastern-bsn", "Northeastern University", "Boston", "MA", "BSN", 3.00, 3.70, 3.00, "Optional", 0, 8, "Jan 1", 120, 720, "CCNE"),
  p("umb-bsn", "University of Maryland Baltimore", "Baltimore", "MD", "BSN", 3.00, 3.55, 3.00, "TEAS", 76, 9, "Feb 1", 160, 760, "CCNE"),
  p("towson-bsn", "Towson University", "Towson", "MD", "BSN", 3.00, 3.45, 3.00, "TEAS", 70, 8, "Jan 15", 120, 520, "CCNE"),
  p("johns-hopkins-msn", "Johns Hopkins University", "Baltimore", "MD", "ABSN", 3.00, 3.55, 3.00, "Optional", 0, 8, "Jan 1", 140, 780, "CCNE"),
  p("maine-bsn", "University of Maine", "Orono", "ME", "BSN", 2.75, 3.35, 2.75, "TEAS", 70, 8, "Feb 1", 90, 300, "CCNE"),
  p("umich-bsn", "University of Michigan", "Ann Arbor", "MI", "BSN", 3.00, 3.80, 3.00, "Optional", 0, 8, "Feb 1", 120, 980, "CCNE"),
  p("msu-bsn", "Michigan State University", "East Lansing", "MI", "BSN", 2.75, 3.45, 2.75, "TEAS", 75, 8, "Jan 15", 120, 540, "CCNE"),
  p("wayne-state-bsn", "Wayne State University", "Detroit", "MI", "BSN", 3.00, 3.50, 3.00, "TEAS", 75, 8, "Feb 1", 96, 460, "CCNE"),
  p("gvsu-bsn", "Grand Valley State University", "Grand Rapids", "MI", "BSN", 3.00, 3.45, 3.00, "TEAS", 75, 8, "Jan 15", 120, 520, "CCNE"),
  p("umn-bsn", "University of Minnesota", "Minneapolis", "MN", "BSN", 3.00, 3.65, 3.00, "TEAS", 76, 9, "Jan 15", 128, 690, "CCNE"),
  p("st-catherine-bsn", "St. Catherine University", "St. Paul", "MN", "BSN", 2.75, 3.30, 2.75, "TEAS", 70, 8, "Feb 1", 100, 360, "ACEN"),
  p("slu-bsn", "Saint Louis University", "St. Louis", "MO", "BSN", 2.75, 3.35, 2.75, "Optional", 0, 8, "Feb 1", 120, 390, "CCNE"),
  p("mizzou-bsn", "University of Missouri", "Columbia", "MO", "BSN", 3.00, 3.45, 3.00, "TEAS", 75, 8, "Jan 31", 120, 540, "CCNE"),
  p("umkc-bsn", "University of Missouri Kansas City", "Kansas City", "MO", "BSN", 2.75, 3.30, 2.75, "TEAS", 70, 8, "Feb 1", 100, 380, "CCNE"),
  p("ummc-bsn", "University of Mississippi Medical Center", "Jackson", "MS", "BSN", 2.75, 3.35, 2.75, "TEAS", 72, 8, "Jan 31", 150, 520, "CCNE"),
  p("southern-miss-bsn", "University of Southern Mississippi", "Hattiesburg", "MS", "BSN", 2.80, 3.35, 2.80, "TEAS", 70, 8, "Feb 1", 120, 420, "CCNE"),
  p("montana-state-bsn", "Montana State University", "Bozeman", "MT", "BSN", 2.75, 3.35, 2.75, "TEAS", 70, 8, "Feb 1", 100, 360, "CCNE"),
  p("unc-bsn", "UNC Chapel Hill", "Chapel Hill", "NC", "BSN", 3.00, 3.75, 3.00, "TEAS", 78, 9, "Dec 22", 104, 840, "CCNE"),
  p("duke-absn", "Duke University", "Durham", "NC", "ABSN", 3.00, 3.55, 3.00, "Optional", 0, 8, "Jan 5", 90, 620, "CCNE"),
  p("ecu-bsn", "East Carolina University", "Greenville", "NC", "BSN", 2.75, 3.35, 2.75, "TEAS", 70, 8, "Feb 1", 130, 520, "CCNE"),
  p("unc-charlotte-bsn", "UNC Charlotte", "Charlotte", "NC", "BSN", 3.00, 3.45, 3.00, "TEAS", 70, 8, "Jan 15", 120, 560, "CCNE"),
  p("ndsu-bsn", "North Dakota State University", "Fargo", "ND", "BSN", 2.75, 3.30, 2.75, "TEAS", 70, 8, "Feb 1", 80, 260, "CCNE"),
  p("creighton-bsn", "Creighton University", "Omaha", "NE", "BSN", 3.00, 3.40, 3.00, "Optional", 0, 8, "Feb 1", 120, 360, "CCNE"),
  p("unh-bsn", "University of New Hampshire", "Durham", "NH", "BSN", 3.00, 3.45, 3.00, "Optional", 0, 8, "Feb 1", 80, 340, "CCNE"),
  p("rutgers-bsn", "Rutgers University", "Newark", "NJ", "BSN", 3.00, 3.60, 3.00, "TEAS", 75, 9, "Feb 1", 180, 900, "CCNE"),
  p("seton-hall-bsn", "Seton Hall University", "Nutley", "NJ", "BSN", 3.00, 3.45, 3.00, "TEAS", 70, 8, "Jan 15", 100, 420, "CCNE"),
  p("unm-bsn", "University of New Mexico", "Albuquerque", "NM", "BSN", 2.75, 3.35, 2.75, "HESI", 75, 8, "Feb 1", 120, 460, "CCNE"),
  p("unlv-bsn", "University of Nevada Las Vegas", "Las Vegas", "NV", "BSN", 3.00, 3.55, 3.00, "HESI", 75, 9, "Feb 1", 72, 420, "CCNE"),
  p("nyu-bsn", "NYU Rory Meyers College of Nursing", "New York", "NY", "BSN", 3.00, 3.60, 3.00, "Optional", 0, 8, "Feb 15", 260, 1200, "CCNE"),
  p("hunter-bsn", "CUNY Hunter College", "New York", "NY", "BSN", 3.00, 3.65, 3.00, "TEAS", 78, 9, "Feb 1", 100, 900, "CCNE"),
  p("stony-brook-bsn", "Stony Brook University", "Stony Brook", "NY", "BSN", 3.00, 3.60, 3.00, "TEAS", 75, 8, "Jan 15", 120, 700, "CCNE"),
  p("binghamton-bsn", "Binghamton University", "Binghamton", "NY", "BSN", 3.00, 3.65, 3.00, "Optional", 0, 8, "Jan 15", 80, 620, "CCNE"),
  p("osu-bsn", "Ohio State University", "Columbus", "OH", "BSN", 3.20, 3.70, 3.20, "Optional", 0, 8, "Jan 15", 160, 900, "CCNE"),
  p("case-bsn", "Case Western Reserve University", "Cleveland", "OH", "BSN", 3.00, 3.55, 3.00, "Optional", 0, 8, "Jan 15", 120, 460, "CCNE"),
  p("cincinnati-bsn", "University of Cincinnati", "Cincinnati", "OH", "BSN", 3.00, 3.50, 3.00, "TEAS", 74, 8, "Jan 15", 160, 720, "CCNE"),
  p("kent-state-bsn", "Kent State University", "Kent", "OH", "BSN", 2.75, 3.30, 2.75, "TEAS", 70, 8, "Feb 1", 180, 620, "CCNE"),
  p("oklahoma-bsn", "University of Oklahoma Health Sciences Center", "Oklahoma City", "OK", "BSN", 2.50, 3.30, 2.50, "TEAS", 70, 8, "Feb 1", 160, 600, "CCNE"),
  p("oklahoma-state-bsn", "Oklahoma State University", "Stillwater", "OK", "BSN", 2.75, 3.25, 2.75, "TEAS", 70, 8, "Feb 15", 80, 320, "CCNE"),
  p("ohsu-bsn", "Oregon Health & Science University", "Portland", "OR", "BSN", 3.00, 3.65, 3.00, "TEAS", 75, 9, "Jan 5", 160, 970, "CCNE"),
  p("pcc-adn", "Portland Community College", "Portland", "OR", "ADN", 2.50, 3.25, 2.50, "TEAS", 67, 7, "Feb 15", 96, 430, "ACEN"),
  p("linfield-bsn", "Linfield University", "Portland", "OR", "BSN", 3.00, 3.45, 3.00, "TEAS", 70, 8, "Feb 1", 120, 420, "CCNE"),
  p("upenn-bsn", "University of Pennsylvania", "Philadelphia", "PA", "BSN", 3.00, 3.85, 3.00, "Optional", 0, 8, "Jan 5", 110, 1200, "CCNE"),
  p("villanova-bsn", "Villanova University", "Villanova", "PA", "BSN", 3.00, 3.60, 3.00, "Optional", 0, 8, "Jan 15", 140, 620, "CCNE"),
  p("ccp-adn", "Community College of Philadelphia", "Philadelphia", "PA", "ADN", 2.75, 3.25, 2.75, "TEAS", 65, 7, "Feb 1", 128, 520, "ACEN"),
  p("pitt-bsn", "University of Pittsburgh", "Pittsburgh", "PA", "BSN", 3.00, 3.70, 3.00, "Optional", 0, 8, "Jan 15", 140, 780, "CCNE"),
  p("penn-state-bsn", "Penn State University", "University Park", "PA", "BSN", 3.00, 3.55, 3.00, "Optional", 0, 8, "Jan 31", 160, 700, "CCNE"),
  p("drexel-bsn", "Drexel University", "Philadelphia", "PA", "BSN", 3.00, 3.45, 3.00, "Optional", 0, 8, "Feb 1", 180, 620, "CCNE"),
  p("uri-bsn", "University of Rhode Island", "Kingston", "RI", "BSN", 3.00, 3.55, 3.00, "Optional", 0, 8, "Jan 15", 130, 540, "CCNE"),
  p("clemson-bsn", "Clemson University", "Clemson", "SC", "BSN", 3.00, 3.65, 3.00, "TEAS", 75, 8, "Jan 15", 160, 760, "CCNE"),
  p("south-carolina-bsn", "University of South Carolina", "Columbia", "SC", "BSN", 3.00, 3.55, 3.00, "TEAS", 75, 8, "Jan 15", 180, 820, "CCNE"),
  p("south-dakota-state-bsn", "South Dakota State University", "Brookings", "SD", "BSN", 2.70, 3.25, 2.70, "TEAS", 70, 8, "Feb 1", 120, 340, "CCNE"),
  p("utk-bsn", "University of Tennessee Knoxville", "Knoxville", "TN", "BSN", 3.00, 3.55, 3.00, "TEAS", 75, 9, "Jan 15", 160, 760, "CCNE"),
  p("belmont-bsn", "Belmont University", "Nashville", "TN", "BSN", 2.75, 3.35, 2.75, "Optional", 0, 8, "Feb 1", 120, 420, "CCNE"),
  p("memphis-bsn", "University of Memphis", "Memphis", "TN", "BSN", 2.70, 3.25, 2.70, "TEAS", 70, 8, "Feb 15", 130, 460, "CCNE"),
  p("texas-am-bsn", "Texas A&M University College of Nursing", "Bryan", "TX", "BSN", 3.00, 3.55, 3.00, "HESI", 75, 10, "Jan 15", 120, 680, "CCNE"),
  p("ut-austin-bsn", "University of Texas at Austin", "Austin", "TX", "BSN", 3.00, 3.75, 3.00, "Optional", 0, 8, "Mar 1", 120, 980, "CCNE"),
  p("ut-arlington-bsn", "University of Texas at Arlington", "Arlington", "TX", "BSN", 2.75, 3.45, 2.75, "TEAS", 70, 8, "Jan 15", 220, 1100, "CCNE"),
  p("texas-tech-bsn", "Texas Tech University Health Sciences Center", "Lubbock", "TX", "BSN", 3.00, 3.50, 3.00, "HESI", 80, 8, "Feb 1", 180, 820, "CCNE"),
  p("utmb-bsn", "University of Texas Medical Branch", "Galveston", "TX", "BSN", 2.75, 3.45, 2.75, "TEAS", 70, 8, "Jan 15", 180, 760, "CCNE"),
  p("texas-state-bsn", "Texas State University", "Round Rock", "TX", "BSN", 3.00, 3.45, 3.00, "TEAS", 75, 8, "Jan 15", 100, 560, "CCNE"),
  p("tcu-bsn", "Texas Christian University", "Fort Worth", "TX", "BSN", 2.50, 3.35, 2.50, "Optional", 0, 8, "Feb 1", 120, 500, "CCNE"),
  p("uthouston-bsn", "UTHealth Houston Cizik School of Nursing", "Houston", "TX", "BSN", 3.00, 3.60, 3.00, "HESI", 80, 9, "Mar 15", 180, 900, "CCNE"),
  p("twU-bsn", "Texas Woman's University", "Denton", "TX", "BSN", 3.00, 3.45, 3.00, "TEAS", 75, 9, "Feb 1", 200, 820, "CCNE"),
  p("acc-adn", "Austin Community College", "Austin", "TX", "ADN", 2.70, 3.20, 2.70, "TEAS", 65, 7, "Jan 31", 130, 520, "ACEN"),
  p("baylor-bsn", "Baylor University", "Dallas", "TX", "BSN", 3.00, 3.55, 3.00, "HESI", 80, 8, "Feb 15", 110, 510, "CCNE"),
  p("utah-bsn", "University of Utah", "Salt Lake City", "UT", "BSN", 3.00, 3.55, 3.00, "TEAS", 76, 9, "Jan 15", 128, 540, "CCNE"),
  p("byu-bsn", "Brigham Young University", "Provo", "UT", "BSN", 3.00, 3.65, 3.00, "Optional", 0, 8, "Jan 15", 80, 520, "CCNE"),
  p("uva-bsn", "University of Virginia", "Charlottesville", "VA", "BSN", 3.00, 3.75, 3.00, "Optional", 0, 8, "Jan 5", 90, 720, "CCNE"),
  p("vcu-bsn", "Virginia Commonwealth University", "Richmond", "VA", "BSN", 2.80, 3.45, 2.80, "TEAS", 75, 9, "Feb 1", 120, 590, "CCNE"),
  p("jmu-bsn", "James Madison University", "Harrisonburg", "VA", "BSN", 3.00, 3.55, 3.00, "TEAS", 75, 8, "Jan 15", 120, 620, "CCNE"),
  p("george-mason-bsn", "George Mason University", "Fairfax", "VA", "BSN", 3.00, 3.45, 3.00, "TEAS", 70, 8, "Jan 15", 120, 540, "CCNE"),
  p("uvm-bsn", "University of Vermont", "Burlington", "VT", "BSN", 3.00, 3.55, 3.00, "Optional", 0, 8, "Jan 15", 90, 360, "CCNE"),
  p("uw-bsn", "University of Washington", "Seattle", "WA", "BSN", 3.00, 3.80, 3.00, "TEAS", 78, 9, "Jan 15", 96, 900, "CCNE"),
  p("wsu-bsn", "Washington State University", "Spokane", "WA", "BSN", 3.00, 3.45, 3.00, "TEAS", 74, 8, "Jan 31", 160, 620, "CCNE"),
  p("seattle-central-adn", "Seattle Central College", "Seattle", "WA", "ADN", 2.75, 3.30, 2.75, "TEAS", 70, 7, "Apr 15", 80, 350, "ACEN"),
  p("seattle-u-bsn", "Seattle University", "Seattle", "WA", "BSN", 3.00, 3.55, 3.00, "Optional", 0, 8, "Jan 15", 100, 460, "CCNE"),
  p("gonzaga-bsn", "Gonzaga University", "Spokane", "WA", "BSN", 3.00, 3.50, 3.00, "Optional", 0, 8, "Feb 1", 96, 420, "CCNE"),
  p("uw-madison-bsn", "University of Wisconsin Madison", "Madison", "WI", "BSN", 3.00, 3.65, 3.00, "TEAS", 76, 9, "Jan 15", 120, 700, "CCNE"),
  p("matc-adn", "Milwaukee Area Technical College", "Milwaukee", "WI", "ADN", 2.50, 3.15, 2.50, "HESI", 75, 7, "Feb 1", 120, 420, "ACEN"),
  p("marquette-bsn", "Marquette University", "Milwaukee", "WI", "BSN", 3.00, 3.50, 3.00, "Optional", 0, 8, "Jan 15", 130, 500, "CCNE"),
  p("west-virginia-bsn", "West Virginia University", "Morgantown", "WV", "BSN", 3.00, 3.45, 3.00, "TEAS", 70, 8, "Jan 15", 120, 430, "CCNE"),
  p("wyoming-bsn", "University of Wyoming", "Laramie", "WY", "BSN", 2.75, 3.35, 2.75, "TEAS", 70, 8, "Feb 1", 80, 260, "CCNE"),
  p("uaa-bsn", "University of Alaska Anchorage", "Anchorage", "AK", "BSN", 2.75, 3.30, 2.75, "TEAS", 70, 8, "Feb 1", 80, 260, "ACEN"),
  p("auburn-bsn", "Auburn University", "Auburn", "AL", "BSN", 3.00, 3.55, 3.00, "TEAS", 75, 8, "Jan 15", 160, 720, "CCNE"),
  p("south-alabama-bsn", "University of South Alabama", "Mobile", "AL", "BSN", 2.75, 3.35, 2.75, "TEAS", 70, 8, "Feb 15", 160, 520, "CCNE"),
];

let programs = starterPrograms.map((program) => ({ ...program }));
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

function p(id, name, city, state, degree, minGpa, competitiveGpa, minScience, test, minTest, prereqs, deadline, seats, applicants, accreditation) {
  return {
    id,
    name,
    city,
    state,
    degree,
    minGpa,
    competitiveGpa,
    minScience,
    test,
    minTest,
    prereqs,
    deadline,
    seats,
    applicants,
    accreditation,
  };
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
  if (program.minTest > 0) return `${program.test} ${program.minTest}+`;
  return `${program.test} required`;
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
  const columns = ["id", "name", "city", "state", "degree", "minGpa", "competitiveGpa", "minScience", "test", "minTest", "prereqs", "deadline", "seats", "applicants", "accreditation"];
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
    const minGpa = Number(object.minGpa) || 2.75;
    const competitiveGpa = Number(object.competitiveGpa) || minGpa + 0.45;
    const minScience = Number(object.minScience) || minGpa;
    return {
      id: object.id || `${object.name || "program"}-${index}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: object.name || "Imported nursing program",
      city: object.city || "",
      state: (object.state || "CA").toUpperCase(),
      degree: object.degree || "BSN",
      minGpa,
      competitiveGpa,
      minScience,
      test: object.test || "Optional",
      minTest: Number(object.minTest) || 0,
      prereqs: Number(object.prereqs) || 8,
      deadline: object.deadline || "Feb 1",
      seats: Number(object.seats) || 80,
      applicants: Number(object.applicants) || 400,
      accreditation: object.accreditation || "Verify",
    };
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

renderStateOptions();
applySavedProfile();
attachEvents();
initScrollReveal();
renderAll();
