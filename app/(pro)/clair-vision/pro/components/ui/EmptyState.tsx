import Button from "@/app/(pro)/clair-vision/pro/components/ui/Button";

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-8 text-center">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-2 text-sm text-slate-600">{description}</div>
      {actionLabel && actionHref ? (
        <div className="mt-5 flex justify-center">
          <Button href={actionHref} variant="primary">
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
