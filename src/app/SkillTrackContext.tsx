import { createContext, useContext, type ReactNode } from "react";
import { useSkillTrack } from "./useSkillTrack";

type SkillTrackContextValue = ReturnType<typeof useSkillTrack>;

const SkillTrackContext = createContext<SkillTrackContextValue | null>(null);

export const SkillTrackProvider = ({ children }: { children: ReactNode }) => {
  const value = useSkillTrack();
  return <SkillTrackContext.Provider value={value}>{children}</SkillTrackContext.Provider>;
};

export const useSkillTrackContext = () => {
  const context = useContext(SkillTrackContext);
  if (!context) throw new Error("SkillTrackContext не подключен.");
  return context;
};
