interface Props {
  label: string;
  active: boolean;
  onClick: () => void;
}

export function FilterChip({ label, active, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center rounded-button border-2 px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "border-primary bg-primary text-white"
          : "border-primary bg-bg-card text-primary hover:bg-bg-hero"
      }`}
    >
      {label}
    </button>
  );
}
