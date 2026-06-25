import { authRequest } from "../../../shared/api/supabaseRest";
import type { AuthResponse } from "../../../entities/session/model/types";

export type LoginPayload = {
  email: string;
  password: string;
};

export type SignupPayload = LoginPayload & {
  displayName: string;
};

export const authRepository = {
  signIn(payload: LoginPayload) {
    return authRequest<AuthResponse>("token?grant_type=password", {
      method: "POST",
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
      }),
    });
  },

  signUp(payload: SignupPayload) {
    return authRequest<AuthResponse>("signup", {
      method: "POST",
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        data: {
          display_name: payload.displayName,
        },
      }),
    });
  },
};
