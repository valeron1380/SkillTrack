export type PracticeLog = {
  id: string;
  skillId: string;
  ownerId: string;
  minutes: number;
  note: string;
  practicedAt: string;
  createdAt: string;
};

export type PracticeLogRow = {
  id: string;
  skill_id: string;
  owner_id: string;
  minutes: number;
  note: string;
  practiced_at: string;
  created_at: string;
};
