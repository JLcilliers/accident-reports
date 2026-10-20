import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { toIncidentCandidates } from "../fromGoogleNews.ts";

// The state a headline from this publisher is stored under, or "none" when it is skipped.
function stateFor(title, source) {
  const log = console.log;
  console.log = () => {};
  try {
    const [candidate] = toIncidentCandidates([
      { title, link: "x", pubDate: new Date().toISOString(), description: undefined, source },
    ]);
    return candidate?.state ?? "none";
  } finally {
    console.log = log;
  }
}

const streetWords = ["Heights", "District", "Street", "St", "Avenue", "Ave", "Road", "Rd", "Boulevard", "Blvd", "Park", "Bridge", "Square"];
const nationalOutlets = ["New York Post", "The New York Times", "nytimes.com", "USA Today", "Associated Press", "AP News", "The Associated Press", "Reuters", "Fox News", "CNN", "NBC News", "ABC News", "CBS News", "Yahoo", "Yahoo News Canada", "yahoo.com", "MSN", "msn.com", "Daily Mail", "The Independent", "Newsweek"];

// [headline, publisher, expected state]
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
  "<State> County": [
    ["1 dead after motorcycle crash in Delaware County", "Fox 59", "none"],
    ["Pedestrian Struck, Killed On Route 1 In Delaware County: PA State Police", "MSN", "PA"],
    ["Fatal 12-Vehicle Crash Closes I-71 in Delaware County, Ohio", "world.infonasional.com", "OH"],
    ["Fatal crash in Delaware County", "WTAE Pittsburgh", "PA"],
    ["Pedestrian struck, killed in Washington County", "Pittsburgh Post-Gazette", "PA"],
    ["Washington County fatal crash; 83-year-old man dead, 2 hurt", "FOX6 News Milwaukee", "WI"],
    ["Man killed in Mississippi County hit-and-run", "K8 News | Jonesboro, Arkansas", "AR"],
    ["Fatal hit-and-run crash in Iowa County", "WMTV 15 NEWS", "none"],
    ["Iowa County Sheriff warns of police presence in Ridgeway after locating vehicle involved in fatal hit-and-run", "WGLR", "none"],
    ["WASHINGTON COUNTY FATAL CRASH CLOSES ROUTE 22", "WPXI", "none"],
    ["Two killed in fatal crash in a rural Iowa county", "KCCI", "IA"],
    ["Fatal crash in Los Angeles County kills 2", "KTLA", "CA"],
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
  "Idaho Avenue, ID'd, ID's": [
    ["Las Cruces Hit-And-Run Injures Pedestrian on Idaho Avenue, Driver Still At Large", "Hoodline", "none"],
    ["Man, 80, ID’d in fatal crash was longtime Seaman’s worker who loved doo-wop, friends say", "NJ.com", "NJ"],
    ["Jayden Magdaleno, 15, ID'd as teen boy killed after car crashed into tree near 92nd Street", "ABC7 Chicago", "IL"],
    ["Victim, 21, ID'd in fatal DUI hit-and-run in Newport Beach", "MSN", "none"],
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
        assert.equal(stateFor(title, source), expected);
      });
    }
  });
}
