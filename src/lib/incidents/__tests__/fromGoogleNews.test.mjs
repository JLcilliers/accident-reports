import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { registerHooks } from "node:module";

// The app imports TypeScript files without an extension, as the bundler resolves them; Node needs the ".ts".
registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (specifier.startsWith(".")) return nextResolve(`${specifier}.ts`, context);
      throw error;
    }
  },
});
const { toIncidentCandidates } = await import("../fromGoogleNews.ts");
const { COMMON_WORD_TOWNS } = await import("../towns.ts");

// Where a headline from this publisher is stored: "City/ST" ("-" for no city) when `expected` names a city,
// else the state alone, or "none" when it is skipped.
function placeFor(title, source, expected) {
  const log = console.log;
  console.log = () => {};
  try {
    const [candidate] = toIncidentCandidates([
      { title, link: "x", pubDate: new Date().toISOString(), description: undefined, source },
    ]);
    if (!candidate) return "none";
    return expected.includes("/") ? `${candidate.city ?? "-"}/${candidate.state}` : candidate.state;
  } finally {
    console.log = log;
  }
}

const streetWords = ["Heights", "District", "Street", "St", "Avenue", "Ave", "Road", "Rd", "Boulevard", "Blvd", "Park", "Bridge", "Square"];
const nationalOutlets = ["New York Post", "The New York Times", "nytimes.com", "USA Today", "Associated Press", "AP News", "The Associated Press", "Reuters", "Fox News", "CNN", "NBC News", "ABC News", "CBS News", "MS NOW", "PA Media", "Yahoo", "Yahoo News Canada", "yahoo.com", "MSN", "msn.com", "Daily Mail", "The Independent", "Newsweek"];

// [headline, publisher, expected place]
const groups = {
  "Replay regressions": [
    ["Hit-and-run SUV driver fatally struck man, 42, in crosswalk in Washington Heights", "Streetsblog Chicago", "IL"],
    ["Hit-and-run SUV driver fatally struck man, 42, in crosswalk August 16 in Washington Heights", "Streetsblog Chicago", "IL"],
    ["Pedestrian struck and killed by driver in S.F.’s Richmond District", "San Francisco Chronicle", "CA"],
  ],
  "Street and neighbourhood names": [
    ...streetWords.map((w) => [`Driver killed in crash on Washington ${w}`, "ABC7 Chicago", "IL"]),
    ...streetWords.map((w) => [`Driver killed in crash on Richmond ${w}`, "ABC7 Chicago", "IL"]),
    ["Maryland traffic alert: Multi-vehicle crash slows traffic on ICC near Georgia Avenue", "WUSA9", "MD"],
    ["Petersburg woman charged in East Washington Street fatal hit-and-run", "WTVR.com", "none"],
    ["Fatal Crash Shuts Route 141 in Maryland Heights, Third Death at Same Spot Since 2023", "Hoodline", "none"],
    ["Pedestrian Struck, Left Unresponsive on Silver Spring's New Hampshire Avenue", "Hoodline", "none"],
    ["Charges filed in Richmond Heights wrong-way crash", "Audacy", "none"],
    ["Fatal crash on I-5 in Washington leaves one dead", "KOMO", "WA"],
    ["Two killed in fatal crash in Virginia Beach", "WAVY", "VA"],
    ["Fatal crash in Richmond closes I-95", "WTVR.com", "VA"],
  ],
  "Streets named after a city": [
    ["Pedestrian struck by vehicle near Las Vegas Boulevard, Nellis", "FOX5 Vegas", "-/NV"],
    ["Pedestrian struck and killed on Las Vegas Boulevard", "KTNV Las Vegas", "-/NV"],
    ["Pedestrian struck and killed on Las Vegas Blvd", "Yahoo", "-/NV"],
    ["Hit-and-run on Fresno Street leaves pedestrian dead", "Hoodline", "-/CA"],
    ["Fatal crash on Las Vegas Boulevard", "ABC7 Chicago", "-/IL"],
    ["Charges filed in Richmond Heights wrong-way crash", "Hoodline", "none"],
    ["Multi-car crash blocks Aurora Avenue early Wednesday morning", "MyNorthwest.com", "-/WA"],
    ["Multi-car crash blocks Aurora Avenue early Wednesday morning", "Yahoo", "-/CO"],
    ["Fatal crash on Aurora Avenue in Seattle", "Yahoo", "Seattle/WA"],
    ["Ohio man killed in crash on Las Vegas Boulevard", "Yahoo", "-/OH"],
    ["CHP identifies Sacramento man killed in fatal Folsom Boulevard hit-and-run", "Yahoo", "Sacramento/CA"],
  ],
  "Hospital names": [
    ["Massachusetts teen ejected, pronounced dead at Rhode Island Hospital, after car crash", "Fall River Reporter", "MA"],
    ["Massachusetts teen ejected, pronounced dead at Rhode Island Hospital, after car crash", "Yahoo", "MA"],
    ["Massachusetts Teen Ejected, Pronounced Dead At Rhode Island Hospital, After Car Crash", "Yahoo", "MA"],
    ["Pedestrian struck in Bristol, taken to Rhode Island Hospital", "WJAR", "RI"],
    ["Pedestrian struck in Bristol, taken to Rhode Island Hospital", "coastalabc.com", "RI"],
    ["Driver flown to Denver Health Medical Center after crash", "Yahoo", "none"],
    ["Child taken to Children's Hospital of Philadelphia after crash", "Yahoo", "none"],
    ["Two killed in crash in Tampa, third flown to Orlando Regional Medical Center", "Yahoo", "Tampa/FL"],
  ],
  "<State> County": [
    ["1 dead after motorcycle crash in Delaware County", "Fox 59", "none"],
    ["Pedestrian Struck, Killed On Route 1 In Delaware County: PA State Police", "MSN", "PA"],
    ["Fatal 12-Vehicle Crash Closes I-71 in Delaware County, Ohio", "world.infonasional.com", "OH"],
    ["Fatal crash in Delaware County", "WTAE Pittsburgh", "PA"],
    ["Fatal crash in Delaware County", "6abc Philadelphia", "PA"],
    ["Pedestrian struck, killed in Washington County", "Pittsburgh Post-Gazette", "PA"],
    ["Washington County fatal crash; 83-year-old man dead, 2 hurt", "FOX6 News Milwaukee", "WI"],
    ["Man killed in Mississippi County hit-and-run", "K8 News | Jonesboro, Arkansas", "AR"],
    ["Fatal hit-and-run crash in Iowa County", "WMTV 15 NEWS", "WI"],
    ["Fatal hit-and-run crash in Iowa County", "KWWL | Waterloo, IA", "IA"],
    ["Fatal hit-and-run crash in Iowa County", "ABC7 Chicago", "none"],
    ["Iowa County Sheriff warns of police presence in Ridgeway after locating vehicle involved in fatal hit-and-run", "WGLR", "none"],
    ["WASHINGTON COUNTY FATAL CRASH CLOSES ROUTE 22", "WPXI", "none"],
    ["Two killed in fatal crash in a rural Iowa county", "KCCI", "IA"],
    ["Fatal crash in Utah County closes I-15", "KSL.com", "-/UT"],
    ["Fatal crash in Oklahoma County kills man", "KFOR", "-/OK"],
    ["Fatal crash in Utah County closes I-15", "ABC7 Chicago", "-/UT"],
  ],
  "<City> County": [
    ["Fatal crash in Los Angeles County kills 2", "KTLA", "-/CA"],
    ["Pedestrian killed in fatal crash in Arlington County", "WTOP", "-/VA"],
    ["Pedestrian killed in fatal crash in Arlington County", "FOX 4 News Dallas-Fort Worth", "-/VA"],
    ["Fresno County man killed in crash", "ABC30 Fresno", "-/CA"],
    ["Cleveland County hit-and-run leaves man dead", "WSOC TV", "none"],
    ["Cleveland County hit-and-run leaves man dead", "Cleveland 19 News", "none"],
    ["Fatal crash in Houston County", "Yahoo", "none"],
    ["Pedestrian killed in fatal crash in Arlington", "WFAA", "Arlington/TX"],
  ],
  "City followed by a state": [
    ["Pedestrian killed in fatal crash in Arlington, Virginia", "WTOP", "VA"],
    ["Pedestrian killed in fatal crash in Arlington, VA", "WTOP", "VA"],
    ["Pedestrian killed in fatal crash in Arlington Virginia", "WTOP", "VA"],
    ["Two killed in crash in Arlington, Texas", "WFAA", "TX"],
    ["Two killed in fatal crash in Arlington", "WFAA", "TX"],
    ["2 dead, 4 seriously injured in wrong-way crash in Kansas City, Kansas", "MSN", "KS"],
    ["3 killed in wrong-way crash on I-88 in Aurora, Illinois, state police say", "MSN", "IL"],
    ["Fatal crash in Portland, ME closes Route 1", "WMTW", "ME"],
    ["Report: Miami DE Rueben Bain Jr. drove in '24 fatal crash", "MSN", "FL"],
  ],
  "AP-style state abbreviations": [
    ["Pedestrian killed in fatal crash in Arlington, Va.", "WFAA", "Arlington/VA"],
    ["Fatal crash in Kansas City, Kan.", "MSN", "Kansas City/KS"],
    ["Two killed in crash in Pittsburgh, Pa.", "MSN", "Pittsburgh/PA"],
    ["Fatal crash in Atlanta, Ga., closes I-85", "MSN", "Atlanta/GA"],
    ["Man killed in fatal crash in Lexington, Ky.", "MSN", "KY"],
    ["Fatal crash in Charleston, W.Va., closes I-64", "MSN", "WV"],
    ["Driver killed in crash near Spokane, Wash.", "MSN", "WA"],
    ["Teen killed in crash in Burlington, Vt.", "MSN", "VT"],
    ["New Richmond, Wis., woman arrested after fatal hit-and-run in Town of Hudson", "Pioneer Press", "WI"],
    ...Object.entries({ "Ala.": "AL", "Ariz.": "AZ", "Ark.": "AR", "Calif.": "CA", "Colo.": "CO", "Conn.": "CT", "Del.": "DE", "Fla.": "FL", "Ga.": "GA", "Ill.": "IL", "Ind.": "IN", "Kan.": "KS", "Ky.": "KY", "La.": "LA", "Md.": "MD", "Mass.": "MA", "Mich.": "MI", "Minn.": "MN", "Miss.": "MS", "Mo.": "MO", "Mont.": "MT", "Neb.": "NE", "Nev.": "NV", "N.H.": "NH", "N.J.": "NJ", "N.M.": "NM", "N.Y.": "NY", "N.C.": "NC", "N.D.": "ND", "Okla.": "OK", "Ore.": "OR", "Pa.": "PA", "R.I.": "RI", "S.C.": "SC", "S.D.": "SD", "Tenn.": "TN", "Tex.": "TX", "Va.": "VA", "Vt.": "VT", "Wash.": "WA", "W.Va.": "WV", "Wis.": "WI", "Wyo.": "WY" }).map(
      ([abbreviation, state]) => [`Driver killed in fatal crash in Springfield, ${abbreviation}`, "Yahoo", state]
    ),
    ["Pa. Turnpike fatal crash closes lanes", "Yahoo", "none"],
  ],
  "Where someone is from": [
    ["New Hampshire man charged with manslaughter after fatal crash in Wells", "WMTW", "ME"],
    ["New Hampshire man charged with manslaughter in fatal Wells hit-and-run", "Yahoo", "NH"],
    ["New Hampshire man charged with manslaughter after fatal crash in Wells — Wells, Maine", "cedarnews.net", "ME"],
    ["NH Man Arrested After Fatal Hit-and-Run in Wells", "The Maine Wire", "ME"],
    ["Texas man killed in fatal crash in Oklahoma", "Yahoo", "OK"],
    ["Texas driver dies in Oklahoma wrong-way crash", "Yahoo", "OK"],
    ["Texas man killed in crash", "Yahoo", "TX"],
    ["Denver man killed in crash in Aurora", "Denver7", "Aurora/CO"],
    ["Kansas City, Kan., man killed in crash in Iowa", "MSN", "IA"],
    ["Iowa City man killed in fatal crash in Missouri", "MSN", "MO"],
    ["New York City man killed in crash in New Jersey", "MSN", "NJ"],
    ["D.C. man killed in fatal crash in Maryland", "MSN", "MD"],
    ["Houston woman killed in crash, police say", "Yahoo", "Houston/TX"],
    ["Maryland man arrested for fatal Poolesville hit-and-run", "FOX 5 DC", "MD"],
    ["Maryland Man Arrested For Fatal Poolesville Hit-And-Run", "FOX 5 DC", "MD"],
    ["Maryland man killed in crash in Poolesville", "FOX 5 DC", "MD"],
    ["Maryland man killed in crash in Wells", "FOX 5 DC", "DC"],
    ["Charlotte woman, man killed after car crashes into motorcycle in Tega Cay", "NewsBreak: Local News & Alerts", "-/SC"],
    ["Tampa Man, 64, Killed in Marion County Truck Crash", "Hoodline", "Tampa/FL"],
  ],
  "A crash's town alone": [
    ["Driver Arrested in Fatal Poolesville Hit-and-Run", "FOX 5 DC", "MD"],
    ["Pedestrian killed in crash in Poolesville", "Yahoo", "MD"],
    ["Pedestrian killed in crash in Poolesville", "ABC7 Chicago", "IL"],
    ["3 hurt in multi-vehicle crash on Route 73 in Evesham Township", "NBC10 Philadelphia", "NJ"],
    ["Fatal hit and run in Lamesa, search for driver ongoing", "everythinglubbock.com", "TX"],
    ["Man arrested nearly 8 months after deadly Pacific Beach hit-and-run", "FOX 5 San Diego & KUSI News", "CA"],
    ["Severna Park man dies in hit-and-run near strip mall on Ritchie Highway", "The Baltimore Banner", "MD"],
    ["Severna Park man killed in Ritchie Highway hit-and-run: Police detain suspect", "Yahoo", "none"],
    ["Pedestrian killed in crash on North Druid Hills Road", "Yahoo", "none"],
    ["Pedestrian killed in crash near Central Park", "Yahoo", "none"],
  ],
  "Towns that are also ordinary words": [
    ["Ohio man killed in crash at Main and 5th", "Yahoo", "OH"],
    ["Ohio man killed in crash near Main and 5th", "Yahoo", "OH"],
    ["Kentucky Man Hit-And-Run Victim Identified", "Yahoo", "KY"],
    ["Ohio man killed in crash near Beach", "Yahoo", "OH"],
    ["Two hurt in crash near Beach", "Yahoo", "none"],
  ],
  "Publisher names": [
    ["Suspect in fatal Wells hit-and-run facing charges", "The Portland Press Herald", "ME"],
    ...["AuroraToday.ca", "Oklahoma City Free Press"].map(
      (publisher) => ["Driver killed in fatal crash, police say", publisher, "none"]
    ),
    ...Object.entries({ "FOX21 News Colorado": "CO", "News12 | New Jersey": "NJ", "Portland, ME Patch": "ME", "KSHB 41 Kansas City": "MO", "ABC13 Houston": "TX", "The Oklahoman": "OK", "CT Insider": "CT", "FOX 5 DC": "DC", "NJ.com": "NJ", "Baltimore Sun": "MD", "KTNV Las Vegas": "NV", "Kansas City Star": "MO", "Streetsblog Chicago": "IL", "San Francisco Chronicle": "CA" }).map(
      ([publisher, state]) => ["Driver killed in fatal crash, police say", publisher, state]
    ),
  ],
  "New York City": [
    ["NYC man, 68, killed in possible Lamborghini hit-and-run", "New York Post", "New York/NY"],
    ["Man, 72, arrested in NYC hit-and-run death of former Nickelodeon child star Kianna Underwood", "FOX 5 New York", "New York/NY"],
    ["72-year-old man charged in New York City hit-and-run crash that killed former Nickelodeon star", "ABC7 Chicago", "New York/NY"],
  ],
  "Idaho Avenue, ID'd, ID's": [
    ["Las Cruces Hit-And-Run Injures Pedestrian on Idaho Avenue, Driver Still At Large", "Hoodline", "NM"],
    ["Man, 80, ID’d in fatal crash was longtime Seaman’s worker who loved doo-wop, friends say", "NJ.com", "NJ"],
    ["Jayden Magdaleno, 15, ID'd as teen boy killed after car crashed into tree near 92nd Street", "ABC7 Chicago", "IL"],
    ["Victim, 21, ID'd in fatal DUI hit-and-run in Newport Beach", "MSN", "CA"],
    ["Coroner ID's driver killed in fatal crash", "KGET 17", "none"],
    ["Coroner ID’s driver killed in fatal crash", "KGET 17", "none"],
    ["Wrong-way driver killed in crash, coroner ID’s victim", "WJBF", "none"],
    ["Fatal crash near Boise, ID closes I-84", "KTVB", "ID"],
    ["Fatal crash in Idaho closes I-84", "KTVB", "ID"],
  ],
  "National outlets": [
    ...nationalOutlets.map((o) => ["Driver killed in fatal crash, police say", o, "none"]),
    ...nationalOutlets.map((o) => ["Driver killed in fatal crash in Houston, police say", o, "TX"]),
    ["Dispatch audio sheds new light on Kyle Shanahan’s horror car crash", "New York Post", "none"],
    ["Driver killed in fatal crash, police say", "ABC7 Chicago", "IL"],
    ["Driver killed in fatal crash, police say", "The Independent Florida Alligator", "FL"],
  ],
};

for (const [group, cases] of Object.entries(groups)) {
  describe(group, () => {
    for (const [title, source, expected] of cases) {
      test(`${title} | ${source} -> ${expected}`, () => {
        assert.equal(placeFor(title, source, expected), expected);
      });
    }
  });
}

test("Main, Hurt, Man and Beach are ordinary words, not towns", () => {
  for (const word of ["main", "hurt", "man", "beach"]) assert.ok(COMMON_WORD_TOWNS.has(word), word);
});
