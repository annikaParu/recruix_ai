interface Props {
  value: number;
}

export function MatchBadge({ value }: Props) {
  let bg = "bg-bg-teal text-accent";
  if (value < 90 && value >= 70) {
    bg = "bg-amber-100 text-amber-700";
  } else if (value < 70) {
    bg = "bg-gray-100 text-text-muted";
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border-2 border-current/20 px-2.5 py-1 text-xs font-medium ${bg}`}
    >
      {value}% Match
    </span>
  );
}
