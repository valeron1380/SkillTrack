export type UserSession = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: {
    id: string;
    email: string;
  };
};

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: {
    id: string;
    email?: string;
  };
};
