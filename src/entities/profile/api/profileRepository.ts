import { restRequest } from "../../../shared/api/supabaseRest";
import type { Profile, ProfileRow } from "../model/types";

const mapProfile = (row: ProfileRow): Profile => ({
  id: row.id,
  email: row.email,
  displayName: row.display_name,
  role: row.role,
  direction: row.direction,
  avatarUrl: row.avatar_url,
});

export const profileRepository = {
  async getMine(userId: string, token: string) {
    const rows = await restRequest<ProfileRow[]>(
      `profiles?id=eq.${userId}&select=id,email,display_name,role,direction,avatar_url`,
      {},
      token,
    );
    return rows[0] ? mapProfile(rows[0]) : null;
  },

  async updateMine(userId: string, token: string, data: Pick<Profile, "displayName" | "direction" | "avatarUrl">) {
    const rows = await restRequest<ProfileRow[]>(
      `profiles?id=eq.${userId}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          display_name: data.displayName,
          direction: data.direction,
          avatar_url: data.avatarUrl || null,
        }),
      },
      token,
    );
    return mapProfile(rows[0]);
  },
};
