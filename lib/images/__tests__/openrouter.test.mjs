import { describe, test } from "node:test";
import assert from "node:assert/strict";

const { cleanAlt } = await import("../openrouter.ts");

const DANGLING = /(,|;|:|-|\b(and|or|with|plus|a|an|the|of|in|on|at|to|by|for|from|into|onto|near|under|over|through|along|across|between|beside|behind|its|their))$/i;

describe("cleanAlt", () => {
  test("keeps a short, complete phrase as it is", () => {
    assert.equal(
      cleanAlt("A pickup truck and a sedan on a wet two-lane highway at dusk in flat teal tones."),
      "A pickup truck and a sedan on a wet two-lane highway at dusk in flat teal tones"
    );
  });

  test("drops an 'illustration of' opener and capitalises", () => {
    assert.equal(cleanAlt("flat illustration of a car on a bridge"), "A car on a bridge");
  });

  for (const [raw, expected] of [
    ["A red car on a road with trees and", "A red car on a road with trees"],
    ["A red car on a road or", "A red car on a road"],
    ["A truck on a bridge over a river with", "A truck on a bridge over a river"],
    ["A car parked by trees,", "A car parked by trees"],
    ["A car on a road lined with trees in the", "A car on a road lined with trees"],
    ["A collision on", "A collision"],
    ["A van under a sky with a", "A van under a sky"],
    ["A van on a road -", "A van on a road"],
    ["A van on a road, and", "A van on a road"],
  ]) {
    test(`trims the hanging end of "${raw}"`, () => {
      assert.equal(cleanAlt(raw), expected);
    });
  }

  test("does not mistake the end of a longer word for a dangling one", () => {
    assert.equal(cleanAlt("A car near a sand dune by the sea on a land"), "A car near a sand dune by the sea on a land");
    assert.equal(cleanAlt("A truck crossing a canyon"), "A truck crossing a canyon");
  });

  const filler = "A silver sedan and a blue pickup truck on a wide highway interchange with mountains and pine trees ";

  test("cuts long text at a word boundary, never mid-word", () => {
    const raw = `${filler}under a pale yellow sky with scattered clouds at sunset`;
    const alt = cleanAlt(raw);
    assert.ok(alt.length <= 124, `${alt.length} characters`);
    assert.ok(raw.startsWith(alt), "is a prefix of the input");
    assert.match(raw.slice(alt.length), /^ /, "the next character in the input is a space");
    assert.doesNotMatch(alt, DANGLING);
  });

  test("keeps the last word when the cut falls right after it", () => {
    const raw = `${"word ".repeat(24)}last more words`;
    assert.equal(raw.indexOf(" more"), 124);
    assert.equal(cleanAlt(raw), `W${raw.slice(1, 124)}`);
  });

  test("never ends on a hanging word wherever a long text is cut", () => {
    const tail =
      "and a car with trees in the distance, under a sky over the hills of the valley near the coast by a road to the sea on a day for a drive from the city";
    // Each step moves the tail one character left, so the 124-character cut falls on every position in it.
    for (let start = 0; start < 70; start++) {
      const raw = (filler + tail.slice(start)).replace(/\s+/g, " ");
      const alt = cleanAlt(raw);
      assert.ok(alt.length <= 124, `${alt.length} characters for "${raw}"`);
      assert.doesNotMatch(alt, DANGLING, `"${alt}"`);
      assert.ok(raw.startsWith(alt), `"${alt}" is not a prefix of the input`);
      assert.match(raw.slice(alt.length), /^[ ,]/, `"${alt}" ends mid-word`);
    }
  });
});
