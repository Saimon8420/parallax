import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import positions from "./fixtures/positions.json";
import helio from "./fixtures/heliocentric.json";
import overview from "./fixtures/overview.json";
import { useSky } from "../lib/useSky";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn((url: string) => {
    const body = url.includes("heliocentric") ? helio : url.includes("overview") ? overview : positions;
    return Promise.resolve({ ok: true, json: () => Promise.resolve(body) } as Response);
  }));
});

describe("useSky", () => {
  it("loads positions + overview for a location", async () => {
    const { result } = renderHook(() => useSky({ lat: 23.81, lng: 90.41, label: "Dhaka" }));
    await waitFor(() => expect(result.current.positions).not.toBeNull());
    expect(result.current.overview).not.toBeNull();
    expect(result.current.positions!.geo.length).toBeGreaterThan(0);
  });
});
