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

  it("ignores a stale in-flight response after the location changes (alive guard)", async () => {
    // Old location's positions/overview fetches stay pending until we resolve them by hand,
    // simulating a slow request for the PREVIOUS city that only settles after the effect
    // has already re-run for a NEW city. Without the `alive` guard on the initial-load
    // setters, this stale resolution would clobber the newer state.
    let resolveStalePositions!: (v: unknown) => void;
    let resolveStaleOverview!: (v: unknown) => void;
    const stalePositionsPromise = new Promise((r) => { resolveStalePositions = r; });
    const staleOverviewPromise = new Promise((r) => { resolveStaleOverview = r; });

    const stalePositionsBody = { ...positions, data: { ...positions.data, datetime: "1999-12-31T00:00:00.000Z" } };
    const staleOverviewBody = {
      ...overview,
      data: { ...overview.data, sun: { ...overview.data.sun, dayLength: { seconds: 1, formatted: "STALE" } } },
    };

    vi.stubGlobal("fetch", vi.fn((url: string) => {
      if (url.includes("heliocentric")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(helio) } as Response);
      }
      if (url.includes("lat=1")) {
        // requests for the OLD location ("A") — resolve only when we call the resolvers below
        if (url.includes("overview")) {
          return staleOverviewPromise.then((b) => ({ ok: true, json: () => Promise.resolve(b) } as Response));
        }
        return stalePositionsPromise.then((b) => ({ ok: true, json: () => Promise.resolve(b) } as Response));
      }
      // requests for the NEW location ("B") — resolve immediately
      const body = url.includes("overview") ? overview : positions;
      return Promise.resolve({ ok: true, json: () => Promise.resolve(body) } as Response);
    }));

    const { result, rerender } = renderHook(
      ({ loc }) => useSky(loc),
      { initialProps: { loc: { lat: 1, lng: 1, label: "A" } } },
    );

    // Switch city before A's fetches resolve — this runs A's effect cleanup (alive=false
    // in A's closure) and starts B's effect.
    rerender({ loc: { lat: 2, lng: 2, label: "B" } });

    await waitFor(() => expect(result.current.positions).not.toBeNull());
    expect(result.current.positions!.datetime).not.toBe("1999-12-31T00:00:00.000Z");
    expect(result.current.overview!.dayLength!.formatted).not.toBe("STALE");

    // Now let A's stale requests resolve late. Give the resulting promise chain
    // (fetch -> .json() -> normalizePositions -> setState) enough turns of the event
    // loop to fully settle before asserting.
    resolveStalePositions(stalePositionsBody);
    resolveStaleOverview(staleOverviewBody);
    await new Promise((r) => setTimeout(r, 50));

    // Final state must still reflect B, not the late-arriving stale A data.
    expect(result.current.positions!.datetime).not.toBe("1999-12-31T00:00:00.000Z");
    expect(result.current.overview!.dayLength!.formatted).not.toBe("STALE");
  });
});
