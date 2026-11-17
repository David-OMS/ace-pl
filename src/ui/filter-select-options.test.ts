import { describe, expect, it } from "vitest";

import { filterSelectOptions } from "./filter-select-options";

const options = [
  { value: "1", label: "Femi O." },
  { value: "2", label: "Kwame O." },
  { value: "3", label: "David" },
];

describe("filterSelectOptions", () => {
  it("returns all options when the query is blank", () => {
    expect(filterSelectOptions(options, "  ")).toEqual(options);
  });

  it("matches labels case-insensitively by substring", () => {
    expect(filterSelectOptions(options, "fem")).toEqual([options[0]]);
    expect(filterSelectOptions(options, "O.")).toEqual([options[0], options[1]]);
  });
});
