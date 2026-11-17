import type { SelectOption } from "./select-control";

/** Case-insensitive label filter for select dropdowns. */
export function filterSelectOptions(
  options: readonly SelectOption[],
  query: string,
): SelectOption[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [...options];
  return options.filter((option) => option.label.toLowerCase().includes(needle));
}
