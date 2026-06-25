import { restRequest } from "../../../shared/api/supabaseRest";
import type { PracticeLog, PracticeLogRow } from "../model/types";

const mapLog = (row: PracticeLogRow): PracticeLog => ({
  id: row.id,
  skillId: row.skill_id,
  ownerId: row.owner_id,
  minutes: row.minutes,
  note: row.note,
  practicedAt: row.practiced_at,
  createdAt: row.created_at,
});

export const practiceRepository = {
  async listBySkill(skillId: string, token: string) {
    const rows = await restRequest<PracticeLogRow[]>(
      `practice_logs?skill_id=eq.${skillId}&select=id,skill_id,owner_id,minutes,note,practiced_at,created_at&order=practiced_at.desc`,
      {},
      token,
    );
    return rows.map(mapLog);
  },

  async listMine(ownerId: string, token: string) {
    const rows = await restRequest<PracticeLogRow[]>(
      `practice_logs?owner_id=eq.${ownerId}&select=id,skill_id,owner_id,minutes,note,practiced_at,created_at&order=practiced_at.desc`,
      {},
      token,
    );
    return rows.map(mapLog);
  },

  async create(skillId: string, ownerId: string, minutes: number, note: string, practicedAt: string, token: string) {
    const rows = await restRequest<PracticeLogRow[]>(
      "practice_logs",
      {
        method: "POST",
        body: JSON.stringify({
          skill_id: skillId,
          owner_id: ownerId,
          minutes,
          note,
          practiced_at: practicedAt,
        }),
      },
      token,
    );
    return mapLog(rows[0]);
  },
};
