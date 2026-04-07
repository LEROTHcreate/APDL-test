import { cn } from "@/lib/utils";

export default function Tabs<T extends string>({
  value,
  onChange,
  items,
}: {
  value: T;
  onChange: (v: T) => void;
  items: T[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200/70 bg-white p-2">
      {items.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={cn(
            "rounded-xl px-4 py-2 text-sm font-semibold transition",
            value === t ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
