import { describe, test } from "node:test";
import assert from "node:assert/strict";

const { parseCrashCheck } = await import("../checkRoadCrash.ts");

describe("parseCrashCheck", () => {
  // Answers gemini-2.5-flash-lite gave on 21 and 22 Oct 2026 that failed tx-woman-charged-arrested-in-connection-with-june-baytown-2026-10-21
  // and nv-nhp-driver-arrested-after-fleeing-rollover-crash-on-2026-10-22: a whole answer, then a stray "}".
  for (const [content, reason] of [
    [
      '{"crash": true, "reason": "The coverage reports on an arrest and charges related to a specific hit-and-run incident that resulted in a fatality."}\n}',
      "The coverage reports on an arrest and charges related to a specific hit-and-run incident that resulted in a fatality.",
    ],
    [
      '{"crash": true, "reason": "The coverage reports a specific rollover crash on a road where a driver fled and was subsequently arrested."}\n}',
      "The coverage reports a specific rollover crash on a road where a driver fled and was subsequently arrested.",
    ],
  ]) {
    test(`reads an answer with a stray closing brace: ${reason.slice(0, 40)}`, () => {
      assert.deepEqual(parseCrashCheck(content), { crash: true, reason });
    });
  }

  test("reads a plain answer", () => {
    assert.deepEqual(parseCrashCheck('{"crash": false, "reason": "A law firm press release."}'), {
      crash: false,
      reason: "A law firm press release.",
    });
  });

  test("reads an answer in a code fence", () => {
    assert.deepEqual(parseCrashCheck('```json\n{"crash": true, "reason": "A two-car crash on I-95."}\n```'), {
      crash: true,
      reason: "A two-car crash on I-95.",
    });
  });

  test("keeps braces inside the reason", () => {
    assert.deepEqual(parseCrashCheck('{"crash": false, "reason": "A {sponsored} ranking."}'), {
      crash: false,
      reason: "A {sponsored} ranking.",
    });
  });

  for (const content of ["", "I cannot tell.", '{"crash": "yes", "reason": "unclear"}', '{"crash": true, "reason": "cut off']) {
    test(`throws on no clear answer: ${JSON.stringify(content)}`, () => {
      assert.throws(() => parseCrashCheck(content), /^Error: Crash check gave no clear answer/);
    });
  }
});
