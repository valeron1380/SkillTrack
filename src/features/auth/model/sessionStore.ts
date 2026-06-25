import type { AuthResponse, UserSession } from "../../../entities/session/model/types";

const STORAGE_KEY = "skilltrack.session";

export const toUserSession = (response: AuthResponse): UserSession => ({
  accessToken: response.access_token,
  refreshToken: response.refresh_token,
  expiresAt: Date.now() + response.expires_in * 1000,
  user: {
    id: response.user.id,
    email: response.user.email ?? "",
  },
});

export const saveSession = (session: UserSession) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

export const readSession = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const session = JSON.parse(raw) as UserSession;
    if (session.expiresAt < Date.now()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const clearSession = () => localStorage.removeItem(STORAGE_KEY);
