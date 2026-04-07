export type UserRole = "Gérant" | "Optométriste" | "Opticien" | "Visagiste" | "Assistant(e)" | "Audioprothésiste";

export type ProUser = {
  id: string;
  name: string;
  role: UserRole;
  initials: string;
  color: string;       // avatar bg color
  password: string;    // plain text (mock — no backend)
  email?: string;
  isOwner?: boolean;   // compte créé par l'enseigne (ne peut pas être supprimé)
};

export const ROLE_COLORS: Record<UserRole, string> = {
  "Gérant":            "#F59E0B",
  "Optométriste":      "#2D8CFF",
  "Opticien":          "#00C98A",
  "Visagiste":         "#8B5CF6",
  "Assistant(e)":      "#EC4899",
  "Audioprothésiste":  "#06B6D4",
};

// Mots de passe hashés avec scrypt (salt:hash). Ne jamais stocker en clair.
// Pour régénérer : node -e "const {scryptSync,randomBytes}=require('crypto'); const s=randomBytes(16).toString('hex'); console.log(s+':'+scryptSync('MOT_DE_PASSE',s,64).toString('hex'))"
export const DEFAULT_USERS: ProUser[] = [
  {
    id:       "nicolas-garnier",
    name:     "Nicolas Garnier",
    role:     "Gérant",
    initials: "NG",
    color:    ROLE_COLORS["Gérant"],
    password: "0564fbdc2c676583773233e2f7a3d3cc:cb453c83e616817a49ba25de7d6b566e0de87758e0f5b2526ea5ac229bf674208451984140691909056c90adb2a300cc8408b2aa778c94c7e4801fc427d09964",
    email:    "contact@clair-vision.fr",
    isOwner:  true,
  },
  {
    id:       "sophie-martin",
    name:     "Sophie Martin",
    role:     "Optométriste",
    initials: "SM",
    color:    ROLE_COLORS["Optométriste"],
    password: "2ef14f96ac65f3a9023ad89395bf52d8:c8072bce07bb01b84d398591f58b8796dd47949f41b16a33e9e259e8fd25bc0b4d478947f20ce454db1dc1f03d0ae03e6c5e6ef36de2a4f4ea8f9c222f4809c3",
    email:    "s.martin@clair-vision.fr",
  },
  {
    id:       "julien-dubois",
    name:     "Julien Dubois",
    role:     "Opticien",
    initials: "JD",
    color:    ROLE_COLORS["Opticien"],
    password: "beef2255af0efddb7049d8deaf532e86:ad247d6bd583e698424edf553f71a38bcae900604901d15f097eb2cbadaa4707dd13813874d53e7f31634bdc6046c4cffacfa92fbe8cd16ef5f783d91957300e",
    email:    "j.dubois@clair-vision.fr",
  },
  {
    id:       "martin-vidal",
    name:     "Martin Vidal",
    role:     "Visagiste",
    initials: "MV",
    color:    ROLE_COLORS["Visagiste"],
    password: "430687bfb7834b78f4f1050781611b74:170575424ff19d10b8060ec24c9fb59da39f642596b44cdfe064236bc092aa80ac6fd07f82d619a587d0e264fdcc99f15ce00f9a9d7ed99dd479139a523b83bf",
    email:    "m.vidal@clair-vision.fr",
  },
];

export const STORAGE_USERS   = "thor_pro_users";
export const STORAGE_CURRENT = "thor_pro_current_user";

export function loadUsers(): ProUser[] {
  if (typeof window === "undefined") return DEFAULT_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_USERS);
    return raw ? (JSON.parse(raw) as ProUser[]) : DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
}

export function saveUsers(users: ProUser[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
}

export function loadCurrentUserId(): string {
  if (typeof window === "undefined") return "sophie-martin";
  return localStorage.getItem(STORAGE_CURRENT) ?? "sophie-martin";
}

export function saveCurrentUserId(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_CURRENT, id);
}

export function generateId(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    + "-" + Math.random().toString(36).slice(2, 6);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
