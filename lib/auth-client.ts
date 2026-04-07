export type ThorRole = "patient" | "praticien" | null;

const KEY = "thor_role";

export function getRole(): ThorRole {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(KEY);
  if (v === "patient" || v === "praticien") return v;
  return null;
}

export function setRole(role: ThorRole) {
  if (typeof window === "undefined") return;
  if (!role) window.localStorage.removeItem(KEY);
  else window.localStorage.setItem(KEY, role);
}
