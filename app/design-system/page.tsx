// Page visible uniquement en développement — storybook interne THOR
import { redirect } from "next/navigation";
import { Button }   from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge }    from "@/components/ui/badge";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Heading, Text } from "@/components/ui/typography";
import { Spinner, Skeleton, Divider, Avatar } from "@/components/ui/spinner";
import { EyeIcon, EarIcon } from "@/components/ui/service-icons";

export default function DesignSystemPage() {
  if (process.env.NODE_ENV !== "development") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-thor-bg py-16">
      <div className="mx-auto max-w-[1100px] px-6 space-y-20">

        {/* ── En-tête ── */}
        <div className="space-y-2">
          <Heading level="h1">Design System THOR</Heading>
          <Text variant="muted">Composants, tokens et identités de marque.</Text>
        </div>

        {/* ── 1. Couleurs ── */}
        <Section title="Couleurs de marque">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Swatch color="bg-thor-accent"       label="Thor accent"       value="#0B1220" />
            <Swatch color="bg-thor-surface-2"    label="Thor surface-2"    value="#F1F5F9" />
            <Swatch color="bg-vision-accent"     label="Vision accent"     value="#2D8CFF" />
            <Swatch color="bg-vision-accent-alt" label="Vision alt"        value="#0EA5E9" />
            <Swatch color="bg-audition-accent"   label="Audition accent"   value="#00C98A" />
            <Swatch color="bg-audition-accent-alt" label="Audition alt"    value="#10B981" />
            <Swatch color="bg-danger"            label="Danger"            value="#DC2626" />
            <Swatch color="bg-warning"           label="Warning"           value="#D97706" />
          </div>
        </Section>

        {/* ── 2. Typographie ── */}
        <Section title="Typographie">
          <div className="space-y-4">
            <Heading level="h1">Heading H1 — Voir avec clarté</Heading>
            <Heading level="h2">Heading H2 — Clair Vision</Heading>
            <Heading level="h3">Heading H3 — Clair Audition</Heading>
            <Heading level="h4">Heading H4 — Sous-titre</Heading>
            <Heading level="h5">Heading H5 — Label section</Heading>
            <Divider />
            <Heading level="h2" variant="gradient-vision">Gradient Vision</Heading>
            <Heading level="h2" variant="gradient-audition">Gradient Audition</Heading>
            <Divider />
            <Text variant="body">Corps de texte — Lorem ipsum dolor sit amet, consectetur adipiscing elit. Une expérience premium, pensée pour vous.</Text>
            <Text variant="muted">Texte muté — description secondaire, hints, légendes.</Text>
            <Text variant="caption">Caption — très petit texte d'accompagnement.</Text>
            <Text variant="label" as="span">Label UI — UPPERCASE TRACKING</Text>
            <br />
            <Text variant="code" as="span">code inline</Text>
          </div>
        </Section>

        {/* ── 3. Boutons ── */}
        <Section title="Boutons">
          <div className="space-y-6">
            {(["vision", "audition", "thor"] as const).map((brand) => (
              <div key={brand} className="space-y-3">
                <Text variant="label" as="p">{brand}</Text>
                <div className="flex flex-wrap gap-3 items-center">
                  <Button brand={brand} variant="primary" size="sm">Small</Button>
                  <Button brand={brand} variant="primary" size="md">Medium</Button>
                  <Button brand={brand} variant="primary" size="lg">Large</Button>
                  <Button brand={brand} variant="outline">Outline</Button>
                  <Button brand={brand} variant="ghost">Ghost</Button>
                  <Button brand={brand} variant="subtle">Subtle</Button>
                  <Button brand={brand} variant="primary" loading>Loading</Button>
                  <Button brand={brand} variant="primary" disabled>Disabled</Button>
                </div>
              </div>
            ))}
            <div>
              <Text variant="label" as="p">Danger</Text>
              <div className="flex gap-3 mt-3">
                <Button variant="danger">Supprimer</Button>
                <Button variant="danger" size="sm">Danger sm</Button>
              </div>
            </div>
            <div>
              <Text variant="label" as="p">Avec icônes</Text>
              <div className="flex flex-wrap gap-3 mt-3">
                <Button brand="vision" iconLeft={<EyeIcon />}>Examen de vue</Button>
                <Button brand="audition" iconLeft={<EarIcon />}>Test auditif</Button>
                <Button brand="vision" variant="outline" iconRight={<span>→</span>}>Voir plus</Button>
              </div>
            </div>
          </div>
        </Section>

        {/* ── 4. Cartes ── */}
        <Section title="Cartes">
          <div className="grid md:grid-cols-2 gap-6">
            <Card variant="default" brand="thor">
              <CardHeader>
                <CardTitle>Carte par défaut</CardTitle>
                <CardDescription>Fond blanc, bordure subtile, ombre légère.</CardDescription>
              </CardHeader>
              <CardContent>
                <Text variant="body">Contenu de la carte. Espacement généreux, lisible.</Text>
              </CardContent>
              <CardFooter>
                <Button brand="vision" size="sm">Action</Button>
              </CardFooter>
            </Card>

            <Card variant="elevated" brand="vision">
              <CardHeader>
                <CardTitle>Carte élevée — Vision</CardTitle>
                <CardDescription>Ombre plus prononcée, bordure bleue douce.</CardDescription>
              </CardHeader>
              <CardContent>
                <Text variant="body">Idéale pour mettre en avant un contenu principal.</Text>
              </CardContent>
            </Card>

            <Card variant="interactive" brand="audition">
              <CardHeader>
                <CardTitle>Carte interactive — Audition</CardTitle>
                <CardDescription>Hover avec lift et glow vert doux.</CardDescription>
              </CardHeader>
              <CardContent>
                <Text variant="body">Passe la souris pour voir l'effet.</Text>
              </CardContent>
            </Card>

            <Card variant="highlight" brand="vision">
              <CardHeader>
                <CardTitle>Carte highlight — Vision</CardTitle>
                <CardDescription>Double ring + glow coloré. Pour les éléments vedettes.</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge status="nouveau" />
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* ── 5. Badges ── */}
        <Section title="Badges">
          <div className="flex flex-wrap gap-3">
            <Badge status="actif" />
            <Badge status="inactif" />
            <Badge status="nouveau" />
            <Badge status="expire" />
            <Badge status="info" />
            <Badge status="warning" />
            <Badge status="actif" dot={false}>Sans point</Badge>
            <Badge status="info">Personnalisé</Badge>
          </div>
        </Section>

        {/* ── 6. Formulaires ── */}
        <Section title="Formulaires">
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
            <Input
              brand="vision"
              label="Email"
              placeholder="votre@email.fr"
              type="email"
            />
            <Input
              brand="vision"
              label="Téléphone"
              placeholder="06 12 34 56 78"
              type="tel"
              hint="Format : 06 XX XX XX XX"
            />
            <Input
              brand="vision"
              label="Champ en erreur"
              placeholder="…"
              error="Ce champ est obligatoire"
            />
            <Input
              brand="vision"
              label="Champ désactivé"
              placeholder="Non modifiable"
              disabled
            />
            <Select brand="vision" label="Spécialité">
              <option value="">Choisir…</option>
              <option value="vision">Clair Vision</option>
              <option value="audition">Clair Audition</option>
            </Select>
            <Select brand="audition" label="Select — Audition">
              <option value="">Choisir…</option>
              <option value="test">Test auditif</option>
              <option value="app">Appareillage</option>
            </Select>
            <div className="md:col-span-2">
              <Textarea
                brand="vision"
                label="Message"
                placeholder="Décrivez votre demande…"
                hint="500 caractères maximum"
              />
            </div>
          </div>
        </Section>

        {/* ── 7. Spinners ── */}
        <Section title="Spinners">
          <div className="flex flex-wrap items-center gap-6">
            <div className="text-center space-y-2">
              <Spinner brand="vision" size="xs" />
              <Text variant="caption" as="p">xs</Text>
            </div>
            <div className="text-center space-y-2">
              <Spinner brand="vision" size="sm" />
              <Text variant="caption" as="p">sm</Text>
            </div>
            <div className="text-center space-y-2">
              <Spinner brand="vision" size="md" />
              <Text variant="caption" as="p">md vision</Text>
            </div>
            <div className="text-center space-y-2">
              <Spinner brand="audition" size="md" />
              <Text variant="caption" as="p">md audition</Text>
            </div>
            <div className="text-center space-y-2">
              <Spinner brand="thor" size="lg" />
              <Text variant="caption" as="p">lg thor</Text>
            </div>
          </div>
        </Section>

        {/* ── 8. Skeletons ── */}
        <Section title="Skeletons">
          <div className="space-y-3 max-w-sm">
            <Skeleton h="h-4" w="w-3/4" />
            <Skeleton h="h-4" />
            <Skeleton h="h-4" w="w-1/2" />
            <Skeleton h="h-32" rounded="large" />
            <div className="flex items-center gap-3">
              <Skeleton h="h-10" w="w-10" rounded="pill" />
              <div className="flex-1 space-y-2">
                <Skeleton h="h-3" w="w-2/3" />
                <Skeleton h="h-3" w="w-1/2" />
              </div>
            </div>
          </div>
        </Section>

        {/* ── 9. Dividers ── */}
        <Section title="Dividers">
          <div className="space-y-2 max-w-md">
            <Divider />
            <Divider label="ou" />
            <Divider label="Section suivante" />
          </div>
        </Section>

        {/* ── 10. Avatars ── */}
        <Section title="Avatars">
          <div className="flex flex-wrap items-center gap-4">
            <Avatar initials="CV" brand="vision" size="xs" />
            <Avatar initials="CV" brand="vision" size="sm" />
            <Avatar initials="CV" brand="vision" size="md" />
            <Avatar initials="CA" brand="audition" size="lg" />
            <Avatar initials="TH" brand="thor" size="xl" />
            <Avatar
              src="https://i.pravatar.cc/150?img=3"
              alt="Photo de profil"
              brand="vision"
              size="md"
            />
          </div>
        </Section>

        {/* ── 11. Classes utilitaires ── */}
        <Section title="Classes utilitaires">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="glass rounded-[var(--radius-large)] p-6">
              <Text variant="label" as="p">glass</Text>
              <Text variant="muted">Fond blanc/72, blur 16px</Text>
            </div>
            <div className="glass-vision rounded-[var(--radius-large)] p-6">
              <Text variant="label" as="p">glass-vision</Text>
              <Text variant="muted">Fond bleu clair/80, bordure vision</Text>
            </div>
            <div className="glass-audition rounded-[var(--radius-large)] p-6">
              <Text variant="label" as="p">glass-audition</Text>
              <Text variant="muted">Fond vert clair/80, bordure audition</Text>
            </div>
            <div className="gradient-vision rounded-[var(--radius-large)] p-6">
              <Text variant="label" as="p" className="text-white">gradient-vision</Text>
            </div>
            <div className="gradient-audition rounded-[var(--radius-large)] p-6">
              <Text variant="label" as="p" className="text-white">gradient-audition</Text>
            </div>
            <div className="gradient-thor rounded-[var(--radius-large)] p-6">
              <Text variant="label" as="p" className="text-white">gradient-thor</Text>
            </div>
          </div>
        </Section>

      </div>
    </div>
  );
}

// ── Helpers locaux ─────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <Heading level="h3">{title}</Heading>
        <span className="flex-1 border-t border-thor-border" />
      </div>
      {children}
    </section>
  );
}

function Swatch({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="space-y-2">
      <div className={`h-12 rounded-[var(--radius-soft)] ${color} ring-1 ring-black/5`} />
      <div>
        <Text variant="caption" as="p" className="font-medium text-thor-text">{label}</Text>
        <Text variant="caption" as="p">{value}</Text>
      </div>
    </div>
  );
}
