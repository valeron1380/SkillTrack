export type ProfileRole = "student" | "mentor";

export type Profile = {
  id: string;
  email: string;
  displayName: string;
  role: ProfileRole;
  direction: string;
  avatarUrl: string | null;
};

export type ProfileRow = {
  id: string;
  email: string;
  display_name: string;
  role: ProfileRole;
  direction: string;
  avatar_url: string | null;
};
