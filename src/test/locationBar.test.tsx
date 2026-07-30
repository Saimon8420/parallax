import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LocationBar } from "../components/LocationBar";
import { DEFAULT_LOCATION } from "../lib/geo";

describe("LocationBar", () => {
  it("shows the current location label", () => {
    render(<LocationBar current={DEFAULT_LOCATION} onPick={() => {}} />);
    expect(screen.getByText(/dhaka/i)).toBeTruthy();
  });
  it("picks a searched city", () => {
    const onPick = vi.fn();
    render(<LocationBar current={DEFAULT_LOCATION} onPick={onPick} />);
    fireEvent.click(screen.getByRole("button", { name: /change|location/i }));
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: "london" } });
    fireEvent.click(screen.getByText(/london/i));
    expect(onPick).toHaveBeenCalled();
  });
});
