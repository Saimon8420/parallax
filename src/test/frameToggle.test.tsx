import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FrameToggle } from "../components/FrameToggle";

describe("FrameToggle", () => {
  it("shows both frames and fires onChange", () => {
    const onChange = vi.fn();
    render(<FrameToggle value="earth" onChange={onChange} />);
    fireEvent.click(screen.getByText(/from above/i));
    expect(onChange).toHaveBeenCalledWith("helio");
  });
  it("renders the honesty caption", () => {
    render(<FrameToggle value="earth" onChange={() => {}} />);
    expect(screen.getByText(/don.t line up|correct physics|viewpoint/i)).toBeTruthy();
  });
});
