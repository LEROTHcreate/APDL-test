export type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | Record<string, unknown>
  | ClassValue[];

function toClassName(value: ClassValue): string {
  if (!value) return "";

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(toClassName).filter(Boolean).join(" ");
  }

  if (typeof value === "object") {
    return Object.entries(value)
      .filter(([, v]) => Boolean(v))
      .map(([k]) => k)
      .join(" ");
  }

  return "";
}

export function cn(...inputs: ClassValue[]) {
  return inputs.map(toClassName).filter(Boolean).join(" ");
}

export type ProRole = "opticien" | "optometriste" | "praticien" | undefined;

export function roleLabel(role?: ProRole) {
  if (role === "opticien") return "Opticien";
  if (role === "optometriste") return "Optométriste";
  return "Praticien";
}

export function proLabel(name: string, role?: ProRole) {
  return `${name} · ${roleLabel(role)}`;
}
