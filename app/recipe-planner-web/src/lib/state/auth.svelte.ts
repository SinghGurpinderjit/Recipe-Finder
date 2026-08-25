import { loadJSON, saveJSON } from '$lib/storage';

const USERS_KEY = 'recipe-finder:users';
const SESSION_KEY = 'recipe-finder:session';

interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
}

// Client-side hashing only obscures passwords from casual viewing of
// localStorage — it is NOT real security (no salt, no server). Fine for
// this assignment's scope since there's no backend; do not reuse this
// pattern for anything with real user data.
async function hashPassword(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function toPublic(user: User): PublicUser {
  const { passwordHash: _drop, ...rest } = user;
  return rest;
}

function loadUsers(): User[] {
  return loadJSON<User[]>(USERS_KEY, []);
}
function saveUsers(users: User[]) {
  saveJSON(USERS_KEY, users);
}

const state = $state<{ currentUser: PublicUser | null }>({
  currentUser: loadJSON<PublicUser | null>(SESSION_KEY, null),
});

function persistSession() {
  saveJSON(SESSION_KEY, state.currentUser);
}

export const auth = {
  get currentUser() {
    return state.currentUser;
  },
  get isLoggedIn() {
    return state.currentUser !== null;
  },

  async signup(name: string, email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    const trimmedEmail = email.trim().toLowerCase();
    if (!name.trim()) return { ok: false, error: 'Name is required.' };
    if (!trimmedEmail) return { ok: false, error: 'Email is required.' };
    if (password.length < 6) return { ok: false, error: 'Password must be at least 6 characters.' };

    const users = loadUsers();
    if (users.some((u) => u.email === trimmedEmail)) {
      return { ok: false, error: 'An account with this email already exists.' };
    }

    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim(),
      email: trimmedEmail,
      passwordHash: await hashPassword(password),
    };
    saveUsers([...users, newUser]);

    state.currentUser = toPublic(newUser);
    persistSession();
    return { ok: true };
  },

  async login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    const trimmedEmail = email.trim().toLowerCase();
    const users = loadUsers();
    const user = users.find((u) => u.email === trimmedEmail);
    if (!user) return { ok: false, error: 'No account found with this email.' };

    const hash = await hashPassword(password);
    if (hash !== user.passwordHash) return { ok: false, error: 'Incorrect password.' };

    state.currentUser = toPublic(user);
    persistSession();
    return { ok: true };
  },

  logout() {
    state.currentUser = null;
    persistSession();
  },
};