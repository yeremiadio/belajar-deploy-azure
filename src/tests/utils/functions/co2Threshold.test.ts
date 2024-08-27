import { describe, expect, it } from "vitest";
import { getColorByCo2Threshold } from "@/utils/functions/co2Threshold";

describe("co2Threshold", () => {
  it("returns correlated color regarding threshold number", () => {
    const result = getColorByCo2Threshold(300);
    const expected = "#00E39E";
    expect(result).toEqual(expected);
  });
});