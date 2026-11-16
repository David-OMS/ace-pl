import { render, screen } from "@testing-library/react";
import { Trophy } from "lucide-react";

import { Icon } from "./icon";

describe("Icon", () => {
  it("is announced by its label when given one", () => {
    render(<Icon icon={Trophy} label="League" />);

    expect(screen.getByRole("img", { name: "League" })).toBeInTheDocument();
  });

  it("is hidden from screen readers when it only decorates text", () => {
    const { container } = render(<Icon icon={Trophy} />);

    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });
});
