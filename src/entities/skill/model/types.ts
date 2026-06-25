export type SkillStatus = "active" | "paused" | "completed";
export type ReviewStatus = "draft" | "requested" | "reviewed";

export type Skill = {
  id: string;
  ownerId: string;
  title: string;
  category: string;
  currentLevel: number;
  targetLevel: number;
  weeklyMinutesGoal: number;
  status: SkillStatus;
  reviewStatus: ReviewStatus;
  mentorNote: string | null;
  createdAt: string;
};

export type SkillRow = {
  id: string;
  owner_id: string;
  title: string;
  category: string;
  current_level: number;
  target_level: number;
  weekly_minutes_goal: number;
  status: SkillStatus;
  review_status: ReviewStatus;
  mentor_note: string | null;
  created_at: string;
};

export type SkillGoal = {
  id: string;
  skillId: string;
  ownerId: string;
  title: string;
  dueDate: string | null;
  isDone: boolean;
};

export type SkillGoalRow = {
  id: string;
  skill_id: string;
  owner_id: string;
  title: string;
  due_date: string | null;
  is_done: boolean;
};
