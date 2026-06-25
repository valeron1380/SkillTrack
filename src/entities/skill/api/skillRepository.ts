import { restRequest } from "../../../shared/api/supabaseRest";
import type { ReviewStatus, Skill, SkillGoal, SkillGoalRow, SkillRow, SkillStatus } from "../model/types";

const skillSelect =
  "id,owner_id,title,category,current_level,target_level,weekly_minutes_goal,status,review_status,mentor_note,created_at";

const mapSkill = (row: SkillRow): Skill => ({
  id: row.id,
  ownerId: row.owner_id,
  title: row.title,
  category: row.category,
  currentLevel: row.current_level,
  targetLevel: row.target_level,
  weeklyMinutesGoal: row.weekly_minutes_goal,
  status: row.status,
  reviewStatus: row.review_status,
  mentorNote: row.mentor_note,
  createdAt: row.created_at,
});

const mapGoal = (row: SkillGoalRow): SkillGoal => ({
  id: row.id,
  skillId: row.skill_id,
  ownerId: row.owner_id,
  title: row.title,
  dueDate: row.due_date,
  isDone: row.is_done,
});

export type CreateSkillPayload = {
  ownerId: string;
  title: string;
  category: string;
  currentLevel: number;
  targetLevel: number;
  weeklyMinutesGoal: number;
};

export const skillRepository = {
  async list(token: string, onlyMine?: string) {
    const ownerFilter = onlyMine ? `&owner_id=eq.${onlyMine}` : "";
    const rows = await restRequest<SkillRow[]>(`skills?select=${skillSelect}${ownerFilter}&order=created_at.desc`, {}, token);
    return rows.map(mapSkill);
  },

  async get(id: string, token: string) {
    const rows = await restRequest<SkillRow[]>(`skills?id=eq.${id}&select=${skillSelect}`, {}, token);
    return rows[0] ? mapSkill(rows[0]) : null;
  },

  async create(payload: CreateSkillPayload, token: string) {
    const rows = await restRequest<SkillRow[]>(
      "skills",
      {
        method: "POST",
        body: JSON.stringify({
          owner_id: payload.ownerId,
          title: payload.title,
          category: payload.category,
          current_level: payload.currentLevel,
          target_level: payload.targetLevel,
          weekly_minutes_goal: payload.weeklyMinutesGoal,
        }),
      },
      token,
    );
    return mapSkill(rows[0]);
  },

  async updateStatus(id: string, status: SkillStatus, token: string) {
    const rows = await restRequest<SkillRow[]>(
      `skills?id=eq.${id}`,
      { method: "PATCH", body: JSON.stringify({ status }) },
      token,
    );
    return mapSkill(rows[0]);
  },

  async updateReview(id: string, reviewStatus: ReviewStatus, mentorNote: string | null, token: string) {
    const rows = await restRequest<SkillRow[]>(
      `skills?id=eq.${id}`,
      { method: "PATCH", body: JSON.stringify({ review_status: reviewStatus, mentor_note: mentorNote }) },
      token,
    );
    return mapSkill(rows[0]);
  },

  async listGoals(skillId: string, token: string) {
    const rows = await restRequest<SkillGoalRow[]>(
      `skill_goals?skill_id=eq.${skillId}&select=id,skill_id,owner_id,title,due_date,is_done&order=created_at.asc`,
      {},
      token,
    );
    return rows.map(mapGoal);
  },

  async createGoal(skillId: string, ownerId: string, title: string, dueDate: string, token: string) {
    const rows = await restRequest<SkillGoalRow[]>(
      "skill_goals",
      {
        method: "POST",
        body: JSON.stringify({
          skill_id: skillId,
          owner_id: ownerId,
          title,
          due_date: dueDate || null,
        }),
      },
      token,
    );
    return mapGoal(rows[0]);
  },

  async toggleGoal(goal: SkillGoal, token: string) {
    const rows = await restRequest<SkillGoalRow[]>(
      `skill_goals?id=eq.${goal.id}`,
      { method: "PATCH", body: JSON.stringify({ is_done: !goal.isDone }) },
      token,
    );
    return mapGoal(rows[0]);
  },
};
