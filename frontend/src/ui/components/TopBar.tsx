import { ChangeEvent } from "react";
import { FilterChip } from "./FilterChip";

interface Props {
  query: string;
  onQueryChange: (value: string) => void;
  filters: {
    fullTime: boolean;
    partTime: boolean;
    contract: boolean;
    remote: boolean;
  };
  onToggleFilter: (key: keyof Props["filters"]) => void;
  sort: string;
  onSortChange: (value: string) => void;
}

export function TopBar({
  query,
  onQueryChange,
  filters,
  onToggleFilter,
  sort,
  onSortChange,
}: Props) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onQueryChange(e.target.value);
  };

  return (
    <div className="mb-3 space-y-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search job titles, companies, skills..."
            className="w-full rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-slate-400">Sort by</span>
          <select
            className="rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="best">Best match</option>
            <option value="recent">Most recent</option>
            <option value="salary">Salary</option>
          </select>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 text-[11px]">
        <FilterChip
          label="Full-time"
          active={filters.fullTime}
          onClick={() => onToggleFilter("fullTime")}
        />
        <FilterChip
          label="Part-time"
          active={filters.partTime}
          onClick={() => onToggleFilter("partTime")}
        />
        <FilterChip
          label="Contract"
          active={filters.contract}
          onClick={() => onToggleFilter("contract")}
        />
        <FilterChip
          label="Remote"
          active={filters.remote}
          onClick={() => onToggleFilter("remote")}
        />
      </div>
    </div>
  );
}

