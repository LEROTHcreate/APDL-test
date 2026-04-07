import { Card, CardContent, CardHeader } from "@/app/(pro)/clair-vision/pro/components/ui/Card";

export default function RightRail({
  analysis,
}: {
  analysis: null | {
    suggestions: Array<{ title: string; detail: string; tone: "info" | "warn" | "danger" }>;
    checklist: Array<{ id: string; label: string; done?: boolean }>;
    questions: string[];
  };
}) {
  const a = analysis ?? { suggestions: [], checklist: [], questions: [] };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Analyse du dossier" subtitle="Suggestions" />
        <CardContent>
          {a.suggestions.length === 0 ? (
            <div className="text-sm text-slate-500">Aucune suggestion.</div>
          ) : (
            <div className="space-y-3">{/* plus tard */}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Checklist étape" />
        <CardContent>
          {a.checklist.length === 0 ? (
            <div className="text-sm text-slate-500">Checklist vide.</div>
          ) : (
            <div className="space-y-2">{/* plus tard */}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Questions à poser" />
        <CardContent>
          {a.questions.length === 0 ? (
            <div className="text-sm text-slate-500">Aucune question.</div>
          ) : (
            <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">{/* plus tard */}</ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
