import { useMemo, type ReactNode } from "react";
import { R } from "../recrux/theme";

const WEEKS = 12;
const DAYS = 7;

/** Deterministic pseudo-random grid (stable across re-renders). */
function cellLevel(week: number, day: number): number {
  const n = ((week * 17 + day * 31) % 100) / 100;
  if (n < 0.65) return 0;
  return ((week + day) % 3) + 1;
}

function ContributionGrid() {
  const cells = useMemo(() => {
    const out: ReactNode[] = [];
    for (let w = 0; w < WEEKS; w++) {
      for (let d = 0; d < DAYS; d++) {
        const level = cellLevel(w, d);
        const bg =
          level === 0
            ? R.muted
            : level === 1
              ? R.border
              : level === 2
                ? R.mid
                : R.primary;
        out.push(<div key={`${w}-${d}`} style={{ width: 12, height: 12, borderRadius: 3, background: bg }} />);
      }
    }
    return out;
  }, []);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: `repeat(${DAYS}, 12px)`,
        gridAutoFlow: "column",
        gap: 4,
        width: "max-content",
      }}
    >
      {cells}
    </div>
  );
}

export function Progress() {
  const weeks = ["M", "T", "W", "T", "F", "S", "S"];
  const barData = [2, 5, 3, 6, 4, 7, 5];
  const linePoints = [62, 68, 71, 69, 74, 78, 80];

  const section = {
    background: R.card,
    border: `0.5px solid ${R.border}`,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  } as const;

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: R.darkest, marginBottom: 16 }}>Progress</h1>

      <div style={section}>
        <h2 style={{ fontSize: 13, fontWeight: 500, color: R.darkest }}>Application streak</h2>
        <p style={{ fontSize: 11, color: R.deep, marginTop: 4 }}>Mock activity grid</p>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              fontSize: 9,
              color: R.muted,
              paddingTop: 2,
              paddingBottom: 2,
            }}
          >
            {weeks.map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>
          <ContributionGrid />
        </div>
      </div>

      <div style={section}>
        <h2 style={{ fontSize: 13, fontWeight: 500, color: R.darkest }}>Applications this week</h2>
        <div style={{ display: "flex", height: 120, alignItems: "flex-end", gap: 8, marginTop: 16 }}>
          {barData.map((h, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: "100%",
                  background: R.mid,
                  borderRadius: "4px 4px 0 0",
                  height: `${(h / 7) * 100}%`,
                  minHeight: 8,
                }}
              />
              <span style={{ fontSize: 9, color: R.deep }}>D{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={section}>
        <h2 style={{ fontSize: 13, fontWeight: 500, color: R.darkest }}>Avg match score</h2>
        <div
          style={{
            display: "flex",
            height: 100,
            alignItems: "flex-end",
            gap: 6,
            marginTop: 16,
            borderBottom: `0.5px solid ${R.border}`,
            paddingBottom: 0,
          }}
        >
          {linePoints.map((v, i) => (
            <div key={i} style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  width: "100%",
                  maxWidth: 28,
                  background: `${R.primary}cc`,
                  borderRadius: "4px 4px 0 0",
                  height: `${v}%`,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div style={section}>
        <h2 style={{ fontSize: 13, fontWeight: 500, color: R.darkest }}>Skill gap tracker</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0" }}>
          {["Kubernetes", "System design", "CI/CD"].map((skill) => (
            <li
              key={skill}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 12px",
                background: R.light,
                borderRadius: 8,
                marginBottom: 8,
                fontSize: 12,
                color: R.deep,
              }}
            >
              <span>{skill}</span>
              <span style={{ fontSize: 11, fontWeight: 500, color: R.primary }}>Start learning</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
