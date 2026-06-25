import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { profileRepository } from "../entities/profile/api/profileRepository";
import type { Profile } from "../entities/profile/model/types";
import { practiceRepository } from "../entities/practice/api/practiceRepository";
import type { PracticeLog } from "../entities/practice/model/types";
import { skillRepository, type CreateSkillPayload } from "../entities/skill/api/skillRepository";
import type { ReviewStatus, Skill, SkillGoal, SkillStatus } from "../entities/skill/model/types";
import { authRepository, type LoginPayload, type SignupPayload } from "../features/auth/model/authRepository";
import { clearSession, readSession, saveSession, toUserSession } from "../features/auth/model/sessionStore";
import type { UserSession } from "../entities/session/model/types";

export type SkillTrackState = {
  session: UserSession | null;
  profile: Profile | null;
  skills: Skill[];
  logs: PracticeLog[];
  goalsBySkill: Record<string, SkillGoal[]>;
  loading: boolean;
  error: string;
};

export const useSkillTrack = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<SkillTrackState>({
    session: readSession(),
    profile: null,
    skills: [],
    logs: [],
    goalsBySkill: {},
    loading: true,
    error: "",
  });

  const token = state.session?.accessToken ?? "";
  const userId = state.session?.user.id ?? "";

  const setError = (error: unknown) => {
    setState((current) => ({
      ...current,
      error: error instanceof Error ? error.message : "Произошла ошибка.",
      loading: false,
    }));
  };

  const reload = useCallback(async () => {
    const activeSession = readSession();
    if (!activeSession) {
      setState((current) => ({ ...current, session: null, profile: null, skills: [], logs: [], loading: false }));
      return;
    }

    setState((current) => ({ ...current, session: activeSession, loading: true, error: "" }));

    try {
      const profile = await profileRepository.getMine(activeSession.user.id, activeSession.accessToken);
      const skills = await skillRepository.list(
        activeSession.accessToken,
        profile?.role === "mentor" ? undefined : activeSession.user.id,
      );
      const logs = await practiceRepository.listMine(activeSession.user.id, activeSession.accessToken);
      const goalsEntries = await Promise.all(
        skills.map(async (skill) => [skill.id, await skillRepository.listGoals(skill.id, activeSession.accessToken)] as const),
      );

      setState((current) => ({
        ...current,
        session: activeSession,
        profile,
        skills,
        logs,
        goalsBySkill: Object.fromEntries(goalsEntries),
        loading: false,
      }));
    } catch (error) {
      setError(error);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const signIn = async (payload: LoginPayload) => {
    const session = toUserSession(await authRepository.signIn(payload));
    saveSession(session);
    setState((current) => ({ ...current, session }));
    await reload();
    navigate("/dashboard");
  };

  const signUp = async (payload: SignupPayload) => {
    const session = toUserSession(await authRepository.signUp(payload));
    saveSession(session);
    setState((current) => ({ ...current, session }));
    await reload();
    navigate("/dashboard");
  };

  const signOut = () => {
    clearSession();
    setState({ session: null, profile: null, skills: [], logs: [], goalsBySkill: {}, loading: false, error: "" });
    navigate("/login");
  };

  const createSkill = async (payload: Omit<CreateSkillPayload, "ownerId">) => {
    if (!state.session) return;
    await skillRepository.create({ ...payload, ownerId: state.session.user.id }, state.session.accessToken);
    await reload();
  };

  const updateSkillStatus = async (id: string, status: SkillStatus) => {
    if (!token) return;
    await skillRepository.updateStatus(id, status, token);
    await reload();
  };

  const updateReview = async (id: string, reviewStatus: ReviewStatus, mentorNote: string | null) => {
    if (!token) return;
    await skillRepository.updateReview(id, reviewStatus, mentorNote, token);
    await reload();
  };

  const createGoal = async (skillId: string, title: string, dueDate: string) => {
    if (!token || !userId) return;
    await skillRepository.createGoal(skillId, userId, title, dueDate, token);
    await reload();
  };

  const toggleGoal = async (goal: SkillGoal) => {
    if (!token) return;
    await skillRepository.toggleGoal(goal, token);
    await reload();
  };

  const addPracticeLog = async (skillId: string, minutes: number, note: string, practicedAt: string) => {
    if (!token || !userId) return;
    await practiceRepository.create(skillId, userId, minutes, note, practicedAt, token);
    await reload();
  };

  const updateProfile = async (data: Pick<Profile, "displayName" | "direction" | "avatarUrl">) => {
    if (!token || !userId) return;
    await profileRepository.updateMine(userId, token, data);
    await reload();
  };

  const stats = useMemo(() => {
    const totalMinutes = state.logs.reduce((sum, log) => sum + log.minutes, 0);
    const activeSkills = state.skills.filter((skill) => skill.status === "active").length;
    const completedGoals = Object.values(state.goalsBySkill).flat().filter((goal) => goal.isDone).length;
    const requestedReviews = state.skills.filter((skill) => skill.reviewStatus === "requested").length;

    return { totalMinutes, activeSkills, completedGoals, requestedReviews };
  }, [state.goalsBySkill, state.logs, state.skills]);

  return {
    ...state,
    stats,
    signIn,
    signUp,
    signOut,
    reload,
    createSkill,
    updateSkillStatus,
    updateReview,
    createGoal,
    toggleGoal,
    addPracticeLog,
    updateProfile,
  };
};
